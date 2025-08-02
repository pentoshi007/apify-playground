import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vzatbklruxmuwfgllwum.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6YXRia2xydXhtdXdmZ2xsd3VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNTI5NzQsImV4cCI6MjA2OTYyODk3NH0.78MMG7wjWnhnNhiLNT8fTcWVJEvtniU3ZAfA04LBHmg";

// Function to get the correct redirect URL for email verification
export const getEmailRedirectUrl = (): string => {
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    // In development, use localhost with the correct port
    return 'http://localhost:5173/';
  }
  
  // In production, use the actual deployed URL
  // You can set this via environment variable or use the current origin
  const productionUrl = import.meta.env.VITE_PRODUCTION_URL || window.location.origin;
  
  // Ensure the URL ends with a slash
  const cleanUrl = productionUrl.endsWith('/') ? productionUrl : `${productionUrl}/`;
  
  // Validate the URL format
  try {
    new URL(cleanUrl);
    return cleanUrl;
  } catch (error) {
    console.error('Invalid production URL:', productionUrl);
    // Fallback to current origin if the production URL is invalid
    return `${window.location.origin}/`;
  }
};

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});