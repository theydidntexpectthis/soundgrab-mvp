const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// CORS configuration
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Enhanced logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  const userAgent = req.get('User-Agent') || 'unknown';
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'ERROR' : 'INFO';
    console.log(`[${logLevel}] ${req.method} ${reqPath} ${res.statusCode} in ${duration}ms - ${userAgent}`);
  });
  
  next();
});

// Health check with more details
app.get("/api/health", (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    uptime: process.uptime()
  };
  res.json(health);
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
  console.error("[ERROR] Unhandled error:", err);
  const status = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? "Internal Server Error"
    : err.message || "Internal Server Error";
  res.status(status).json({
    error: message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

const port = process.env.PORT || 5000;
const host = process.env.HOST || process.env.HOSTNAME || "0.0.0.0";

app.listen(port, host, () => {
  console.log(`[INFO] Server running on http://${host}:${port}`);
  console.log(`[INFO] Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`[INFO] Client build path: ${path.resolve(__dirname, "..", "client", "dist")}`);
  console.log(`[INFO] Process ID: ${process.pid}`);
});