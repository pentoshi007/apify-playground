#!/usr/bin/env node

/**
 * Setup script for environment variables
 * This script helps configure the production URL for email verification
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Apify Actor Playground - Environment Setup\n');

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupEnvironment() {
  console.log('This script will help you set up environment variables for production deployment.\n');
  
  const productionUrl = await question('Enter your production URL (e.g., https://your-app.netlify.app): ');
  
  if (!productionUrl) {
    console.log('❌ Production URL is required for email verification to work properly.');
    process.exit(1);
  }
  
  // Validate URL format
  try {
    new URL(productionUrl);
  } catch (error) {
    console.log('❌ Invalid URL format. Please enter a valid URL starting with http:// or https://');
    process.exit(1);
  }
  
  const envContent = `# Environment variables for Apify Actor Playground

# Production URL for email verification redirects
VITE_PRODUCTION_URL=${productionUrl}

# Development settings
# The app will automatically use localhost:5173 in development mode
`;
  
  const envPath = path.join(process.cwd(), '.env');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log(`✅ Environment file created at: ${envPath}`);
    console.log(`✅ Production URL set to: ${productionUrl}`);
    console.log('\n📝 Next steps:');
    console.log('1. Add .env to your .gitignore file if not already present');
    console.log('2. Set the VITE_PRODUCTION_URL environment variable in your deployment platform');
    console.log('3. Deploy your application');
  } catch (error) {
    console.error('❌ Error creating environment file:', error.message);
    process.exit(1);
  }
}

setupEnvironment().finally(() => {
  rl.close();
});