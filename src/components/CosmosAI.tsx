import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Settings, Star, Rocket, Zap, Key } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const getAIResponse = async (question: string, apiKey: string): Promise<string> => {
  if (!apiKey) {
    return "Please enter your Perplexity API key to unlock my full astronomical knowledge!";
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are Nova, an expert cosmic AI assistant with deep knowledge of astronomy, astrophysics, cosmology, space exploration, and all things related to the universe. Provide detailed, accurate, and engaging answers about space topics. Be enthusiastic and educational while maintaining scientific accuracy. If asked about non-space topics, politely redirect to space-related subjects.'
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.3,
        top_p: 0.9,
        max_tokens: 800,
        return_images: false,
        return_related_questions: false,
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "I'm having trouble accessing my cosmic knowledge right now. Please try again!";
  } catch (error) {
    console.error('Perplexity API error:', error);
    return "I'm experiencing some cosmic interference! Please check your API key and try again. Make sure you have a valid Perplexity API key.";
  }
};

export default function CosmosAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Nova, your cosmic AI assistant with access to the latest astronomical knowledge! I can answer any question about space, astronomy, cosmology, and the universe. Ask me about neutron stars, black holes, exoplanets, galaxy formation, or anything cosmic! First, please enter your Perplexity API key below to unlock my full potential.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const response = await getAIResponse(currentInput, apiKey);
      
      const aiMessage: Message = {
        id: messages.length + 2,
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "I'm experiencing some cosmic interference! Please check your connection and try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What are neutron stars?",
    "How do black holes form?",
    "What is dark matter?",
    "How big is the universe?",
    "What are exoplanets?",
    "How do stars die?",
    "What is the Big Bang theory?",
    "What are quasars?"
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

            {/* API Key Input */}
            {showApiKeyInput && (
              <div className="space-y-2 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-yellow-400" />
                  <p className="text-yellow-400 text-sm font-medium">Perplexity API Key Required</p>
                </div>
                <p className="text-gray-300 text-xs">
                  To unlock my full astronomical knowledge, please enter your Perplexity API key. 
                  Get one at <a href="https://docs.perplexity.ai/docs/getting-started" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">perplexity.ai</a>
                </p>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Perplexity API key..."
                    className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                  />
                  <Button
                    onClick={() => {
                      if (apiKey.trim()) {
                        setShowApiKeyInput(false);
                        const welcomeMessage: Message = {
                          id: messages.length + 1,
                          text: "Perfect! I'm now connected to my vast cosmic knowledge base. Ask me anything about the universe - from the smallest subatomic particles to the largest galaxy clusters!",
                          isUser: false,
                          timestamp: new Date()
                        };
                        setMessages(prev => [...prev, welcomeMessage]);
                      }
                    }}
                    disabled={!apiKey.trim()}
                    variant="outline"
                    className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                  >
                    Connect
                  </Button>
                </div>
              </div>
            )}

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
                Nova AI is powered by Perplexity's real-time astronomical knowledge. Ask any cosmic question!
              </p>
              {!showApiKeyInput && (
                <Button
                  onClick={() => setShowApiKeyInput(true)}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-gray-500 hover:text-gray-300 mt-1"
                >
                  Change API Key
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}