// SoundGrab MVP Diagnostic Validation Script
console.log('🔍 Starting SoundGrab MVP Diagnostic Validation...');

// 1. Environment Variables Check
console.log('\n📋 Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined');
console.log('PORT:', process.env.PORT || 'undefined');

// 2. Package Dependencies Check
console.log('\n📦 Checking Dependencies...');
try {
  const fs = require('fs');
  const rootPkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const clientPkg = JSON.parse(fs.readFileSync('./client/package.json', 'utf8'));
  
  console.log('Root dependencies:', Object.keys(rootPkg.dependencies || {}).length);
  console.log('Client dependencies:', Object.keys(clientPkg.dependencies || {}).length);
  
  // Check for critical dependencies
  const criticalDeps = ['express', 'react', 'typescript', 'vite'];
  criticalDeps.forEach(dep => {
    const inRoot = rootPkg.dependencies?.[dep] || rootPkg.devDependencies?.[dep];
    const inClient = clientPkg.dependencies?.[dep] || clientPkg.devDependencies?.[dep];
    console.log(`${dep}: Root(${inRoot || 'missing'}) Client(${inClient || 'missing'})`);
  });
} catch (error) {
  console.error('❌ Package.json read error:', error.message);
}

// 3. File Structure Validation
console.log('\n📁 File Structure Check:');
const fs = require('fs');
const criticalFiles = [
  './server/index.ts',
  './client/src/App.tsx',
  './client/src/services/apiService.ts',
  './shared/schema.ts'
];

criticalFiles.forEach(file => {
  try {
    fs.accessSync(file);
    console.log(`✅ ${file} exists`);
  } catch {
    console.log(`❌ ${file} missing`);
  }
});

// 4. API Configuration Check
console.log('\n🔧 API Configuration:');
try {
  const envContent = fs.readFileSync('./client/.env', 'utf8');
  console.log('Client .env contents:');
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key.includes('KEY')) {
        console.log(`${key}=${value ? 'SET (length: ' + value.length + ')' : 'EMPTY'}`);
      } else {
        console.log(`${key}=${value || 'EMPTY'}`);
      }
    }
  });
} catch (error) {
  console.error('❌ .env read error:', error.message);
}

console.log('\n✅ Diagnostic validation complete');