
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";

interface FullScreenGameProps {
  children: React.ReactNode;
  title: string;
}

const FullScreenGame: React.FC<FullScreenGameProps> = ({ children, title }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);

  const toggleFullScreen = async () => {
    if (!gameRef.current) return;

    try {
      if (!isFullScreen) {
        await gameRef.current.requestFullscreen();
        setIsFullScreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullScreen(false);
      }
    } catch (error) {
      console.log("Fullscreen not supported or denied");
    }
  };

  React.useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={toggleFullScreen}
          variant="outline"
          size="sm"
          className="bg-slate-800/80 border-purple-500/50 text-white hover:bg-slate-700/80"
        >
          {isFullScreen ? (
            <>
              <Minimize className="h-4 w-4 mr-2" />
              Exit Fullscreen
            </>
          ) : (
            <>
              <Maximize className="h-4 w-4 mr-2" />
              Fullscreen
            </>
          )}
        </Button>
      </div>
      
      <div 
        ref={gameRef} 
        className={isFullScreen ? 'fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 z-50' : ''}
        style={isFullScreen ? { zIndex: 9999 } : {}}
      >
        <div className={isFullScreen ? 'w-full max-w-6xl' : ''}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FullScreenGame;
