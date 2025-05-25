#!/bin/bash

echo "🧹 Starting complete puppeteer dependency cleanup..."

# Remove node_modules and package-lock.json
echo "🗑️ Removing node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

# Check and update all package.json files
echo "🔍 Checking all package.json files for puppeteer references..."
find . -name "package.json" -not -path "*/node_modules/*" | while read -r file; do
  echo "📄 Checking $file..."
  if grep -q "\"puppeteer\":" "$file"; then
    echo "🔧 Updating puppeteer in $file..."
    # Use perl for more reliable JSON editing
    perl -i -pe 's/"puppeteer": "\^?[0-9]+\.[0-9]+\.[0-9]+"/"puppeteer": "^22.8.2"/g' "$file"
    echo "✅ Updated $file"
  fi
done

# Clean npm cache
echo "🧹 Cleaning npm cache..."
npm cache clean --force

# Reinstall dependencies
echo "📦 Reinstalling dependencies with correct puppeteer version..."
npm install puppeteer@^22.8.2 --save
npm install

echo "✨ Cleanup complete! All puppeteer references should now be version 22.8.2 or higher."
