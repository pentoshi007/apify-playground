import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Confirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        if (!token_hash || !type) {
          throw new Error('Missing confirmation parameters');
        }

        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
        });

        if (error) {
          throw error;
        }

        setStatus('success');
        setMessage('Your email has been confirmed successfully!');
        
        toast({
          title: 'Email confirmed!',
          description: 'Your account has been verified successfully.',
        });

        // Redirect to home page after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);

      } catch (error: any) {
        console.error('Email confirmation error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to confirm email. Please try again.');
        
        toast({
          title: 'Confirmation failed',
          description: error.message || 'Failed to confirm your email.',
          variant: 'destructive',
        });
      }
    };

    confirmEmail();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4">
      <Card className="w-full max-w-md glass-card border-border/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            {status === 'loading' && (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-8 w-8 text-green-500" />
            )}
            {status === 'error' && (
              <XCircle className="h-8 w-8 text-red-500" />
            )}
          </div>
          <CardTitle className="text-xl">
            {status === 'loading' && 'Confirming Email...'}
            {status === 'success' && 'Email Confirmed!'}
            {status === 'error' && 'Confirmation Failed'}
          </CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'success' && (
            <p className="text-sm text-muted-foreground mb-4">
              Redirecting you to the homepage in a few seconds...
            </p>
          )}
          <Button 
            onClick={() => navigate('/')}
            className="w-full"
            variant={status === 'error' ? 'outline' : 'default'}
          >
            {status === 'error' ? 'Try Again' : 'Go to Homepage'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
