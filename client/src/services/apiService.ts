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

// Debug logging for API configuration
console.log('🔧 API Configuration Debug:');
console.log('- USE_MOCK_DATA:', USE_MOCK_DATA);
console.log('- API_BASE_URL:', API_BASE_URL);
console.log('- USE_EXTERNAL_APIS:', USE_EXTERNAL_APIS);
console.log('- RAPIDAPI_KEY:', RAPIDAPI_KEY ? 'Set' : 'Not set');
const RAPIDAPI_HOST_YT = "youtube-search-and-download.p.rapidapi.com";
const RAPIDAPI_HOST_SPOTIFY = "spotify23.p.rapidapi.com";
const RAPIDAPI_HOST_LYRICS = "genius-song-lyrics1.p.rapidapi.com";

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
  
  try {
    const response = await fetch(url.toString(), options);
    
    if (!response.ok) {
      throw new Error(`RapidAPI request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('RapidAPI request failed:', error);
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

  try {
    // Always use our backend API for consistency
    const apiUrl = `${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}&sort=${sortBy}`;
    console.log('🔍 Attempting API search:', apiUrl);
    
    const response = await apiRequest(
      "GET",
      apiUrl,
    );

    if (!response.ok) {
      throw new Error("Failed to search for tracks");
    }

    const result = await response.json();
    console.log('✅ API search successful:', result);
    return result;
  } catch (error) {
    console.error("❌ Failed to search tracks:", error);
    
    // If external APIs are enabled and backend fails, try RapidAPI as fallback
    if (USE_EXTERNAL_APIS) {
      try {
        console.log("Trying RapidAPI fallback for query:", query);
        
        const ytData = await rapidApiRequest(
          RAPIDAPI_HOST_YT,
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
        
        // Return mock data as final fallback
        console.log("Using mock data as final fallback");
        return mockSearchResults;
      }
    }
    
    // Return mock data as fallback if external APIs are disabled
    console.log("Using mock data as fallback");
    return mockSearchResults;
  }
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
        RAPIDAPI_HOST_YT,
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

  try {
    // Use our backend API first
    const response = await apiRequest(
      "GET",
      `/api/search/lyrics?q=${encodeURIComponent(lyrics)}`,
    );

    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error("Backend lyrics search failed:", error);
  }

  // Fallback to external API if enabled
  if (USE_EXTERNAL_APIS) {
    try {
      const lyricsData = await rapidApiRequest(
        RAPIDAPI_HOST_LYRICS,
        '/search',
        { q: lyrics }
      );

      if (!lyricsData || !lyricsData.hits || !lyricsData.hits.length) {
        throw new Error("No lyrics results found");
      }

      const topResult = lyricsData.hits[0].result;
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
    // Search Spotify via RapidAPI
    const spotifyData = await rapidApiRequest(
      RAPIDAPI_HOST_SPOTIFY,
      '/search/',
      { q: query, type: 'tracks', limit: '10' }
    );
    
    if (!spotifyData || !spotifyData.tracks || !spotifyData.tracks.items) {
      throw new Error("Invalid response from Spotify API");
    }
    
    // Map Spotify results to our Track schema
    const tracks: Track[] = spotifyData.tracks.items.map((item: any) => {
      return {
        id: item.id,
        videoId: item.id, // Use Spotify ID as videoId for now
        title: item.name,
        artist: item.artists.map((artist: any) => artist.name).join(', '),
        thumbnailUrl: item.album?.images?.[0]?.url,
        duration: Math.floor(item.duration_ms / 1000),
        views: item.popularity * 10000, // Convert popularity to estimated views
        description: `${item.name} by ${item.artists.map((artist: any) => artist.name).join(', ')}`,
        publishDate: item.album?.release_date,
        previewUrl: item.preview_url,
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
