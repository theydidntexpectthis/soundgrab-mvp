#!/bin/bash

echo "🛠️ Fixing TailwindCSS configuration for Vercel deployment..."

# Make sure we're in the project root
cd "$(dirname "$0")"

# Install tailwindcss in the root directory
echo "📦 Installing TailwindCSS in root directory..."
npm install --save-dev tailwindcss postcss autoprefixer

# Copy the postcss.config.js to the client directory
echo "🔧 Setting up PostCSS configuration in client directory..."
cp postcss.config.js client/

# Install tailwindcss in the client directory
echo "📦 Installing TailwindCSS in client directory..."
cd client
npm install --save-dev tailwindcss postcss autoprefixer

# Create a tailwind.config.js in the client directory if it doesn't exist
if [ ! -f "tailwind.config.js" ]; then
  echo "🔧 Creating TailwindCSS configuration in client directory..."
  cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOL
fi

# Create a postcss.config.js in the client directory if it doesn't exist
if [ ! -f "postcss.config.js" ]; then
  echo "🔧 Creating PostCSS configuration in client directory..."
  cat > postcss.config.js << 'EOL'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOL
fi

echo "✅ TailwindCSS configuration fixed successfully!"
