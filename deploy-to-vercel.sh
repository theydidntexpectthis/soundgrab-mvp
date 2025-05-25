#!/bin/bash

# Script to deploy the project to Vercel

echo "===== Vercel Deployment Script ====="
echo "This script will deploy the project to Vercel"
echo

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Installing..."
    npm install -g vercel
else
    echo "Vercel CLI is already installed."
fi

# Step 1: Build the project
echo
echo "Step 1: Building the project..."
npm run build

# Step 2: Run tests before deployment
echo
echo "Step 2: Running tests before deployment..."
./run-all-tests.sh
if [ $? -ne 0 ]; then
    echo "Tests failed. Aborting deployment."
    echo "Fix the issues and try again."
    exit 1
fi

# Step 3: Deploy to Vercel
echo
echo "Step 3: Deploying to Vercel..."
echo "You may be prompted to log in if this is your first time using Vercel CLI."

# Deploy to preview environment first
echo "Deploying to preview environment..."
vercel

# Ask if user wants to deploy to production
echo
read -p "Do you want to deploy to production? (y/n): " deploy_prod
if [[ $deploy_prod == "y" || $deploy_prod == "Y" ]]; then
    echo "Deploying to production..."
    vercel --prod
else
    echo "Skipping production deployment."
fi

echo
echo "===== Deployment Complete ====="
echo "Your project is now deployed to Vercel."
echo
echo "Next steps:"
echo "1. Set up monitoring for your mining pool"
echo "2. Optimize mining parameters based on performance"
echo "3. Monitor detection rates and adjust stealth settings as needed"