
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ImageGallery = () => {
  // Mock gallery data - will be replaced with actual user images from Supabase
  const galleryImages = [
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=300&fit=crop",
  ];

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Your Generated Images</CardTitle>
      </CardHeader>
      <CardContent>
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-800/50 rounded-lg overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={image}
                  alt={`Generated image ${index + 1}`}
                  className="w-full h-full object-cover"
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
