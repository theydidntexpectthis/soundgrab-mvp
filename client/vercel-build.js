#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Vercel build process...');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Create assets directory
const assetsDir = path.join(distDir, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create a simple index.html file
fs.writeFileSync(path.join(distDir, 'index.html'), `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Soundgrab</title>
  <link rel="stylesheet" href="/assets/index.css">
  <script src="/assets/index.js" defer></script>
</head>
<body>
  <div class="container">
    <h1>Soundgrab</h1>
    <p>Your application is being deployed. The full version will be available soon.</p>
    <p>This is a temporary landing page while we resolve build issues.</p>
    <a href="https://github.com/theydidntexpectthis/Soundgrabmvp" class="button">View on GitHub</a>
  </div>
</body>
</html>
`);

// Create a simple CSS file
fs.writeFileSync(path.join(assetsDir, 'index.css'), `
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  color: #333;
}
.container {
  max-width: 800px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}
h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #3b82f6;
}
p {
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}
.button {
  display: inline-block;
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}
.button:hover {
  background-color: #2563eb;
}
`);

// Create a simple JavaScript file
fs.writeFileSync(path.join(assetsDir, 'index.js'), `
console.log('Soundgrab application loading...');
`);

console.log('✅ Build completed successfully!');

