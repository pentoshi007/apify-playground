# Email Verification Fix

## Problem
When users clicked email verification links, they were being redirected to `localhost:8080` instead of the production domain, causing connection errors.

## Root Cause
The `emailRedirectTo` URL in the Supabase auth signup was using `window.location.origin`, which resolves to `localhost:8080` during development but should use the production domain in production.

## Solution
1. **Environment Variable**: Added `VITE_SITE_URL` environment variable to specify the production domain
2. **Configuration Utility**: Created `src/lib/config.ts` with utility functions to handle base URL logic
3. **Updated AuthPage**: Modified the signup function to use the new configuration utility

## Files Changed
- `src/components/AuthPage.tsx` - Updated to use `getAuthRedirectUrl()` utility
- `src/lib/config.ts` - New configuration utility file
- `.env` - Environment variable for production URL
- `.env.example` - Example environment file
- `README.md` - Updated with setup instructions

## Configuration
1. Set the `VITE_SITE_URL` environment variable to your production domain:
   ```env
   VITE_SITE_URL=https://your-production-domain.com
   ```

2. The application will automatically use this URL for email verification links in production, while falling back to `window.location.origin` in development.

## Testing
- In development: Email verification links will point to `localhost:5173`
- In production: Email verification links will point to your production domain

## Benefits
- ✅ Email verification links work correctly in production
- ✅ No more localhost connection errors
- ✅ Maintains development functionality
- ✅ Centralized configuration for future auth flows