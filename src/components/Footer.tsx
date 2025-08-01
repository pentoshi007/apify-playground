import { Key, Github, Twitter, Mail, Code, Sparkles } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  

  return (
    <footer className="relative border-t border-border/50 bg-gradient-to-br from-card/40 via-card/30 to-background/20 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16">
          {/* Brand Section */}
          <div className="flex-1 max-w-lg">
            <button 
              onClick={() => window.location.href = '/'}
              className="group flex items-center gap-4 mb-8 hover:opacity-90 transition-all duration-300 cursor-pointer"
            >
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 border border-primary/30 shadow-xl group-hover:scale-105 group-hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
                
                {/* Modern icon design */}
                <div className="relative z-10 flex items-center justify-center">
                  <svg 
                    className="h-8 w-8 text-white drop-shadow-md" 
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
                
                {/* Multiple accent dots for footer version */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                <div className="absolute top-0 -left-0.5 w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-80 transition-opacity duration-500 animate-pulse" style={{animationDelay: '0.3s'}} />
                
                {/* Animated border glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent group-hover:from-primary/95 group-hover:via-primary group-hover:to-primary/80 transition-all duration-300">
                  Apify Playground
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">Actor execution platform</p>
              </div>
            </button>
            <p className="text-muted-foreground leading-relaxed text-lg mb-6">
              The most intuitive way to execute, explore, and manage Apify actors.
            </p>
            <div className="flex items-center gap-2 text-primary/80">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Production Ready Platform</span>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="flex flex-col items-center lg:items-end">
            <div className="flex gap-4 mb-8">
              <a 
                href="https://github.com/pentoshi007" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-14 h-14 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 border border-border/50 flex items-center justify-center transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 hover:scale-110 active:scale-95 overflow-hidden"
                aria-label="GitHub"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Github className="relative z-10 w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </a>
              <a 
                href="https://www.linkedin.com/in/aniket00736/" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-14 h-14 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 border border-border/50 flex items-center justify-center transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 hover:scale-110 active:scale-95 overflow-hidden"
                aria-label="LinkedIn"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <svg className="relative z-10 w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://x.com/lunatic_ak_" 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-14 h-14 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 border border-border/50 flex items-center justify-center transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 hover:scale-110 active:scale-95 overflow-hidden"
                aria-label="X (Twitter)"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Twitter className="relative z-10 w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </a>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full px-4 py-2">
              <Code className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Built by Aniket</span>
            </div>
          </div>
        </div>

        <div className="relative border-t border-border/30 mt-16 pt-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
          <div className="flex justify-center items-center">
            <p className="text-muted-foreground text-sm font-medium text-center">
              © 2025 Apify Playground. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}