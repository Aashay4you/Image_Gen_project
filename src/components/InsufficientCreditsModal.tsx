
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import { usePayment } from "@/hooks/usePayment";

interface InsufficientCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InsufficientCreditsModal = ({ open, onOpenChange }: InsufficientCreditsModalProps) => {
  const { createPaymentSession } = usePayment();

  const handleBuyCredits = () => {
    createPaymentSession();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Coins className="w-6 h-6 mr-2 text-yellow-500" />
            You ran out of credits
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-300">
            You need credits to generate images. Purchase more credits to continue creating amazing AI artwork.
          </p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-500 mb-2">Credit Package</h3>
            <p className="text-2xl font-bold">3 Credits - $2.99</p>
            <p className="text-sm text-gray-400">Generate 3 AI images</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleBuyCredits}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Coins className="w-4 h-4 mr-2" />
              Buy Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InsufficientCreditsModal;
