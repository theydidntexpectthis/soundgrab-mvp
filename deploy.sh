#!/bin/bash

# SoundGrab Fly.io Deployment Script

echo "🚀 Starting SoundGrab deployment to Fly.io..."

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null && ! command -v fly &> /dev/null; then
    echo "❌ Fly CLI not found. Please install it first:"
    echo "   brew install flyctl"
    echo "   or visit: https://fly.io/docs/getting-started/installing-flyctl/"
    exit 1
fi

# Use flyctl or fly command
FLY_CMD="flyctl"
if command -v fly &> /dev/null; then
    FLY_CMD="fly"
fi

echo "✅ Fly CLI found: $FLY_CMD"

# Check if user is authenticated
if ! $FLY_CMD auth whoami &> /dev/null; then
    echo "🔐 Please authenticate with Fly.io:"
    $FLY_CMD auth login
fi

# Check if app exists, if not create it
if ! $FLY_CMD apps list | grep -q "soundgrab"; then
    echo "📱 Creating Fly.io app..."
    $FLY_CMD apps create soundgrab
else
    echo "✅ App 'soundgrab' already exists"
fi

# Deploy the application
echo "🚀 Deploying to Fly.io..."
$FLY_CMD deploy

# Show deployment status
echo "📊 Deployment status:"
$FLY_CMD status

echo "🎉 Deployment complete!"
echo "🌐 Your app should be available at: https://soundgrab.fly.dev"
echo "📝 View logs with: $FLY_CMD logs"