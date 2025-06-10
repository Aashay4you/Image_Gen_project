

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase clients
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    
    // Client for authentication
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey)
    // Client for admin operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser(authHeader.replace('Bearer ', ''))
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid user' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check user's credits
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile error:', profileError)
      return new Response(JSON.stringify({ error: 'Failed to fetch user profile' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!profile || profile.credits <= 0) {
      return new Response(JSON.stringify({ error: 'Insufficient credits' }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Parse and validate the request body
    const requestBody = await req.json()
    console.log('Request body received:', requestBody)
    
    const { prompt } = requestBody
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      console.error('Invalid prompt received:', prompt)
      return new Response(JSON.stringify({ error: 'Prompt is required and must be a non-empty string' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const cleanPrompt = prompt.trim()
    console.log('Generating image with prompt:', cleanPrompt)

    const falKey = Deno.env.get('FAL_KEY')
    if (!falKey) {
      return new Response(JSON.stringify({ error: 'FAL API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Prepare the request payload for Fal.ai
    const falPayload = {
      input: {
        prompt: cleanPrompt,
        image_size: "square_hd",
        num_inference_steps: 4,
        num_images: 1,
        enable_safety_checker: true
      }
    }

    console.log('Sending to Fal.ai:', JSON.stringify(falPayload, null, 2))

    // Make request to Fal.ai API
    const falResponse = await fetch('https://queue.fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(falPayload)
    })

    if (!falResponse.ok) {
      const errorText = await falResponse.text()
      console.error('Fal.ai API error:', errorText)
      throw new Error(`Fal.ai API error: ${falResponse.status} ${errorText}`)
    }

    const falData = await falResponse.json()
    console.log('Fal.ai response:', falData)

    // Get the request ID for polling
    const requestId = falData.request_id
    if (!requestId) {
      throw new Error('No request ID returned from Fal.ai')
    }

    // Poll for completion
    let result
    let attempts = 0
    const maxAttempts = 60 // 5 minutes max wait time (5 second intervals)

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds
      
      const statusResponse = await fetch(`https://queue.fal.run/fal-ai/flux/schnell/requests/${requestId}/status`, {
        headers: {
          'Authorization': `Key ${falKey}`,
        }
      })

      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        console.log('Status check:', statusData)

        if (statusData.status === 'COMPLETED') {
          // Get the final result
          const resultResponse = await fetch(`https://queue.fal.run/fal-ai/flux/schnell/requests/${requestId}`, {
            headers: {
              'Authorization': `Key ${falKey}`,
            }
          })
          
          if (resultResponse.ok) {
            result = await resultResponse.json()
            break
          }
        } else if (statusData.status === 'FAILED') {
          throw new Error('Image generation failed')
        }
      }
      
      attempts++
    }

    if (!result) {
      throw new Error('Image generation timed out')
    }

    const imageUrl = result.images?.[0]?.url
    if (!imageUrl) {
      throw new Error('No image URL in response')
    }

    console.log('Generated image URL:', imageUrl)

    // Download and store the image
    const imageResponse = await fetch(imageUrl)
    const imageBlob = await imageResponse.blob()
    const imageBuffer = await imageBlob.arrayBuffer()

    const fileName = `${user.id}/${Date.now()}.webp`

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('generated-images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/webp',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error(`Failed to upload image: ${uploadError.message}`)
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('generated-images')
      .getPublicUrl(fileName)

    // Deduct credit
    const { error: creditError } = await supabaseAdmin
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', user.id)

    if (creditError) {
      console.error('Credit deduction error:', creditError)
    }

    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('generated_images')
      .insert({
        user_id: user.id,
        prompt: cleanPrompt,
        image_url: publicUrl,
        storage_path: fileName
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error(`Failed to save to database: ${dbError.message}`)
    }

    console.log('Image saved successfully:', dbData)

    return new Response(JSON.stringify({
      success: true,
      image: {
        id: dbData.id,
        url: publicUrl,
        prompt: cleanPrompt
      },
      remainingCredits: profile.credits - 1
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in generate-image function:', error)
    return new Response(JSON.stringify({
      error: 'Failed to generate image',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

