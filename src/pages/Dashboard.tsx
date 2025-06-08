
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Wand2, Download, Share2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import ImageGallery from "@/components/ImageGallery";

const Dashboard = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call - will be replaced with actual AI generation
    setTimeout(() => {
      setGeneratedImage("https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=512&h=512&fit=crop");
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI Image Generator</h1>
          <p className="text-gray-300">Transform your ideas into stunning visuals</p>
        </div>
        
        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Prompt Input */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Wand2 className="w-5 h-5 mr-2" />
                Create Your Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Describe your image
                </label>
                <Textarea
                  placeholder="A majestic dragon flying over a mystical forest at sunset, digital art style..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-32 bg-white/5 border-white/20 text-white placeholder:text-gray-400 resize-none"
                />
              </div>
              
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg rounded-xl"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Palette className="w-5 h-5 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
              
              {/* Generation Progress */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse" style={{width: "60%"}}></div>
                  </div>
                  <p className="text-sm text-gray-300 text-center">Creating your masterpiece...</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Right Column - Generated Image */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Generated Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gray-800/50 rounded-xl flex items-center justify-center overflow-hidden">
                {generatedImage ? (
                  <div className="relative group w-full h-full">
                    <img
                      src={generatedImage}
                      alt="Generated AI Image"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center space-x-4">
                      <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Palette className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Your generated image will appear here</p>
                    <p className="text-sm mt-2">Enter a prompt and click generate to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Gallery Section */}
        <div className="mt-12">
          <ImageGallery />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
