# Email Verification Fix - Vercel Deployment Guide

## 🚨 Issue Fixed

**Problem**: Email verification links were redirecting to `localhost:8080` instead of the production URL, causing "connection refused" errors.

**Solution**: Updated the email verification redirect URL to use the correct production URL for Vercel deployment.

## ✅ Changes Made

### 1. Updated Supabase Client Configuration
- **File**: `src/integrations/supabase/client.ts`
- **Change**: Added `getEmailRedirectUrl()` function that properly handles development vs production URLs
- **Result**: Email verification now redirects to `https://apify-playground.vercel.app/` in production

### 2. Fixed AuthPage Component
- **File**: `src/components/AuthPage.tsx`
- **Change**: Replaced hardcoded `window.location.origin` with `getEmailRedirectUrl()`
- **Result**: Signup process now uses the correct redirect URL

### 3. Environment Configuration
- **File**: `.env`
- **Change**: Set `VITE_PRODUCTION_URL=https://apify-playground.vercel.app`
- **Result**: Production URL is properly configured

## 🚀 Deployment Steps

### Step 1: Deploy Updated Code
```bash
# Commit and push your changes
git add .
git commit -m "Fix email verification redirect URL for Vercel deployment"
git push origin main
```

### Step 2: Set Environment Variable in Vercel
1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `apify-playground`
3. Go to **Settings** → **Environment Variables**
4. Add a new environment variable:
   - **Name**: `VITE_PRODUCTION_URL`
   - **Value**: `https://apify-playground.vercel.app`
   - **Environment**: Production (and Preview if needed)
5. Click **Save**

### Step 3: Redeploy (if needed)
- Vercel should automatically redeploy when you push changes
- If not, trigger a manual redeploy from the Vercel dashboard

## 🧪 Testing the Fix

### Test Email Verification
1. Go to https://apify-playground.vercel.app/
2. Click "Sign Up" and create a new account
3. Check your email for the verification link
4. Click the verification link
5. **Expected Result**: You should be redirected to `https://apify-playground.vercel.app/` instead of `localhost:8080`

### Run Test Script
```bash
npm run test:email-redirect
```

This will show you the expected redirect URLs for different environments.

## 🔧 Configuration Details

### Development Environment
- **URL**: `http://localhost:5173/`
- **Behavior**: Uses localhost for development testing

### Production Environment
- **URL**: `https://apify-playground.vercel.app/`
- **Behavior**: Uses the configured production URL

### Fallback Behavior
- If `VITE_PRODUCTION_URL` is not set, falls back to `window.location.origin`
- Includes URL validation to prevent invalid redirects

## 📋 Verification Checklist

- [ ] Code changes committed and pushed
- [ ] Environment variable set in Vercel dashboard
- [ ] Application deployed successfully
- [ ] Email verification link redirects to production URL
- [ ] No more "connection refused" errors
- [ ] Development environment still works correctly

## 🆘 Troubleshooting

### If email verification still doesn't work:
1. **Check Environment Variable**: Verify `VITE_PRODUCTION_URL` is set correctly in Vercel
2. **Clear Browser Cache**: Clear cache and cookies for the domain
3. **Check Supabase Settings**: Ensure Supabase project is configured correctly
4. **Test with New Account**: Try signing up with a new email address

### If you need to change the production URL:
1. Update the `VITE_PRODUCTION_URL` environment variable in Vercel
2. Update the `.env` file locally
3. Redeploy the application

## 📞 Support

If you continue to experience issues:
1. Check the browser console for any JavaScript errors
2. Verify the Supabase project configuration
3. Test the email verification flow in an incognito/private browser window