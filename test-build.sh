#!/bin/bash

echo "🧪 Testing local build before deployment..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client && npm install && cd ..

# Test client build
echo "🏗️ Testing client build..."
cd client && npm run build && cd ..

# Test production server
echo "🚀 Testing production server..."
node server/prod-server.js &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

# Test if server is responding
echo "🔍 Testing server response..."
curl -s http://localhost:5000/api/health || echo "Server test failed"

# Kill the test server
kill $SERVER_PID

echo "✅ Build test completed!"