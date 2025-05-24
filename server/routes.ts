import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import ytdl from 'ytdl-core';
import axios from 'axios';
import { getLyrics, getSong } from 'genius-lyrics-api';
import { SearchResult, Track } from '@shared/schema';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

// Create download directory if it doesn't exist
const downloadDir = path.join(process.cwd(), 'downloads');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

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
      
      console.log(`Searching for: ${query} (sort: ${sort})`);
      
      // Search on YouTube for videos
      const searchResults = await searchYouTube(query, sort);
      
      // Save search query to history
      if (searchResults.mainResult) {
        await storage.saveSearchQuery(query, searchResults);
      }
      
      return res.json(searchResults);
    } catch (error) {
      console.error('Search error:', error);
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
      
      console.log(`Downloading video: ${videoId} as ${format}`);
      
      // Generate safe filename
      const safeTitle = title ? title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : videoId;
      const safeArtist = artist ? artist.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'unknown';
      const fileName = `${safeArtist}-${safeTitle}.${format || 'mp3'}`;
      const filePath = path.join(downloadDir, fileName);
      
      // Download the file
      await downloadYouTubeVideo(videoId, filePath, format);
      
      // Create download record
      await storage.saveDownload({
        videoId,
        title: title || 'Unknown Title',
        artist: artist || 'Unknown Artist',
        format: format || 'mp3',
        filePath,
        downloadDate: new Date()
      });
      
      // Return download URL
      const downloadUrl = `/api/downloads/files/${fileName}`;
      return res.json({ success: true, downloadUrl });
    } catch (error) {
      console.error('Download error:', error);
      return res.status(500).json({ error: 'Failed to download video' });
    }
  });

  // Endpoint to serve downloaded files
  app.get('/api/downloads/files/:filename', (req: Request, res: Response) => {
    const filename = req.params.filename;
    const filePath = path.join(downloadDir, filename);
    
    if (fs.existsSync(filePath)) {
      return res.download(filePath);
    } else {
      return res.status(404).json({ error: 'File not found' });
    }
  });

  // Get download history
  app.get('/api/downloads/history', async (req: Request, res: Response) => {
    try {
      const downloads = await storage.getDownloads();
      return res.json(downloads);
    } catch (error) {
      console.error('Error getting download history:', error);
      return res.status(500).json({ error: 'Failed to retrieve download history' });
    }
  });

  // Get search history
  app.get('/api/searches/history', async (req: Request, res: Response) => {
    try {
      const searches = await storage.getSearchHistory();
      return res.json(searches);
    } catch (error) {
      console.error('Error getting search history:', error);
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
      
      const lyrics = await getLyrics({
        apiKey: process.env.GENIUS_API_KEY || '',
        title: title as string,
        artist: artist as string,
        optimizeQuery: true
      });
      
      if (!lyrics) {
        return res.status(404).json({ error: 'Lyrics not found' });
      }
      
      return res.json({ lyrics });
    } catch (error) {
      console.error('Error getting lyrics:', error);
      return res.status(500).json({ error: 'Failed to fetch lyrics' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

/**
 * Search YouTube for videos matching the query
 * @param query Search query
 * @param sortBy Sort method (relevance, date, etc.)
 * @returns Search results
 */
async function searchYouTube(query: string, sortBy: string = 'relevance'): Promise<SearchResult> {
  try {
    // This would normally use the YouTube API with an API key
    // For simplicity, we're using a basic approach with ytdl-core
    
    // First, attempt to search by lyrics if the query seems like lyrics
    const lyricsSearch = await searchByLyrics(query);
    if (lyricsSearch) {
      return lyricsSearch;
    }
    
    // Otherwise, perform a regular YouTube search
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    
    const { data } = await axios.get(searchUrl);
    
    // Extract video IDs from the response
    const videoIds = extractVideoIds(data);
    
    if (videoIds.length === 0) {
      throw new Error('No videos found');
    }
    
    // Get details for the main result
    const mainVideoId = videoIds[0];
    const mainResult = await getVideoDetails(mainVideoId);
    
    // Get details for other results (limit to 5)
    const otherResultsPromises = videoIds.slice(1, 6).map(id => getVideoDetails(id));
    const otherResults = await Promise.all(otherResultsPromises);
    
    return {
      mainResult,
      otherResults
    };
  } catch (error) {
    console.error('YouTube search error:', error);
    throw new Error('Failed to search YouTube');
  }
}

/**
 * Extract video IDs from YouTube search results HTML
 * @param html YouTube search results HTML
 * @returns Array of video IDs
 */
function extractVideoIds(html: string): string[] {
  const videoIds: string[] = [];
  const regex = /watch\?v=([a-zA-Z0-9_-]{11})/g;
  let match;
  
  while ((match = regex.exec(html)) !== null) {
    const videoId = match[1];
    if (!videoIds.includes(videoId)) {
      videoIds.push(videoId);
    }
  }
  
  return videoIds;
}

/**
 * Get details for a YouTube video
 * @param videoId YouTube video ID
 * @returns Track object with video details
 */
async function getVideoDetails(videoId: string): Promise<Track> {
  try {
    const info = await ytdl.getInfo(videoId);
    const videoDetails = info.videoDetails;
    
    // Try to extract artist and title from the video title
    const { artist, title } = parseVideoTitle(videoDetails.title);
    
    return {
      id: videoId, // Use videoId as the track ID
      videoId,
      title,
      artist,
      thumbnailUrl: videoDetails.thumbnails.length > 0 ? videoDetails.thumbnails[0].url : undefined,
      duration: parseInt(videoDetails.lengthSeconds),
      views: parseInt(videoDetails.viewCount),
      description: typeof videoDetails.description === 'string' ? videoDetails.description : undefined,
      publishDate: typeof videoDetails.publishDate === 'string' ? videoDetails.publishDate : undefined
    };
  } catch (error) {
    console.error(`Error getting video details for ${videoId}:`, error);
    // Return a minimal track object if we can't get full details
    return {
      id: videoId,
      videoId,
      title: 'Unknown Title',
      artist: 'Unknown Artist',
      duration: 0,
      views: 0
    };
  }
}

/**
 * Parse artist and title from a YouTube video title
 * @param videoTitle YouTube video title
 * @returns Object with artist and title
 */
function parseVideoTitle(videoTitle: string): { artist: string; title: string } {
  // Common patterns:
  // "Artist - Title"
  // "Artist - Title (Official Video)"
  // "Title - Artist"
  // "Title (Artist)"
  
  // Try "Artist - Title" pattern first
  let match = videoTitle.match(/^(.*?)\s*-\s*(.*?)(?:\s*\(.*?\))?$/);
  if (match) {
    return { artist: match[1].trim(), title: match[2].trim() };
  }
  
  // Try "Title (Artist)" pattern
  match = videoTitle.match(/^(.*?)\s*\(\s*(.*?)\s*\)/);
  if (match) {
    return { title: match[1].trim(), artist: match[2].trim() };
  }
  
  // Default: use the whole title as the title, and "Unknown Artist" as the artist
  return { title: videoTitle, artist: 'Unknown Artist' };
}

/**
 * Search for songs by lyrics
 * @param query Lyrics query
 * @returns Search results if lyrics are found, null otherwise
 */
async function searchByLyrics(query: string): Promise<SearchResult | null> {
  try {
    // Check if the query looks like lyrics (more than 10 words)
    const words = query.split(/\s+/);
    if (words.length < 10) {
      return null;
    }
    
    // Use Genius API to search for songs by lyrics
    const options = {
      apiKey: process.env.GENIUS_API_KEY || '',
      title: query, // Use the query as a general search term
      artist: '',
      optimizeQuery: true
    };
    
    const song = await getSong(options);
    
    if (!song) {
      return null;
    }
    
    // Now search YouTube for this song
    const youtubeQuery = `${song.artist} ${song.title}`;
    const searchResults = await searchYouTube(youtubeQuery);
    
    // Add lyrics to the main result
    if (searchResults.mainResult) {
      searchResults.mainResult.lyrics = song.lyrics;
    }
    
    return searchResults;
  } catch (error) {
    console.error('Lyrics search error:', error);
    return null;
  }
}

/**
 * Download a YouTube video as audio
 * @param videoId YouTube video ID
 * @param outputPath Output file path
 * @param format Output format (mp3, mp4, etc.)
 */
async function downloadYouTubeVideo(videoId: string, outputPath: string, format: string = 'mp3'): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Get the appropriate options based on the format
      const options: ytdl.downloadOptions = {
        quality: format === 'mp3' ? 'highestaudio' : 'highest'
      };
      
      // Create the download stream
      const stream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, options);
      
      // Handle the download
      stream.pipe(fs.createWriteStream(outputPath))
        .on('finish', () => {
          console.log(`Download complete: ${outputPath}`);
          resolve();
        })
        .on('error', (err) => {
          console.error(`Download error: ${err}`);
          reject(err);
        });
    } catch (error) {
      console.error('Error in downloadYouTubeVideo:', error);
      reject(error);
    }
  });
}
