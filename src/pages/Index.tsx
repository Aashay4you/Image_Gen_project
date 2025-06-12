import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Palette, Download, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import GalleryProtectionModal from "@/components/GalleryProtection";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleViewGallery = () => {
    if (user) {
      navigate("/gallery");
    } else {
      setShowGalleryModal(true);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' : 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'}`}>
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10' : 'bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20'}`}></div>
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${isDarkMode ? 'bg-purple-500/5' : 'bg-purple-500/10'} rounded-full blur-3xl`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${isDarkMode ? 'bg-pink-500/5' : 'bg-pink-500/10'} rounded-full blur-3xl`}></div>
        
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="text-center space-y-8">
            {/* Logo/Brand */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Palette className="w-5 h-5 text-purple-300" />
              <span className="text-white font-semibold">ImageGen AI</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Generate Stunning
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent italic animate-pulse hover:scale-110 transition-all duration-20 cursor-default">
                AI Images
              </span>
              in Seconds
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your imagination into reality with our cutting-edge AI image generator. 
              Create professional-quality images from simple text descriptions.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button 
                onClick={() => navigate("/auth")} 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300" 
                size="lg"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                onClick={handleViewGallery}
                variant="outline" 
                className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white border-0 px-8 py-6 text-lg rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300" 
                size="lg"
              >
                View Gallery
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className={`py-20 ${isDarkMode ? 'bg-gradient-to-b from-transparent to-black/40' : 'bg-gradient-to-b from-transparent to-black/20'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful AI Features
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Everything you need to create amazing AI-generated images
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Generate high-quality images in seconds with our optimized AI models"
              }, 
              {
                icon: Palette,
                title: "Unlimited Creativity",
                description: "From photorealistic to artistic styles, create any image you can imagine"
              }, 
              {
                icon: Download,
                title: "High Resolution",
                description: "Download your creations in stunning 4K resolution for any use case"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Theme Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={toggleTheme} 
          className={`w-14 h-14 rounded-full ${isDarkMode ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'} text-white shadow-2xl transform hover:scale-110 transition-all duration-300`} 
          size="icon"
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </Button>
      </div>

      {/* Gallery Protection Modal */}
      <GalleryProtectionModal 
        open={showGalleryModal} 
        onOpenChange={setShowGalleryModal} 
      />
    </div>
  );
};

export default Index;