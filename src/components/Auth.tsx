import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket, Mail, Lock, User, Star, Sparkles, Globe, Orbit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;

    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Welcome to Mission Cosmos! 🚀",
        description: "Please check your email to verify your account.",
      });
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        window.location.href = '/';
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error) {
      toast({
        title: "Google sign in failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced space background */}
      <div className="absolute inset-0 space-background">
        <div className="stars"></div>
        <div className="shooting-stars">
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
          <div className="shooting-star"></div>
        </div>
      </div>
      
      {/* Floating cosmic elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-blue-400/20 animate-pulse">
          <Star className="h-8 w-8" />
        </div>
        <div className="absolute top-40 right-20 text-purple-400/20 animate-bounce">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="absolute bottom-32 left-16 text-cyan-400/20 animate-pulse">
          <Globe className="h-10 w-10" />
        </div>
        <div className="absolute bottom-20 right-10 text-pink-400/20 animate-spin-slow">
          <Orbit className="h-7 w-7" />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="relative">
                <Rocket className="h-12 w-12 text-blue-400 animate-pulse" />
                <div className="absolute -top-1 -right-1">
                  <Star className="h-4 w-4 text-yellow-400 animate-bounce" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent space-text">
                  Mission Cosmos
                </h1>
                <div className="flex justify-center gap-1 mt-1">
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-lg space-text">
              Join the cosmic exploration community
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Your journey through the universe begins here
            </p>
          </div>

          {/* Main Auth Card */}
          <Card className="bg-slate-900/90 border-slate-600/50 backdrop-blur-lg shadow-2xl shadow-blue-500/10 animate-scale-in">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-white text-xl flex items-center justify-center gap-2 space-text">
                <div className="relative">
                  <Star className="h-6 w-6 text-yellow-400 animate-pulse" />
                  <div className="absolute inset-0 h-6 w-6 border border-yellow-400/50 rounded-full animate-ping"></div>
                </div>
                Welcome Aboard, Explorer
              </CardTitle>
              <CardDescription className="text-center text-gray-300 space-text">
                Sign in to save your cosmic discoveries and continue your journey through the stars
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="signin" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800/80 border border-slate-600/50">
                  <TabsTrigger 
                    value="signin" 
                    className="text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
                  >
                    Launch Mission
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-5">
                    <div className="space-y-3">
                      <Label htmlFor="signin-email" className="text-gray-200 font-medium space-text">
                        Email Address
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                        <Input
                          id="signin-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="astronaut@cosmos.space"
                          className="pl-10 bg-slate-800/70 border-slate-600/70 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="signin-password" className="text-gray-200 font-medium space-text">
                        Mission Password
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                        <Input
                          id="signin-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••"
                          className="pl-10 bg-slate-800/70 border-slate-600/70 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 space-text"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Launching...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Rocket className="h-4 w-4" />
                          Launch Into Cosmos
                        </div>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-5">
                    <div className="space-y-3">
                      <Label htmlFor="signup-name" className="text-gray-200 font-medium space-text">
                        Astronaut Name
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                        <Input
                          id="signup-name"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Commander Cosmos"
                          className="pl-10 bg-slate-800/70 border-slate-600/70 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="signup-email" className="text-gray-200 font-medium space-text">
                        Mission Email
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                        <Input
                          id="signup-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="explorer@universe.space"
                          className="pl-10 bg-slate-800/70 border-slate-600/70 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="signup-password" className="text-gray-200 font-medium space-text">
                        Mission Password
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                        <Input
                          id="signup-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create your cosmic key"
                          className="pl-10 bg-slate-800/70 border-slate-600/70 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                          required
                          minLength={6}
                        />
                      </div>
                      <p className="text-xs text-gray-400 space-text">
                        Minimum 6 characters for intergalactic security
                      </p>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 space-text"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Preparing Launch...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Begin Mission
                        </div>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-600/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-3 text-gray-400 space-text">
                    Or join via the galaxy network
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <Button
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full border-slate-600/70 bg-slate-800/50 text-white hover:bg-slate-700/70 hover:border-slate-500 transition-all duration-300 py-3 group"
                disabled={isLoading}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="space-text font-medium">
                    {isLoading ? "Connecting to galaxy..." : "Continue with Google"}
                  </span>
                </div>
              </Button>

            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 space-y-3 animate-fade-in">
            <p className="text-sm text-gray-400 space-text">
              By joining Mission Cosmos, you agree to explore the universe responsibly
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-blue-400/50 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-400/50 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-cyan-400/50 rounded-full animate-pulse delay-150"></div>
            </div>
            <p className="text-xs text-gray-500 space-text">
              🚀 Ready to explore the infinite cosmos? Your adventure starts now!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}