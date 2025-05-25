#!/bin/bash

echo "🚀 Starting Vercel deployment preparation for Soundgrab..."

# Make sure we're in the project root
cd "$(dirname "$0")"

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Build the project
echo "🏗️ Building project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
  echo "❌ Build failed! Check for errors above."
  exit 1
fi

echo "✅ Build successful! Ready for Vercel deployment."
echo "Run 'vercel' command to deploy or use the Vercel GitHub integration."
echo "Make sure you've installed Vercel CLI with: npm install -g vercel"
