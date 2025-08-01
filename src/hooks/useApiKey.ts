import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

export function useApiKey(user: User | null) {
  const [apiKey, setApiKey] = useState<string>('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadApiKey();
    } else {
      setApiKey('');
      setHasApiKey(false);
    }
  }, [user]);

  const loadApiKey = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('api_key_encrypted')
        .eq('user_id', user.id)
        .eq('service', 'apify')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setApiKey(data.api_key_encrypted);
        setHasApiKey(true);
      }
    } catch (error) {
      console.error('Error loading API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = async (newApiKey: string) => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('api_keys')
        .upsert({
          user_id: user.id,
          service: 'apify',
          api_key_encrypted: newApiKey,
        });

      if (error) throw error;

      setApiKey(newApiKey);
      setHasApiKey(true);
      
      toast({
        title: 'API key saved',
        description: 'Your Apify API key has been saved securely.',
      });

      return true;
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: 'Error saving API key',
        description: 'Failed to save your API key. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearApiKey = async () => {
    if (!user) return;

    try {
      await supabase
        .from('api_keys')
        .delete()
        .eq('user_id', user.id)
        .eq('service', 'apify');

      setApiKey('');
      setHasApiKey(false);
      
      toast({
        title: 'API key removed',
        description: 'Your Apify API key has been removed.',
      });
    } catch (error) {
      console.error('Error removing API key:', error);
    }
  };

  return {
    apiKey,
    hasApiKey,
    loading,
    saveApiKey,
    clearApiKey,
    refreshApiKey: loadApiKey,
  };
}