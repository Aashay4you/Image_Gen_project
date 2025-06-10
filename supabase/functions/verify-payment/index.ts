
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from "https://esm.sh/stripe@14.21.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { sessionId } = await req.json()
    
    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'Session ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const stripeSecretKey = 'sk_test_51RXwitRrhZZQxgVPoS0CCwdrRnVYNhpUKBMAJ2ZAfr5nw1zV8bpmRp3xMPfWvpe6NDTTSK0KYp1ZR6O0cdi3c8Om00b9zw5BBf'

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    })

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (session.payment_status === 'paid' && session.metadata?.user_id) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

      const creditsToAdd = parseInt(session.metadata.credits_to_add || '10')
      
      // Get current credits
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('credits')
        .eq('id', session.metadata.user_id)
        .single()

      const currentCredits = profile?.credits || 0
      
      // Add credits
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ credits: currentCredits + creditsToAdd })
        .eq('id', session.metadata.user_id)

      if (updateError) {
        console.error('Error updating credits:', updateError)
        return new Response(JSON.stringify({ error: 'Failed to update credits' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ 
        success: true, 
        creditsAdded: creditsToAdd,
        newTotal: currentCredits + creditsToAdd
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ success: false, status: session.payment_status }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error verifying payment:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
