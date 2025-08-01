import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Play, User, Globe } from 'lucide-react';
import { AnimatedSection, FadeUpSection, StaggeredSection } from '@/components/AnimatedSection';
import { usePageLoadAnimation } from '@/hooks/useScrollAnimation';

interface Actor {
  id: string;
  name: string;
  title: string;
  description: string;
  username: string;
  currentVersionNumber: string;
  stats?: {
    totalRuns: number;
  };
}

interface ActorListProps {
  actors: Actor[];
  onActorSelect: (actor: Actor) => void;
  isLoading?: boolean;
}

export function ActorList({ actors, onActorSelect, isLoading }: ActorListProps) {
  const isPageLoaded = usePageLoadAnimation(300);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredActors = actors.filter(actor =>
    actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    actor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    actor.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className={`inline-flex items-center gap-2 text-muted-foreground transition-all duration-1000 ease-out ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Loading your actors...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <FadeUpSection className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            Your Actors
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground px-4 sm:px-0">
            Select an actor to explore its schema and run executions
          </p>
        </FadeUpSection>

        <FadeUpSection className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search actors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-input h-11 sm:h-12 text-sm sm:text-base"
            />
          </div>
        </FadeUpSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredActors.map((actor, index) => (
            <StaggeredSection key={actor.id} delay={index * 100}>
              <Card 
                className="group cursor-pointer transition-all duration-300 glass-card hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-primary/10"
                onClick={() => onActorSelect(actor)}
              >
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 w-full">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex-shrink-0">
                        <Play className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-lg group-hover:text-primary transition-colors leading-tight">
                          {actor.title}
                        </CardTitle>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mt-1">
                          <User className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{actor.username}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <CardDescription className="mb-4 text-sm sm:text-base line-clamp-3 leading-relaxed">
                    {actor.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Globe className="w-3 h-3" />
                      <span>v{actor.currentVersionNumber}</span>
                    </div>
                    <Button 
                      variant="glass" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onActorSelect(actor);
                      }}
                      className="hover:scale-105 transition-all duration-200 hover:shadow-md hover:shadow-primary/20 opacity-100 sm:opacity-0 group-hover:opacity-100 text-xs sm:text-sm px-3 sm:px-4"
                    >
                      Select
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </StaggeredSection>
          ))}
        </div>

        {filteredActors.length === 0 && (
          <FadeUpSection className="text-center py-12">
            <p className="text-sm sm:text-base text-muted-foreground">
              No actors found matching your search.
            </p>
          </FadeUpSection>
        )}
      </div>
    </div>
  );
}