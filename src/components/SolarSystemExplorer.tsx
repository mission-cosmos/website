import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Orbit, Star, Info } from 'lucide-react';
import * as THREE from 'three';

interface CelestialBodyData {
  name: string;
  type: string;
  diameter: string;
  distanceFromSun: string;
  dayLength: string;
  yearLength: string;
  moons: number;
  temperature: string;
  atmosphere: string;
  funFact: string;
  mass: string;
  gravity: string;
  composition: string;
}

const celestialBodies: Record<string, CelestialBodyData> = {
  Sun: {
    name: 'Sun',
    type: 'G-type Main-sequence Star',
    diameter: '1,392,700 km',
    distanceFromSun: '0 km (center)',
    dayLength: '25 Earth days (at equator)',
    yearLength: 'N/A',
    moons: 0,
    temperature: '5,778 K (surface), 15,000,000 K (core)',
    atmosphere: 'Hydrogen (73%), Helium (25%), heavier elements (2%)',
    funFact: 'The Sun contains 99.86% of the mass in our solar system and could fit 1.3 million Earths inside it!',
    mass: '1.989 × 10³⁰ kg',
    gravity: '274 m/s² (28 times Earth)',
    composition: 'Plasma - ionized hydrogen and helium'
  },
  Mercury: {
    name: 'Mercury',
    type: 'Terrestrial Planet',
    diameter: '4,879 km',
    distanceFromSun: '57.9 million km',
    dayLength: '58.6 Earth days',
    yearLength: '88 Earth days',
    moons: 0,
    temperature: '427°C (day), -173°C (night)',
    atmosphere: 'Extremely thin - oxygen, sodium, hydrogen, helium, potassium',
    funFact: 'Mercury has the most extreme temperature variations in the solar system, with a 600°C difference between day and night!',
    mass: '3.301 × 10²³ kg',
    gravity: '3.7 m/s² (38% of Earth)',
    composition: 'Large iron core (75% of radius), thin silicate mantle'
  },
  Venus: {
    name: 'Venus',
    type: 'Terrestrial Planet',
    diameter: '12,104 km',
    distanceFromSun: '108.2 million km',
    dayLength: '243 Earth days (retrograde)',
    yearLength: '225 Earth days',
    moons: 0,
    temperature: '462°C (hottest planet)',
    atmosphere: '96.5% Carbon dioxide, 3.5% Nitrogen, thick sulfuric acid clouds',
    funFact: 'Venus rotates backwards and has the densest atmosphere of any terrestrial planet, creating a runaway greenhouse effect!',
    mass: '4.867 × 10²⁴ kg',
    gravity: '8.87 m/s² (90% of Earth)',
    composition: 'Iron core, silicate mantle, basaltic crust'
  },
  Earth: {
    name: 'Earth',
    type: 'Terrestrial Planet',
    diameter: '12,756 km',
    distanceFromSun: '149.6 million km (1 AU)',
    dayLength: '23 hours 56 minutes',
    yearLength: '365.25 days',
    moons: 1,
    temperature: '15°C (average surface)',
    atmosphere: '78% Nitrogen, 21% Oxygen, 1% other gases',
    funFact: 'Earth is the only known planet with life and liquid water on its surface. The Moon stabilizes Earth\'s axial tilt!',
    mass: '5.972 × 10²⁴ kg',
    gravity: '9.8 m/s²',
    composition: 'Iron-nickel core, silicate mantle, continental and oceanic crust'
  },
  Mars: {
    name: 'Mars',
    type: 'Terrestrial Planet',
    diameter: '6,792 km',
    distanceFromSun: '227.9 million km',
    dayLength: '24 hours 37 minutes',
    yearLength: '687 Earth days',
    moons: 2,
    temperature: '-65°C (average)',
    atmosphere: '95% Carbon dioxide, 3% Nitrogen, 2% Argon (very thin)',
    funFact: 'Mars has the largest volcano in the solar system (Olympus Mons) and evidence of ancient riverbeds and polar ice caps!',
    mass: '6.417 × 10²³ kg',
    gravity: '3.71 m/s² (38% of Earth)',
    composition: 'Iron core, basaltic mantle, iron oxide surface (rust)'
  },
  Jupiter: {
    name: 'Jupiter',
    type: 'Gas Giant',
    diameter: '142,984 km',
    distanceFromSun: '778.5 million km',
    dayLength: '9 hours 56 minutes',
    yearLength: '11.9 Earth years',
    moons: 95,
    temperature: '-110°C (cloud tops)',
    atmosphere: '89% Hydrogen, 10% Helium, traces of methane, ammonia',
    funFact: 'Jupiter is so massive it could contain all other planets combined and acts as a "cosmic vacuum cleaner" protecting inner planets!',
    mass: '1.898 × 10²⁷ kg',
    gravity: '24.79 m/s² (2.5 times Earth)',
    composition: 'Hydrogen and helium with possible rocky core'
  },
  Saturn: {
    name: 'Saturn',
    type: 'Gas Giant',
    diameter: '120,536 km',
    distanceFromSun: '1.43 billion km',
    dayLength: '10 hours 42 minutes',
    yearLength: '29.5 Earth years',
    moons: 146,
    temperature: '-140°C (cloud tops)',
    atmosphere: '96% Hydrogen, 3% Helium, traces of ammonia and methane',
    funFact: 'Saturn is less dense than water and has the most spectacular ring system made of ice and rock particles!',
    mass: '5.683 × 10²⁶ kg',
    gravity: '10.44 m/s² (91% of Earth)',
    composition: 'Hydrogen and helium with possible rocky core'
  },
  Uranus: {
    name: 'Uranus',
    type: 'Ice Giant',
    diameter: '51,118 km',
    distanceFromSun: '2.87 billion km',
    dayLength: '17 hours 14 minutes (retrograde)',
    yearLength: '84 Earth years',
    moons: 27,
    temperature: '-195°C',
    atmosphere: '83% Hydrogen, 15% Helium, 2% Methane',
    funFact: 'Uranus rotates on its side (98° tilt) likely due to an ancient collision, and has faint rings discovered in 1977!',
    mass: '8.681 × 10²⁵ kg',
    gravity: '8.69 m/s² (87% of Earth)',
    composition: 'Water, methane, ammonia ices with rocky core'
  },
  Neptune: {
    name: 'Neptune',
    type: 'Ice Giant',
    diameter: '49,528 km',
    distanceFromSun: '4.5 billion km',
    dayLength: '16 hours 7 minutes',
    yearLength: '165 Earth years',
    moons: 16,
    temperature: '-200°C',
    atmosphere: '80% Hydrogen, 19% Helium, 1% Methane',
    funFact: 'Neptune has the fastest winds in the solar system (up to 2,100 km/h) and was discovered mathematically before being observed!',
    mass: '1.024 × 10²⁶ kg',
    gravity: '11.15 m/s² (114% of Earth)',
    composition: 'Water, methane, ammonia ices with rocky core'
  }
};

interface PlanetProps {
  name: string;
  distance: number;
  size: number;
  color: string;
  speed: number;
  onClick: (name: string) => void;
  position?: [number, number, number];
}

function Planet({ name, distance, size, color, speed, onClick, position }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const textureLoader = new THREE.TextureLoader();

  // Create realistic textures for each planet
  const getTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d')!;
    
    // Create a gradient based on the planet
    const gradient = context.createLinearGradient(0, 0, 512, 512);
    
    switch(name) {
      case 'Sun':
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.5, '#FF8C00');
        gradient.addColorStop(1, '#FF4500');
        break;
      case 'Mercury':
        gradient.addColorStop(0, '#8C7853');
        gradient.addColorStop(0.5, '#A0895A');
        gradient.addColorStop(1, '#7A6B47');
        break;
      case 'Venus':
        gradient.addColorStop(0, '#FFC649');
        gradient.addColorStop(0.5, '#FFB347');
        gradient.addColorStop(1, '#FF8C69');
        break;
      case 'Earth':
        gradient.addColorStop(0, '#6B93D6');
        gradient.addColorStop(0.3, '#4169E1');
        gradient.addColorStop(0.6, '#228B22');
        gradient.addColorStop(1, '#8FBC8F');
        break;
      case 'Mars':
        gradient.addColorStop(0, '#CD5C5C');
        gradient.addColorStop(0.5, '#A0522D');
        gradient.addColorStop(1, '#8B4513');
        break;
      case 'Jupiter':
        gradient.addColorStop(0, '#D2691E');
        gradient.addColorStop(0.3, '#CD853F');
        gradient.addColorStop(0.6, '#DEB887');
        gradient.addColorStop(1, '#F4A460');
        break;
      case 'Saturn':
        gradient.addColorStop(0, '#FAD5A5');
        gradient.addColorStop(0.5, '#DEB887');
        gradient.addColorStop(1, '#D2B48C');
        break;
      case 'Uranus':
        gradient.addColorStop(0, '#4FD0E3');
        gradient.addColorStop(0.5, '#87CEEB');
        gradient.addColorStop(1, '#4682B4');
        break;
      case 'Neptune':
        gradient.addColorStop(0, '#4B70DD');
        gradient.addColorStop(0.5, '#1E90FF');
        gradient.addColorStop(1, '#191970');
        break;
      default:
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color);
    }
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 512);
    
    // Add some texture details
    for (let i = 0; i < 50; i++) {
      context.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
      context.beginPath();
      context.arc(Math.random() * 512, Math.random() * 512, Math.random() * 3, 0, Math.PI * 2);
      context.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  };

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current && name !== 'Sun') {
      meshRef.current.position.x = Math.cos(time * speed) * distance;
      meshRef.current.position.z = Math.sin(time * speed) * distance;
    }
    // Add rotation for realism
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const handleClick = () => {
    onClick(name);
  };

  const texture = useMemo(() => getTexture(), [name]);

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? size * 1.2 : size}
        position={position}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial 
          map={texture}
          shininess={name === 'Sun' ? 100 : 30}
          emissive={name === 'Sun' ? '#FFA500' : '#000000'}
          emissiveIntensity={name === 'Sun' ? 0.3 : 0}
        />
      </mesh>
      
      {/* Saturn's rings */}
      {name === 'Saturn' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 2.0, 64]} />
          <meshBasicMaterial 
            color="#D2B48C" 
            transparent 
            opacity={0.6} 
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Orbit path */}
      {name !== 'Sun' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[distance - 0.02, distance + 0.02, 128]} />
          <meshBasicMaterial color="white" transparent opacity={0.2} />
        </mesh>
      )}
      
      {/* Planet label */}
      {hovered && (
        <Html position={[0, size + 1, 0]}>
          <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-sm pointer-events-none border border-white/20 backdrop-blur-sm">
            <div className="font-bold">{name}</div>
            <div className="text-xs text-gray-300">{celestialBodies[name]?.type}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function Starfield() {
  const count = 1000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1000;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1000;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1000;
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="white" size={2} />
    </points>
  );
}

function AsteroidBelt() {
  const count = 200;
  const positions = useMemo(() => {
    const pos: JSX.Element[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const distance = 15 + Math.random() * 5;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const y = (Math.random() - 0.5) * 2;
      
      pos.push(
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.1 + Math.random() * 0.1, 8, 8]} />
          <meshStandardMaterial color="#8C7853" />
        </mesh>
      );
    }
    return pos;
  }, []);

  return <>{positions}</>;
}

export default function SolarSystemExplorer() {
  const [selectedBody, setSelectedBody] = useState<string | null>(null);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number]>([0, 0, 0]);

  const handlePlanetClick = (name: string) => {
    setSelectedBody(name);
  };

  const resetView = () => {
    setSelectedBody(null);
    setCameraTarget([0, 0, 0]);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 space-text">3D Solar System Explorer</h2>
        <p className="text-xl text-gray-200 space-text">Navigate through our cosmic neighborhood in full 3D</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="space-card border-white/20 h-[600px] bg-black/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-white space-text flex items-center gap-2">
                <Orbit className="h-6 w-6 text-blue-400" />
                Interactive 3D Solar System
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={resetView}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10 bg-black/40"
                >
                  Reset View
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-2 h-[520px]">
              <Canvas 
                camera={{ position: [0, 20, 30], fov: 75 }}
                onCreated={({ gl }) => {
                  gl.shadowMap.enabled = true;
                  gl.shadowMap.type = THREE.PCFSoftShadowMap;
                }}
              >
                <ambientLight intensity={0.2} />
                <pointLight 
                  position={[0, 0, 0]} 
                  intensity={3} 
                  castShadow
                  shadow-mapSize-width={2048}
                  shadow-mapSize-height={2048}
                />
                <directionalLight 
                  position={[50, 50, 50]} 
                  intensity={0.5} 
                  castShadow
                />
                <Starfield />
                
                {/* Sun */}
                <Planet
                  name="Sun"
                  distance={0}
                  size={2}
                  color="#FFA500"
                  speed={0}
                  onClick={handlePlanetClick}
                />
                
                {/* Planets */}
                <Planet name="Mercury" distance={4} size={0.3} color="#8C7853" speed={0.8} onClick={handlePlanetClick} />
                <Planet name="Venus" distance={6} size={0.5} color="#FFC649" speed={0.6} onClick={handlePlanetClick} />
                <Planet name="Earth" distance={8} size={0.6} color="#6B93D6" speed={0.5} onClick={handlePlanetClick} />
                <Planet name="Mars" distance={10} size={0.4} color="#CD5C5C" speed={0.4} onClick={handlePlanetClick} />
                <Planet name="Jupiter" distance={20} size={1.5} color="#D8CA9D" speed={0.2} onClick={handlePlanetClick} />
                <Planet name="Saturn" distance={25} size={1.2} color="#FAD5A5" speed={0.15} onClick={handlePlanetClick} />
                <Planet name="Uranus" distance={30} size={0.8} color="#4FD0E3" speed={0.1} onClick={handlePlanetClick} />
                <Planet name="Neptune" distance={35} size={0.8} color="#4B70DD" speed={0.08} onClick={handlePlanetClick} />
                
                {/* Asteroid Belt */}
                <AsteroidBelt />
                
                <OrbitControls 
                  enablePan={true} 
                  enableZoom={true} 
                  enableRotate={true}
                  zoomToCursor={true}
                  panSpeed={2}
                  rotateSpeed={1}
                  zoomSpeed={1.2}
                  minDistance={5}
                  maxDistance={200}
                />
              </Canvas>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {selectedBody ? (
            <Card className="space-card border-white/20 bg-black/40">
              <CardHeader>
                <CardTitle className="text-white space-text flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-400" />
                  {selectedBody}
                </CardTitle>
                <Badge variant="outline" className="border-white/20 text-white w-fit bg-black/20">
                  {celestialBodies[selectedBody]?.type}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-white">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="bg-white/5 p-3 rounded">
                    <span className="text-gray-300">Diameter:</span>
                    <p className="text-white font-medium">{celestialBodies[selectedBody]?.diameter}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded">
                    <span className="text-gray-300">Distance from Sun:</span>
                    <p className="text-white font-medium">{celestialBodies[selectedBody]?.distanceFromSun}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded">
                    <span className="text-gray-300">Day Length:</span>
                    <p className="text-white font-medium">{celestialBodies[selectedBody]?.dayLength}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded">
                    <span className="text-gray-300">Year Length:</span>
                    <p className="text-white font-medium">{celestialBodies[selectedBody]?.yearLength}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded">
                    <span className="text-gray-300">Moons:</span>
                    <p className="text-white font-medium">{celestialBodies[selectedBody]?.moons}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded">
                    <span className="text-gray-300">Temperature:</span>
                    <p className="text-white font-medium">{celestialBodies[selectedBody]?.temperature}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded">
                    <span className="text-gray-300">Mass:</span>
                    <p className="text-white font-medium">{celestialBodies[selectedBody]?.mass}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded">
                    <span className="text-gray-300">Gravity:</span>
                    <p className="text-white font-medium">{celestialBodies[selectedBody]?.gravity}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded">
                    <span className="text-gray-300">Atmosphere:</span>
                    <p className="text-white font-medium">{celestialBodies[selectedBody]?.atmosphere}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded">
                    <span className="text-gray-300">Composition:</span>
                    <p className="text-white font-medium">{celestialBodies[selectedBody]?.composition}</p>
                  </div>
                  <div className="bg-blue/10 p-3 rounded border border-blue-400/20">
                    <span className="text-blue-300">Fun Fact:</span>
                    <p className="text-white font-medium">{celestialBodies[selectedBody]?.funFact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="space-card border-white/20 bg-black/40">
              <CardHeader>
                <CardTitle className="text-white space-text">Explore the Solar System!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 space-text">
                  Click and drag to rotate the view. Use mouse wheel to zoom. Click on any celestial body to learn detailed information about it.
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="space-card border-white/20 bg-black/40">
            <CardHeader>
              <CardTitle className="text-white space-text">Solar System Facts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-gray-300 text-sm space-text">
                • The solar system is 4.6 billion years old
              </p>
              <p className="text-gray-300 text-sm space-text">
                • Jupiter has more mass than all other planets combined
              </p>
              <p className="text-gray-300 text-sm space-text">
                • The asteroid belt contains millions of rocky objects
              </p>
              <p className="text-gray-300 text-sm space-text">
                • Light from the Sun takes 8 minutes to reach Earth
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
