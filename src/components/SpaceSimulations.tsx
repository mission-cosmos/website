
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, Zap, Target, Settings, Play, Pause, RotateCcw } from 'lucide-react';

interface SimulationProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onStart: () => void;
  active: boolean;
}

const SimulationCard: React.FC<SimulationProps> = ({ title, description, icon, color, onStart, active }) => (
  <Card className={`space-card border-white/20 hover:border-white/40 transition-all cursor-pointer bg-black/40 ${active ? 'ring-2 ring-blue-400' : ''}`}>
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

interface RocketState {
  altitude: number;
  velocity: number;
  fuel: number;
  thrust: number;
  stage: number;
  acceleration: number;
  maxAltitude: number;
}

interface GravityObject {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  id: number;
  trail: { x: number; y: number }[];
}

export default function SpaceSimulations() {
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [rocketData, setRocketData] = useState<RocketState>({
    altitude: 0,
    velocity: 0,
    fuel: 100,
    thrust: 0,
    stage: 1,
    acceleration: 0,
    maxAltitude: 0
  });
  const [gravityObjects, setGravityObjects] = useState<GravityObject[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const GRAVITY = 9.81;
  const FUEL_CONSUMPTION_RATE = 0.5;
  const THRUST_EFFICIENCY = 2.0;

  const updateRocketPhysics = useCallback((deltaTime: number) => {
    setRocketData(prev => {
      const newData = { ...prev };
      
      // Calculate forces
      const gravityForce = GRAVITY * (1 - prev.altitude / 100000); // Gravity decreases with altitude
      let netAcceleration = -gravityForce;
      
      // Add thrust if fuel available and thrust applied
      if (prev.fuel > 0 && prev.thrust > 0) {
        const thrustForce = prev.thrust * THRUST_EFFICIENCY;
        netAcceleration += thrustForce;
        newData.fuel = Math.max(0, prev.fuel - (prev.thrust * FUEL_CONSUMPTION_RATE * deltaTime));
      }
      
      // Update velocity and altitude
      newData.acceleration = netAcceleration;
      newData.velocity = prev.velocity + (netAcceleration * deltaTime);
      newData.altitude = Math.max(0, prev.altitude + (prev.velocity * deltaTime));
      
      // Track max altitude
      newData.maxAltitude = Math.max(prev.maxAltitude, newData.altitude);
      
      // Landing/crash detection
      if (newData.altitude <= 0 && prev.velocity < -10) {
        // Crash landing
        newData.velocity = 0;
        newData.altitude = 0;
      }
      
      return newData;
    });
  }, []);

  const updateGravityPhysics = useCallback((deltaTime: number) => {
    setGravityObjects(prev => {
      return prev.map(obj => {
        const newObj = { ...obj };
        
        // Calculate gravitational forces from other objects
        let fx = 0, fy = 0;
        prev.forEach(other => {
          if (other.id !== obj.id) {
            const dx = other.x - obj.x;
            const dy = other.y - obj.y;
            const distanceSquared = dx * dx + dy * dy;
            const distance = Math.sqrt(distanceSquared);
            
            if (distance > 5) { // Prevent division by zero and extreme forces
              const force = (obj.mass * other.mass * 100) / distanceSquared; // Scaled for visualization
              fx += (force * dx) / distance;
              fy += (force * dy) / distance;
            }
          }
        });
        
        // Update velocity based on forces
        newObj.vx += (fx / obj.mass) * deltaTime;
        newObj.vy += (fy / obj.mass) * deltaTime;
        
        // Update position
        newObj.x += newObj.vx * deltaTime * 60; // Scale for smooth animation
        newObj.y += newObj.vy * deltaTime * 60;
        
        // Add to trail
        newObj.trail = [...obj.trail.slice(-20), { x: newObj.x, y: newObj.y }];
        
        // Boundary bouncing
        const canvas = canvasRef.current;
        if (canvas) {
          if (newObj.x < 10 || newObj.x > canvas.width - 10) newObj.vx *= -0.8;
          if (newObj.y < 10 || newObj.y > canvas.height - 10) newObj.vy *= -0.8;
          newObj.x = Math.max(10, Math.min(canvas.width - 10, newObj.x));
          newObj.y = Math.max(10, Math.min(canvas.height - 10, newObj.y));
        }
        
        return newObj;
      });
    });
  }, []);

  const animateRocket = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const deltaTime = lastTimeRef.current ? (currentTime - lastTimeRef.current) / 1000 : 0;
    lastTimeRef.current = currentTime;

    if (isPlaying && deltaTime > 0) {
      updateRocketPhysics(deltaTime);
    }

    // Clear canvas with space background
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    for (let i = 0; i < 150; i++) {
      const x = (i * 37) % canvas.width;
      const y = (i * 73) % canvas.height;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.7})`;
      ctx.fillRect(x, y, 1, 1);
    }

    // Draw Earth
    const earthRadius = 50;
    const earthY = canvas.height - earthRadius;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, earthY, earthRadius, 0, Math.PI * 2);
    const earthGradient = ctx.createRadialGradient(canvas.width / 2, earthY, 0, canvas.width / 2, earthY, earthRadius);
    earthGradient.addColorStop(0, '#4B70DD');
    earthGradient.addColorStop(0.7, '#2E5BDA');
    earthGradient.addColorStop(1, '#1E4BA8');
    ctx.fillStyle = earthGradient;
    ctx.fill();

    // Draw atmosphere
    ctx.beginPath();
    ctx.arc(canvas.width / 2, earthY, earthRadius + 10, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(135, 206, 250, 0.3)';
    ctx.fill();

    // Calculate rocket position
    const rocketX = canvas.width / 2;
    const maxDisplayAltitude = canvas.height - earthRadius - 200;
    const rocketY = earthY - earthRadius - Math.min(rocketData.altitude / 100, maxDisplayAltitude);
    
    // Draw rocket
    const rocketWidth = 8;
    const rocketHeight = 24;
    
    // Rocket body
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(rocketX - rocketWidth/2, rocketY - rocketHeight, rocketWidth, rocketHeight);
    
    // Rocket nose
    ctx.beginPath();
    ctx.moveTo(rocketX - rocketWidth/2, rocketY - rocketHeight);
    ctx.lineTo(rocketX, rocketY - rocketHeight - 8);
    ctx.lineTo(rocketX + rocketWidth/2, rocketY - rocketHeight);
    ctx.fillStyle = '#FF4444';
    ctx.fill();
    
    // Draw flame if thrust > 0
    if (rocketData.thrust > 0 && rocketData.fuel > 0) {
      const flameHeight = 15 + (rocketData.thrust * 2);
      ctx.beginPath();
      ctx.moveTo(rocketX - rocketWidth/2 + 1, rocketY);
      ctx.lineTo(rocketX + rocketWidth/2 - 1, rocketY);
      ctx.lineTo(rocketX, rocketY + flameHeight);
      ctx.fillStyle = '#FFA500';
      ctx.fill();
      
      // Inner flame
      ctx.beginPath();
      ctx.moveTo(rocketX - rocketWidth/4, rocketY);
      ctx.lineTo(rocketX + rocketWidth/4, rocketY);
      ctx.lineTo(rocketX, rocketY + flameHeight * 0.7);
      ctx.fillStyle = '#FFFF00';
      ctx.fill();
    }

    // Draw altitude indicator
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '14px monospace';
    ctx.fillText(`Alt: ${Math.round(rocketData.altitude)}m`, 10, 30);
    ctx.fillText(`Vel: ${Math.round(rocketData.velocity)}m/s`, 10, 50);
    ctx.fillText(`Max: ${Math.round(rocketData.maxAltitude)}m`, 10, 70);

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animateRocket);
    }
  }, [rocketData, isPlaying, updateRocketPhysics]);

  const animateGravity = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const deltaTime = lastTimeRef.current ? (currentTime - lastTimeRef.current) / 1000 : 0;
    lastTimeRef.current = currentTime;

    if (isPlaying && deltaTime > 0) {
      updateGravityPhysics(deltaTime);
    }

    // Clear canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    for (let i = 0; i < 100; i++) {
      const x = (i * 37) % canvas.width;
      const y = (i * 73) % canvas.height;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillRect(x, y, 1, 1);
    }

    // Draw objects and trails
    gravityObjects.forEach(obj => {
      // Draw trail
      if (obj.trail.length > 1) {
        ctx.strokeStyle = `rgba(255, 107, 107, 0.5)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(obj.trail[0].x, obj.trail[0].y);
        for (let i = 1; i < obj.trail.length; i++) {
          ctx.lineTo(obj.trail[i].x, obj.trail[i].y);
        }
        ctx.stroke();
      }

      // Draw object
      const radius = Math.sqrt(obj.mass) * 2;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, radius, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(obj.x, obj.y, 0, obj.x, obj.y, radius);
      gradient.addColorStop(0, '#FF6B6B');
      gradient.addColorStop(1, '#FF4444');
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw velocity vector
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(obj.x, obj.y);
      ctx.lineTo(obj.x + obj.vx * 10, obj.y + obj.vy * 10);
      ctx.stroke();
    });

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animateGravity);
    }
  }, [gravityObjects, isPlaying, updateGravityPhysics]);

  useEffect(() => {
    if (activeSimulation === 'rocket') {
      animationRef.current = requestAnimationFrame(animateRocket);
    } else if (activeSimulation === 'gravity') {
      animationRef.current = requestAnimationFrame(animateGravity);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeSimulation, animateRocket, animateGravity]);

  const startRocketSimulation = () => {
    setActiveSimulation('rocket');
    setIsPlaying(true);
    setRocketData({
      altitude: 0,
      velocity: 0,
      fuel: 100,
      thrust: 0,
      stage: 1,
      acceleration: 0,
      maxAltitude: 0
    });
    lastTimeRef.current = 0;
  };

  const startGravitySimulation = () => {
    setActiveSimulation('gravity');
    setIsPlaying(true);
    setGravityObjects([
      { x: 200, y: 200, vx: 0.5, vy: 0, mass: 10, id: 1, trail: [] },
      { x: 400, y: 200, vx: -0.5, vy: 0, mass: 10, id: 2, trail: [] },
      { x: 300, y: 300, vx: 0, vy: 0.5, mass: 15, id: 3, trail: [] }
    ]);
    lastTimeRef.current = 0;
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetSimulation = () => {
    setActiveSimulation(null);
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const addThrust = () => {
    if (rocketData.fuel > 0) {
      setRocketData(prev => ({ ...prev, thrust: Math.min(10, prev.thrust + 1) }));
    }
  };

  const removeThrust = () => {
    setRocketData(prev => ({ ...prev, thrust: Math.max(0, prev.thrust - 1) }));
  };

  const addGravityObject = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newObject: GravityObject = {
      x: 100 + Math.random() * (canvas.width - 200),
      y: 100 + Math.random() * (canvas.height - 200),
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      mass: 5 + Math.random() * 15,
      id: Date.now(),
      trail: []
    };

    setGravityObjects(prev => [...prev, newObject]);
  };

  const clearGravityObjects = () => {
    setGravityObjects([]);
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
            description="Experience a realistic rocket launch with accurate physics, fuel management, and atmospheric effects."
            icon={<Rocket className="h-6 w-6" />}
            color="text-red-400"
            onStart={startRocketSimulation}
            active={false}
          />
          
          <SimulationCard
            title="Gravity Physics"
            description="Simulate gravitational interactions between multiple objects with real physics equations."
            icon={<Zap className="h-6 w-6" />}
            color="text-blue-400"
            onStart={startGravitySimulation}
            active={false}
          />
          
          <SimulationCard
            title="Orbital Mechanics"
            description="Coming soon: Learn about orbital mechanics and satellite trajectories with interactive physics."
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
              <Card className="space-card border-white/20 bg-black/40">
                <CardHeader>
                  <CardTitle className="text-white space-text flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Settings className="h-6 w-6 text-blue-400" />
                      {activeSimulation === 'rocket' ? 'Rocket Launch Simulator' : 'Gravity Physics Simulator'}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        onClick={togglePlayPause}
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10 bg-black/40"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        onClick={resetSimulation}
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10 bg-black/40"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <canvas
                    ref={canvasRef}
                    className="w-full rounded border border-white/20 bg-black"
                    style={{ height: '500px' }}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {activeSimulation === 'rocket' && (
                <>
                  <Card className="space-card border-white/20 bg-black/40">
                    <CardHeader>
                      <CardTitle className="text-white space-text">Rocket Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm bg-white/5 p-2 rounded">
                        <span className="text-gray-300">Altitude:</span>
                        <span className="text-white font-mono">{Math.round(rocketData.altitude)}m</span>
                      </div>
                      <div className="flex justify-between text-sm bg-white/5 p-2 rounded">
                        <span className="text-gray-300">Velocity:</span>
                        <span className="text-white font-mono">{Math.round(rocketData.velocity)}m/s</span>
                      </div>
                      <div className="flex justify-between text-sm bg-white/5 p-2 rounded">
                        <span className="text-gray-300">Fuel:</span>
                        <span className="text-white font-mono">{Math.round(rocketData.fuel)}%</span>
                      </div>
                      <div className="flex justify-between text-sm bg-white/5 p-2 rounded">
                        <span className="text-gray-300">Thrust:</span>
                        <span className="text-white font-mono">{rocketData.thrust}/10</span>
                      </div>
                      <div className="flex justify-between text-sm bg-white/5 p-2 rounded">
                        <span className="text-gray-300">Max Alt:</span>
                        <span className="text-white font-mono">{Math.round(rocketData.maxAltitude)}m</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="space-card border-white/20 bg-black/40">
                    <CardHeader>
                      <CardTitle className="text-white space-text">Thrust Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        onClick={addThrust}
                        className="w-full bg-green-500 hover:bg-green-600"
                        disabled={rocketData.fuel <= 0}
                      >
                        Increase Thrust (+)
                      </Button>
                      <Button
                        onClick={removeThrust}
                        className="w-full bg-red-500 hover:bg-red-600"
                        disabled={rocketData.thrust <= 0}
                      >
                        Decrease Thrust (-)
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}

              {activeSimulation === 'gravity' && (
                <Card className="space-card border-white/20 bg-black/40">
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
                    <Button
                      onClick={clearGravityObjects}
                      className="w-full bg-red-500 hover:bg-red-600"
                      disabled={gravityObjects.length === 0}
                    >
                      Clear All
                    </Button>
                    <div className="text-sm space-y-1 bg-white/5 p-3 rounded">
                      <p className="text-gray-300">Objects: <span className="text-white">{gravityObjects.length}</span></p>
                      <p className="text-gray-300 text-xs">White lines show velocity vectors</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="space-card border-white/20 bg-black/40">
                <CardHeader>
                  <CardTitle className="text-white space-text">Physics Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm space-text">
                    {activeSimulation === 'rocket' 
                      ? "This simulation uses real physics equations including thrust-to-weight ratio, fuel consumption, and decreasing gravity with altitude."
                      : "Objects attract each other using Newton's law of universal gravitation: F = G(m₁m₂)/r². Watch orbital mechanics in action!"
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
