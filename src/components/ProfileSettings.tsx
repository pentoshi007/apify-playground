import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useApiKey } from '@/hooks/useApiKey';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, User as UserIcon, Settings, Save, Key, Eye, EyeOff, Trash2 } from 'lucide-react';

interface ProfileSettingsProps {
  user: User;
  onBack: () => void;
}

export function ProfileSettings({ user, onBack }: ProfileSettingsProps) {
  const [profile, setProfile] = useState({
    full_name: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [isUpdatingApiKey, setIsUpdatingApiKey] = useState(false);
  const { toast } = useToast();
  const { apiKey, hasApiKey, saveApiKey, clearApiKey } = useApiKey(user);

  const fetchProfile = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, username')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, username')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          username: profile.username,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApiKey = async () => {
    if (!newApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingApiKey(true);
    try {
      const success = await saveApiKey(newApiKey);
      if (success) {
        setNewApiKey('');
        toast({
          title: "API Key Updated",
          description: "Your Apify API key has been updated successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingApiKey(false);
    }
  };

  const handleRemoveApiKey = async () => {
    setIsUpdatingApiKey(true);
    try {
      await clearApiKey();
      toast({
        title: "API Key Removed",
        description: "Your Apify API key has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingApiKey(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <UserIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Profile & Settings</h1>
              <p className="text-muted-foreground">Manage your account preferences</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your profile information and how others see you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user.email || ''}
                      disabled
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Enter username"
                      value={profile.username}
                      onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={profile.full_name}
                    onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={saveProfile} 
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and security settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* API Key Management */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Key className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">API Key Management</h3>
                  </div>
                  
                  <div className="p-4 border border-border/50 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Apify API Key</h4>
                        <p className="text-sm text-muted-foreground">
                          {hasApiKey ? 'Your API key is configured' : 'No API key configured'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasApiKey && (
                          <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">
                            Connected
                          </div>
                        )}
                      </div>
                    </div>

                    {hasApiKey && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Input
                            type={showApiKey ? "text" : "password"}
                            value={showApiKey ? apiKey || '' : '••••••••••••••••'}
                            disabled
                            className="bg-muted/50 font-mono text-sm"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="px-3"
                          >
                            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label htmlFor="newApiKey">
                        {hasApiKey ? 'Update API Key' : 'Add API Key'}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="newApiKey"
                          type="password"
                          placeholder="Enter your Apify API key"
                          value={newApiKey}
                          onChange={(e) => setNewApiKey(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleUpdateApiKey}
                          disabled={isUpdatingApiKey || !newApiKey.trim()}
                          className="flex items-center gap-2"
                        >
                          <Key className="w-4 h-4" />
                          {isUpdatingApiKey ? 'Updating...' : hasApiKey ? 'Update' : 'Add'}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Your API key is encrypted and stored securely. Get your API key from{' '}
                        <a
                          href="https://console.apify.com/account/integrations"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Apify Console
                        </a>
                      </p>
                    </div>

                    {hasApiKey && (
                      <div className="pt-3 border-t border-border/50">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleRemoveApiKey}
                          disabled={isUpdatingApiKey}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove API Key
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Account Information</h3>
                  
                  <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Account Status</h4>
                      <p className="text-sm text-muted-foreground">
                        Your account is active and verified
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm">
                      Active
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Member Since</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Last Sign In</h4>
                      <p className="text-sm text-muted-foreground">
                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}