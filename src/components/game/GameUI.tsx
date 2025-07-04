
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplet, Wifi, Target } from "lucide-react";
import { getSignalColor } from "./gameUtils";

interface GameUIProps {
  waterPoints: number;
  signalStrength: number;
  score: number;
  gameStarted: boolean;
  gameOver: boolean;
  onStart: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({
  waterPoints,
  signalStrength,
  score,
  gameStarted,
  gameOver,
  onStart
}) => {
  return (
    <>
      <div className="flex justify-center gap-4">
        <Badge variant="outline" className="border-white text-white">
          <Droplet className="h-4 w-4 mr-1" /> {waterPoints}
        </Badge>
        <Badge variant="outline" className={`border-white ${getSignalColor(signalStrength)}`}>
          <Wifi className="h-4 w-4 mr-1" /> {signalStrength}%
        </Badge>
        <Badge variant="outline" className="border-white text-white">
          <Target className="h-4 w-4 mr-1" /> {score}
        </Badge>
      </div>
      
      {!gameStarted && (
        <div className="text-center">
          <Button onClick={onStart} className="bg-red-600 text-white">
            Start Mission
          </Button>
          <p className="text-sm text-gray-400 mt-2">Use arrow keys to move the rover</p>
        </div>
      )}
      
      {gameOver && (
        <div className="text-center space-y-2">
          <p className="text-red-400 font-bold">Mission Failed!</p>
          <Button onClick={onStart} className="bg-white text-black">
            Retry
          </Button>
        </div>
      )}
    </>
  );
};
