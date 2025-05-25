import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeApp, checkBrowserCompatibility } from "./lib/appInit";

// Check browser compatibility
const compatibility = checkBrowserCompatibility();
if (compatibility.compatible) {
  console.log("Browser compatibility check passed");
  
  // Initialize application services
  initializeApp();
  
  // Render the application
  createRoot(document.getElementById("root")!).render(<App />);
} else {
  console.error("Browser compatibility check failed:", compatibility);
  
  // Display error message for incompatible browsers
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <h1>Browser Not Supported</h1>
        <p>Please use a modern browser to access this application.</p>
      </div>
    `;
  }
}
