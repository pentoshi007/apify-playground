import { useState, useEffect, useCallback } from 'react';
import { ApiKeyForm } from '@/components/ApiKeyForm';
import { ActorList } from '@/components/ActorList';
import { ActorRunner } from '@/components/ActorRunner';
import { AuthPage } from '@/components/AuthPage';
import { Navbar } from '@/components/Navbar';
import { Landing } from '@/pages/Landing';
import { ProfileSettings } from '@/components/ProfileSettings';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useApiKey } from '@/hooks/useApiKey';
import { useToast } from '@/hooks/use-toast';
import { createApifyService } from '@/services/apifyApi';

interface Actor {
  id: string;
  name: string;
  title: string;
  description: string;
  username: string;
  currentVersionNumber: string;
  version: string;
  stats?: {
    totalRuns: number;
  };
}

interface ActorSchema {
  properties: Record<string, {
    title?: string;
    description?: string;
    type: string;
    default?: string | number | boolean;
    example?: string | number | boolean;
    enum?: string[];
  }>;
  required?: string[];
}

interface RunResult {
  status: string;
  data?: Record<string, unknown>;
  error?: string;
}

type AppState = 'landing' | 'auth' | 'api-key' | 'actor-list' | 'actor-runner' | 'profile-settings';
type AuthTab = 'signin' | 'signup' | 'tryNow';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { apiKey, hasApiKey, saveApiKey } = useApiKey(user);
  
  const [state, setState] = useState<AppState>('landing');
  const [actors, setActors] = useState<Actor[]>([]);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [actorSchema, setActorSchema] = useState<ActorSchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [guestApiKey, setGuestApiKey] = useState<string>('');
  const [authTab, setAuthTab] = useState<AuthTab>('signin');
  const { toast } = useToast();

  const loadActors = useCallback(async (userApiKey: string) => {
    setIsLoading(true);
    try {
      const apifyService = createApifyService(userApiKey);
      const fetchedActors = await apifyService.getActors();
      
      // Map ApifyActor to Actor interface
      const mappedActors: Actor[] = fetchedActors.map(actor => ({
        id: actor.id,
        name: actor.name,
        title: actor.title,
        description: actor.description,
        username: actor.username,
        currentVersionNumber: actor.currentVersionNumber,
        version: actor.currentVersionNumber, // Map currentVersionNumber to version
        stats: actor.stats
      }));
      
      setActors(mappedActors);
      setState('actor-list');
      toast({
        title: 'Actors loaded successfully',
        description: `Found ${fetchedActors.length} actors in your account.`,
      });
    } catch (error) {
      console.error('Failed to load actors:', error);
      toast({
        title: 'Failed to load actors',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
      // If loading actors fails, go back to API key form
      setState('api-key');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (user && hasApiKey && apiKey) {
      loadActors(apiKey);
    } else if (user && !hasApiKey) {
      setState('api-key');
    }
  }, [user, hasApiKey, apiKey, loadActors]);



  const handleGetStarted = () => {
    setState('auth');
  };

  const handleAuthSuccess = () => {
    // Will be handled by useEffect when user state changes
  };

  const handleGuestAccess = async (apiKey: string) => {
    setGuestApiKey(apiKey);
    await loadActors(apiKey);
    toast({
      title: 'Guest access granted',
      description: 'You can now explore actors. Sign up to save your progress!',
    });
  };

  const handleApiKeySubmit = async (key: string) => {
    setIsLoading(true);
    try {
      // Validate API key with Apify API
      const apifyService = createApifyService(key);
      const isValid = await apifyService.validateApiKey();
      
      if (!isValid) {
        throw new Error('Invalid API key. Please check your API key and try again.');
      }

      if (user) {
        // Authenticated user - save the API key
        const success = await saveApiKey(key);
        if (success) {
          await loadActors(key);
        }
      } else {
        // Guest mode - just load actors
        setGuestApiKey(key);
        await loadActors(key);
      }
    } catch (error) {
      toast({
        title: 'Connection failed',
        description: error instanceof Error ? error.message : 'Failed to validate API key.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setGuestApiKey('');
    setState('landing');
    setActors([]);
    setSelectedActor(null);
    setActorSchema(null);
  };

  const handleActorSelect = async (actor: Actor) => {
    setIsLoading(true);
    try {
      const currentApiKey = user ? apiKey : guestApiKey;
      if (!currentApiKey) {
        throw new Error('No API key available');
      }

      const apifyService = createApifyService(currentApiKey);
      const schema = await apifyService.getActorSchema(actor.id);
      
      setSelectedActor(actor);
      setActorSchema(schema);
      setState('actor-runner');
      
      toast({
        title: 'Schema loaded successfully',
        description: `Loaded input schema for ${actor.title}`,
      });
    } catch (error) {
      console.error('Failed to load actor schema:', error);
      toast({
        title: 'Schema loading failed',
        description: error instanceof Error ? error.message : 'Could not load actor schema. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleActorRun = async (inputs: Record<string, string | number | boolean>): Promise<RunResult> => {
    try {
      const currentApiKey = user ? apiKey : guestApiKey;
      if (!currentApiKey || !selectedActor) {
        throw new Error('No API key or actor selected');
      }

      const apifyService = createApifyService(currentApiKey);
      
      // Start the actor run
      const run = await apifyService.runActor(selectedActor.id, inputs);
      
      // Wait for the run to complete (with a timeout)
      const completedRun = await apifyService.waitForRun(selectedActor.id, run.id);
      
      // Get the results if the run succeeded
      let data: Record<string, unknown> = {
        itemsCount: completedRun.stats.itemsCount,
        requestsCount: completedRun.stats.requestsCount,
        runId: completedRun.id,
        runTime: completedRun.finishedAt ? 
          new Date(completedRun.finishedAt).getTime() - new Date(completedRun.startedAt).getTime() : 0
      };
      
      if (completedRun.status === 'SUCCEEDED' && completedRun.defaultDatasetId) {
        try {
          const results = await apifyService.getRunResults(completedRun.defaultDatasetId, completedRun.stats.itemsCount);
          data = {
            ...data,
            datasetId: completedRun.defaultDatasetId,
            results: results.slice(0, 10) // Limit to first 10 items for display
          };
        } catch (resultsError) {
          console.warn('Failed to fetch results, but run completed successfully:', resultsError);
          data = {
            ...data,
            datasetId: completedRun.defaultDatasetId,
            message: 'Run completed successfully, but results could not be retrieved.'
          };
        }
      }

      return {
        status: completedRun.status.toLowerCase(),
        data
      };
    } catch (error) {
      console.error('Actor run failed:', error);
      return {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred during actor execution'
      };
    }
  };

  const handleBack = () => {
    if (state === 'actor-runner') {
      setState('actor-list');
      setSelectedActor(null);
      setActorSchema(null);
    } else if (state === 'profile-settings') {
      setState('actor-list');
    }
  };

  const handleProfileSettings = () => {
    setState('profile-settings');
  };

  const handleAuthClick = (tab: AuthTab) => {
    setAuthTab(tab);
    setState('auth');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <div className="w-12 h-12 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <div className="text-sm text-muted-foreground animate-bounce">Loading your workspace...</div>
        </div>
      </div>
    );
  }

  if (state === 'landing') {
    return (
      <div className="animate-in fade-in duration-500">
        <Landing onGetStarted={handleGetStarted} onAuthClick={handleAuthClick} />
      </div>
    );
  }

  if (state === 'auth') {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <AuthPage 
          onAuthSuccess={handleAuthSuccess} 
          onGuestAccess={handleGuestAccess}
          defaultTab={authTab}
          onAuthClick={handleAuthClick}
        />
      </div>
    );
  }

  const renderContent = () => {
    const baseAnimation = "animate-in fade-in slide-in-from-bottom-4 duration-500";
    
    if (state === 'api-key') {
      return (
        <div className={baseAnimation}>
          <ApiKeyForm onApiKeySubmit={handleApiKeySubmit} isLoading={isLoading} />
        </div>
      );
    }

    if (state === 'actor-list') {
      return (
        <div className={baseAnimation}>
          <ActorList actors={actors} onActorSelect={handleActorSelect} isLoading={isLoading} />
        </div>
      );
    }

    if (state === 'actor-runner' && selectedActor && actorSchema) {
      return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <ActorRunner
            actor={selectedActor}
            schema={actorSchema}
            onBack={handleBack}
            onRun={handleActorRun}
          />
        </div>
      );
    }

    if (state === 'profile-settings' && user) {
      return (
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
          <ProfileSettings user={user} onBack={handleBack} />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        user={user} 
        onSignOut={handleSignOut} 
        onProfileSettings={handleProfileSettings}
        onAuthClick={handleAuthClick}
      />
      <div className="flex-1 pt-24">
        {renderContent()}
      </div>
      <Footer />
    </div>
  );
};

export default Index;