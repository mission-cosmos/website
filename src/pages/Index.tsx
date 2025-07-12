
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Rocket, Globe, BookOpen, PenTool, Star, Zap, Target, Brain, Mail, Orbit, Settings, Users, LogOut, User } from "lucide-react";

import RedPlanetRoverWrapper from "../components/RedPlanetRoverWrapper";
import AstroRun from "../components/AstroRun";
import CosmicFacts from "../components/CosmicFacts";
import CosmicJournal from "../components/CosmicJournal";
import Contact from "../components/Contact";
import SolarSystemExplorer from "../components/SolarSystemExplorer";
import QuizCenter from "../components/QuizCenter";
import SpaceSimulations from "../components/SpaceSimulations";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();

  // Update active section based on URL
  useEffect(() => {
    const path = location.pathname;
    switch (path) {
      case '/games':
        setActiveSection('games');
        break;
      case '/facts':
        setActiveSection('facts');
        break;
      case '/journal':
        setActiveSection('journal');
        break;
      case '/contact':
        setActiveSection('contact');
        break;
      case '/solar-system':
        setActiveSection('solar-system');
        break;
      case '/quiz':
        setActiveSection('quiz');
        break;
      case '/simulations':
        setActiveSection('simulations');
        break;
      default:
        setActiveSection('home');
    }
  }, [location.pathname]);

  // Update URL when section changes
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    const path = section === 'home' ? '/' : `/${section}`;
    navigate(path);
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated starry background */}
      <div className="space-background">
        <div className="stars"></div>
        <div className="shooting-stars">
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/2a801fa8-7949-45f9-abc7-79d5632d8c5f.png" alt="Mission Cosmos Logo" className="h-8 w-8" />
              <h1 className="text-2xl font-bold text-white space-text">Mission Cosmos</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {[
                { key: "home", label: "Home" },
                { key: "games", label: "Games" },
                { key: "solar-system", label: "Solar System" },
                { key: "quiz", label: "Quiz" },
                { key: "simulations", label: "Simulations" },
                { key: "facts", label: "Cosmic Facts" },
                { key: "journal", label: "Journal" },
                { key: "contact", label: "Contact" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleSectionChange(key)}
                  className={`text-sm font-medium transition-colors space-text ${
                    activeSection === key ? "text-yellow-400" : "text-gray-100 hover:text-yellow-200"
                  }`}
                >
                  {label}
                </button>
              ))}
              <div className="text-white text-sm">
                Mission Cosmos
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Home Section */}
      {activeSection === "home" && (
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Star className="h-16 w-16 text-yellow-400 animate-pulse" />
                  <div className="absolute inset-0 h-16 w-16 bg-yellow-400/20 rounded-full animate-ping"></div>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight space-text">
                Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400">Cosmos</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 mb-4 leading-relaxed space-text">
                Making space accessible and exciting for all.
              </p>
              <p className="text-lg md:text-xl text-yellow-400 mb-6 font-semibold space-text">
                Explore. Play. Dream Big.
              </p>
              <p className="text-lg text-gray-200 mb-12 max-w-2xl mx-auto space-text">
                Mission Cosmos is an interactive digital space lab for students and dreamers to discover the wonders of the universe through games, stories, and cosmic creativity.
              </p>
              
              {/* Feature Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                {[
                  { icon: Target, title: "Red-Planet Rover", desc: "Navigate Mars terrain and complete missions", color: "text-red-400" },
                  { icon: Orbit, title: "Solar System", desc: "Explore planets and stars in 3D", color: "text-blue-400" },
                  { icon: Brain, title: "Quiz Center", desc: "Test your cosmic knowledge", color: "text-green-400" },
                  { icon: Rocket, title: "Simulations", desc: "Experience realistic space scenarios", color: "text-orange-400" },
                  { icon: Zap, title: "Astro Run", desc: "Race through space adventures", color: "text-purple-400" },
                  { icon: BookOpen, title: "Cosmic Facts", desc: "Discover amazing space knowledge", color: "text-pink-400" },
                  { icon: PenTool, title: "Cosmic Journal", desc: "Reflect and imagine the universe", color: "text-indigo-400" }
                ].map((feature, index) => (
                  <Card key={index} className="space-card hover:bg-white/10 transition-all hover:scale-105 border-white/20">
                    <CardHeader className="text-center">
                      <feature.icon className={`h-12 w-12 ${feature.color} mx-auto mb-2`} />
                      <CardTitle className="text-white space-text">{feature.title}</CardTitle>
                      <CardDescription className="text-gray-300 space-text">{feature.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* About Mission Cosmos Section */}
              <div className="mt-20 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 space-text">About Mission Cosmos</h2>
                <p className="text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto space-text">
                  We believe that astronomy is for everyone—and our mission is to make learning about space immersive, inclusive, and fun. From journaling your dreams of the stars to playing our space-themed mini-games, there's something here for every explorer. Come embark with us on a cosmic journey with Mission Cosmos and discover the wonders of the universe through our interactive experiences.
                </p>
              </div>

              <div className="mt-12">
                <Button 
                  onClick={() => handleSectionChange("games")}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-lg px-8 py-3 rounded-full transform hover:scale-105 transition-all"
                >
                  Start Your Mission
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Games Section */}
      {activeSection === "games" && (
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 space-text">Space Games</h2>
              <p className="text-xl text-gray-200 space-text">Interactive adventures that make learning fun</p>
            </div>
            
            <Tabs defaultValue="rover" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 glass-effect">
                <TabsTrigger value="rover" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 text-white">
                  Red-Planet Rover
                </TabsTrigger>
                <TabsTrigger value="astro" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 text-white">
                  Astro Run
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="rover" className="mt-8">
                <RedPlanetRoverWrapper />
              </TabsContent>
              
              <TabsContent value="astro" className="mt-8">
                <AstroRun />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {/* Solar System Explorer Section */}
      {activeSection === "solar-system" && (
        <div className="pt-20 pb-16">
          <SolarSystemExplorer />
        </div>
      )}

      {/* Quiz Center Section */}
      {activeSection === "quiz" && (
        <div className="pt-20 pb-16">
          <QuizCenter />
        </div>
      )}

      {/* Space Simulations Section */}
      {activeSection === "simulations" && (
        <div className="pt-20 pb-16">
          <SpaceSimulations />
        </div>
      )}


      {/* Cosmic Facts Section */}
      {activeSection === "facts" && (
        <div className="pt-20 pb-16">
          <CosmicFacts />
        </div>
      )}

      {/* Cosmic Journal Section */}
      {activeSection === "journal" && (
        <div className="pt-20 pb-16">
          <CosmicJournal />
        </div>
      )}

      {/* Contact Section */}
      {activeSection === "contact" && (
        <div className="pt-20 pb-16">
          <Contact />
        </div>
      )}

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 glass-effect md:hidden">
        <div className="flex justify-around py-2 overflow-x-auto">
          {[
            { key: "home", icon: Rocket, label: "Home" },
            { key: "games", icon: Globe, label: "Games" },
            { key: "solar-system", icon: Orbit, label: "Solar" },
            { key: "quiz", icon: Brain, label: "Quiz" },
            { key: "simulations", icon: Target, label: "Sims" },
            { key: "facts", icon: BookOpen, label: "Facts" },
            { key: "journal", icon: PenTool, label: "Journal" },
            { key: "contact", icon: Mail, label: "Contact" },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => handleSectionChange(key)}
              className={`flex flex-col items-center p-2 min-w-0 ${
                activeSection === key ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1 truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
