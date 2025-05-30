import { SearchResult, Track } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import {
  mockSearchResults,
  mockSearchHistory,
  mockDownloads,
  mockTracks,
} from "./mockData";

// Flag to toggle between mock data and real API
const USE_MOCK_DATA = false; // Using real API connections

// Environment-based API configuration
// In production, use relative URLs (same origin), in development use localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');
const USE_EXTERNAL_APIS = import.meta.env.VITE_USE_EXTERNAL_APIS === 'true';

// RapidAPI configuration (only used if external APIs are enabled)
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || "d42dbed423mshd69f27217e2311bp11bd5cjsnc2b55ca495da";

// Enhanced debug logging for API configuration
console.log('🔧 API Configuration Debug:');
console.log('- Environment Mode:', import.meta.env.MODE);
console.log('- Raw VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('- Raw VITE_USE_EXTERNAL_APIS:', import.meta.env.VITE_USE_EXTERNAL_APIS);
console.log('- Raw VITE_RAPIDAPI_KEY:', import.meta.env.VITE_RAPIDAPI_KEY ? 'Set (length: ' + import.meta.env.VITE_RAPIDAPI_KEY.length + ')' : 'NOT SET');
console.log('- Computed API_BASE_URL:', API_BASE_URL);
console.log('- Current Origin:', typeof window !== 'undefined' ? window.location.origin : 'N/A (server)');
console.log('- USE_MOCK_DATA:', USE_MOCK_DATA);
console.log('- USE_EXTERNAL_APIS:', USE_EXTERNAL_APIS);
console.log('- RAPIDAPI_KEY (computed):', RAPIDAPI_KEY ? 'Set (length: ' + RAPIDAPI_KEY.length + ', first 10: ' + RAPIDAPI_KEY.substring(0, 10) + '...)' : 'Not set');
console.log('- All env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));

// Log potential integration issues
if (import.meta.env.MODE === 'production' && API_BASE_URL.includes('localhost')) {
  console.error('🚨 INTEGRATION ISSUE: Production mode but API_BASE_URL still points to localhost!');
  console.error('🚨 This will cause frontend-backend connection failures in deployment');
}
// Updated RapidAPI hosts based on your actual subscriptions
const RAPIDAPI_HOST_YT_SEARCH = "youtube-search-and-download.p.rapidapi.com"; // For search
const RAPIDAPI_HOST_YT_DOWNLOAD = "youtube-mp3-audio-video-downloader.p.rapidapi.com"; // YouTube MP3 Audio Video Downloader by nikzeferis
const RAPIDAPI_HOST_SPOTIFY = "spotify23.p.rapidapi.com"; // Spotify Data API by Glavier
const RAPIDAPI_HOST_LYRICS = "genius-song-lyrics1.p.rapidapi.com"; // Genius - Song Lyrics by Glavier
const RAPIDAPI_HOST_SPOTIFY_DOWNLOADER = "spotify-downloader9.p.rapidapi.com"; // Spotify Downloader

/**
 * Make a request to RapidAPI
 * @param host RapidAPI host
 * @param endpoint API endpoint
 * @param params Query parameters
 * @returns Response from the API
 */
async function rapidApiRequest(host: string, endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`https://${host}${endpoint}`);
  
  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': host
    }
  };
  
  // Enhanced diagnostic logging
  console.log('🔍 RapidAPI Request Diagnostics:');
  console.log('- URL:', url.toString());
  console.log('- Host:', host);
  console.log('- Endpoint:', endpoint);
  console.log('- Params:', params);
  console.log('- API Key (first 10 chars):', RAPIDAPI_KEY ? RAPIDAPI_KEY.substring(0, 10) + '...' : 'NOT SET');
  console.log('- Headers:', options.headers);
  
  try {
    const response = await fetch(url.toString(), options);
    
    console.log('📡 RapidAPI Response Status:', response.status);
    console.log('📡 RapidAPI Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ RapidAPI Error Response Body:', errorText);
      throw new Error(`RapidAPI request failed with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ RapidAPI Success Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ RapidAPI request failed:', error);
    throw error;
  }
}

/**
 * Search for tracks by query
 * @param query Search query (title, artist, lyrics, or URL)
 * @param sortBy Sort method
 * @returns Search results
 */
export async function searchTracks(
  query: string,
  sortBy: string = "relevance",
): Promise<SearchResult> {
  if (USE_MOCK_DATA) {
    console.log("Using mock search data");
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check if this looks like a lyrics search (longer query)
    if (query.split(" ").length > 6) {
      return searchByLyrics(query);
    }

    return mockSearchResults;
  }

  // Handle YouTube URL searches
  if (query.startsWith('youtube:')) {
    const videoId = query.replace('youtube:', '');
    return searchByVideoId(videoId);
  }

  // Try backend API first
  try {
    console.log('🔍 Trying backend API for search:', query);
    const response = await apiRequest(
      "GET",
      `${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}&sort=${encodeURIComponent(sortBy)}`
    );

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend API search successful:', data);
      return data;
    }
  } catch (error) {
    console.error("❌ Backend API search failed:", error);
  }

  // Fallback to RapidAPI if backend fails or external APIs are enabled
  if (USE_EXTERNAL_APIS) {
    console.log('🔍 Using RapidAPI fallback for search:', query);
    try {
      console.log("Trying RapidAPI fallback for query:", query);
      
      const ytData = await rapidApiRequest(
        RAPIDAPI_HOST_YT_SEARCH,
        '/search',
        {
          query: query,
          type: 'video',
          sort: sortBy,
          limit: '10'
        }
      );

      console.log("RapidAPI response:", ytData);

      if (!ytData || (!ytData.contents && !ytData.videos && !ytData.items)) {
        throw new Error("Invalid response from YouTube API");
      }

      // Handle different response formats from different RapidAPI endpoints
      let videos = ytData.contents || ytData.videos || ytData.items || [];
      
      // Map YouTube results to our Track schema
      const tracks: Track[] = videos
        .filter((item: any) => item.type === 'video' || item.videoId || item.id)
        .slice(0, 10)
        .map((item: any) => {
          const video = item.video || item;
          return {
            id: video.videoId || video.id || Math.random().toString(36),
            videoId: video.videoId || video.id,
            title: video.title || 'Unknown Title',
            artist: video.author?.name || video.channelTitle || video.channel?.name || 'Unknown Artist',
            thumbnailUrl: video.thumbnails?.[0]?.url || video.thumbnail || video.thumbnails?.high?.url,
            duration: video.lengthSeconds || video.duration || 0,
            views: video.viewCount || video.viewCountText ? parseInt(String(video.viewCount || video.viewCountText).replace(/[^0-9]/g, '')) : 0,
            description: video.description || video.shortDescription || '',
            publishDate: video.publishedTimeText || video.publishedAt || '',
          };
        });

      const mainResult = tracks.length > 0 ? tracks[0] : null;
      const otherResults = tracks.length > 1 ? tracks.slice(1) : [];

      if (!mainResult) {
        throw new Error("No results found");
      }

      return {
        mainResult,
        otherResults
      };
    } catch (rapidApiError) {
      console.error("RapidAPI fallback also failed:", rapidApiError);
    }
  }
  
  // Final fallback to mock data
  console.log("Using mock data as final fallback");
  return mockSearchResults;
}

/**
 * Search for a specific YouTube video by ID
 * @param videoId YouTube video ID
 * @returns Search results
 */
export async function searchByVideoId(videoId: string): Promise<SearchResult> {
  if (USE_MOCK_DATA) {
    console.log("Using mock data for video ID search");
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockSearchResults;
  }

  try {
    // Try backend API first
    const response = await apiRequest(
      "GET",
      `/api/search/video?id=${encodeURIComponent(videoId)}`,
    );

    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error("Backend video search failed:", error);
  }

  // Fallback to RapidAPI if enabled
  if (USE_EXTERNAL_APIS) {
    try {
      const videoData = await rapidApiRequest(
        RAPIDAPI_HOST_YT_SEARCH,
        '/video/info',
        { id: videoId }
      );

      if (!videoData) {
        throw new Error("No video data found");
      }

      const track: Track = {
        id: videoData.videoId || videoId,
        videoId: videoData.videoId || videoId,
        title: videoData.title || 'Unknown Title',
        artist: videoData.author?.name || videoData.channelTitle || 'Unknown Artist',
        thumbnailUrl: videoData.thumbnails?.[0]?.url || videoData.thumbnail,
        duration: videoData.lengthSeconds || 0,
        views: videoData.viewCount || 0,
        description: videoData.description || '',
        publishDate: videoData.publishDate || '',
      };

      return {
        mainResult: track,
        otherResults: []
      };
    } catch (error) {
      console.error("RapidAPI video search failed:", error);
    }
  }

  // Final fallback to mock data
  return mockSearchResults;
}

/**
 * Search specifically for tracks by lyrics
 * @param lyrics Lyrics snippet to search for
 * @returns Search results matching the lyrics
 */
export async function searchByLyrics(lyrics: string): Promise<SearchResult> {
  if (USE_MOCK_DATA) {
    console.log("Using mock lyrics search");
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo purposes, if the lyrics contain specific words, return matching tracks
    const lyricsLower = lyrics.toLowerCase();
    let mainResult = mockTracks[0]; // Default to first track

    if (
      lyricsLower.includes("never gonna give you up") ||
      lyricsLower.includes("strangers to love")
    ) {
      mainResult = mockTracks[0]; // Rick Astley
    } else if (
      lyricsLower.includes("gangnam") ||
      lyricsLower.includes("style")
    ) {
      mainResult = mockTracks[2]; // Gangnam Style
    } else if (lyricsLower.includes("despacito")) {
      mainResult = mockTracks[3]; // Despacito
    } else if (
      lyricsLower.includes("shape of you") ||
      lyricsLower.includes("bed of my love")
    ) {
      mainResult = mockTracks[4]; // Shape of You
    }

    // Filter out the main result from other results
    const otherResults = mockTracks.filter(
      (track) => track.id !== mainResult.id,
    );

    return {
      mainResult,
      otherResults: otherResults.slice(0, 4), // Limit to 4 other results
    };
  }

  // Skip backend for lyrics search since /api/search/lyrics endpoint doesn't exist
  // Go directly to RapidAPI for lyrics search
  if (USE_EXTERNAL_APIS) {
    console.log('🎵 Using RapidAPI for lyrics search:', lyrics);
    try {
      console.log('🎵 Searching Genius API for lyrics:', lyrics);
      
      // Try different possible endpoints for Genius API by Glavier
      let lyricsData;
      try {
        // First try /search endpoint
        lyricsData = await rapidApiRequest(
          RAPIDAPI_HOST_LYRICS,
          '/search',
          { q: lyrics }
        );
      } catch (error) {
        console.log('❌ /search endpoint failed, trying /songs/search');
        // Try alternative endpoint
        lyricsData = await rapidApiRequest(
          RAPIDAPI_HOST_LYRICS,
          '/songs/search',
          { q: lyrics }
        );
      }

      console.log('🎵 Genius API response:', lyricsData);

      if (!lyricsData || !lyricsData.hits || !lyricsData.hits.length) {
        console.log('❌ No lyrics results found in Genius response');
        throw new Error("No lyrics results found");
      }

      const topResult = lyricsData.hits[0].result;
      console.log('🎵 Found song:', topResult.title, 'by', topResult.primary_artist.name);
      
      const songQuery = `${topResult.title} ${topResult.primary_artist.name}`;
      const ytResults = await searchTracks(songQuery);
      
      if (ytResults.mainResult) {
        ytResults.mainResult.lyrics = await getLyrics(
          ytResults.mainResult.title,
          ytResults.mainResult.artist
        ).catch(() => "Lyrics not available");
      }
      
      return ytResults;
    } catch (error) {
      console.error("External lyrics search failed:", error);
    }
  }

  throw new Error("Failed to search by lyrics");
}

/**
 * Search for tracks on Spotify
 * @param query Search query
 * @returns Search results
 */
export async function searchSpotify(query: string): Promise<SearchResult> {
  if (USE_MOCK_DATA) {
    console.log("Using mock Spotify search");
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockSearchResults;
  }
  
  try {
    // Search Spotify via RapidAPI (Spotify Data API by Glavier)
    const spotifyData = await rapidApiRequest(
      RAPIDAPI_HOST_SPOTIFY,
      '/search',
      { q: query, type: 'track', limit: '10' }
    );
    
    console.log('🎵 Spotify API response structure:', JSON.stringify(spotifyData, null, 2));
    
    if (!spotifyData || !spotifyData.tracks || !spotifyData.tracks.items) {
      throw new Error("Invalid response from Spotify API");
    }
    
    // Map Spotify results to our Track schema with better error handling
    const tracks: Track[] = spotifyData.tracks.items.map((item: any) => {
      // Safe artist extraction with fallback
      let artistName = 'Unknown Artist';
      if (item.artists && Array.isArray(item.artists) && item.artists.length > 0) {
        artistName = item.artists.map((artist: any) => artist.name || 'Unknown').join(', ');
      } else if (item.artist) {
        artistName = item.artist;
      }
      
      return {
        id: item.id || `spotify_${Date.now()}`,
        videoId: item.id || `spotify_${Date.now()}`, // Use Spotify ID as videoId for now
        title: item.name || 'Unknown Title',
        artist: artistName,
        thumbnailUrl: item.album?.images?.[0]?.url || item.image || '',
        duration: item.duration_ms ? Math.floor(item.duration_ms / 1000) : 0,
        views: (item.popularity || 0) * 10000, // Convert popularity to estimated views
        description: `${item.name || 'Unknown'} by ${artistName}`,
        publishDate: item.album?.release_date || '',
        previewUrl: item.preview_url || '',
      };
    });
    
    // Format response according to our schema
    const mainResult = tracks.length > 0 ? tracks[0] : null;
    const otherResults = tracks.length > 1 ? tracks.slice(1) : [];
    
    if (!mainResult) {
      throw new Error("No Spotify results found");
    }
    
    return {
      mainResult,
      otherResults
    };
  } catch (error) {
    console.error("Failed to search Spotify via RapidAPI:", error);
    
    // Fallback to YouTube search
    return searchTracks(query);
  }
}

/**
 * Get search history
 * @returns Array of search history items
 */
export async function getSearchHistory(): Promise<any[]> {
  if (USE_MOCK_DATA) {
    console.log("Using mock search history");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockSearchHistory;
  }

  const response = await apiRequest("GET", "/api/searches/history");

  if (!response.ok) {
    throw new Error("Failed to get search history");
  }

  return response.json();
}

/**
 * Download a track
 * @param track Track to download
 * @param format Format (mp3, mp4, wav)
 * @returns Download URL
 */
export async function downloadTrack(
  track: Track,
  format: string = "mp3",
): Promise<string> {
  if (USE_MOCK_DATA) {
    console.log("Using mock download");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return `/api/downloads/files/${track.artist.replace(/\s+/g, "_").toLowerCase()}-${track.title.replace(/\s+/g, "_").toLowerCase()}.${format}`;
  }

  // Use YouTube to mp3 API for actual downloads with multiple endpoint attempts
  if (USE_EXTERNAL_APIS && track.videoId) {
    console.log('🎵 Attempting YouTube to mp3 API download for:', track.videoId);
    
    // Try multiple endpoint patterns for the YouTube MP3 Audio Video Downloader API
    const endpointPatterns = [
      `/mp3/${track.videoId}`,
      `/${track.videoId}`,
      `/download/${track.videoId}`,
      `/api/mp3/${track.videoId}`,
      `/v1/mp3/${track.videoId}`
    ];
    
    for (const endpoint of endpointPatterns) {
      try {
        console.log(`🔄 Trying endpoint: ${endpoint}`);
        
        const downloadData = await rapidApiRequest(
          RAPIDAPI_HOST_YT_DOWNLOAD,
          endpoint,
          {
            quality: 'low' // Optional quality parameter
          }
        );

        console.log('🎵 Download API response:', downloadData);

        if (downloadData && (downloadData.link || downloadData.url || downloadData.download_url)) {
          const downloadUrl = downloadData.link || downloadData.url || downloadData.download_url;
          console.log('✅ Download link found:', downloadUrl);
          return downloadUrl;
        }
      } catch (error: any) {
        console.log(`❌ Endpoint ${endpoint} failed:`, error.message);
        // Continue to next endpoint
      }
    }
    
    console.error("❌ All YouTube download endpoints failed, falling back to backend");
  }

  // Fallback to backend API
  const response = await apiRequest("POST", "/api/downloads", {
    videoId: track.videoId,
    format,
    title: track.title,
    artist: track.artist,
  });

  if (!response.ok) {
    throw new Error("Failed to download track");
  }

  const data = await response.json();
  return data.downloadUrl;
}

/**
 * Get download history
 * @returns Array of download records
 */
export async function getDownloadHistory(): Promise<any[]> {
  if (USE_MOCK_DATA) {
    console.log("Using mock download history");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockDownloads;
  }

  const response = await apiRequest("GET", "/api/downloads/history");

  if (!response.ok) {
    throw new Error("Failed to get download history");
  }

  return response.json();
}

/**
 * Get lyrics for a track
 * @param title Track title
 * @param artist Track artist
 * @returns Lyrics text
 */
export async function getLyrics(
  title: string,
  artist: string,
): Promise<string> {
  if (USE_MOCK_DATA) {
    console.log("Using mock lyrics");
    await new Promise((resolve) => setTimeout(resolve, 700));
    // Return some mock lyrics based on the title
    if (title.toLowerCase().includes("never gonna give you up")) {
      return "We're no strangers to love\nYou know the rules and so do I\nA full commitment's what I'm thinking of\nYou wouldn't get this from any other guy\nI just wanna tell you how I'm feeling\nGotta make you understand\n\nNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you";
    }
    return "Lyrics not found for this track.";
  }

  try {
    // First search for the song on Genius
    const searchData = await rapidApiRequest(
      RAPIDAPI_HOST_LYRICS,
      '/search',
      { q: `${title} ${artist}` }
    );
    
    if (!searchData || !searchData.hits || !searchData.hits.length) {
      throw new Error("No song found on Genius");
    }
    
    // Get the song ID from the top result
    const songId = searchData.hits[0].result.id;
    
    // Get the lyrics for this song
    const lyricsData = await rapidApiRequest(
      RAPIDAPI_HOST_LYRICS,
      `/song/lyrics/?id=${songId}`,
      {}
    );
    
    if (!lyricsData || !lyricsData.lyrics || !lyricsData.lyrics.lyrics) {
      throw new Error("No lyrics found for this song");
    }
    
    return lyricsData.lyrics.lyrics.body || "Lyrics not available";
  } catch (error) {
    console.error("Failed to get lyrics via RapidAPI:", error);
    
    // Fallback to our backend API
    const response = await apiRequest(
      "GET",
      `/api/lyrics?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to get lyrics");
    }

    const data = await response.json();
    return data.lyrics || "Lyrics not found for this track.";
  }
}
