import { Button } from "@/components/ui/button";
import { Palette, User, LogIn, LogOut, Coins, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCredits } from "@/hooks/useCredits";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { credits, loading } = useCredits();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="relative z-50 bg-white/5 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity group"
            onClick={() => navigate("/")}
          >
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ImageGen</span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <Button
                variant="ghost"
                onClick={() => navigate("/gallery")}
                className="text-white hover:bg-white/10 flex items-center space-x-2"
              >
                <Image className="w-4 h-4" />
                <span>Gallery</span>
              </Button>
            )}
          </div>
          
          {/* Navigation Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Credits Display */}
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur rounded-full px-3 py-1">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-white">
                    {loading ? '...' : credits}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full p-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900/95 backdrop-blur border-gray-700 text-white">
                    <DropdownMenuItem onClick={() => navigate("/dashboard")} className="hover:bg-gray-800">
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/gallery")} className="hover:bg-gray-800 md:hidden">
                      <Image className="w-4 h-4 mr-2" />
                      Gallery
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/profile")} className="hover:bg-gray-800">
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem onClick={handleSignOut} className="hover:bg-gray-800">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;