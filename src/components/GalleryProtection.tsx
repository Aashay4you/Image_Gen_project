import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GalleryProtectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GalleryProtectionModal = ({ open, onOpenChange }: GalleryProtectionModalProps) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onOpenChange(false);
    navigate("/auth");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Lock className="w-6 h-6 mr-2 text-purple-500" />
            Gallery Access Required
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-300">
            Please log in to access your personal gallery and view your generated images.
          </p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-400 mb-2">What you'll get:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• View all your generated images</li>
              <li>• Download your creations</li>
              <li>• Track your generation history</li>
              <li>• Manage your credits</li>
            </ul>
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
              onClick={handleLogin}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Log In
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryProtectionModal;