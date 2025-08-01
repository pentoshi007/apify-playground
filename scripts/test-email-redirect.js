#!/usr/bin/env node

/**
 * Test script to verify email redirect URL configuration
 */

// Simulate different environments
const testEnvironments = [
  { name: 'Development', env: { DEV: true, VITE_PRODUCTION_URL: undefined } },
  { name: 'Production with env var', env: { DEV: false, VITE_PRODUCTION_URL: 'https://apify-playground.vercel.app' } },
  { name: 'Production without env var', env: { DEV: false, VITE_PRODUCTION_URL: undefined } }
];

console.log('🧪 Testing Email Redirect URL Configuration\n');

// Mock the getEmailRedirectUrl function logic
function getEmailRedirectUrl(env) {
  if (env.DEV) {
    return 'http://localhost:5173/';
  }
  
  const productionUrl = env.VITE_PRODUCTION_URL || 'https://apify-playground.vercel.app';
  const cleanUrl = productionUrl.endsWith('/') ? productionUrl : `${productionUrl}/`;
  
  try {
    new URL(cleanUrl);
    return cleanUrl;
  } catch (error) {
    console.error('Invalid production URL:', productionUrl);
    return 'https://apify-playground.vercel.app/';
  }
}

// Test each environment
testEnvironments.forEach(({ name, env }) => {
  const redirectUrl = getEmailRedirectUrl(env);
  console.log(`📋 ${name}:`);
  console.log(`   Environment: DEV=${env.DEV}, VITE_PRODUCTION_URL=${env.VITE_PRODUCTION_URL || 'undefined'}`);
  console.log(`   Redirect URL: ${redirectUrl}`);
  console.log('');
});

console.log('✅ Email redirect URL configuration test completed!');
console.log('\n📝 Next steps:');
console.log('1. Deploy to Vercel with the updated code');
console.log('2. Set VITE_PRODUCTION_URL=https://apify-playground.vercel.app in Vercel environment variables');
console.log('3. Test email verification by signing up a new user');
console.log('4. Verify the email link redirects to https://apify-playground.vercel.app/ instead of localhost');