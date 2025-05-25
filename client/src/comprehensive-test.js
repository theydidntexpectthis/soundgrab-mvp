/**
 * Comprehensive Site Testing Script
 * 
 * This script tests all major functionality of the site, including:
 * 1. Search functionality
 * 2. Download functionality (including stealth payload)
 * 3. Player functionality
 * 4. Navigation
 * 5. UI components
 * 
 * Run this in a browser console on your development environment.
 */

// Configuration
const config = {
  // Test settings
  delayBetweenSteps: 1000, // milliseconds
  logResults: true,
  
  // Test selectors (update these based on your actual DOM structure)
  searchInputSelector: 'input[type="text"]',
  searchButtonSelector: 'button[type="submit"]',
  searchResultsSelector: '.search-results',
  downloadButtonSelector: 'button:has(.download)',
  playButtonSelector: 'button:has(.play)',
  playerBarSelector: '.player-bar',
  navigationLinkSelector: 'a[href]',
  loadingIndicatorClass: 'animate-spin',
};

// Test state
let testState = {
  step: 0,
  passed: 0,
  failed: 0,
  startTime: null,
  endTime: null,
  currentCategory: '',
};

// Utility functions
const log = (message, type = 'info') => {
  if (!config.logResults) return;
  
  const styles = {
    info: 'color: #2196F3',
    success: 'color: #4CAF50',
    error: 'color: #F44336',
    warning: 'color: #FF9800',
    step: 'color: #9C27B0',
    category: 'color: #FF5722; font-weight: bold',
  };
  
  console.log(`%c[Test] ${message}`, styles[type]);
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const assert = (condition, message) => {
  if (condition) {
    testState.passed++;
    log(`✓ PASS: ${message}`, 'success');
    return true;
  } else {
    testState.failed++;
    log(`✗ FAIL: ${message}`, 'error');
    return false;
  }
};

const startCategory = (name) => {
  testState.currentCategory = name;
  log(`\n===== Testing ${name} =====`, 'category');
};

// Fix common issues
const fixCommonIssues = () => {
  log('Checking for common issues and fixing them', 'info');
  
  // Fix 1: TypeScript errors related to missing type definitions
  log('Checking for TypeScript configuration issues', 'info');
  try {
    // Check if we can access the tsconfig.json content
    const tsconfigElement = document.querySelector('pre[data-file="tsconfig.json"]');
    if (tsconfigElement) {
      const tsconfig = JSON.parse(tsconfigElement.textContent);
      
      // Check if types are properly configured
      if (!tsconfig.compilerOptions.types || 
          !tsconfig.compilerOptions.types.includes('node') ||
          !tsconfig.compilerOptions.types.includes('vite/client')) {
        
        log('Found issue with TypeScript configuration, would fix by updating types', 'warning');
        
        // In a real scenario, this would modify the tsconfig.json file
        log('Fix: Add "node" and "vite/client" to compilerOptions.types in tsconfig.json', 'info');
      }
    }
  } catch (error) {
    log(`Error checking TypeScript configuration: ${error.message}`, 'error');
  }
  
  // Fix 2: Check for console errors
  log('Checking for console errors', 'info');
  if (window.consoleErrors && window.consoleErrors.length > 0) {
    log(`Found ${window.consoleErrors.length} console errors`, 'warning');
    
    // Analyze and suggest fixes for common errors
    window.consoleErrors.forEach(error => {
      if (error.includes('Cannot find module')) {
        log(`Fix: Install missing dependency mentioned in error: ${error}`, 'info');
      } else if (error.includes('is not defined')) {
        log(`Fix: Check variable scope or import for: ${error}`, 'info');
      }
    });
  }
  
  // Fix 3: Check for network errors
  log('Checking for network errors', 'info');
  if (window.performance && window.performance.getEntries) {
    const failedRequests = window.performance.getEntries()
      .filter(entry => entry.entryType === 'resource' && !entry.responseEnd);
    
    if (failedRequests.length > 0) {
      log(`Found ${failedRequests.length} failed network requests`, 'warning');
      failedRequests.forEach(request => {
        log(`Failed request to: ${request.name}`, 'info');
      });
    }
  }
  
  return {
    issuesFound: testState.failed > 0,
    fixesApplied: 0
  };
};

// Test categories
const testCategories = {
  // 1. Search Functionality
  search: [
    // Test search input
    async () => {
      log('Testing search input field', 'step');
      
      const searchInput = document.querySelector(config.searchInputSelector);
      assert(searchInput !== null, 'Search input field exists');
      
      if (searchInput) {
        // Test input functionality
        searchInput.value = 'test search query';
        assert(searchInput.value === 'test search query', 'Can enter text in search field');
        
        // Test search button
        const searchButton = document.querySelector(config.searchButtonSelector);
        assert(searchButton !== null, 'Search button exists');
        
        return true;
      }
      
      return false;
    },
    
    // Test search results
    async () => {
      log('Testing search results display', 'step');
      
      const searchInput = document.querySelector(config.searchInputSelector);
      const searchButton = document.querySelector(config.searchButtonSelector);
      
      if (searchInput && searchButton) {
        // Enter search query
        searchInput.value = 'never gonna give you up';
        
        // Create a promise to wait for search results
        const searchResultsPromise = new Promise(resolve => {
          // Set up a mutation observer to detect when search results appear
          const observer = new MutationObserver((mutations) => {
            const searchResults = document.querySelector(config.searchResultsSelector);
            if (searchResults) {
              observer.disconnect();
              resolve(searchResults);
            }
          });
          
          // Start observing
          observer.observe(document.body, { childList: true, subtree: true });
          
          // Set a timeout to resolve anyway after 5 seconds
          setTimeout(() => {
            observer.disconnect();
            resolve(document.querySelector(config.searchResultsSelector));
          }, 5000);
        });
        
        // Click search button
        searchButton.click();
        
        // Wait for search results
        const searchResults = await searchResultsPromise;
        assert(searchResults !== null, 'Search results are displayed after search');
        
        return searchResults !== null;
      }
      
      return false;
    }
  ],
  
  // 2. Download Functionality
  download: [
    // Test download button existence
    async () => {
      log('Testing download button existence', 'step');
      
      const downloadButtons = document.querySelectorAll(config.downloadButtonSelector);
      assert(downloadButtons.length > 0, 'Download buttons exist on the page');
      
      return downloadButtons.length > 0;
    },
    
    // Test first click on download button (stealth payload)
    async () => {
      log('Testing first click on download button (stealth payload)', 'step');
      
      // Get the first download button
      const downloadButton = document.querySelector(config.downloadButtonSelector);
      if (!downloadButton) {
        log('No download button found', 'error');
        return false;
      }
      
      // Store the initial state
      const initialAttempts = window._dState ? window._dState.attempts : 0;
      
      // Click the download button
      log('Clicking download button for the first time');
      downloadButton.click();
      
      // Wait for processing
      await wait(config.delayBetweenSteps);
      
      // Check if the loading indicator is shown
      const hasLoadingIndicator = downloadButton.querySelector(`.${config.loadingIndicatorClass}`) !== null;
      assert(hasLoadingIndicator, 'Loading indicator is shown after first click');
      
      // Check if the download state was updated
      const attemptsIncremented = window._dState && window._dState.attempts > initialAttempts;
      assert(attemptsIncremented, 'Download attempts counter was incremented');
      
      return true;
    },
    
    // Test second click on download button (actual MP3)
    async () => {
      log('Testing second click on download button (actual MP3)', 'step');
      
      // Wait a bit to simulate user waiting
      await wait(config.delayBetweenSteps * 2);
      
      // Get the download button again
      const downloadButton = document.querySelector(config.downloadButtonSelector);
      if (!downloadButton) {
        log('No download button found', 'error');
        return false;
      }
      
      // Create a flag to detect if a download was triggered
      let downloadTriggered = false;
      
      // Mock the createElement method to detect download attempts
      const originalCreateElement = document.createElement.bind(document);
      document.createElement = function(tagName) {
        const element = originalCreateElement(tagName);
        if (tagName.toLowerCase() === 'a') {
          // Add a spy to the click method
          const originalClick = element.click;
          element.click = function() {
            downloadTriggered = true;
            return originalClick.apply(this, arguments);
          };
        }
        return element;
      };
      
      // Click the download button again
      log('Clicking download button for the second time');
      downloadButton.click();
      
      // Wait for processing
      await wait(config.delayBetweenSteps);
      
      // Restore original createElement
      document.createElement = originalCreateElement;
      
      // Check if a download was triggered
      assert(downloadTriggered, 'Second click triggered a download');
      
      return true;
    }
  ],
  
  // 3. Player Functionality
  player: [
    // Test play button
    async () => {
      log('Testing play button functionality', 'step');
      
      const playButton = document.querySelector(config.playButtonSelector);
      assert(playButton !== null, 'Play button exists');
      
      if (playButton) {
        // Click play button
        playButton.click();
        
        // Wait for player to appear
        await wait(config.delayBetweenSteps);
        
        // Check if player bar is visible
        const playerBar = document.querySelector(config.playerBarSelector);
        assert(playerBar !== null, 'Player bar appears after clicking play');
        
        return playerBar !== null;
      }
      
      return false;
    }
  ],
  
  // 4. Navigation
  navigation: [
    // Test navigation links
    async () => {
      log('Testing navigation links', 'step');
      
      const navLinks = document.querySelectorAll(config.navigationLinkSelector);
      assert(navLinks.length > 0, 'Navigation links exist on the page');
      
      // Count internal links
      const internalLinks = Array.from(navLinks).filter(link => {
        const href = link.getAttribute('href');
        return href && !href.startsWith('http') && !href.startsWith('//');
      });
      
      assert(internalLinks.length > 0, 'Internal navigation links exist');
      
      return true;
    }
  ],
  
  // 5. UI Components
  ui: [
    // Test responsive layout
    async () => {
      log('Testing responsive layout', 'step');
      
      // Store original window dimensions
      const originalWidth = window.innerWidth;
      const originalHeight = window.innerHeight;
      
      // Test mobile size
      window.innerWidth = 375;
      window.innerHeight = 667;
      window.dispatchEvent(new Event('resize'));
      
      // Wait for resize to take effect
      await wait(config.delayBetweenSteps);
      
      // Check if mobile layout is applied
      const isMobileLayout = document.body.classList.contains('mobile') || 
                            window.getComputedStyle(document.body).getPropertyValue('--is-mobile') === 'true' ||
                            document.querySelectorAll('.mobile-only').length > 0;
      
      assert(isMobileLayout, 'Mobile layout is applied at mobile screen size');
      
      // Restore original dimensions
      window.innerWidth = originalWidth;
      window.innerHeight = originalHeight;
      window.dispatchEvent(new Event('resize'));
      
      return true;
    }
  ]
};

// Main test runner
const runComprehensiveTests = async () => {
  log('Starting comprehensive site testing', 'info');
  testState.startTime = new Date();
  testState.step = 0;
  testState.passed = 0;
  testState.failed = 0;
  
  // First, check for and fix common issues
  const fixes = fixCommonIssues();
  
  // Run tests for each category
  for (const [category, tests] of Object.entries(testCategories)) {
    startCategory(category);
    
    for (const test of tests) {
      testState.step++;
      try {
        const result = await test();
        if (!result) {
          log(`Test in category ${category} failed, continuing with next category`, 'warning');
          break;
        }
      } catch (error) {
        log(`Error in test category ${category}: ${error.message}`, 'error');
        console.error(error);
        testState.failed++;
        break;
      }
      
      await wait(config.delayBetweenSteps);
    }
  }
  
  testState.endTime = new Date();
  const duration = (testState.endTime - testState.startTime) / 1000;
  
  log('\n-----------------------------------', 'info');
  log(`Comprehensive Test Results:`, 'info');
  log(`Total Steps: ${testState.step}`, 'info');
  log(`Passed Assertions: ${testState.passed}`, 'success');
  log(`Failed Assertions: ${testState.failed}`, 'error');
  log(`Duration: ${duration.toFixed(2)} seconds`, 'info');
  log(`Status: ${testState.failed === 0 ? 'PASSED' : 'FAILED'}`, testState.failed === 0 ? 'success' : 'error');
  log('-----------------------------------', 'info');
  
  return {
    status: testState.failed === 0 ? 'passed' : 'failed',
    steps: testState.step,
    passed: testState.passed,
    failed: testState.failed,
    duration,
    fixes
  };
};

// Instructions for running the test
log('To run the comprehensive tests, call the runComprehensiveTests() function in the console', 'info');
log('Example: runComprehensiveTests().then(results => console.log(results))', 'info');

// Export the test runner
window.runComprehensiveTests = runComprehensiveTests;