#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting full project build...');

try {
  // Step 1: Install root dependencies
  console.log('📦 Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Step 2: Install client dependencies
  console.log('📦 Installing client dependencies...');
  execSync('cd client && npm install', { stdio: 'inherit' });

  // Step 3: Build client
  console.log('🏗️ Building client...');
  execSync('cd client && npm run build', { stdio: 'inherit' });

  // Step 4: Compile server TypeScript
  console.log('🏗️ Compiling server TypeScript...');
  execSync('npx tsc --project server/tsconfig.json', { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
  console.log('📁 Client build output: client/dist/');
  console.log('📁 Server build output: server/dist/');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}