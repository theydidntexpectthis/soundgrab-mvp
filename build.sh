#!/bin/bash

# Navigate to the client directory
cd client

# Install dependencies
npm install

# Build the project
npm run build

# Return to the root directory
cd ..

# Copy the built files to the expected location
mkdir -p dist
cp -r client/dist/* dist/
