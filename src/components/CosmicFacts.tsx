
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Shuffle, Star, Globe, Rocket, Telescope } from "lucide-react";

const CosmicFacts = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const facts = [
    {
      id: 1,
      category: "Stars",
      icon: Star,
      color: "yellow",
      title: "The Sun's Core Temperature",
      fact: "The core of the Sun reaches temperatures of about 15 million degrees Celsius (27 million degrees Fahrenheit)!",
      funDetail: "That's hot enough to fuse hydrogen atoms into helium, creating the energy that lights up our solar system.",
      difficulty: "Beginner"
    },
    {
      id: 2,
      category: "Planets",
      icon: Globe,
      color: "blue",
      title: "Jupiter's Great Red Spot",
      fact: "Jupiter's Great Red Spot is a storm that has been raging for over 300 years and is larger than Earth!",
      funDetail: "This massive hurricane could swallow two or three Earths and still have room for more.",
      difficulty: "Intermediate"
    },
    {
      id: 3,
      category: "Space Travel",
      icon: Rocket,
      color: "red",
      title: "Light Speed Journey",
      fact: "It would take over 4 years traveling at the speed of light to reach the nearest star outside our solar system.",
      funDetail: "That star is Proxima Centauri, about 4.24 light-years away. Even at light speed, it's a long trip!",
      difficulty: "Advanced"
    },
    {
      id: 4,
      category: "Universe",
      icon: Telescope,
      color: "purple",
      title: "Observable Universe",
      fact: "The observable universe is about 93 billion light-years in diameter, containing over 2 trillion galaxies!",
      funDetail: "Each galaxy contains billions of stars, making the total number of stars almost impossible to count.",
      difficulty: "Advanced"
    },
    {
      id: 5,
      category: "Planets",
      icon: Globe,
      color: "orange",
      title: "Mars' Olympus Mons",
      fact: "Olympus Mons on Mars is the largest volcano in our solar system, standing 21 kilometers (13 miles) tall!",
      funDetail: "That's nearly three times taller than Mount Everest and about the size of the state of Arizona.",
      difficulty: "Intermediate"
    },
    {
      id: 6,
      category: "Stars",
      icon: Star,
      color: "pink",
      title: "Neutron Star Density",
      fact: "A teaspoon of neutron star material would weigh about 6 billion tons on Earth!",
      funDetail: "Neutron stars are so dense that their gravity is 200 billion times stronger than Earth's.",
      difficulty: "Advanced"
    },
    {
      id: 7,
      category: "Space Travel",
      icon: Rocket,
      color: "green",
      title: "Voyager 1 Journey",
      fact: "Voyager 1, launched in 1977, is now over 14 billion miles from Earth and still sending signals!",
      funDetail: "It takes over 22 hours for a signal from Voyager 1 to reach Earth at the speed of light.",
      difficulty: "Beginner"
    },
    {
      id: 8,
      category: "Universe",
      icon: Telescope,
      color: "cyan",
      title: "Dark Matter Mystery",
      fact: "About 85% of all matter in the universe is 'dark matter' that we can't see or directly detect!",
      funDetail: "We know it exists because of its gravitational effects on visible matter and light.",
      difficulty: "Advanced"
    }
  ];

  const currentFact = facts[currentFactIndex];

  const nextFact = () => {
    setCurrentFactIndex((prev) => (prev + 1) % facts.length);
  };

  const randomFact = () => {
    const randomIndex = Math.floor(Math.random() * facts.length);
    setCurrentFactIndex(randomIndex);
  };

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      yellow: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
      blue: "border-blue-500/30 bg-blue-500/10 text-blue-400",
      red: "border-red-500/30 bg-red-500/10 text-red-400",
      purple: "border-purple-500/30 bg-purple-500/10 text-purple-400",
      orange: "border-orange-500/30 bg-orange-500/10 text-orange-400",
      pink: "border-pink-500/30 bg-pink-500/10 text-pink-400",
      green: "border-green-500/30 bg-green-500/10 text-green-400",
      cyan: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
    };
    return colorMap[color] || colorMap.blue;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Intermediate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Advanced":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Cosmic Facts</h2>
        <p className="text-xl text-gray-300">Discover amazing bite-sized knowledge about our universe</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className={`${getColorClasses(currentFact.color)} border-2 transition-all duration-300 hover:scale-105`}>
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className={`p-3 rounded-full bg-slate-800/50`}>
                <currentFact.icon className={`h-8 w-8 ${currentFact.color === 'yellow' ? 'text-yellow-400' : 
                  currentFact.color === 'blue' ? 'text-blue-400' :
                  currentFact.color === 'red' ? 'text-red-400' :
                  currentFact.color === 'purple' ? 'text-purple-400' :
                  currentFact.color === 'orange' ? 'text-orange-400' :
                  currentFact.color === 'pink' ? 'text-pink-400' :
                  currentFact.color === 'green' ? 'text-green-400' :
                  'text-cyan-400'}`} />
              </div>
              <div className="flex flex-col gap-2">
                <Badge variant="outline" className={getDifficultyColor(currentFact.difficulty)}>
                  {currentFact.difficulty}
                </Badge>
                <Badge variant="outline" className="border-gray-500/50 text-gray-400">
                  {currentFact.category}
                </Badge>
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl text-white mb-4">
              {currentFact.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                {currentFact.fact}
              </p>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/30">
                <p className="text-gray-300 italic">
                  💡 {currentFact.funDetail}
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-6">
              <Button
                onClick={nextFact}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Brain className="h-4 w-4 mr-2" />
                Next Fact
              </Button>
              <Button
                onClick={randomFact}
                variant="outline"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Random Fact
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Fact {currentFactIndex + 1} of {facts.length}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Fact Categories Preview */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Stars", icon: Star, color: "text-yellow-400", count: facts.filter(f => f.category === "Stars").length },
            { name: "Planets", icon: Globe, color: "text-blue-400", count: facts.filter(f => f.category === "Planets").length },
            { name: "Space Travel", icon: Rocket, color: "text-red-400", count: facts.filter(f => f.category === "Space Travel").length },
            { name: "Universe", icon: Telescope, color: "text-purple-400", count: facts.filter(f => f.category === "Universe").length }
          ].map((category) => (
            <Card key={category.name} className="bg-slate-800/30 border-slate-600/30 text-center p-4">
              <category.icon className={`h-8 w-8 ${category.color} mx-auto mb-2`} />
              <h3 className="text-white font-semibold">{category.name}</h3>
              <p className="text-gray-400 text-sm">{category.count} facts</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CosmicFacts;
