
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Orbit, Zap, Star } from 'lucide-react';

interface CelestialBody {
  name: string;
  distance: number;
  size: number;
  color: string;
  info: {
    type: string;
    diameter: string;
    distanceFromSun: string;
    dayLength: string;
    yearLength: string;
    moons: number;
    temperature: string;
    atmosphere: string;
    funFact: string;
  };
}

const celestialBodies: CelestialBody[] = [
  {
    name: 'Sun',
    distance: 0,
    size: 30,
    color: '#FFA500',
    info: {
      type: 'Star',
      diameter: '1,392,700 km',
      distanceFromSun: '0 km (center)',
      dayLength: '25 Earth days (at equator)',
      yearLength: 'N/A',
      moons: 0,
      temperature: '5,778 K (surface)',
      atmosphere: 'Hydrogen and Helium plasma',
      funFact: 'The Sun contains 99.86% of the mass in our solar system!'
    }
  },
  {
    name: 'Mercury',
    distance: 80,
    size: 4,
    color: '#8C7853',
    info: {
      type: 'Rocky Planet',
      diameter: '4,879 km',
      distanceFromSun: '57.9 million km',
      dayLength: '59 Earth days',
      yearLength: '88 Earth days',
      moons: 0,
      temperature: '427°C (day), -173°C (night)',
      atmosphere: 'Extremely thin (oxygen, sodium, hydrogen)',
      funFact: 'Mercury has the most extreme temperature variations in the solar system!'
    }
  },
  {
    name: 'Venus',
    distance: 120,
    size: 7,
    color: '#FFC649',
    info: {
      type: 'Rocky Planet',
      diameter: '12,104 km',
      distanceFromSun: '108.2 million km',
      dayLength: '243 Earth days',
      yearLength: '225 Earth days',
      moons: 0,
      temperature: '462°C (hottest planet)',
      atmosphere: '96% Carbon dioxide, thick clouds',
      funFact: 'Venus rotates backwards compared to most planets!'
    }
  },
  {
    name: 'Earth',
    distance: 160,
    size: 8,
    color: '#6B93D6',
    info: {
      type: 'Rocky Planet',
      diameter: '12,756 km',
      distanceFromSun: '149.6 million km',
      dayLength: '24 hours',
      yearLength: '365.25 days',
      moons: 1,
      temperature: '15°C (average)',
      atmosphere: '78% Nitrogen, 21% Oxygen',
      funFact: 'Earth is the only known planet with life in the universe!'
    }
  },
  {
    name: 'Mars',
    distance: 200,
    size: 6,
    color: '#CD5C5C',
    info: {
      type: 'Rocky Planet',
      diameter: '6,792 km',
      distanceFromSun: '227.9 million km',
      dayLength: '24.6 hours',
      yearLength: '687 Earth days',
      moons: 2,
      temperature: '-65°C (average)',
      atmosphere: '95% Carbon dioxide, very thin',
      funFact: 'Mars has the largest volcano in the solar system, Olympus Mons!'
    }
  },
  {
    name: 'Jupiter',
    distance: 280,
    size: 20,
    color: '#D8CA9D',
    info: {
      type: 'Gas Giant',
      diameter: '142,984 km',
      distanceFromSun: '778.5 million km',
      dayLength: '9.9 hours',
      yearLength: '12 Earth years',
      moons: 95,
      temperature: '-110°C (cloud tops)',
      atmosphere: '89% Hydrogen, 10% Helium',
      funFact: 'Jupiter is so massive it could fit all other planets inside it!'
    }
  },
  {
    name: 'Saturn',
    distance: 360,
    size: 18,
    color: '#FAD5A5',
    info: {
      type: 'Gas Giant',
      diameter: '120,536 km',
      distanceFromSun: '1.43 billion km',
      dayLength: '10.7 hours',
      yearLength: '29 Earth years',
      moons: 146,
      temperature: '-140°C (cloud tops)',
      atmosphere: '96% Hydrogen, 3% Helium',
      funFact: 'Saturn is less dense than water - it would float!'
    }
  },
  {
    name: 'Uranus',
    distance: 440,
    size: 12,
    color: '#4FD0E3',
    info: {
      type: 'Ice Giant',
      diameter: '51,118 km',
      distanceFromSun: '2.87 billion km',
      dayLength: '17.2 hours',
      yearLength: '84 Earth years',
      moons: 27,
      temperature: '-195°C',
      atmosphere: '83% Hydrogen, 15% Helium, 2% Methane',
      funFact: 'Uranus rotates on its side, likely due to an ancient collision!'
    }
  },
  {
    name: 'Neptune',
    distance: 520,
    size: 11,
    color: '#4B70DD',
    info: {
      type: 'Ice Giant',
      diameter: '49,528 km',
      distanceFromSun: '4.5 billion km',
      dayLength: '16.1 hours',
      yearLength: '165 Earth years',
      moons: 16,
      temperature: '-200°C',
      atmosphere: '80% Hydrogen, 19% Helium, 1% Methane',
      funFact: 'Neptune has the fastest winds in the solar system, up to 2,100 km/h!'
    }
  }
];

export default function SolarSystemExplorer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      if (!isAnimating) return;

      ctx.fillStyle = '#000011';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      for (let i = 0; i < 200; i++) {
        const x = (i * 37) % canvas.width;
        const y = (i * 73) % canvas.height;
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, 1, 1);
      }

      const centerX = canvas.width / 2 + offset.x;
      const centerY = canvas.height / 2 + offset.y;

      celestialBodies.forEach((body, index) => {
        const angle = (time * 0.01) / (index + 1);
        const x = centerX + Math.cos(angle) * body.distance * zoom;
        const y = centerY + Math.sin(angle) * body.distance * zoom;

        // Draw orbit path
        if (body.name !== 'Sun') {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(centerX, centerY, body.distance * zoom, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw planet
        ctx.beginPath();
        ctx.arc(x, y, body.size * zoom, 0, Math.PI * 2);
        ctx.fillStyle = body.color;
        ctx.fill();

        // Add glow effect for sun
        if (body.name === 'Sun') {
          ctx.shadowColor = body.color;
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(x, y, body.size * zoom, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Draw name
        ctx.fillStyle = 'white';
        ctx.font = `${12 * zoom}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(body.name, x, y + body.size * zoom + 15);
      });

      time += 1;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      const centerX = canvas.width / 2 + offset.x;
      const centerY = canvas.height / 2 + offset.y;

      celestialBodies.forEach((body, index) => {
        const angle = (time * 0.01) / (index + 1);
        const x = centerX + Math.cos(angle) * body.distance * zoom;
        const y = centerY + Math.sin(angle) * body.distance * zoom;

        const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
        if (distance <= body.size * zoom) {
          setSelectedBody(body);
          // Zoom in on selected body
          setZoom(2);
          setOffset({ x: -Math.cos(angle) * body.distance, y: -Math.sin(angle) * body.distance });
        }
      });
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleClick);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isAnimating, zoom, offset]);

  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setSelectedBody(null);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 space-text">Solar System Explorer</h2>
        <p className="text-xl text-gray-200 space-text">Explore our cosmic neighborhood in 3D</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="space-card border-white/20 h-[600px]">
            <CardHeader>
              <CardTitle className="text-white space-text flex items-center gap-2">
                <Orbit className="h-6 w-6 text-blue-400" />
                Interactive Solar System
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsAnimating(!isAnimating)}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {isAnimating ? 'Pause' : 'Play'}
                </Button>
                <Button
                  onClick={resetView}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Reset View
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-pointer rounded-b-lg"
                style={{ height: '500px' }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {selectedBody ? (
            <Card className="space-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white space-text flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-400" />
                  {selectedBody.name}
                </CardTitle>
                <Badge variant="outline" className="border-white/20 text-white w-fit">
                  {selectedBody.info.type}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-300">Diameter:</span>
                    <p className="text-white font-medium">{selectedBody.info.diameter}</p>
                  </div>
                  <div>
                    <span className="text-gray-300">Distance:</span>
                    <p className="text-white font-medium">{selectedBody.info.distanceFromSun}</p>
                  </div>
                  <div>
                    <span className="text-gray-300">Day Length:</span>
                    <p className="text-white font-medium">{selectedBody.info.dayLength}</p>
                  </div>
                  <div>
                    <span className="text-gray-300">Year Length:</span>
                    <p className="text-white font-medium">{selectedBody.info.yearLength}</p>
                  </div>
                  <div>
                    <span className="text-gray-300">Moons:</span>
                    <p className="text-white font-medium">{selectedBody.info.moons}</p>
                  </div>
                  <div>
                    <span className="text-gray-300">Temperature:</span>
                    <p className="text-white font-medium">{selectedBody.info.temperature}</p>
                  </div>
                </div>
                <div>
                  <span className="text-gray-300">Atmosphere:</span>
                  <p className="text-white font-medium">{selectedBody.info.atmosphere}</p>
                </div>
                <div>
                  <span className="text-gray-300">Fun Fact:</span>
                  <p className="text-white font-medium">{selectedBody.info.funFact}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="space-card border-white/20">
              <CardHeader>
                <CardTitle className="text-white space-text">Click on any celestial body!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 space-text">
                  Explore the solar system by clicking on planets, moons, and the sun to learn fascinating facts about each celestial body.
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="space-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white space-text">Quick Facts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-gray-300 text-sm space-text">
                • The solar system is 4.6 billion years old
              </p>
              <p className="text-gray-300 text-sm space-text">
                • It would take 9 years to walk to the moon
              </p>
              <p className="text-gray-300 text-sm space-text">
                • Jupiter protects Earth from asteroids
              </p>
              <p className="text-gray-300 text-sm space-text">
                • One day on Venus equals 243 Earth days
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
