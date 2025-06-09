
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const usePayment = () => {
  const { toast } = useToast();

  const createPaymentSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('create-payment', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');

    } catch (error) {
      console.error('Error creating payment session:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create payment session",
        variant: "destructive",
      });
    }
  };

  const verifyPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId },
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return { success: false };
    }
  };

  return {
    createPaymentSession,
    verifyPayment
  };
};
