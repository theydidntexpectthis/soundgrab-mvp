#!/bin/bash

echo "🔍 Checking for outdated dependencies in all package.json files..."

# Update main package.json
echo "📦 Updating main package.json..."
if grep -q "\"puppeteer\": \"\\^21" package.json; then
  sed -i '' 's/"puppeteer": "\^21[0-9.]*"/"puppeteer": "\^22.8.2"/g' package.json
  echo "✅ Updated puppeteer in main package.json"
else
  echo "✅ Main package.json already has correct puppeteer version"
fi

# Update test-package.json
echo "📦 Updating test-package.json..."
if grep -q "\"puppeteer\": \"\\^21" test-package.json; then
  sed -i '' 's/"puppeteer": "\^21[0-9.]*"/"puppeteer": "\^22.8.2"/g' test-package.json
  echo "✅ Updated puppeteer in test-package.json"
else
  echo "✅ test-package.json already has correct puppeteer version"
fi

# Check for any other package.json files in subdirectories
echo "🔍 Checking for other package.json files..."
find . -name "package.json" -not -path "./package.json" -not -path "./test-package.json" -not -path "./client/package.json" -not -path "./node_modules/*" | while read -r file; do
  echo "📦 Checking $file..."
  if grep -q "\"puppeteer\": \"\\^21" "$file"; then
    sed -i '' 's/"puppeteer": "\^21[0-9.]*"/"puppeteer": "\^22.8.2"/g' "$file"
    echo "✅ Updated puppeteer in $file"
  else
    echo "✅ $file does not need updating"
  fi
done

# Update package-lock.json if it exists
if [ -f "package-lock.json" ]; then
  echo "🔄 Running npm install to update package-lock.json..."
  npm install puppeteer@^22.8.2 --save
  echo "✅ Updated package-lock.json"
fi

echo "✨ All done! All package.json files should now use puppeteer ^22.8.2"
