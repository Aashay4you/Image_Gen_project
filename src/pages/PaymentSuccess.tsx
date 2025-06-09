
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Coins, ArrowLeft } from "lucide-react";
import { usePayment } from "@/hooks/usePayment";
import { useCredits } from "@/hooks/useCredits";
import Navigation from "@/components/Navigation";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyPayment } = usePayment();
  const { refreshCredits } = useCredits();
  const [verifying, setVerifying] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [creditsAdded, setCreditsAdded] = useState(0);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifyPayment(sessionId).then((result) => {
        setPaymentVerified(result.success);
        if (result.success) {
          setCreditsAdded(result.creditsAdded || 10);
          refreshCredits();
        }
        setVerifying(false);
      });
    } else {
      setVerifying(false);
    }
  }, [searchParams, verifyPayment, refreshCredits]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Navigation />
        <div className="container mx-auto px-6 py-8 flex items-center justify-center min-h-[80vh]">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white">Verifying payment...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navigation />
      <div className="container mx-auto px-6 py-8 flex items-center justify-center min-h-[80vh]">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-white text-center flex items-center justify-center">
              {paymentVerified ? (
                <>
                  <CheckCircle className="w-8 h-8 mr-2 text-green-500" />
                  Payment Successful!
                </>
              ) : (
                "Payment Processing"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            {paymentVerified ? (
              <>
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <Coins className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                  <p className="text-white font-semibold">
                    {creditsAdded} Credits Added!
                  </p>
                  <p className="text-gray-300 text-sm">
                    You can now generate {creditsAdded} more AI images
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Creating
                </Button>
              </>
            ) : (
              <>
                <p className="text-gray-300">
                  We're processing your payment. This may take a few moments.
                </p>
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Return to Dashboard
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
