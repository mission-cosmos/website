
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
  "what is the sun": "The Sun is a medium-sized star at the center of our solar system. It's a massive ball of hot plasma held together by gravity, with a core temperature of about 15 million degrees Celsius. The Sun generates energy through nuclear fusion, converting hydrogen into helium.",
  
  "how many planets": "There are 8 planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Pluto was reclassified as a dwarf planet in 2006.",
  
  "what is a black hole": "A black hole is a region of spacetime where gravity is so strong that nothing, not even light, can escape once it crosses the event horizon. They form when massive stars collapse at the end of their lives.",
  
  "how big is the universe": "The observable universe is about 93 billion light-years in diameter. However, the entire universe might be infinite. We can only see a portion of it due to the finite speed of light and the age of the universe.",
  
  "what is dark matter": "Dark matter is a mysterious form of matter that makes up about 27% of the universe. It doesn't emit, absorb, or reflect light, making it invisible. We know it exists because of its gravitational effects on visible matter.",
  
  "how far is mars": "Mars is approximately 227.9 million kilometers (141.6 million miles) away from the Sun on average. The distance between Earth and Mars varies greatly, from about 54.6 million km to 401 million km depending on their positions in orbit.",
  
  "what is the milky way": "The Milky Way is our home galaxy, containing over 100 billion stars. It's a spiral galaxy about 100,000 light-years across. Our solar system is located about 26,000 light-years from the galactic center.",
  
  "how do rockets work": "Rockets work on Newton's third law: for every action, there's an equal and opposite reaction. They burn fuel to create hot gases that are expelled downward, which pushes the rocket upward. They carry their own oxygen supply to work in the vacuum of space.",
  
  "what is gravity": "Gravity is a fundamental force that attracts objects with mass toward each other. According to Einstein's theory, massive objects actually curve spacetime, and this curvature is what we experience as gravity.",
  
  "how old is the universe": "The universe is approximately 13.8 billion years old, as determined by observations of the cosmic microwave background radiation and other astronomical measurements."
};

export default function CosmosAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Nova, your personal space exploration assistant! 🚀 I'm here to answer all your questions about the cosmos, from planets and stars to black holes and space missions. What would you like to know about the universe?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Check for exact matches first
    for (const [key, response] of Object.entries(knowledgeBase)) {
      if (lowerQuestion.includes(key)) {
        return response;
      }
    }
    
    // Check for keywords
    if (lowerQuestion.includes('planet') || lowerQuestion.includes('planets')) {
      return "Planets are celestial bodies that orbit stars. In our solar system, we have 8 planets, each with unique characteristics. Would you like to know more about a specific planet?";
    }
    
    if (lowerQuestion.includes('star') || lowerQuestion.includes('stars')) {
      return "Stars are massive, luminous balls of plasma held together by gravity. They generate energy through nuclear fusion in their cores. Our Sun is a medium-sized star, and there are billions of stars in our galaxy alone!";
    }
    
    if (lowerQuestion.includes('moon') || lowerQuestion.includes('moons')) {
      return "Moons are natural satellites that orbit planets. Earth has one moon, but some planets have many - Jupiter has 95 confirmed moons! They form through various processes and can be quite diverse in size and composition.";
    }
    
    if (lowerQuestion.includes('space') || lowerQuestion.includes('cosmos')) {
      return "Space is the vast, mostly empty region that exists beyond Earth's atmosphere. It contains galaxies, stars, planets, and mysterious phenomena like dark matter and dark energy. It's an incredible frontier for exploration and discovery!";
    }
    
    if (lowerQuestion.includes('astronaut') || lowerQuestion.includes('space travel')) {
      return "Astronauts are brave explorers who travel to space to conduct research and exploration. Space travel requires overcoming Earth's gravity, dealing with radiation, and surviving in the vacuum of space. It's one of humanity's greatest achievements!";
    }
    
    if (lowerQuestion.includes('alien') || lowerQuestion.includes('life')) {
      return "The search for extraterrestrial life is one of the most exciting areas of space science! While we haven't found definitive proof of alien life yet, scientists are actively searching through projects like SETI and by studying potentially habitable exoplanets.";
    }
    
    // Default responses for common greetings and general questions
    if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi')) {
      return "Hello there, space explorer! I'm excited to help you discover the wonders of the universe. What cosmic mystery would you like to explore today?";
    }
    
    if (lowerQuestion.includes('thank')) {
      return "You're very welcome! I love sharing the amazing secrets of space with curious minds like yours. Keep exploring and asking questions! 🌟";
    }
    
    if (lowerQuestion.includes('how are you')) {
      return "I'm doing wonderfully, thank you for asking! I'm always energized when I get to talk about space and the cosmos. There's so much incredible stuff out there to discover!";
    }
    
    // Default response
    return "That's a fascinating question about space! While I don't have specific information about that topic in my current knowledge base, I'd love to help you explore other cosmic wonders. Try asking me about planets, stars, black holes, the solar system, or space exploration!";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateResponse(inputText);
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What is a black hole?",
    "How many planets are in our solar system?",
    "What is the Milky Way?",
    "How do rockets work?",
    "What is dark matter?",
    "How far is Mars from Earth?"
  ];

  const handleSuggestionClick = (question: string) => {
    setInputText(question);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 space-text">Meet Nova</h2>
        <p className="text-xl text-gray-200 space-text">Your Personal Cosmic Intelligence Assistant</p>
        <Badge variant="outline" className="border-purple-400 text-purple-400 mt-2">
          AI-Powered Space Expert
        </Badge>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="space-card border-white/20 h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-white space-text flex items-center gap-2">
              <div className="relative">
                <Settings className="h-6 w-6 text-purple-400 animate-spin" style={{ animationDuration: '3s' }} />
                <Star className="absolute inset-0 h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
              Nova - Cosmic AI Assistant
              <div className="ml-auto flex items-center gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">Online</span>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.isUser
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'glass-effect text-white'
                    }`}
                  >
                    <p className="space-text">{message.text}</p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="glass-effect p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-gray-300 text-sm space-text">Nova is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 1 && (
              <div className="px-6 py-2">
                <p className="text-gray-300 text-sm mb-3 space-text">Try asking Nova about:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      onClick={() => handleSuggestionClick(question)}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-6 border-t border-white/10">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Nova anything about space and the cosmos..."
                  className="flex-1 p-3 rounded-lg glass-effect text-white placeholder-gray-400 border border-white/20 focus:border-purple-400 focus:outline-none"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-6"
                >
                  <Rocket className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
