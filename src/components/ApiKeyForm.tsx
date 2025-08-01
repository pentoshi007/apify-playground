import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, ArrowRight } from 'lucide-react';

interface ApiKeyFormProps {
  onApiKeySubmit: (apiKey: string) => void;
  isLoading?: boolean;
}

export function ApiKeyForm({ onApiKeySubmit, isLoading }: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="flex items-center justify-center p-8 pt-24">
      <div className="w-full max-w-md">
        <Card className="glass-card">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
              <Key className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Connect Your API Key
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your Apify API key to access and execute actors from your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter your Apify API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="text-center glass-input"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full glass-button" 
                disabled={!apiKey.trim() || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connecting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Connect to Apify
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}