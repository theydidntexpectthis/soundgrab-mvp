#!/usr/bin/env node

console.log('🔍 SoundGrab Diagnostic Test');
console.log('============================');

// Test 1: Environment Configuration
console.log('\n1. Environment Configuration:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined');
console.log('PORT:', process.env.PORT || 'undefined');
console.log('GENIUS_API_KEY:', process.env.GENIUS_API_KEY ? 'SET' : 'MISSING');
console.log('YOUTUBE_API_KEY:', process.env.YOUTUBE_API_KEY ? 'SET' : 'MISSING');

// Test 2: Dependencies Check
console.log('\n2. Dependencies Check:');
try {
  require('ytdl-core');
  console.log('✅ ytdl-core: Available');
} catch (e) {
  console.log('❌ ytdl-core: Missing or broken');
}

try {
  require('genius-lyrics-api');
  console.log('✅ genius-lyrics-api: Available');
} catch (e) {
  console.log('❌ genius-lyrics-api: Missing or broken');
}

// Test 3: File Structure
console.log('\n3. File Structure:');
const fs = require('fs');
console.log('.env exists:', fs.existsSync('.env'));
console.log('client/dist exists:', fs.existsSync('client/dist'));
console.log('server/dist exists:', fs.existsSync('server/dist'));

// Test 4: API Endpoint Test
console.log('\n4. API Test (if server running):');
const http = require('http');
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Health check status: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log('Health response:', chunk.toString());
  });
});

req.on('error', (err) => {
  console.log('❌ Server not running or health endpoint failed:', err.message);
});

req.end();

console.log('\n🔍 Diagnostic complete. Review results above.');