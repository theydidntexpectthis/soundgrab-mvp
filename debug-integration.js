// Debug script to validate frontend-backend integration issues
console.log('=== SoundGrab Integration Debug ===');

// Check environment variables
console.log('\n1. Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VITE_API_BASE_URL:', process.env.VITE_API_BASE_URL);
console.log('VITE_USE_EXTERNAL_APIS:', process.env.VITE_USE_EXTERNAL_APIS);
console.log('VITE_RAPIDAPI_KEY:', process.env.VITE_RAPIDAPI_KEY ? 'SET' : 'NOT SET');

// Check if we're in browser environment
if (typeof window !== 'undefined') {
  console.log('\n2. Browser Environment:');
  console.log('Current URL:', window.location.href);
  console.log('Origin:', window.location.origin);
  
  // Test API connectivity
  console.log('\n3. Testing API Connectivity:');
  
  const apiBaseUrl = import.meta?.env?.VITE_API_BASE_URL || 
    (import.meta?.env?.MODE === 'production' ? '' : 'http://localhost:5000');
  
  console.log('Computed API Base URL:', apiBaseUrl);
  
  // Test basic API endpoint
  fetch(apiBaseUrl + '/api/health')
    .then(response => {
      console.log('API Health Check Status:', response.status);
      return response.text();
    })
    .then(data => console.log('API Health Response:', data))
    .catch(error => console.error('API Health Check Failed:', error));
    
  // Test CORS
  fetch(apiBaseUrl + '/api/searches/history')
    .then(response => {
      console.log('CORS Test Status:', response.status);
      console.log('CORS Headers:', response.headers);
    })
    .catch(error => console.error('CORS Test Failed:', error));
}

// Check server environment
if (typeof process !== 'undefined') {
  console.log('\n4. Server Environment:');
  console.log('Server Port:', process.env.PORT || 5000);
  console.log('Server Host:', process.env.HOSTNAME || '0.0.0.0');
}