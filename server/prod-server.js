const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      console.log(`${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`);
    }
  });
  
  next();
});

// Basic API routes for production
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/search", (req, res) => {
  // Mock search endpoint
  res.json({ 
    results: [],
    message: "Search functionality will be implemented"
  });
});

app.post("/api/downloads", (req, res) => {
  // Mock download endpoint
  res.json({ 
    id: "mock-download-id",
    status: "queued",
    message: "Download functionality will be implemented"
  });
});

app.get("/api/downloads/active", (req, res) => {
  // Mock active downloads
  res.json({ downloads: [] });
});

app.get("/api/lyrics", (req, res) => {
  // Mock lyrics endpoint
  res.json({ 
    lyrics: "Lyrics functionality will be implemented",
    source: "mock"
  });
});

// Serve static files from client/dist
const distPath = path.resolve(__dirname, "..", "client", "dist");

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  
  // Fallback to index.html for SPA routing
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
} else {
  app.get("*", (req, res) => {
    res.status(404).json({ 
      error: "Client build not found. Please build the client first." 
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

const port = process.env.PORT || 5000;
const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});