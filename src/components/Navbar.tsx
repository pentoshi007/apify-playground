import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Key, LogOut, User, Settings, Menu, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface NavbarProps {
  user: SupabaseUser | null;
  onSignOut: () => void;
  onProfileSettings?: () => void;
  onAuthClick?: (tab: 'signin' | 'signup' | 'tryNow') => void;
}

export function Navbar({ user, onSignOut, onProfileSettings, onAuthClick }: NavbarProps) {
  const [profile, setProfile] = useState<{ full_name?: string; username?: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (data) {
      setProfile(data);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);



  const getDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    if (profile?.username) return profile.username;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glassmorphic-navbar px-6 py-4">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-primary/3" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent" />
      <div className="relative flex items-center justify-between max-w-7xl mx-auto">
        <button 
          onClick={() => window.location.href = '/'}
          className="group flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-all duration-300 cursor-pointer"
        >
          <div className="relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 border border-primary/30 shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
            
            {/* Modern icon design */}
            <div className="relative z-10 flex items-center justify-center">
              <svg 
                className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-sm" 
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
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent group-hover:from-primary/95 group-hover:via-primary group-hover:to-primary/80 transition-all duration-300">
              Apify Playground
            </h1>
            <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">Actor execution platform</p>
          </div>
          <div className="block sm:hidden">
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent group-hover:from-primary/95 group-hover:via-primary group-hover:to-primary/80 transition-all duration-300">
              Apify
            </h1>
          </div>
        </button>

        <div className="flex items-center gap-3">
          {/* Desktop Navigation */}
          {!user && onAuthClick && (
            <div className="hidden md:flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onAuthClick('tryNow')}
                className="relative group text-muted-foreground hover:text-primary bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 px-4 py-2 rounded-lg overflow-hidden border border-transparent hover:border-primary/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 border border-primary/20 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />
                <span className="relative z-10 font-medium">Try Now</span>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-gradient-to-r from-primary to-primary/70 transition-all duration-300" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onAuthClick('signin')}
                className="navbar-button-glow relative group border border-border/20 hover:border-primary/40 bg-white/10 backdrop-blur-md hover:bg-primary/10 transition-all duration-300 px-5 py-2 rounded-lg overflow-hidden shadow-sm hover:shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 font-medium text-foreground group-hover:text-primary transition-colors duration-300">Sign In</span>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
              
              <Button 
                size="sm"
                onClick={() => onAuthClick('signup')}
                className="navbar-accent-dot navbar-button-glow relative group bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/95 hover:via-primary hover:to-primary/85 text-primary-foreground font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 border border-white/20 rounded-lg" />
                <span className="relative z-10 flex items-center gap-2">
                  Sign Up
                  <div className="w-1.5 h-1.5 rounded-full bg-white/70 group-hover:bg-white transition-colors duration-300" />
                </span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-white/30 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {!user && onAuthClick && (
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="md:hidden relative w-10 h-10 p-0 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-primary/20 rounded-lg"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5 text-foreground" />
                  ) : (
                    <Menu className="h-5 w-5 text-foreground" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-xl border-border/30">
                <div className="flex flex-col space-y-6 mt-8">
                  <div className="flex items-center gap-3 pb-6 border-b border-border/30">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 border border-primary/30 shadow-lg">
                      <svg 
                        className="h-6 w-6 text-white drop-shadow-sm" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
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
                    <div>
                      <h3 className="text-lg font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                        Apify Playground
                      </h3>
                      <p className="text-xs text-muted-foreground">Actor execution platform</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        onAuthClick('tryNow');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start h-12 text-left bg-white/5 hover:bg-primary/10 border border-border/20 hover:border-primary/30"
                    >
                      <span className="font-medium">Try Now</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        onAuthClick('signin');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start h-12 bg-white/10 hover:bg-primary/10 border-border/20 hover:border-primary/30"
                    >
                      <span className="font-medium">Sign In</span>
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        onAuthClick('signup');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start h-12 bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/95 hover:via-primary hover:to-primary/85 text-primary-foreground font-medium shadow-lg"
                    >
                      <span className="font-medium">Sign Up</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="glass" className="h-10 w-10 rounded-full p-0 hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20">
                  <Avatar className="h-9 w-9 transition-all duration-200">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/20 text-primary-foreground font-semibold border border-primary/20 hover:from-primary/40 hover:to-primary/30 transition-all duration-200">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background/80 backdrop-blur-xl border border-border/30 rounded-xl shadow-xl shadow-black/10 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-2 py-1.5 animate-in fade-in duration-300">
                  <p className="text-sm font-medium">{getDisplayName()}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuItem 
                  onClick={onProfileSettings}
                  className="hover:bg-muted/50 transition-all duration-200 hover:translate-x-1 cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
                  Profile & Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={onSignOut}
                  className="hover:bg-destructive/20 text-destructive hover:text-destructive transition-all duration-200 hover:translate-x-1 cursor-pointer group"
                >
                  <LogOut className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}