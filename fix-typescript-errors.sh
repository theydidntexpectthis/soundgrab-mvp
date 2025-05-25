#!/bin/bash

# Script to fix TypeScript errors by installing missing type definitions

echo "Installing missing TypeScript type definitions..."

# Install @types/node if not already installed
if ! npm list @types/node >/dev/null 2>&1; then
  echo "Installing @types/node..."
  npm install --save-dev @types/node
else
  echo "@types/node is already installed."
fi

# Check if vite is installed and install its types if needed
if npm list vite >/dev/null 2>&1; then
  echo "Vite is installed, ensuring types are available..."
  # Vite's types are included in the package, but let's make sure
  npm install --save-dev vite
else
  echo "Vite is not installed, installing it with types..."
  npm install --save-dev vite
fi

# Check for other common missing types
echo "Checking for other common missing types..."

# React types
if ! npm list @types/react >/dev/null 2>&1; then
  echo "Installing @types/react..."
  npm install --save-dev @types/react
fi

# React DOM types
if ! npm list @types/react-dom >/dev/null 2>&1; then
  echo "Installing @types/react-dom..."
  npm install --save-dev @types/react-dom
fi

echo "Clearing TypeScript cache..."
rm -rf ./node_modules/typescript/tsbuildinfo

echo "TypeScript errors should now be fixed. Restart your IDE or TypeScript server if errors persist."