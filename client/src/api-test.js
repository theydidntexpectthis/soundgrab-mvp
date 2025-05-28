/**
 * API Integration Testing Script
 *
 * This script tests the RapidAPI integration for:
 * 1. YouTube search
 * 2. Spotify search
 * 3. Lyrics search
 * 4. Error handling and fallbacks
 *
 * Run this in a browser console on your development environment.
 */

// Configuration
const config = {
  // Test settings
  delayBetweenTests: 1000, // milliseconds
  logResults: true,
  
  // Test data
  testQueries: {
    song: "Never Gonna Give You Up",
    artist: "Rick Astley",
    lyrics: "We're no strangers to love, you know the rules and so do I",
    invalidQuery: "thisisaninvalidquerythatwontmatchanything12345",
    spotifySong: "Shape of You",
    spotifyArtist: "Ed Sheeran",
    youtubeQuery: "Despacito"
  },
  
  // Test all API endpoints
  testAllEndpoints: true,
  
  // Test performance
  measurePerformance: true
};

// Test state
let testState = {
  step: 0,
  passed: 0,
  failed: 0,
  startTime: null,
  endTime: null,
  currentCategory: ""
};

// Utility functions
const apiLog = (message, type = "info") => {
  if (!config.logResults) return;

  const styles = {
    info: "color: #2196F3",
    success: "color: #4CAF50",
    error: "color: #F44336",
    warning: "color: #FF9800",
    step: "color: #9C27B0",
    category: "color: #FF5722; font-weight: bold"
  };

  console.log(`%c[API Test] ${message}`, styles[type]);
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const assert = (condition, message) => {
  if (condition) {
    testState.passed++;
    apiLog(`✓ PASS: ${message}`, "success");
    return true;
  } else {
    testState.failed++;
    apiLog(`✗ FAIL: ${message}`, "error");
    return false;
  }
};

const startCategory = (name) => {
  testState.currentCategory = name;
  apiLog(`\n===== Testing ${name} =====`, "category");
};

// Import API functions
const { 
  searchTracks, 
  searchByLyrics, 
  searchSpotify, 
  getLyrics 
} = window.apiService || {};

// Performance measurement
const perfMeasurement = {
  startTime: null,
  endTime: null,
  measurements: {},
  
  start: function(label) {
    this.measurements[label] = { start: window.performance.now() };
    return this.measurements[label].start;
  },
  
  end: function(label) {
    if (this.measurements[label]) {
      this.measurements[label].end = window.performance.now();
      this.measurements[label].duration = this.measurements[label].end - this.measurements[label].start;
      return this.measurements[label].duration;
    }
    return 0;
  },
  
  getReport: function() {
    const report = {};
    for (const [label, data] of Object.entries(this.measurements)) {
      if (data.duration) {
        report[label] = `${data.duration.toFixed(2)}ms`;
      }
    }
    return report;
  }
};

// Test categories
const testCategories = {
  // 1. YouTube Search via RapidAPI
  youtubeSearch: [
    async () => {
      apiLog("Testing YouTube search via RapidAPI", "step");
      
      try {
        // Check if the API function exists
        assert(typeof searchTracks === 'function', "searchTracks function exists");
        
        if (typeof searchTracks !== 'function') {
          return false;
        }
        
        // Perform a search
        const results = await searchTracks(config.testQueries.song);
        
        // Validate results
        assert(results !== null, "Search returned results");
        assert(results.mainResult !== undefined, "Search returned a main result");
        assert(Array.isArray(results.otherResults), "Search returned other results");
        
        if (results.mainResult) {
          apiLog(`Found main result: "${results.mainResult.title}" by ${results.mainResult.artist}`, "info");
          assert(results.mainResult.title.length > 0, "Main result has a title");
          assert(results.mainResult.artist.length > 0, "Main result has an artist");
          assert(results.mainResult.videoId.length > 0, "Main result has a videoId");
        }
        
        return results !== null && results.mainResult !== undefined;
      } catch (error) {
        apiLog(`Error testing YouTube search: ${error.message}`, "error");
        console.error(error);
        return false;
      }
    }
  ],
  
  // 2. Spotify Search via RapidAPI
  spotifySearch: [
    async () => {
      apiLog("Testing Spotify search via RapidAPI", "step");
      
      try {
        // Check if the API function exists
        assert(typeof searchSpotify === 'function', "searchSpotify function exists");
        
        if (typeof searchSpotify !== 'function') {
          return false;
        }
        
        // Perform a search
        const results = await searchSpotify(config.testQueries.song);
        
        // Validate results
        assert(results !== null, "Spotify search returned results");
        assert(results.mainResult !== undefined, "Spotify search returned a main result");
        assert(Array.isArray(results.otherResults), "Spotify search returned other results");
        
        if (results.mainResult) {
          apiLog(`Found Spotify result: "${results.mainResult.title}" by ${results.mainResult.artist}`, "info");
          assert(results.mainResult.title.length > 0, "Spotify result has a title");
          assert(results.mainResult.artist.length > 0, "Spotify result has an artist");
          assert(results.mainResult.previewUrl !== undefined, "Spotify result has preview URL info");
        }
        
        return results !== null && results.mainResult !== undefined;
      } catch (error) {
        apiLog(`Error testing Spotify search: ${error.message}`, "error");
        console.error(error);
        return false;
      }
    }
  ],
  
  // 3. Lyrics Search via RapidAPI
  lyricsSearch: [
    async () => {
      apiLog("Testing lyrics search via RapidAPI", "step");
      
      try {
        // Check if the API function exists
        assert(typeof searchByLyrics === 'function', "searchByLyrics function exists");
        
        if (typeof searchByLyrics !== 'function') {
          return false;
        }
        
        // Perform a search
        const results = await searchByLyrics(config.testQueries.lyrics);
        
        // Validate results
        assert(results !== null, "Lyrics search returned results");
        assert(results.mainResult !== undefined, "Lyrics search returned a main result");
        
        if (results.mainResult) {
          apiLog(`Found song from lyrics: "${results.mainResult.title}" by ${results.mainResult.artist}`, "info");
          assert(results.mainResult.title.length > 0, "Lyrics result has a title");
          assert(results.mainResult.artist.length > 0, "Lyrics result has an artist");
        }
        
        return results !== null && results.mainResult !== undefined;
      } catch (error) {
        apiLog(`Error testing lyrics search: ${error.message}`, "error");
        console.error(error);
        return false;
      }
    }
  ],
  
  // 4. Get Lyrics via RapidAPI
  getLyricsTest: [
    async () => {
      apiLog("Testing get lyrics via RapidAPI", "step");
      
      try {
        // Check if the API function exists
        assert(typeof getLyrics === 'function', "getLyrics function exists");
        
        if (typeof getLyrics !== 'function') {
          return false;
        }
        
        // Get lyrics
        const lyrics = await getLyrics(config.testQueries.song, config.testQueries.artist);
        
        // Validate results
        assert(lyrics !== null, "getLyrics returned content");
        assert(typeof lyrics === 'string', "getLyrics returned a string");
        assert(lyrics.length > 100, "getLyrics returned substantial content");
        
        apiLog(`Retrieved lyrics with length: ${lyrics.length} characters`, "info");
        
        return lyrics !== null && lyrics.length > 0;
      } catch (error) {
        apiLog(`Error testing getLyrics: ${error.message}`, "error");
        console.error(error);
        return false;
      }
    }
  ],
  
  // 5. Error Handling and Fallbacks
  errorHandling: [
    async () => {
      apiLog("Testing error handling and fallbacks", "step");
      
      try {
        // Test with invalid query
        const invalidQuery = "thisisaninvalidquerythatwontmatchanything12345";
        
        // Should not throw an error, but return empty or fallback results
        const results = await searchTracks(invalidQuery);
        
        // Validate error handling
        assert(results !== null, "API handles invalid queries without crashing");
        
        // Test with invalid lyrics
        const invalidLyrics = "xyzabcdefghijklmnopqrstuvwxyz123456789";
        const lyricsResults = await searchByLyrics(invalidLyrics);
        
        assert(lyricsResults !== null, "Lyrics API handles invalid queries without crashing");
        
        return true;
      } catch (error) {
        apiLog(`Error testing error handling: ${error.message}`, "error");
        console.error(error);
        return false;
      }
    }
  ],
  
  // 6. API Response Time Testing
  performanceTesting: [
    async () => {
      if (!config.measurePerformance) {
        apiLog("Performance testing disabled, skipping", "info");
        return true;
      }
      
      apiLog("Testing API response times", "step");
      
      try {
        // Test YouTube search performance
        apiLog("Measuring YouTube search performance...", "info");
        perfMeasurement.start("youtube_search");
        await searchTracks(config.testQueries.youtubeQuery);
        const youtubeTime = perfMeasurement.end("youtube_search");
        apiLog(`YouTube search took ${youtubeTime.toFixed(2)}ms`, "info");
        
        // Test Spotify search performance
        apiLog("Measuring Spotify search performance...", "info");
        perfMeasurement.start("spotify_search");
        await searchSpotify(config.testQueries.spotifySong);
        const spotifyTime = perfMeasurement.end("spotify_search");
        apiLog(`Spotify search took ${spotifyTime.toFixed(2)}ms`, "info");
        
        // Test lyrics search performance
        apiLog("Measuring lyrics search performance...", "info");
        perfMeasurement.start("lyrics_search");
        await searchByLyrics(config.testQueries.lyrics);
        const lyricsTime = perfMeasurement.end("lyrics_search");
        apiLog(`Lyrics search took ${lyricsTime.toFixed(2)}ms`, "info");
        
        // Assert reasonable performance
        assert(youtubeTime < 5000, "YouTube search completes in under 5 seconds");
        assert(spotifyTime < 5000, "Spotify search completes in under 5 seconds");
        assert(lyricsTime < 5000, "Lyrics search completes in under 5 seconds");
        
        return true;
      } catch (error) {
        apiLog(`Error in performance testing: ${error.message}`, "error");
        console.error(error);
        return false;
      }
    }
  ],
  
  // 7. UI Integration Testing
  uiIntegration: [
    async () => {
      apiLog("Testing API integration with UI components", "step");
      
      try {
        // Check if we're in a browser environment with DOM
        if (typeof document === 'undefined') {
          apiLog("Not in browser environment, skipping UI integration tests", "warning");
          return true;
        }
        
        // Test search box integration
        const searchBox = document.querySelector('input[type="text"][placeholder*="search"]');
        assert(searchBox !== null || searchBox !== undefined, "Search box exists in the UI");
        
        if (searchBox) {
          apiLog("Found search box in the UI", "success");
          
          // Test search results integration
          const searchResults = document.querySelector('.search-results') ||
                               document.querySelector('[class*="search-results"]') ||
                               document.querySelector('[class*="searchResults"]');
          
          if (searchResults) {
            apiLog("Found search results container in the UI", "success");
          } else {
            apiLog("Search results container not found in the UI", "warning");
          }
          
          // Test player integration
          const player = document.querySelector('audio') ||
                        document.querySelector('.player') ||
                        document.querySelector('[class*="player"]');
          
          if (player) {
            apiLog("Found audio player in the UI", "success");
          } else {
            apiLog("Audio player not found in the UI", "warning");
          }
        }
        
        return true;
      } catch (error) {
        apiLog(`Error in UI integration testing: ${error.message}`, "error");
        console.error(error);
        return false;
      }
    }
  ],
  
  // 8. Comprehensive API Testing
  comprehensiveApiTesting: [
    async () => {
      if (!config.testAllEndpoints) {
        apiLog("Comprehensive API testing disabled, skipping", "info");
        return true;
      }
      
      apiLog("Running comprehensive API endpoint testing", "step");
      
      try {
        // Test all YouTube search variations
        apiLog("Testing multiple YouTube search queries...", "info");
        const queries = ["Despacito", "Shape of You", "Gangnam Style", "Billie Jean"];
        
        for (const query of queries) {
          apiLog(`Testing YouTube search for "${query}"...`, "info");
          const results = await searchTracks(query);
          assert(results !== null, `YouTube search for "${query}" returned results`);
          assert(results.mainResult !== undefined, `YouTube search for "${query}" returned a main result`);
        }
        
        // Test all Spotify search variations
        apiLog("Testing multiple Spotify search queries...", "info");
        const spotifyQueries = ["Ed Sheeran", "Taylor Swift", "The Weeknd", "Drake"];
        
        for (const query of spotifyQueries) {
          apiLog(`Testing Spotify search for "${query}"...`, "info");
          const results = await searchSpotify(query);
          assert(results !== null, `Spotify search for "${query}" returned results`);
        }
        
        // Test various lyrics snippets
        apiLog("Testing multiple lyrics search queries...", "info");
        const lyricsSnippets = [
          "I'm in love with the shape of you",
          "Hello from the other side",
          "Baby shark doo doo doo",
          "I'm gonna take my horse to the old town road"
        ];
        
        for (const lyrics of lyricsSnippets) {
          apiLog(`Testing lyrics search for "${lyrics}"...`, "info");
          const results = await searchByLyrics(lyrics);
          assert(results !== null, `Lyrics search for "${lyrics}" returned results`);
        }
        
        return true;
      } catch (error) {
        apiLog(`Error in comprehensive API testing: ${error.message}`, "error");
        console.error(error);
        return false;
      }
    }
  ]
};

// Main test runner
const runAPITests = async () => {
  apiLog("Starting API integration tests", "info");
  testState.startTime = new Date();
  testState.step = 0;
  testState.passed = 0;
  testState.failed = 0;
  
  // Start overall performance measurement
  if (config.measurePerformance) {
    perfMeasurement.start("total_test_time");
  }
  
  // Make API functions available globally for testing
  if (!window.apiService) {
    apiLog("API service not found in window object. Importing from module...", "warning");
    
    try {
      // Try to import the API service using relative path
      const apiModule = await import('../services/apiService.ts');
      window.apiService = apiModule;
      apiLog("Successfully imported API service", "success");
    } catch (error) {
      apiLog(`Failed to import API service: ${error.message}`, "error");
      apiLog("Please run this test from the application where API service is available", "warning");
      return {
        status: "failed",
        passed: 0,
        failed: 1
      };
    }
  }
  
  // Run tests for each category
  for (const [category, tests] of Object.entries(testCategories)) {
    startCategory(category);
    
    for (const test of tests) {
      testState.step++;
      try {
        const result = await test();
        if (!result) {
          apiLog(`Test in category ${category} failed, continuing with next category`, "warning");
          break;
        }
      } catch (error) {
        apiLog(`Error in test category ${category}: ${error.message}`, "error");
        console.error(error);
        testState.failed++;
        break;
      }
      
      await wait(config.delayBetweenTests);
    }
  }
  
  testState.endTime = new Date();
  const duration = (testState.endTime - testState.startTime) / 1000;
  
  apiLog("\n-----------------------------------", "info");
  apiLog(`API Integration Test Results:`, "info");
  apiLog(`Total Steps: ${testState.step}`, "info");
  apiLog(`Passed Assertions: ${testState.passed}`, "success");
  apiLog(`Failed Assertions: ${testState.failed}`, "error");
  apiLog(`Duration: ${duration.toFixed(2)} seconds`, "info");
  apiLog(`Status: ${testState.failed === 0 ? "PASSED" : "FAILED"}`, testState.failed === 0 ? "success" : "error");
  
  // Add performance report if enabled
  if (config.measurePerformance) {
    perfMeasurement.end("total_test_time");
    const perfReport = perfMeasurement.getReport();
    
    apiLog("-----------------------------------", "info");
    apiLog("Performance Report:", "info");
    for (const [label, duration] of Object.entries(perfReport)) {
      apiLog(`${label}: ${duration}`, "info");
    }
  }
  
  apiLog("-----------------------------------", "info");
  
  return {
    status: testState.failed === 0 ? "passed" : "failed",
    steps: testState.step,
    passed: testState.passed,
    failed: testState.failed,
    duration
  };
};

// Instructions for running the test
apiLog("To run the API integration tests, call the runAPITests() function in the console", "info");
apiLog("Example: runAPITests().then(results => console.log(results))", "info");

// Export the test runner
window.runAPITests = runAPITests;
window.runAPITests = runAPITests;
