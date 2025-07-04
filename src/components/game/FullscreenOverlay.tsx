
import React from "react";
import { createPortal } from "react-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplet, Wifi, Target } from "lucide-react";
import { getSignalColor } from "./gameUtils";

interface FullscreenOverlayProps {
  isFullscreen: boolean;
  waterPoints: number;
  signalStrength: number;
  score: number;
  gameStarted: boolean;
  gameOver: boolean;
  onStart: () => void;
}

export const FullscreenOverlay: React.FC<FullscreenOverlayProps> = ({
  isFullscreen,
  waterPoints,
  signalStrength,
  score,
  gameStarted,
  gameOver,
  onStart
}) => {
  if (!isFullscreen) return null;

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-[999999]">
      {/* Score badges - ALWAYS visible in fullscreen */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex gap-4 pointer-events-auto z-[1000000]">
        <Badge variant="outline" className="border-white text-white bg-black/90 backdrop-blur-sm text-lg px-4 py-2">
          <Droplet className="h-5 w-5 mr-2" /> {waterPoints}
        </Badge>
        <Badge variant="outline" className={`border-white ${getSignalColor(signalStrength)} bg-black/90 backdrop-blur-sm text-lg px-4 py-2`}>
          <Wifi className="h-5 w-5 mr-2" /> {signalStrength}%
        </Badge>
        <Badge variant="outline" className="border-white text-white bg-black/90 backdrop-blur-sm text-lg px-4 py-2">
          <Target className="h-5 w-5 mr-2" /> {score}
        </Badge>
      </div>
      
      {/* Game over overlay */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center pointer-events-auto z-[1000000]">
          <div className="text-center space-y-6 bg-slate-800/95 p-12 rounded-lg border border-red-500/50 backdrop-blur-sm">
            <p className="text-red-400 font-bold text-4xl">Mission Failed!</p>
            <Button onClick={onStart} className="bg-white text-black text-xl px-12 py-4">
              Retry Mission
            </Button>
          </div>
        </div>
      )}

      {/* Start game overlay */}
      {!gameStarted && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center pointer-events-auto z-[1000000]">
          <div className="text-center space-y-6 bg-slate-800/95 p-12 rounded-lg border border-red-500/50 backdrop-blur-sm">
            <Button onClick={onStart} className="bg-red-600 text-white text-xl px-12 py-4">
              Start Mission
            </Button>
            <p className="text-lg text-gray-300">Use arrow keys to move the rover</p>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};
