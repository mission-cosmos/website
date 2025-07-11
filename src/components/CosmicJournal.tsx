
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PenTool, BookOpen, Sparkles, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const CosmicJournal = () => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [savedEntries, setSavedEntries] = useState<Array<{id: string, prompt_title: string, content: string, created_at: string, prompt_category?: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const prompts = [
    {
      id: 1,
      category: "Imagination",
      title: "Life on Other Planets",
      prompt: "Imagine you've discovered a new planet with life. Describe what the creatures look like, how they communicate, and what their world is like.",
      emoji: "👽"
    },
    {
      id: 2,
      category: "Adventure",
      title: "Your Space Mission",
      prompt: "You're the commander of a space mission to explore a distant galaxy. What is your mission goal, who is on your crew, and what challenges do you face?",
      emoji: "🚀"
    },
    {
      id: 3,
      category: "Wonder",
      title: "The Most Beautiful Thing in Space",
      prompt: "Describe the most beautiful thing you can imagine seeing in space. It could be a nebula, a planet, or something entirely new that doesn't exist yet.",
      emoji: "✨"
    },
    {
      id: 4,
      category: "Science",
      title: "Future Technology",
      prompt: "Invent a new piece of space technology that could help astronauts explore the universe. How does it work and what problems does it solve?",
      emoji: "🔧"
    },
    {
      id: 5,
      category: "Philosophy",
      title: "Messages to the Stars",
      prompt: "If you could send a message to intelligent life somewhere in the universe, what would you want to tell them about Earth and humanity?",
      emoji: "📡"
    },
    {
      id: 6,
      category: "Creativity",
      title: "Space Colony Design",
      prompt: "Design your ideal space colony on Mars or the Moon. What would daily life be like? How would people work, play, and live together?",
      emoji: "🏗️"
    },
    {
      id: 7,
      category: "Mystery",
      title: "Cosmic Mysteries",
      prompt: "What's the biggest mystery about space that you'd like to solve? Why is it interesting to you, and how might we find the answer?",
      emoji: "🔍"
    },
    {
      id: 8,
      category: "Dreams",
      title: "Your Space Dream",
      prompt: "If you could have any space-related superpower or ability, what would it be? How would you use it to explore the universe?",
      emoji: "⭐"
    }
  ];

  const currentPrompt = prompts[currentPromptIndex];

  const nextPrompt = () => {
    setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
    setJournalEntry("");
  };

  const randomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setCurrentPromptIndex(randomIndex);
    setJournalEntry("");
  };

  // Load saved entries on component mount
  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedEntries(data || []);
    } catch (error) {
      console.error('Error loading entries:', error);
      toast({
        title: "Error loading entries",
        description: "Could not load your journal entries.",
        variant: "destructive",
      });
    }
  };

  const saveEntry = async () => {
    if (!journalEntry.trim() || !user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          prompt_title: currentPrompt.title,
          prompt_category: currentPrompt.category,
          content: journalEntry.trim()
        })
        .select()
        .single();

      if (error) throw error;

      setSavedEntries(prev => [data, ...prev]);
      toast({
        title: "Entry Saved! 🌟",
        description: "Your cosmic thoughts have been saved to your journal.",
      });
      setJournalEntry("");
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error saving entry",
        description: "Could not save your journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      "Imagination": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "Adventure": "bg-red-500/20 text-red-400 border-red-500/30",
      "Wonder": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "Science": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "Philosophy": "bg-green-500/20 text-green-400 border-green-500/30",
      "Creativity": "bg-pink-500/20 text-pink-400 border-pink-500/30",
      "Mystery": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      "Dreams": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
    };
    return colorMap[category] || colorMap.Science;
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Cosmic Journal</h2>
        <p className="text-xl text-gray-300">Reflect on the universe and express your curiosity</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Current Writing Prompt */}
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className="text-6xl">{currentPrompt.emoji}</div>
              <Badge variant="outline" className={getCategoryColor(currentPrompt.category)}>
                {currentPrompt.category}
              </Badge>
            </div>
            <CardTitle className="text-2xl md:text-3xl text-white mb-4">
              {currentPrompt.title}
            </CardTitle>
            <CardDescription className="text-lg text-gray-300 leading-relaxed">
              {currentPrompt.prompt}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Textarea
                placeholder="Start writing your cosmic thoughts here..."
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                className="min-h-[200px] bg-slate-900/50 border-slate-600/50 text-white placeholder:text-gray-400 resize-none"
              />
              <div className="text-right text-sm text-gray-400">
                {journalEntry.length} characters
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={saveEntry}
                disabled={!journalEntry.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Entry"}
              </Button>
              <Button
                onClick={nextPrompt}
                variant="outline"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
              >
                <PenTool className="h-4 w-4 mr-2" />
                Next Prompt
              </Button>
              <Button
                onClick={randomPrompt}
                variant="outline"
                className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Random Prompt
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Prompt {currentPromptIndex + 1} of {prompts.length}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Saved Entries */}
        {savedEntries.length > 0 && (
          <Card className="bg-slate-800/30 border-slate-600/30">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-400" />
                Your Cosmic Journal Entries
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your thoughts and reflections about the universe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {savedEntries.map((entry) => (
                  <div key={entry.id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-600/30">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{entry.prompt_title}</h4>
                      <span className="text-xs text-gray-400">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {entry.content.length > 200 ? `${entry.content.substring(0, 200)}...` : entry.content}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Writing Tips - Updated with better contrast */}
        <Card className="bg-slate-800/80 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              Writing Tips for Cosmic Explorers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-white">
              <div className="space-y-2">
                <p><strong className="text-yellow-400">Be Creative:</strong> There are no wrong answers in space imagination!</p>
                <p><strong className="text-blue-400">Use Details:</strong> Describe what you see, hear, and feel.</p>
              </div>
              <div className="space-y-2">
                <p><strong className="text-purple-400">Ask Questions:</strong> Wonder about the "what ifs" of the universe.</p>
                <p><strong className="text-green-400">Have Fun:</strong> Let your curiosity guide your writing!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CosmicJournal;
