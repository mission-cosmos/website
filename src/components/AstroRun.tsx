
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, Star, Zap } from "lucide-react";

const AstroRun = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playerY, setPlayerY] = useState(300);
  const [obstacles, setObstacles] = useState<Array<{x: number, y: number, type: 'asteroid' | 'star'}>>([]);
  const [speed, setSpeed] = useState(2);

  const gameHeight = 400;
  const gameWidth = 600;
  const playerSize = 40;

  const jump = useCallback(() => {
    if (!gameStarted || gameOver) return;
    setPlayerY(prev => Math.max(50, prev - 80));
  }, [gameStarted, gameOver]);

  // Gravity effect
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const gravityInterval = setInterval(() => {
      setPlayerY(prev => Math.min(gameHeight - playerSize, prev + 4));
    }, 50);

    return () => clearInterval(gravityInterval);
  }, [gameStarted, gameOver]);

  // Spawn obstacles
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const spawnInterval = setInterval(() => {
      const newObstacle = {
        x: gameWidth,
        y: Math.random() > 0.7 ? Math.random() * (gameHeight - 100) + 50 : gameHeight - 60,
        type: Math.random() > 0.3 ? 'asteroid' as const : 'star' as const
      };
      setObstacles(prev => [...prev, newObstacle]);
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, [gameStarted, gameOver, speed]);

  // Move obstacles and handle collisions
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveInterval = setInterval(() => {
      setObstacles(prev => {
        const newObstacles = prev
          .map(obstacle => ({ ...obstacle, x: obstacle.x - speed }))
          .filter(obstacle => obstacle.x > -50);

        // Check collisions
        newObstacles.forEach(obstacle => {
          const playerLeft = 50;
          const playerRight = playerLeft + playerSize;
          const playerTop = playerY;
          const playerBottom = playerY + playerSize;

          const obstacleLeft = obstacle.x;
          const obstacleRight = obstacle.x + 30;
          const obstacleTop = obstacle.y;
          const obstacleBottom = obstacle.y + 30;

          if (
            playerRight > obstacleLeft &&
            playerLeft < obstacleRight &&
            playerBottom > obstacleTop &&
            playerTop < obstacleBottom
          ) {
            if (obstacle.type === 'asteroid') {
              setGameOver(true);
            } else if (obstacle.type === 'star') {
              setScore(prev => prev + 50);
              obstacle.x = -100; // Remove star
            }
          }
        });

        return newObstacles;
      });

      setScore(prev => prev + 1);
    }, 50);

    return () => clearInterval(moveInterval);
  }, [gameStarted, gameOver, speed, playerY]);

  // Increase speed over time
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const speedInterval = setInterval(() => {
      setSpeed(prev => Math.min(prev + 0.1, 5));
    }, 5000);

    return () => clearInterval(speedInterval);
  }, [gameStarted, gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setPlayerY(300);
    setObstacles([]);
    setSpeed(2);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setPlayerY(300);
    setObstacles([]);
    setSpeed(2);
  };

  return (
    <Card className="bg-slate-800/50 border-blue-500/20 max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
          <Rocket className="h-6 w-6 text-blue-400" />
          Astro Run Adventure
        </CardTitle>
        <CardDescription className="text-gray-300">
          Pilot your spacecraft through space! Avoid asteroids and collect stars!
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Game Stats */}
        <div className="flex justify-center gap-6 flex-wrap">
          <Badge variant="outline" className="border-green-500/50 text-green-400">
            Score: {score}
          </Badge>
          <Badge variant="outline" className="border-purple-500/50 text-purple-400">
            <Zap className="h-4 w-4 mr-1" />
            Speed: {speed.toFixed(1)}x
          </Badge>
        </div>

        {/* Game Canvas */}
        <div className="flex justify-center">
          <div 
            className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 border border-blue-500/20 rounded-lg overflow-hidden"
            style={{ width: gameWidth, height: gameHeight }}
          >
            {/* Stars background */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>

            {/* Player */}
            {gameStarted && (
              <div
                className="absolute text-3xl transition-all duration-100"
                style={{
                  left: 50,
                  top: playerY,
                  transform: 'rotate(-15deg)'
                }}
              >
                🚀
              </div>
            )}

            {/* Obstacles */}
            {obstacles.map((obstacle, index) => (
              <div
                key={index}
                className="absolute text-2xl"
                style={{
                  left: obstacle.x,
                  top: obstacle.y,
                }}
              >
                {obstacle.type === 'asteroid' ? '☄️' : '⭐'}
              </div>
            ))}

            {/* Game Over Overlay */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <h3 className="text-3xl font-bold text-red-400">Game Over!</h3>
                  <p className="text-xl text-gray-300">Final Score: {score}</p>
                  <Button 
                    onClick={resetGame}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        {gameStarted && !gameOver && (
          <div className="text-center space-y-4">
            <Button
              onClick={jump}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4"
            >
              JUMP 🚀
            </Button>
            <p className="text-sm text-gray-400">
              Press SPACE or click JUMP to navigate your spacecraft!
            </p>
          </div>
        )}

        {/* Start Screen */}
        {!gameStarted && (
          <div className="text-center space-y-4">
            <p className="text-gray-300">
              Navigate through space by jumping over asteroids and collecting stars!
            </p>
            <p className="text-sm text-gray-400">
              Use SPACE key or the JUMP button to control your spacecraft
            </p>
            <Button 
              onClick={startGame}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3"
            >
              Launch Mission
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AstroRun;
