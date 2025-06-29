
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplet, Wifi, Target } from "lucide-react";

export default function RedPlanetRover() {
  // Game UI state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [waterPoints, setWaterPoints] = useState(0);
  const [signalStrength, setSignalStrength] = useState(100);
  const [isCanvasFullScreen, setIsCanvasFullScreen] = useState(false);

  // Canvas & refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationId = useRef<number>();
  const frame = useRef(0);

  // Assets
  const hillsImg = useRef(new Image());
  const roverImg = useRef(new Image());
  const iceImg = useRef(new Image());
  const dustImg = useRef(new Image());
  const rockImg = useRef(new Image());

  // Game constants - RESTORED ORIGINAL ROVER SPEED
  const W = 640;
  const H = 360;
  const rover = useRef({ x: 40, y: H - 75, w: 64, h: 48, speed: 8 });
  const iceChunks = useRef<Array<{ x: number; y: number }>>([]);
  const dusts = useRef<Array<{ x: number; y: number }>>([]);
  const rocks = useRef<Array<{ x: number; y: number }>>([]);

  // Load images once
  useEffect(() => {
    hillsImg.current.src = "/lovable-uploads/0a3db819-fa9b-43a5-85f7-c8fa75998d9b.png";
    roverImg.current.src = "/lovable-uploads/ecec65ca-3cd0-4791-917b-3eac62c8aa01.png";
    iceImg.current.src = "/lovable-uploads/2d686005-6624-4dfa-beae-25c3708b4ad0.png";
    dustImg.current.src = "/lovable-uploads/6880029a-1c2d-49a1-873b-e8edd82f4bdb.png";
    rockImg.current.src = "/lovable-uploads/5c716d72-ed18-4132-9b8c-1faf06d8de33.png";
  }, []);

  // Check fullscreen state specifically for the canvas
  useEffect(() => {
    const handleFullScreenChange = () => {
      const canvas = canvasRef.current;
      const isFullscreen = canvas && document.fullscreenElement === canvas;
      console.log('Fullscreen change detected:', isFullscreen);
      setIsCanvasFullScreen(!!isFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  const isColliding = useCallback((a: any, b: any, aw: number, ah: number) => {
    return (
      a.x < b.x + b.w &&
      a.x + aw > b.x &&
      a.y < b.y + b.h &&
      a.y + ah > b.y
    );
  }, []);

  const endGame = useCallback(() => {
    setGameOver(true);
    cancelAnimationFrame(animationId.current!);
  }, []);

  const spawnIce = useCallback(() => {
    iceChunks.current.push({ x: Math.random() * (W - 16), y: -16 });
  }, []);
  const spawnDust = useCallback(() => {
    dusts.current.push({ x: Math.random() * (W - 32), y: -32 });
  }, []);
  const spawnRock = useCallback(() => {
    rocks.current.push({ x: Math.random() * (W - 28), y: -28 });
  }, []);

  // Input
  const keys = useRef<Record<string, boolean>>({});
  useEffect(() => {
    const down = (e: KeyboardEvent) => (keys.current[e.code] = true);
    const up = (e: KeyboardEvent) => (keys.current[e.code] = false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Main loop
  useEffect(() => {
    if (!gameStarted) return;
    const ctx = canvasRef.current!.getContext("2d")!;

    function drawBackground() {
      // sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#3a0f1d");
      grad.addColorStop(1, "#6b1e2e");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      // hills parallax
      const offset = -(frame.current * 0.3) % W;
      ctx.drawImage(hillsImg.current, offset, H - 120, W, 120);
      ctx.drawImage(hillsImg.current, offset + W, H - 120, W, 120);
    }

    function loop() {
      if (gameOver) return;
      const f = frame.current;
      frame.current += 1;

      // Update signal strength based on distance from base (simulated)
      const distanceFromBase = Math.floor(f / 100);
      const newSignal = Math.max(20, 100 - distanceFromBase);
      setSignalStrength(newSignal);

      drawBackground();
      // spawn entities
      if (f % 90 === 0) spawnIce();
      if (f % 150 === 0) spawnDust();
      if (f % 200 === 0) spawnRock();

      // move rover
      if (keys.current.ArrowLeft && rover.current.x > 0) rover.current.x -= rover.current.speed;
      if (keys.current.ArrowRight && rover.current.x < W - rover.current.w) rover.current.x += rover.current.speed;
      // draw rover
      ctx.drawImage(roverImg.current, rover.current.x, rover.current.y, rover.current.w, rover.current.h);

      // ice
      iceChunks.current.forEach((i, idx) => {
        i.y += 2 + f * 0.0005;
        ctx.drawImage(iceImg.current, i.x, i.y, 16, 16);
        if (isColliding(i, rover.current, 16, 16)) {
          iceChunks.current.splice(idx, 1);
          setWaterPoints(w => w + 50);
        }
      });
      // dust
      dusts.current.forEach((d, idx) => {
        d.y += 1.5 + f * 0.003;
        ctx.drawImage(dustImg.current, d.x, d.y, 32, 32);
        if (isColliding(d, rover.current, 32, 32)) endGame();
      });
      // rocks
      rocks.current.forEach((r, idx) => {
        r.y += 1.8 + f * 0.003;
        ctx.drawImage(rockImg.current, r.x, r.y, 28, 24);
        if (isColliding(r, rover.current, 28, 24)) endGame();
      });

      // Update score
      setScore(Math.floor(f / 10));

      animationId.current = requestAnimationFrame(loop);
    }

    animationId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId.current!);
  }, [gameStarted, gameOver, isColliding, spawnIce, spawnDust, spawnRock, endGame]);

  const start = () => {
    setGameStarted(true);
    setGameOver(false);
    setWaterPoints(0);
    setSignalStrength(100);
    frame.current = 0;
    rover.current = { x: 40, y: H - 75, w: 64, h: 48, speed: 8 };
    iceChunks.current = [];
    dusts.current = [];
    rocks.current = [];
  };

  const getSignalColor = () => {
    if (signalStrength > 70) return "text-green-400";
    if (signalStrength > 40) return "text-yellow-400";
    return "text-red-400";
  };

  // Fullscreen UI overlay - ALWAYS SHOWS WHEN CANVAS IS IN FULLSCREEN
  const FullscreenOverlay = () => (
    <div className="absolute inset-0 pointer-events-none z-50">
      {/* Score badges - ALWAYS visible in fullscreen */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-4 pointer-events-auto">
        <Badge variant="outline" className="border-white text-white bg-black/80">
          <Droplet className="h-4 w-4 mr-1" /> {waterPoints}
        </Badge>
        <Badge variant="outline" className={`border-white ${getSignalColor()} bg-black/80`}>
          <Wifi className="h-4 w-4 mr-1" /> {signalStrength}%
        </Badge>
        <Badge variant="outline" className="border-white text-white bg-black/80">
          <Target className="h-4 w-4 mr-1" /> {score}
        </Badge>
      </div>
      
      {/* Game over overlay - shows in fullscreen when game is over */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center pointer-events-auto">
          <div className="text-center space-y-4 bg-slate-800/95 p-8 rounded-lg border border-red-500/50">
            <p className="text-red-400 font-bold text-2xl">Mission Failed!</p>
            <Button onClick={start} className="bg-white text-black text-lg px-8 py-3">
              Retry Mission
            </Button>
          </div>
        </div>
      )}

      {/* Start game overlay - shows in fullscreen when game hasn't started */}
      {!gameStarted && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center pointer-events-auto">
          <div className="text-center space-y-4 bg-slate-800/95 p-8 rounded-lg border border-red-500/50">
            <Button onClick={start} className="bg-red-600 text-white text-lg px-8 py-3">
              Start Mission
            </Button>
            <p className="text-sm text-gray-300">Use arrow keys to move the rover</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
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
            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="border-white text-white">
                <Droplet className="h-4 w-4 mr-1" /> {waterPoints}
              </Badge>
              <Badge variant="outline" className={`border-white ${getSignalColor()}`}>
                <Wifi className="h-4 w-4 mr-1" /> {signalStrength}%
              </Badge>
              <Badge variant="outline" className="border-white text-white">
                <Target className="h-4 w-4 mr-1" /> {score}
              </Badge>
            </div>
          )}
          <div className="flex justify-center relative">
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              className="rounded-lg border border-red-500/30"
            />
            {/* ALWAYS show overlay when in fullscreen */}
            {isCanvasFullScreen && <FullscreenOverlay />}
          </div>
          {!isCanvasFullScreen && !gameStarted && (
            <div className="text-center">
              <Button onClick={start} className="bg-red-600 text-white">
                Start Mission
              </Button>
              <p className="text-sm text-gray-400 mt-2">Use arrow keys to move the rover</p>
            </div>
          )}
          {!isCanvasFullScreen && gameOver && (
            <div className="text-center space-y-2">
              <p className="text-red-400 font-bold">Mission Failed!</p>
              <Button onClick={start} className="bg-white text-black">
                Retry
              </Button>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
