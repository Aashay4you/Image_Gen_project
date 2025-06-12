import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ImageGallery from "@/components/ImageGallery";
import GalleryProtectionModal from "@/components/GalleryProtection";

const Gallery = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showProtectionModal, setShowProtectionModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowProtectionModal(true);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-4">Gallery</h1>
            <p className="text-gray-300">Please log in to view your gallery</p>
          </div>
        </div>
        <GalleryProtectionModal 
          open={showProtectionModal} 
          onOpenChange={setShowProtectionModal} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navigation />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Gallery</h1>
          <p className="text-gray-300">View and manage all your generated images</p>
        </div>
        <ImageGallery />
      </div>
    </div>
  );
};

export default Gallery;