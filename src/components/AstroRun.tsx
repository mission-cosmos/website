import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, Zap, Gauge } from "lucide-react";
import FullScreenGame from "./FullScreenGame";

interface Obstacle {
  x: number;
  y: number;
  size: number;
  speed: number;
}

export default function AstroRun() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(3);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationId = useRef<number>();

  const gameWidth = 600;
  const gameHeight = 400;
  const playerSize = 40;
  const moveSpeed = 6; // faster up/down movement

  const playerY = useRef(gameHeight / 2 - playerSize / 2);
  const speed = useRef(3);
  const obstacles = useRef<Obstacle[]>([]);
  const keys = useRef({ Up: false, Down: false });

  // Precompute starfield positions
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }).map(() => ({
        x: Math.random() * gameWidth,
        y: Math.random() * gameHeight,
        r: Math.random() * 2 + 0.5,
      })),
    []
  );

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    playerY.current = gameHeight / 2 - playerSize / 2;
    obstacles.current = [];
    speed.current = 3;
  };

  const resetGame = () => startGame();

  // Main render loop
  useEffect(() => {
    if (!gameStarted) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    let lastTime = performance.now();

    function update(time: number) {
      const delta = (time - lastTime) / 16;
      lastTime = time;

      // Clear canvas
      ctx.clearRect(0, 0, gameWidth, gameHeight);

      // Draw starfield
      ctx.fillStyle = "#1a0226";
      ctx.fillRect(0, 0, gameWidth, gameHeight);
      ctx.fillStyle = "#fff";
      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Move player via arrow keys
      if (keys.current.Up) {
        playerY.current = Math.max(0, playerY.current - moveSpeed * delta);
      }
      if (keys.current.Down) {
        playerY.current = Math.min(
          gameHeight - playerSize,
          playerY.current + moveSpeed * delta
        );
      }

      // Draw player upright
      ctx.font = `${playerSize}px serif`;
      ctx.fillText("🚀", 50, playerY.current + playerSize);

      // Spawn obstacles randomly
      if (Math.random() < 0.03) {
        const size = 20 + Math.random() * 30;
        const spd = speed.current + Math.random() * 2;
        obstacles.current.push({
          x: gameWidth + size,
          y: Math.random() * (gameHeight - size),
          size,
          speed: spd,
        });
      }

      // Update and draw obstacles
      obstacles.current = obstacles.current.filter((o) => {
        o.x -= o.speed * delta;
        ctx.font = `${o.size}px serif`;
        ctx.fillText("☄️", o.x, o.y + o.size);
        // Collision detection
        if (
          50 + playerSize > o.x &&
          50 < o.x + o.size &&
          playerY.current + playerSize > o.y &&
          playerY.current < o.y + o.size
        ) {
          setGameOver(true);
          return false;
        }
        return o.x + o.size > 0;
      });

      // Score and speed update
      setScore((s) => s + 1);
      speed.current = Math.min(6, speed.current + 0.0005);
      setCurrentSpeed(Math.round(speed.current * 10) / 10);

      if (!gameOver) animationId.current = requestAnimationFrame(update);
    }

    animationId.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId.current!);
  }, [gameStarted, gameOver, stars]);

  // Keyboard control for arrows with preventDefault to stop page scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp') {
        e.preventDefault(); // Prevent page scrolling
        keys.current.Up = true;
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault(); // Prevent page scrolling
        keys.current.Down = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp') {
        e.preventDefault(); // Prevent page scrolling
        keys.current.Up = false;
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault(); // Prevent page scrolling
        keys.current.Down = false;
      }
    };
    
    // Only add event listeners when game is started
    if (gameStarted) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted]);

  return (
    <FullScreenGame title="Astro Run Adventure">
      <Card className="bg-slate-800/50 border-transparent max-w-3xl mx-auto relative overflow-hidden">
        {/* Astronaut background image */}
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/lovable-uploads/1c412bcc-e3f8-4a96-aa74-4646f288588e.png)' }}
        />
        <div className="relative z-10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
              <Rocket className="h-6 w-6 text-blue-400" /> Astro Run Adventure
            </CardTitle>
            <CardDescription className="text-gray-300">
              Navigate through space and dodge asteroids!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="border-white text-white">
                <Zap className="h-4 w-4 mr-1" /> {score}
              </Badge>
              <Badge variant="outline" className="border-white text-orange-400">
                <Gauge className="h-4 w-4 mr-1" /> {currentSpeed}x
              </Badge>
            </div>
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={gameWidth}
                height={gameHeight}
                className="rounded-lg border-transparent"
              />
            </div>
            {!gameStarted && (
              <div className="text-center">
                <Button onClick={startGame} className="bg-blue-600 text-white">
                  Launch Mission
                </Button>
                <p className="text-sm text-gray-400 mt-2">Use arrow keys to navigate</p>
              </div>
            )}
            {gameOver && (
              <div className="text-center space-y-2">
                <p className="text-blue-400 font-bold">Mission Failed!</p>
                <Button onClick={resetGame} className="bg-white text-black">
                  Retry
                </Button>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </FullScreenGame>
  );
}
