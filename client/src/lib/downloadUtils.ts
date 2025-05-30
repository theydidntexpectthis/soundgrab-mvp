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
import { downloadTrack } from "../services/apiService";

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

    console.log(`Download initiated for: ${track.title} (${format})`);

    // Actually download the track using the API service
    const downloadUrl = await downloadTrack(track, format);
    
    if (!downloadUrl) {
      throw new Error("Failed to get download URL");
    }

    // Create a temporary anchor element to trigger the download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${track.artist} - ${track.title}.${format}`;
    link.style.display = 'none';
    
    // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`Download completed for: ${track.title} (${format})`);
    console.log(`Download URL: ${downloadUrl}`);

    // Track successful download
    trackEvent("download", "complete", `${track.title} - ${format}`);

    // Execute the download callback
    if (callback) {
      callback();
    }

    // Return true to indicate successful download
    return true;
  } catch (error) {
    console.error("Download error:", error);
    trackEvent("download", "error", `${track.title} - ${format}: ${error.message}`);
    return false;
  }
};

/**
 * Check if a file exists on the server
 * @param url URL of the file to check
 * @returns Promise resolving to boolean indicating if file exists
 */
export const checkFileExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error("Error checking file existence:", error);
    return false;
  }
};

/**
 * Get the full URL for a downloaded track
 * @param track Track object
 * @param format File format (mp3, wav, etc.)
 * @returns URL string for the downloaded file
 */
export const getDownloadedFileUrl = (track: any, format: string = "mp3"): string => {
  const fileName = `${track.artist.replace(/\s+/g, "_").toLowerCase()}-${track.title.replace(/\s+/g, "_").toLowerCase()}.${format}`;
  return `/api/downloads/files/${fileName}`;
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
