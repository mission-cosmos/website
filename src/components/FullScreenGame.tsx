
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";

interface FullScreenGameProps {
  children: React.ReactNode;
  title: string;
}

const FullScreenGame: React.FC<FullScreenGameProps> = ({ children, title }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const toggleFullScreen = async () => {
    if (!gameContainerRef.current) return;

    try {
      if (!isFullScreen) {
        // Find the canvas element within the game container
        const canvas = gameContainerRef.current.querySelector('canvas');
        if (canvas) {
          await canvas.requestFullscreen();
          setIsFullScreen(true);
        }
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
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
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
        {!isFullScreen && (
          <p className="text-xs text-gray-400 max-w-[200px] text-right">
            💡 Start the game first, then click fullscreen for best experience
          </p>
        )}
      </div>
      
      <div ref={gameContainerRef}>
        {children}
      </div>
    </div>
  );
};

export default FullScreenGame;
