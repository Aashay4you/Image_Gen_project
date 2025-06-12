
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCredits } from '@/hooks/useCredits';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();
  const { refreshCredits } = useCredits();

  const generateImage = async (prompt: string) => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate an image",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null); // Clear previous image
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      console.log('Starting image generation with prompt:', prompt);

      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      console.log('Edge function response:', data);

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.error) {
        console.error('Function returned error:', data.error);
        if (data.error === 'Insufficient credits') {
          return { insufficientCredits: true };
        }
        throw new Error(data.error);
      }

      if (data?.success && data?.image?.url) {
        console.log('Image generated successfully:', data.image.url);
        setGeneratedImage(data.image.url);
        refreshCredits(); // Refresh credits after successful generation
        
        toast({
          title: "Success!",
          description: "Your image has been generated successfully",
        });

        return data.image;
      } else {
        console.error('Unexpected response format:', data);
        throw new Error('Invalid response format from server');
      }

    } catch (error) {
      console.error('Error generating image:', error);
      const errorMessage = error?.message || 'Failed to generate image';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateImage,
    isGenerating,
    generatedImage,
    setGeneratedImage
  };
};
