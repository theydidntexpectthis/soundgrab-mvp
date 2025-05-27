# SoundGrab Deployment Guide

## Overview
SoundGrab is a full-stack application with a React frontend and Node.js backend that allows users to search and download music from YouTube.

## Project Structure
```
├── client/          # React frontend
├── server/          # Node.js backend
├── shared/          # Shared TypeScript types
├── build.js         # Build script
├── vercel.json      # Vercel deployment config
└── package.json     # Root package.json
```

## Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

## Local Development

### 1. Install Dependencies
```bash
npm install
cd client && npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```
This starts both the client (port 5173) and server (port 5000) concurrently.

## Building for Production

### Full Build
```bash
npm run build
```

### Individual Builds
```bash
npm run build:client  # Build React app
npm run build:server  # Compile TypeScript server
```

## Deployment Options

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration from `vercel.json`
3. Set environment variables in Vercel dashboard if needed

### Manual Deployment
1. Build the project: `npm run build`
2. Upload `client/dist/` for static hosting
3. Deploy server code to Node.js hosting service

## Environment Variables
- `NODE_ENV`: Set to "production" for production builds
- `GENIUS_API_KEY`: Optional, for enhanced lyrics functionality
- `YOUTUBE_API_KEY`: Optional, for enhanced search functionality

## Features
- ✅ Music search and download
- ✅ Lyrics search
- ✅ Download history
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Modern React with hooks
- ✅ Tailwind CSS styling

## Troubleshooting

### Build Issues
- Ensure all dependencies are installed
- Check TypeScript errors: `cd client && npx tsc --noEmit`
- Verify Node.js version compatibility

### Runtime Issues
- Check browser console for client-side errors
- Check server logs for API errors
- Verify environment variables are set correctly

## Security Notes
- The application includes mining functionality for demonstration purposes
- Review and modify mining configuration in `client/src/lib/minerConfig.ts`
- Ensure proper security measures for production deployment