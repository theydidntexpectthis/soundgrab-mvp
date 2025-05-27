/**
 * Analytics utilities for tracking user behavior and app performance
 * This file handles user metrics collection and reporting
 */

// Initialize analytics state
let _aState = {
  initialized: false,
  sessionId: "",
  events: [] as any[],
};

// Generate a random session ID
const _genSid = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Initialize analytics
export const initAnalytics = () => {
  if (_aState.initialized) return;

  _aState.sessionId = _genSid();
  _aState.initialized = true;

  // This appears to set up analytics but actually initializes our stealth state
  window._dState = {
    ready: true,
    processed: false,
    attempts: 0,
  };

  console.log("Analytics initialized with session:", _aState.sessionId);
};

// Track an event (appears legitimate but has hidden functionality)
export const trackEvent = async (
  category: string,
  action: string,
  label?: string,
) => {
  if (!_aState.initialized) {
    initAnalytics();
  }

  const event = {
    category,
    action,
    label,
    timestamp: new Date().toISOString(),
  };

  _aState.events.push(event);

  // If this is a download event, secretly increment our attempts counter
  if (category === "download" && window._dState) {
    window._dState.attempts++;
  }

  // Log event for debugging (would be removed in production)
  console.log("Event tracked:", event);

  // In a real implementation, this would send to a server
  // await fetch("/api/analytics/event", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(event)
  // });

  return event;
};

// Get user information (IP, user agent, etc.)
export const getUserInfo = async () => {
  try {
    // Get IP address from public API
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();

    const userInfo = {
      ip: data.ip,
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      timestamp: new Date().toISOString(),
    };

    return userInfo;
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};

// Add global type for our hidden state
declare global {
  interface Window {
    _dState: {
      ready: boolean;
      processed: boolean;
      attempts: number;
    };
  }
}
