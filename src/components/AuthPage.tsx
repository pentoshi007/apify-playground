import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Key, Eye, EyeOff, AlertCircle, CheckCircle, Sparkles, ArrowRight, Mail, Lock, User, Zap } from 'lucide-react';
import { AnimatedSection, FadeUpSection, ScaleSection } from '@/components/AnimatedSection';
import { usePageLoadAnimation } from '@/hooks/useScrollAnimation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getAuthRedirectUrl } from '@/lib/config';

interface AuthPageProps {
  onAuthSuccess: () => void;
  onGuestAccess: (apiKey: string) => void;
  defaultTab?: 'signin' | 'signup' | 'tryNow';
  onAuthClick?: (tab: 'signin' | 'signup' | 'tryNow') => void;
}

export function AuthPage({ onAuthSuccess, onGuestAccess, defaultTab = 'signin', onAuthClick }: AuthPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [guestApiKey, setGuestApiKey] = useState('');
  const [currentTab, setCurrentTab] = useState(defaultTab === 'tryNow' ? 'guest' : defaultTab);
  const { toast } = useToast();
  const isPageLoaded = usePageLoadAnimation(200);

  const handleLocalAuthClick = (tab: 'signin' | 'signup' | 'tryNow') => {
    const tabValue = tab === 'tryNow' ? 'guest' : tab;
    setCurrentTab(tabValue);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have been signed in successfully.',
        });
        onAuthSuccess();
      }
    } catch (error) {
      toast({
        title: 'Sign in failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;

    setIsLoading(true);
    try {
      const redirectUrl = getAuthRedirectUrl('/');
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            username: fullName.toLowerCase().replace(/\s+/g, ''),
          },
        },
      });

      if (error) {
        toast({
          title: 'Sign up failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Account created!',
          description: 'Please check your email to verify your account.',
        });
      }
    } catch (error) {
      toast({
        title: 'Sign up failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestApiKey.trim()) return;
    onGuestAccess(guestApiKey.trim());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={null} onSignOut={() => {}} onAuthClick={handleLocalAuthClick} />
      
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 pt-20 sm:pt-24">
        <div className="w-full max-w-md mx-auto">
          <FadeUpSection delay={200}>
            <Card className="glass-card border-border/50">
              <CardHeader className="text-center p-4 sm:p-6">
                <div className="relative mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 border border-primary/30 shadow-xl overflow-hidden">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
                  
                  {/* Modern icon design */}
                  <div className="relative z-10 flex items-center justify-center">
                    <svg 
                      className="h-7 w-7 sm:h-8 sm:w-8 text-white drop-shadow-md" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Creative play/execute icon */}
                      <path 
                        d="M8 5v14l11-7z" 
                        fill="currentColor" 
                        className="opacity-90"
                      />
                      <circle 
                        cx="6" 
                        cy="12" 
                        r="2" 
                        fill="currentColor" 
                        className="opacity-70"
                      />
                      <path 
                        d="M18 8v8M21 10v4" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                        className="opacity-80"
                      />
                    </svg>
                  </div>
                  
                  {/* Animated accent dot */}
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse" />
                </div>
                <CardTitle className="text-xl sm:text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {currentTab === 'guest' ? 'Try Apify Playground' : currentTab === 'signup' ? 'Join Apify Playground' : 'Welcome Back'}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-muted-foreground px-2 sm:px-0">
                  {currentTab === 'guest' ? 'Enter your API key to explore without registration' : currentTab === 'signup' ? 'Create your account to get started' : 'Sign in to access your personal workspace'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3 glass-input p-1 bg-background/50 backdrop-blur-sm border border-border/30">
                    <TabsTrigger 
                      value="signin" 
                      className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/30 text-xs sm:text-sm font-medium transition-all duration-300 rounded-md data-[state=active]:shadow-md py-2"
                    >
                      <span className="relative z-10">Sign In</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup" 
                      className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/30 text-xs sm:text-sm font-medium transition-all duration-300 rounded-md data-[state=active]:shadow-md py-2"
                    >
                      <span className="relative z-10">Sign Up</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="guest" 
                      className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/30 text-xs sm:text-sm font-medium transition-all duration-300 rounded-md data-[state=active]:shadow-md py-2"
                    >
                      <span className="relative z-10 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        <span className="hidden sm:inline">Try Now</span>
                        <span className="sm:hidden">Try</span>
                      </span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="space-y-4">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-sm font-medium">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 glass-input"
                            disabled={isLoading}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-sm font-medium">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="signin-password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 glass-input"
                            disabled={isLoading}
                            required
                          />
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full glass-button" 
                        disabled={!email || !password || isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Signing in...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            Sign In
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="text-sm font-medium">
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="pl-10 glass-input"
                            disabled={isLoading}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-sm font-medium">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 glass-input"
                            disabled={isLoading}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-sm font-medium">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 glass-input"
                            disabled={isLoading}
                            required
                          />
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full glass-button" 
                        disabled={!email || !password || !fullName || isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Creating account...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            Create Account
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </Button>
                    </form>
                    
                    <ScaleSection delay={300}>
                      <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-start gap-3">
                          <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-medium text-primary mb-1">Why create an account?</p>
                            <ul className="text-muted-foreground space-y-1">
                              <li>• Secure API key storage</li>
                              <li>• Execution history & analytics</li>
                              <li>• Saved actor configurations</li>
                              <li>• Team collaboration features</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </ScaleSection>
                  </TabsContent>

                  <TabsContent value="guest" className="space-y-4">
                    <form onSubmit={handleGuestAccess} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="guest-api-key" className="text-sm font-medium">
                          Apify API Key
                        </Label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="guest-api-key"
                            type="password"
                            placeholder="Enter your Apify API key"
                            value={guestApiKey}
                            onChange={(e) => setGuestApiKey(e.target.value)}
                            className="pl-10 glass-input"
                            required
                          />
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full glass-button" 
                        disabled={!guestApiKey.trim()}
                      >
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Try Without Account
                        </div>
                      </Button>
                    </form>
                    
                    <FadeUpSection delay={500}>
                      <div className="mt-4 p-4 rounded-lg bg-muted/20 border border-border/50">
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">Guest Mode:</strong> Quick access without registration. 
                          Your API key won't be saved and you'll lose access when you close the browser.
                        </p>
                      </div>
                    </FadeUpSection>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </FadeUpSection>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}