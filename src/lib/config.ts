/**
 * Configuration utilities for the application
 */

/**
 * Get the base URL for the application
 * Uses environment variable VITE_SITE_URL in production, falls back to window.location.origin
 */
export function getBaseUrl(): string {
  // In production, use the environment variable
  if (import.meta.env.PROD && import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL;
  }
  
  // In development or if no environment variable is set, use window.location.origin
  return window.location.origin;
}

/**
 * Get the redirect URL for authentication flows (email verification, password reset, etc.)
 */
export function getAuthRedirectUrl(path: string = '/'): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}`;
}