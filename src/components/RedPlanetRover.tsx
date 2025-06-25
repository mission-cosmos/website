
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Target, Battery, Wifi } from "lucide-react";

const RedPlanetRover = () => {
  const [roverPosition, setRoverPosition] = useState({ x: 2, y: 2 });
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [targets, setTargets] = useState([
    { x: 0, y: 0, collected: false },
    { x: 4, y:1, collected: false },
    { x: 1, y: 4, collected: false }
  ]);
  const [battery, setBattery] = useState(100);

  const gridSize = 5;

  useEffect(() => {
    if (gameStarted && battery > 0) {
      const timer = setInterval(() => {
        setBattery(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, battery]);

  const moveRover = (direction: string) => {
    if (!gameStarted || battery <= 0) return;

    setRoverPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;

      switch (direction) {
        case 'up':
          newY = Math.max(0, prev.y - 1);
          break;
        case 'down':
          newY = Math.min(gridSize - 1, prev.y + 1);
          break;
        case 'left':
          newX = Math.max(0, prev.x - 1);
          break;
        case 'right':
          newX = Math.min(gridSize - 1, prev.x + 1);
          break;
      }

      // Check for target collection
      const targetIndex = targets.findIndex(target => 
        target.x === newX && target.y === newY && !target.collected
      );
      
      if (targetIndex !== -1) {
        setTargets(prev => prev.map((target, index) => 
          index === targetIndex ? { ...target, collected: true } : target
        ));
        setScore(prev => prev + 100);
        setBattery(prev => Math.min(100, prev + 20));
      }

      return { x: newX, y: newY };
    });
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setBattery(100);
    setRoverPosition({ x: 2, y: 2 });
    setTargets([
      { x: 0, y: 0, collected: false },
      { x: 4, y: 1, collected: false },
      { x: 1, y: 4, collected: false }
    ]);
  };

  const resetGame = () => {
    setGameStarted(false);
    setScore(0);
    setBattery(100);
    setRoverPosition({ x: 2, y: 2 });
    setTargets([
      { x: 0, y: 0, collected: false },
      { x: 4, y: 1, collected: false },
      { x: 1, y: 4, collected: false }
    ]);
  };

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isRover = roverPosition.x === x && roverPosition.y === y;
        const target = targets.find(t => t.x === x && t.y === y);
        const isTarget = target && !target.collected;
        
        grid.push(
          <div
            key={`${x}-${y}`}
            className={`w-16 h-16 border border-red-800/30 flex items-center justify-center text-2xl
              ${isRover ? 'bg-red-600/80' : 'bg-red-900/20'}
              ${isTarget ? 'bg-yellow-500/30' : ''}
            `}
          >
            {isRover && '🚗'}
            {isTarget && '🎯'}
          </div>
        );
      }
    }
    return grid;
  };

  const targetsCollected = targets.filter(t => t.collected).length;
  const isGameWon = targetsCollected === targets.length;
  const isGameOver = battery <= 0 && !isGameWon;

  return (
    <Card className="bg-slate-800/50 border-red-500/20 max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
          <Target className="h-6 w-6 text-red-400" />
          Red-Planet Rover Mission
        </CardTitle>
        <CardDescription className="text-gray-300">
          Navigate your rover across Mars to collect samples before your battery runs out!
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Game Stats */}
        <div className="flex justify-center gap-6 flex-wrap">
          <Badge variant="outline" className="border-green-500/50 text-green-400">
            Score: {score}
          </Badge>
          <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
            <Battery className="h-4 w-4 mr-1" />
            Battery: {battery}%
          </Badge>
          <Badge variant="outline" className="border-blue-500/50 text-blue-400">
            Targets: {targetsCollected}/{targets.length}
          </Badge>
        </div>

        {/* Game Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-5 gap-1 p-4 bg-red-950/30 rounded-lg border border-red-500/20">
            {renderGrid()}
          </div>
        </div>

        {/* Controls */}
        {gameStarted && !isGameOver && !isGameWon && (
          <div className="flex flex-col items-center space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div></div>
              <Button
                onClick={() => moveRover('up')}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/20"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <div></div>
              
              <Button
                onClick={() => moveRover('left')}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div></div>
              <Button
                onClick={() => moveRover('right')}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/20"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <div></div>
              <Button
                onClick={() => moveRover('down')}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/20"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <div></div>
            </div>
          </div>
        )}

        {/* Game States */}
        {!gameStarted && (
          <div className="text-center space-y-4">
            <p className="text-gray-300">Ready to explore Mars? Use the arrow buttons to move your rover!</p>
            <Button 
              onClick={startGame}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Start Mission
            </Button>
          </div>
        )}

        {isGameWon && (
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-green-400">Mission Accomplished! 🎉</h3>
            <p className="text-gray-300">You collected all samples with {battery}% battery remaining!</p>
            <Button 
              onClick={resetGame}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              New Mission
            </Button>
          </div>
        )}

        {isGameOver && (
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-red-400">Mission Failed</h3>
            <p className="text-gray-300">Your rover ran out of battery! Try again.</p>
            <Button 
              onClick={resetGame}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Retry Mission
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RedPlanetRover;
