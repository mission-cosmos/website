import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Star, Rocket, Zap } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const knowledgeBase = {
  // Basic Sun Facts
  "how big is the sun": "The Sun has a diameter of about 1.39 million kilometers (864,000 miles), which is about 109 times the diameter of Earth. Its mass is approximately 1.989 × 10^30 kg, which is about 333,000 times the mass of Earth. The Sun contains 99.86% of all the mass in our solar system. You could fit about 1.3 million Earths inside the Sun!",
  "sun size": "The Sun has a diameter of about 1.39 million kilometers (864,000 miles), which is about 109 times the diameter of Earth. Its mass is approximately 1.989 × 10^30 kg, which is about 333,000 times the mass of Earth. The Sun contains 99.86% of all the mass in our solar system. You could fit about 1.3 million Earths inside the Sun!",
  "sun diameter": "The Sun's diameter is approximately 1.39 million kilometers (864,000 miles), making it about 109 times wider than Earth.",
  "sun mass": "The Sun's mass is about 1.989 × 10^30 kg, which is roughly 333,000 times the mass of Earth.",
  "sun temperature": "The Sun's core temperature is about 15 million degrees Celsius (27 million degrees Fahrenheit), while its surface temperature is about 5,778 K (5,505°C or 9,941°F).",
  "sun age": "The Sun is approximately 4.6 billion years old and is about halfway through its main sequence lifetime. It has about 5 billion more years before it becomes a red giant.",

  // Planet Sizes and Facts
  "how big is earth": "Earth has a diameter of about 12,742 kilometers (7,918 miles) and a circumference of about 40,075 kilometers (24,901 miles) at the equator. Its mass is approximately 5.97 × 10^24 kg.",
  "how big is jupiter": "Jupiter is the largest planet in our solar system with a diameter of about 139,820 kilometers (86,881 miles), which is about 11 times Earth's diameter. Its mass is about 318 times that of Earth.",
  "how big is saturn": "Saturn has a diameter of about 116,460 kilometers (72,367 miles), making it about 9 times wider than Earth. Despite its size, Saturn is less dense than water.",
  "how big is mars": "Mars has a diameter of about 6,779 kilometers (4,212 miles), which is about half the size of Earth. Its mass is about 11% of Earth's mass.",
  "how big is venus": "Venus has a diameter of about 12,104 kilometers (7,521 miles), making it almost the same size as Earth (about 95% of Earth's diameter).",
  "how big is mercury": "Mercury is the smallest planet with a diameter of about 4,879 kilometers (3,032 miles), which is about 38% the size of Earth.",
  "how big is uranus": "Uranus has a diameter of about 50,724 kilometers (31,518 miles), making it about 4 times wider than Earth.",
  "how big is neptune": "Neptune has a diameter of about 49,244 kilometers (30,598 miles), making it about 4 times wider than Earth.",

  // Solar System - Comprehensive  
  "what is the sun": "The Sun is a G-type main-sequence star at the center of our solar system. It's a massive ball of hot plasma held together by gravity, with a core temperature of about 15 million degrees Celsius. The Sun generates energy through nuclear fusion, converting 600 million tons of hydrogen into helium every second, releasing the energy equivalent of 100 billion nuclear bombs per second. It contains 99.86% of the solar system's mass and could fit 1.3 million Earths inside it.",
  "how many planets": "There are 8 planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Pluto was reclassified as a dwarf planet in 2006 by the International Astronomical Union because it doesn't meet all three criteria for a planet: it must orbit the Sun, have sufficient mass to be roughly round, and clear its orbital neighborhood.",
  "solar system formation": "Our solar system formed about 4.6 billion years ago from the gravitational collapse of a giant molecular cloud. The Sun formed at the center, while planets formed from the accretion of dust and gas in the surrounding protoplanetary disk. Inner planets are rocky due to high temperatures, while outer planets are gas/ice giants because volatiles could condense in the cooler outer regions.",
  "mercury facts": "Mercury is the smallest planet and closest to the Sun. It has extreme temperature variations (427°C day, -173°C night), no atmosphere, and takes 88 Earth days to orbit the Sun. One day on Mercury lasts 59 Earth days due to its slow rotation.",
  "venus facts": "Venus is the hottest planet with surface temperatures of 462°C due to its thick carbon dioxide atmosphere creating a runaway greenhouse effect. It rotates backwards (retrograde) and has the longest day of any planet - 243 Earth days.",
  "earth facts": "Earth is the only known planet with life. It's 71% water-covered, has one moon that stabilizes its rotation, and sits in the 'Goldilocks zone' - the perfect distance from the Sun for liquid water to exist.",
  "mars facts": "Mars is called the Red Planet due to iron oxide (rust) on its surface. It has two small moons (Phobos and Deimos), the largest volcano in the solar system (Olympus Mons), and evidence of ancient water flows. A day on Mars is 24.6 hours.",
  "jupiter facts": "Jupiter is the largest planet, containing more mass than all other planets combined. It has 95 known moons including the four Galilean moons. Its Great Red Spot is a storm larger than Earth that's been raging for centuries.",
  "saturn facts": "Saturn is famous for its prominent ring system made of ice and rock particles. It's less dense than water and has 146 known moons, including Titan which has lakes of liquid methane.",
  "uranus facts": "Uranus rotates on its side (98° tilt) likely due to an ancient collision. It's an ice giant with 27 moons and was the first planet discovered with a telescope in 1781 by William Herschel.",
  "neptune facts": "Neptune is the windiest planet with speeds up to 2,100 km/h. It was discovered mathematically before being observed, and takes 165 Earth years to orbit the Sun.",

  // General responses for better interaction
  "hello": "Hello! I'm Nova, your cosmic AI assistant. Ask me anything about space, astronomy, or the universe!",
  "hi": "Hi there! I'm here to help you explore the wonders of the cosmos. What would you like to know?",
  "what can you do": "I can answer questions about planets, stars, galaxies, space exploration, physics, and much more! Try asking me about the size of planets, how stars work, or any space facts you're curious about.",
  "thanks": "You're welcome! Keep exploring the universe with curiosity!",
  "thank you": "My pleasure! The cosmos is full of amazing discoveries waiting to be shared."
};

export default function CosmosAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Nova, your cosmic AI assistant. Ask me anything about space, astronomy, or the universe! Try asking me 'How big is the Sun?' or 'What are black holes?'",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestMatch = (query: string): string => {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Direct match
    if (knowledgeBase[normalizedQuery as keyof typeof knowledgeBase]) {
      return knowledgeBase[normalizedQuery as keyof typeof knowledgeBase];
    }

    // Partial matches
    const keys = Object.keys(knowledgeBase);
    for (const key of keys) {
      if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
        return knowledgeBase[key as keyof typeof knowledgeBase];
      }
    }

    // Keyword-based matching
    if (normalizedQuery.includes('big') || normalizedQuery.includes('size') || normalizedQuery.includes('diameter')) {
      if (normalizedQuery.includes('sun')) return knowledgeBase["how big is the sun"];
      if (normalizedQuery.includes('earth')) return knowledgeBase["how big is earth"];
      if (normalizedQuery.includes('jupiter')) return knowledgeBase["how big is jupiter"];
      if (normalizedQuery.includes('saturn')) return knowledgeBase["how big is saturn"];
      if (normalizedQuery.includes('mars')) return knowledgeBase["how big is mars"];
      if (normalizedQuery.includes('venus')) return knowledgeBase["how big is venus"];
      if (normalizedQuery.includes('mercury')) return knowledgeBase["how big is mercury"];
      if (normalizedQuery.includes('uranus')) return knowledgeBase["how big is uranus"];
      if (normalizedQuery.includes('neptune')) return knowledgeBase["how big is neptune"];
    }

    // Default response for unmatched queries
    return "That's a fascinating question! While I have extensive knowledge about space and astronomy, I might not have specific information about that topic yet. Try asking me about planet sizes, stellar facts, or space exploration. You can ask things like 'How big is Jupiter?' or 'What are neutron stars?'";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = findBestMatch(inputText);
      
      const aiMessage: Message = {
        id: messages.length + 2,
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "How big is the Sun?",
    "What are black holes?",
    "How many moons does Jupiter have?",
    "What is the Milky Way?",
    "How far is Mars from Earth?"
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 space-text">Cosmos AI Assistant</h2>
        <p className="text-xl text-gray-200 space-text">Your intelligent guide to the universe</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="space-card border-white/20 bg-black/40">
          <CardHeader>
            <CardTitle className="text-white space-text flex items-center gap-2">
              <Rocket className="h-6 w-6 text-blue-400" />
              Nova - Cosmic AI Assistant
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="border-green-400 text-green-400">
                Online
              </Badge>
              <Badge variant="outline" className="border-blue-400 text-blue-400">
                Space Expert
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="h-96 overflow-y-auto space-y-4 p-4 bg-black/20 rounded-lg border border-white/10">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-white border border-white/20'
                    }`}
                  >
                    {!message.isUser && (
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-xs text-yellow-400">Nova AI</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed space-text">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-lg max-w-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-xs text-yellow-400">Nova AI</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            <div className="space-y-2">
              <p className="text-white text-sm space-text">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputText(question)}
                    className="border-white/20 text-white hover:bg-white/10 bg-black/20 text-xs"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about space and astronomy..."
                className="flex-1 p-3 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none"
                rows={2}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                <Zap className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-400 space-text">
                Nova AI is powered by extensive astronomical knowledge. Ask away!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}