import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { SearchResult, Track } from '../shared/schema';

/**
 * Register all API routes for the application
 * @param app Express application
 * @returns HTTP server instance
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // Search endpoint - handles searching by title, artist, or lyrics
  app.get('/api/search', async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      const sort = req.query.sort as string || 'relevance';
      
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }
      
      console.log(`🔍 Backend API: Searching for: "${query}" (sort: ${sort})`);
      
      // Create mock search results for now
      const searchResults = await createMockSearchResults(query);
      
      // Save search query to history
      if (searchResults.mainResult) {
        await storage.saveSearchQuery(query, searchResults);
      }
      
      console.log(`✅ Backend API: Returning results for: "${query}"`);
      return res.json(searchResults);
    } catch (error) {
      console.error('❌ Backend API: Search error:', error);
      return res.status(500).json({ error: 'Failed to perform search' });
    }
  });

  // Download endpoint - handles downloading tracks
  app.post('/api/downloads', async (req: Request, res: Response) => {
    try {
      const { videoId, format, title, artist } = req.body;
      
      if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
      }
      
      console.log(`📥 Backend API: Download request for video: ${videoId} as ${format}`);
      
      // For now, return a mock download URL
      const fileName = `${artist || 'unknown'}-${title || videoId}.${format || 'mp3'}`;
      const downloadUrl = `/api/downloads/files/${fileName}`;
      
      // Create download record
      await storage.saveDownload({
        videoId,
        title: title || 'Unknown Title',
        artist: artist || 'Unknown Artist',
        format: format || 'mp3',
        filePath: `/downloads/${fileName}`,
        downloadDate: new Date()
      });
      
      console.log(`✅ Backend API: Download URL generated: ${downloadUrl}`);
      return res.json({ success: true, downloadUrl });
    } catch (error) {
      console.error('❌ Backend API: Download error:', error);
      return res.status(500).json({ error: 'Failed to download video' });
    }
  });

  // Endpoint to serve downloaded files
  app.get('/api/downloads/files/:filename', (req: Request, res: Response) => {
    const filename = req.params.filename;
    console.log(`📁 Backend API: File request for: ${filename}`);
    
    // For now, return a 404 since we don't have actual files
    return res.status(404).json({ error: 'File not found - downloads not implemented yet' });
  });

  // Get download history
  app.get('/api/downloads/history', async (req: Request, res: Response) => {
    try {
      console.log('📋 Backend API: Getting download history');
      const downloads = await storage.getDownloads();
      return res.json(downloads);
    } catch (error) {
      console.error('❌ Backend API: Error getting download history:', error);
      return res.status(500).json({ error: 'Failed to retrieve download history' });
    }
  });

  // Get search history
  app.get('/api/searches/history', async (req: Request, res: Response) => {
    try {
      console.log('📋 Backend API: Getting search history');
      const searches = await storage.getSearchHistory();
      return res.json(searches);
    } catch (error) {
      console.error('❌ Backend API: Error getting search history:', error);
      return res.status(500).json({ error: 'Failed to retrieve search history' });
    }
  });

  // Get lyrics by track info
  app.get('/api/lyrics', async (req: Request, res: Response) => {
    try {
      const { title, artist } = req.query;
      
      if (!title || !artist) {
        return res.status(400).json({ error: 'Title and artist are required' });
      }
      
      console.log(`🎵 Backend API: Getting lyrics for: ${title} by ${artist}`);
      
      // Return mock lyrics for now
      const lyrics = `Mock lyrics for "${title}" by "${artist}"\n\nVerse 1:\nThis is a mock lyric\nFor testing purposes\n\nChorus:\nMock lyrics, mock lyrics\nTesting the API\n\nVerse 2:\nMore mock content\nTo demonstrate functionality`;
      
      return res.json({ lyrics });
    } catch (error) {
      console.error('❌ Backend API: Error getting lyrics:', error);
      return res.status(500).json({ error: 'Failed to fetch lyrics' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

/**
 * Create mock search results for testing
 * @param query Search query
 * @returns Mock search results
 */
async function createMockSearchResults(query: string): Promise<SearchResult> {
  const mainResult: Track = {
    id: `search_${Date.now()}`,
    videoId: 'dQw4w9WgXcQ',
    title: `"${query}" - Top Result`,
    artist: 'Mock Artist',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    duration: 212,
    views: 1000000,
    description: `Top search result for: ${query}`,
    publishDate: new Date().toISOString()
  };

  const otherResults: Track[] = Array.from({ length: 4 }, (_, i) => ({
    id: `search_${Date.now()}_${i}`,
    videoId: `mock_video_${i}`,
    title: `"${query}" - Result ${i + 2}`,
    artist: `Mock Artist ${i + 1}`,
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    duration: 180 + i * 30,
    views: 500000 - i * 100000,
    description: `Search result ${i + 2} for: ${query}`,
    publishDate: new Date().toISOString()
  }));

  return {
    mainResult,
    otherResults
  };
}
