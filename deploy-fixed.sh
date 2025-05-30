#!/bin/bash

echo "🚀 SoundGrab Integration Fix Deployment"
echo "======================================"

# Build the client with production environment
echo "📦 Building client with production environment..."
cd client
npm run build
cd ..

# Build the server
echo "🔧 Building server..."
npm run build:server

# Deploy to Fly.io with environment variables
echo "🌐 Deploying to Fly.io..."
fly deploy

echo "✅ Deployment complete!"
echo ""
echo "🔍 To test the fix:"
echo "1. Visit https://soundgrab.fly.dev"
echo "2. Try searching for a song"
echo "3. Check browser console for debug logs"
echo ""
echo "🐛 If issues persist, check logs with:"
echo "fly logs"