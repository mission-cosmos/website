
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Rocket, Globe, BookOpen, PenTool, Star, Zap, Target, Brain } from "lucide-react";
import RedPlanetRover from "../components/RedPlanetRover";
import AstroRun from "../components/AstroRun";
import CosmicFacts from "../components/CosmicFacts";
import CosmicJournal from "../components/CosmicJournal";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-yellow-400" />
              <h1 className="text-2xl font-bold text-white">Mission Cosmos</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setActiveSection("home")}
                className={`text-sm font-medium transition-colors ${
                  activeSection === "home" ? "text-yellow-400" : "text-gray-300 hover:text-white"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveSection("games")}
                className={`text-sm font-medium transition-colors ${
                  activeSection === "games" ? "text-yellow-400" : "text-gray-300 hover:text-white"
                }`}
              >
                Games
              </button>
              <button
                onClick={() => setActiveSection("facts")}
                className={`text-sm font-medium transition-colors ${
                  activeSection === "facts" ? "text-yellow-400" : "text-gray-300 hover:text-white"
                }`}
              >
                Cosmic Facts
              </button>
              <button
                onClick={() => setActiveSection("journal")}
                className={`text-sm font-medium transition-colors ${
                  activeSection === "journal" ? "text-yellow-400" : "text-gray-300 hover:text-white"
                }`}
              >
                Journal
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400">Cosmos</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-4 leading-relaxed">
                Making space accessible and exciting for all.
              </p>
              <p className="text-lg md:text-xl text-yellow-400 mb-6 font-semibold">
                Explore. Play. Dream Big.
              </p>
              <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
                Mission Cosmos is an interactive digital space lab for students and dreamers to discover the wonders of the universe through games, stories, and cosmic creativity.
              </p>
              
              {/* Feature Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                <Card className="bg-slate-800/50 border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-105">
                  <CardHeader className="text-center">
                    <Target className="h-12 w-12 text-red-400 mx-auto mb-2" />
                    <CardTitle className="text-white">Red-Planet Rover</CardTitle>
                    <CardDescription className="text-gray-400">Navigate Mars terrain and complete missions</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="bg-slate-800/50 border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-105">
                  <CardHeader className="text-center">
                    <Zap className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                    <CardTitle className="text-white">Astro Run</CardTitle>
                    <CardDescription className="text-gray-400">Race through space in an endless adventure</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="bg-slate-800/50 border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-105">
                  <CardHeader className="text-center">
                    <Brain className="h-12 w-12 text-green-400 mx-auto mb-2" />
                    <CardTitle className="text-white">Cosmic Facts</CardTitle>
                    <CardDescription className="text-gray-400">Discover amazing space knowledge</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="bg-slate-800/50 border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-105">
                  <CardHeader className="text-center">
                    <PenTool className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                    <CardTitle className="text-white">Cosmic Journal</CardTitle>
                    <CardDescription className="text-gray-400">Reflect and imagine the universe</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div className="mt-12">
                <Button 
                  onClick={() => setActiveSection("games")}
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
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Space Games</h2>
              <p className="text-xl text-gray-300">Interactive adventures that make learning fun</p>
            </div>
            
            <Tabs defaultValue="rover" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                <TabsTrigger value="rover" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                  Red-Planet Rover
                </TabsTrigger>
                <TabsTrigger value="astro" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                  Astro Run
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="rover" className="mt-8">
                <RedPlanetRover />
              </TabsContent>
              
              <TabsContent value="astro" className="mt-8">
                <AstroRun />
              </TabsContent>
            </Tabs>
          </div>
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

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-purple-500/20 md:hidden">
        <div className="flex justify-around py-2">
          <button
            onClick={() => setActiveSection("home")}
            className={`flex flex-col items-center p-2 ${
              activeSection === "home" ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            <Rocket className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            onClick={() => setActiveSection("games")}
            className={`flex flex-col items-center p-2 ${
              activeSection === "games" ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            <Globe className="h-5 w-5" />
            <span className="text-xs mt-1">Games</span>
          </button>
          <button
            onClick={() => setActiveSection("facts")}
            className={`flex flex-col items-center p-2 ${
              activeSection === "facts" ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-xs mt-1">Facts</span>
          </button>
          <button
            onClick={() => setActiveSection("journal")}
            className={`flex flex-col items-center p-2 ${
              activeSection === "journal" ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            <PenTool className="h-5 w-5" />
            <span className="text-xs mt-1">Journal</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
