
import React, { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { GAME_CONSTANTS } from "./game/gameUtils";
import { useGameState } from "./game/useGameState";
import { useGameLoop } from "./game/useGameLoop";
import { GameUI } from "./game/GameUI";
import { FullscreenOverlay } from "./game/FullscreenOverlay";

export default function RedPlanetRover() {
  const [isCanvasFullScreen, setIsCanvasFullScreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameState = useGameState();
  
  useGameLoop(gameState, canvasRef);

  // Check fullscreen state specifically for the canvas
  useEffect(() => {
    const handleFullScreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      console.log('Fullscreen change detected:', isFullscreen, 'Element:', document.fullscreenElement);
      setIsCanvasFullScreen(isFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  return (
    <>
      <Card className="bg-slate-800/50 border-red-500/20 max-w-3xl mx-auto relative overflow-hidden">
        {/* Mars rover background image */}
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/lovable-uploads/2f88afbf-c39c-420f-811c-7519f6b8f9c7.png)' }}
        />
        <div className="relative z-10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
              <Target className="h-6 w-6 text-red-400" /> Red-Planet Rover
            </CardTitle>
            <CardDescription className="text-gray-300">
              Navigate Mars, collect ice, avoid dust & rocks!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isCanvasFullScreen && (
              <GameUI
                waterPoints={gameState.waterPoints}
                signalStrength={gameState.signalStrength}
                score={gameState.score}
                gameStarted={gameState.gameStarted}
                gameOver={gameState.gameOver}
                onStart={gameState.resetGame}
              />
            )}
            <div className="flex justify-center relative">
              <canvas
                ref={canvasRef}
                width={GAME_CONSTANTS.WIDTH}
                height={GAME_CONSTANTS.HEIGHT}
                className="rounded-lg border border-red-500/30"
              />
            </div>
            {!isCanvasFullScreen && !gameState.gameStarted && (
              <div className="text-center">
                <Button onClick={gameState.resetGame} className="bg-red-600 text-white">
                  Start Mission
                </Button>
                <p className="text-sm text-gray-400 mt-2">Use arrow keys to move the rover</p>
              </div>
            )}
            {!isCanvasFullScreen && gameState.gameOver && (
              <div className="text-center space-y-2">
                <p className="text-red-400 font-bold">Mission Failed!</p>
                <Button onClick={gameState.resetGame} className="bg-white text-black">
                  Retry
                </Button>
              </div>
            )}
          </CardContent>
        </div>
      </Card>

      <FullscreenOverlay
        isFullscreen={isCanvasFullScreen}
        waterPoints={gameState.waterPoints}
        signalStrength={gameState.signalStrength}
        score={gameState.score}
        gameStarted={gameState.gameStarted}
        gameOver={gameState.gameOver}
        onStart={gameState.resetGame}
      />
    </>
  );
}
