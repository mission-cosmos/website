
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, Zap, Target, Settings } from 'lucide-react';

interface SimulationProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onStart: () => void;
  active: boolean;
}

const SimulationCard: React.FC<SimulationProps> = ({ title, description, icon, color, onStart, active }) => (
  <Card className={`space-card border-white/20 hover:border-white/40 transition-all cursor-pointer ${active ? 'ring-2 ring-blue-400' : ''}`}>
    <CardHeader>
      <CardTitle className="text-white space-text flex items-center gap-2">
        <div className={color}>{icon}</div>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-300 space-text mb-4">{description}</p>
      <Button
        onClick={onStart}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
        disabled={active}
      >
        {active ? 'Running...' : 'Start Simulation'}
      </Button>
    </CardContent>
  </Card>
);

export default function SpaceSimulations() {
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [rocketData, setRocketData] = useState({
    altitude: 0,
    velocity: 0,
    fuel: 100,
    thrust: 0,
    stage: 1
  });
  const [gravityData, setGravityData] = useState({
    objects: [] as Array<{ x: number; y: number; vx: number; vy: number; id: number }>
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (activeSimulation === 'rocket' && canvasRef.current) {
      animateRocket();
    } else if (activeSimulation === 'gravity' && canvasRef.current) {
      animateGravity();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeSimulation]);

  const animateRocket = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#000011';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      for (let i = 0; i < 100; i++) {
        const x = (i * 37) % canvas.width;
        const y = (i * 73) % canvas.height;
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, 1, 1);
      }

      // Draw Earth
      const earthY = canvas.height - 50;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, earthY + 25, 25, 0, Math.PI);
      ctx.fillStyle = '#4B70DD';
      ctx.fill();

      // Draw rocket
      const rocketX = canvas.width / 2;
      const rocketY = earthY - rocketData.altitude / 100;
      
      ctx.fillStyle = '#FF6B6B';
      ctx.fillRect(rocketX - 5, rocketY - 20, 10, 20);
      
      // Draw flame if thrust > 0
      if (rocketData.thrust > 0) {
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.moveTo(rocketX - 3, rocketY);
        ctx.lineTo(rocketX + 3, rocketY);
        ctx.lineTo(rocketX, rocketY + 10);
        ctx.fill();
      }

      // Update physics
      if (rocketData.fuel > 0 && rocketData.thrust > 0) {
        setRocketData(prev => ({
          ...prev,
          velocity: prev.velocity + (prev.thrust * 0.1) - 0.98, // thrust - gravity
          fuel: Math.max(0, prev.fuel - 0.1),
          altitude: Math.max(0, prev.altitude + prev.velocity)
        }));
      } else {
        setRocketData(prev => ({
          ...prev,
          velocity: prev.velocity - 0.98, // gravity only
          altitude: Math.max(0, prev.altitude + prev.velocity)
        }));
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const animateGravity = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#000011';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      for (let i = 0; i < 100; i++) {
        const x = (i * 37) % canvas.width;
        const y = (i * 73) % canvas.height;
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, 1, 1);
      }

      // Update and draw objects
      setGravityData(prev => {
        const newObjects = prev.objects.map(obj => {
          // Apply gravity from other objects
          let fx = 0, fy = 0;
          prev.objects.forEach(other => {
            if (other.id !== obj.id) {
              const dx = other.x - obj.x;
              const dy = other.y - obj.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const force = 0.5 / (dist * dist);
              fx += force * dx / dist;
              fy += force * dy / dist;
            }
          });

          return {
            ...obj,
            vx: obj.vx + fx,
            vy: obj.vy + fy,
            x: obj.x + obj.vx,
            y: obj.y + obj.vy
          };
        });

        return { objects: newObjects };
      });

      // Draw objects
      gravityData.objects.forEach(obj => {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#FF6B6B';
        ctx.fill();

        // Draw trail
        ctx.strokeStyle = 'rgba(255, 107, 107, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(obj.x - obj.vx * 10, obj.y - obj.vy * 10);
        ctx.lineTo(obj.x, obj.y);
        ctx.stroke();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const startRocketSimulation = () => {
    setActiveSimulation('rocket');
    setRocketData({
      altitude: 0,
      velocity: 0,
      fuel: 100,
      thrust: 0,
      stage: 1
    });
  };

  const startGravitySimulation = () => {
    setActiveSimulation('gravity');
    setGravityData({
      objects: [
        { x: 200, y: 200, vx: 1, vy: 0, id: 1 },
        { x: 400, y: 200, vx: -1, vy: 0, id: 2 },
        { x: 300, y: 300, vx: 0, vy: 1, id: 3 }
      ]
    });
  };

  const addThrust = () => {
    if (rocketData.fuel > 0) {
      setRocketData(prev => ({ ...prev, thrust: Math.min(10, prev.thrust + 2) }));
    }
  };

  const removeThrust = () => {
    setRocketData(prev => ({ ...prev, thrust: Math.max(0, prev.thrust - 2) }));
  };

  const addGravityObject = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newObject = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      id: Date.now()
    };

    setGravityData(prev => ({
      objects: [...prev.objects, newObject]
    }));
  };

  const resetSimulation = () => {
    setActiveSimulation(null);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 space-text">Space Simulations</h2>
        <p className="text-xl text-gray-200 space-text">Experience realistic space physics and scenarios</p>
      </div>

      {!activeSimulation ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <SimulationCard
            title="Rocket Launch"
            description="Experience a realistic rocket launch with physics, fuel management, and multi-stage separation."
            icon={<Rocket className="h-6 w-6" />}
            color="text-red-400"
            onStart={startRocketSimulation}
            active={false}
          />
          
          <SimulationCard
            title="Zero Gravity"
            description="Simulate zero gravity physics with multiple objects affected by gravitational forces."
            icon={<Zap className="h-6 w-6" />}
            color="text-blue-400"
            onStart={startGravitySimulation}
            active={false}
          />
          
          <SimulationCard
            title="Orbital Mechanics"
            description="Coming soon: Learn about orbital mechanics and satellite trajectories."
            icon={<Target className="h-6 w-6" />}
            color="text-green-400"
            onStart={() => {}}
            active={false}
          />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="space-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white space-text flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Settings className="h-6 w-6 text-blue-400" />
                      {activeSimulation === 'rocket' ? 'Rocket Launch Simulator' : 'Zero Gravity Simulator'}
                    </span>
                    <Button
                      onClick={resetSimulation}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Back to Menu
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <canvas
                    ref={canvasRef}
                    className="w-full rounded-b-lg"
                    style={{ height: '500px' }}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {activeSimulation === 'rocket' && (
                <>
                  <Card className="space-card border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white space-text">Rocket Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Altitude:</span>
                        <span className="text-white font-medium">{Math.round(rocketData.altitude)} km</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Velocity:</span>
                        <span className="text-white font-medium">{Math.round(rocketData.velocity)} m/s</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Fuel:</span>
                        <span className="text-white font-medium">{Math.round(rocketData.fuel)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Thrust:</span>
                        <span className="text-white font-medium">{rocketData.thrust}/10</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="space-card border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white space-text">Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        onClick={addThrust}
                        className="w-full bg-green-500 hover:bg-green-600"
                        disabled={rocketData.fuel <= 0}
                      >
                        Increase Thrust
                      </Button>
                      <Button
                        onClick={removeThrust}
                        className="w-full bg-red-500 hover:bg-red-600"
                        disabled={rocketData.thrust <= 0}
                      >
                        Decrease Thrust
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}

              {activeSimulation === 'gravity' && (
                <Card className="space-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white space-text">Gravity Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={addGravityObject}
                      className="w-full bg-purple-500 hover:bg-purple-600"
                    >
                      Add Object
                    </Button>
                    <p className="text-gray-300 text-sm space-text">
                      Objects: {gravityData.objects.length}
                    </p>
                    <p className="text-gray-300 text-sm space-text">
                      Watch how objects attract each other through gravitational forces.
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card className="space-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white space-text">Physics Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm space-text">
                    {activeSimulation === 'rocket' 
                      ? "This simulation models real rocket physics including thrust, gravity, and fuel consumption. Try to reach maximum altitude!"
                      : "Objects in space attract each other with gravitational force. Watch the complex orbital patterns that emerge!"
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
