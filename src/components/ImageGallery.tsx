
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserImages } from "@/hooks/useUserImages";
import { Loader2 } from "lucide-react";

const ImageGallery = () => {
  const { data: images, isLoading, error, refetch } = useUserImages();

  // Refresh gallery every 30 seconds to catch new images
  React.useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Your Generated Images</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <span className="ml-2 text-gray-300">Loading your images...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Your Generated Images</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-red-400 py-12">
          <p>Error loading images: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Your Generated Images</CardTitle>
      </CardHeader>
      <CardContent>
        {images && images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="aspect-square bg-gray-800/50 rounded-lg overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300"
                title={image.prompt}
              >
                <img
                  src={image.image_url}
                  alt={`Generated: ${image.prompt}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    console.error('Gallery image failed to load:', image.image_url);
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <p>No images generated yet</p>
            <p className="text-sm mt-2">Your created images will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageGallery;
