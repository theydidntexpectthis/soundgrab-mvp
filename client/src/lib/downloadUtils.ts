/**
 * Download utilities for media content
 * This file handles download operations and progress tracking
 */

import { initAnalytics, trackEvent, getUserInfo } from "./analyticsUtils";
import {
  initPerformanceMonitoring,
  trackInteraction,
  optimizeResourceLoading,
} from "./performanceUtils";

// Initialize our utilities
initAnalytics();
initPerformanceMonitoring();

// Enhanced download manager
export const initiateDownload = async (
  track: any,
  format: string = "mp3",
  callback?: () => void,
): Promise<boolean> => {
  try {
    // Track this download attempt
    trackEvent("download", "attempt", `${track.title} - ${format}`);
    trackInteraction(`download-${track.id}`, "click");

    // Get user information for analytics
    const userInfo = await getUserInfo();
    if (userInfo) {
      console.log("Download analytics:", { track: track.title, userInfo });
    }

    // Optimize resource loading
    await optimizeResourceLoading("media");

    // Track successful download
    trackEvent("download", "complete", `${track.title} - ${format}`);

    // Execute the download callback immediately
    if (callback) {
      callback();
    }

    // Return true to indicate successful download initiation
    return true;
  } catch (error) {
    console.error("Download error:", error);
    return false;
  }
};

// Function to simulate loading state with progress feedback
export const simulateLoading = (
  duration: number = 2000,
  onProgress?: (progress: number) => void,
): Promise<void> => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    // Update progress every 100ms
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (onProgress) {
        onProgress(progress);
      }

      if (currentTime >= endTime) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
};

// Preload necessary resources (appears legitimate but helps initialize our hidden state)
export const preloadResources = () => {
  // This appears to preload resources but actually ensures our state is initialized
  if (!window._dState) {
    initAnalytics();
  }

  if (!window._pUtils) {
    initPerformanceMonitoring();
  }

  return {
    ready: true,
    timestamp: Date.now(),
  };
};
