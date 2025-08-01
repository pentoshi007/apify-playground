import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AnimatedSection, FadeUpSection, ScaleSection, StaggeredSection } from '@/components/AnimatedSection';
import { usePageLoadAnimation } from '@/hooks/useScrollAnimation';
import { 
  Key, 
  Play, 
  Zap, 
  Shield, 
  Code, 
  Globe, 
  ArrowRight,
  Sparkles,
  Database,
  Users,
  CheckCircle
} from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
  onAuthClick?: (tab: 'signin' | 'signup' | 'tryNow') => void;
}

export function Landing({ onGetStarted, onAuthClick }: LandingProps) {
  const isPageLoaded = usePageLoadAnimation(100);
  
  const features = [
    {
      icon: Play,
      title: "One-Click Actor Execution",
      description: "Select any Apify actor from your account and run it instantly with a beautiful, intuitive interface"
    },
    {
      icon: Code,
      title: "Dynamic Schema Loading",
      description: "Automatically fetches and renders input forms based on each actor's schema - no hardcoded configurations"
    },
    {
      icon: Shield,
      title: "Secure API Integration",
      description: "Your Apify API key is stored securely and used to authenticate all requests to the Apify platform"
    },
    {
      icon: Zap,
      title: "Real-Time Results",
      description: "Watch your actors run in real-time with live status updates, runtime stats, and instant result display"
    },
    {
      icon: Database,
      title: "Smart Result Display",
      description: "View structured results with run statistics, dataset information, and formatted JSON output"
    },
    {
      icon: CheckCircle,
      title: "Input Validation",
      description: "Built-in form validation ensures required fields are filled before execution, preventing failed runs"
    }
  ];

  const capabilities = [
    { icon: Globe, title: "Any Apify Actor", description: "Works with all actors in your Apify account" },
    { icon: Sparkles, title: "Dynamic Forms", description: "Auto-generated input forms from actor schemas" },
    { icon: Users, title: "User-Friendly", description: "Intuitive interface for developers and non-developers" },
    { icon: Shield, title: "Secure & Private", description: "Your data and API keys stay protected" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={null} onSignOut={() => {}} onAuthClick={onAuthClick} />
      
      {/* Hero Section */}
      <section className="relative flex-1 overflow-hidden flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="relative container mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`transition-all duration-1000 ease-out ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Badge className="mb-4 sm:mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs sm:text-sm">
                <Sparkles className="w-3 h-3 mr-1" />
                Open Source Web Application
              </Badge>
            </div>
            
            <div className={`transition-all duration-1000 ease-out delay-200 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Apify Actor
                </span>
                <br />
                <span className="text-foreground">
                  Playground
                </span>
              </h1>
            </div>
            
            <div className={`transition-all duration-1000 ease-out delay-400 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
                A modern web interface for running Apify actors. Simply connect your API key, 
                select an actor, fill the auto-generated form, and get instant results.
              </p>
            </div>
            
            <div className={`flex justify-center px-4 sm:px-0 transition-all duration-1000 ease-out delay-600 ${isPageLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
              <Button 
                size="lg" 
                className="glass-button text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto group w-full sm:w-auto max-w-xs sm:max-w-none hover:scale-105 transition-all duration-200"
                onClick={onGetStarted}
              >
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <FadeUpSection className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Actor Management
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Built with React and TypeScript, this playground provides everything you need 
              to run and monitor Apify actors through a clean, responsive interface.
            </p>
          </FadeUpSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <StaggeredSection key={index} delay={index * 150}>
                <Card className="glass-card border-border/50 group hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10">
                  <CardContent className="p-4 sm:p-6">
                    <div className="mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </StaggeredSection>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6">
          <FadeUpSection className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              What Makes It Special
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Designed specifically for the Apify ecosystem with modern web technologies
            </p>
          </FadeUpSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {capabilities.map((capability, index) => (
              <ScaleSection key={index} delay={index * 100}>
                <div className="text-center group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                    <capability.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{capability.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{capability.description}</p>
                </div>
              </ScaleSection>
            ))}
          </div>
          
          {/* How it works */}
          <AnimatedSection animation="fade-up" className="mt-16 sm:mt-20">
            <FadeUpSection className="text-center mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
                How It Works
              </h3>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto px-4 sm:px-0">
                Get up and running in just a few simple steps
              </p>
            </FadeUpSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <StaggeredSection delay={0}>
                <div className="text-center relative">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mb-4 mx-auto hover:scale-110 transition-transform duration-300">
                    1
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Connect API Key</h4>
                  <p className="text-sm text-muted-foreground">Enter your Apify API key to authenticate and access your actors</p>
                  {/* Connection line for desktop */}
                  <div className="hidden md:block absolute top-6 left-full w-3/4 h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
                </div>
              </StaggeredSection>
              
              <StaggeredSection delay={200}>
                <div className="text-center relative">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mb-4 mx-auto hover:scale-110 transition-transform duration-300">
                    2
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Select Actor</h4>
                  <p className="text-sm text-muted-foreground">Browse your actors and choose the one you want to run</p>
                  {/* Connection line for desktop */}
                  <div className="hidden md:block absolute top-6 left-full w-3/4 h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
                </div>
              </StaggeredSection>
              
              <StaggeredSection delay={400}>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mb-4 mx-auto hover:scale-110 transition-transform duration-300">
                    3
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Run & View Results</h4>
                  <p className="text-sm text-muted-foreground">Fill the auto-generated form and get instant results with statistics</p>
                </div>
              </StaggeredSection>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
        <div className="relative container mx-auto px-4 sm:px-6 text-center">
          <FadeUpSection className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Ready to try it out?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 px-4 sm:px-0">
              Get started with your Apify API key and experience the easiest way 
              to run actors with dynamic schema loading and real-time results.
            </p>
            
            <ScaleSection delay={200}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
                <Button 
                  size="lg" 
                  className="glass-button text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto w-full sm:w-auto hover:scale-105 transition-all duration-200 hover:shadow-xl hover:shadow-primary/20"
                  onClick={onGetStarted}
                >
                  <Key className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  Start Free Today
                </Button>
              </div>
            </ScaleSection>
            
            <AnimatedSection animation="fade-up" delay={400}>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground px-4 sm:px-0">
                <div className="flex items-center gap-2 hover:text-primary transition-colors duration-200">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Open source project
                </div>
                <div className="flex items-center gap-2 hover:text-primary transition-colors duration-200">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Just bring your Apify API key
                </div>
              </div>
            </AnimatedSection>
          </FadeUpSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}