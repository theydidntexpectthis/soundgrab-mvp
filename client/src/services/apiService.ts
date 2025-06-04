import { SearchResult, Track } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Environment-based API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');
const USE_EXTERNAL_APIS = import.meta.env.VITE_USE_EXTERNAL_APIS === 'true';

// RapidAPI configuration
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || "d42dbed423mshd69f27217e2311bp11bd5cjsnc2b55ca495da";

// RapidAPI hosts
const RAPIDAPI_HOST_YT_SEARCH = "youtube-search-and-download.p.rapidapi.com";
const RAPIDAPI_HOST_YT_DOWNLOAD = "youtube-mp3-audio-video-downloader.p.rapidapi.com";
const RAPIDAPI_HOST_SPOTIFY = "spotify23.p.rapidapi.com";
const RAPIDAPI_HOST_LYRICS = "genius-song-lyrics1.p.rapidapi.com";

/**
 * Make a request to RapidAPI
 */
async function rapidApiRequest(host: string, endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`https://${host}${endpoint}`);
  
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
  
  const response = await fetch(url.toString(), options);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`RapidAPI request failed with status ${response.status}: ${errorText}`);
  }
  
  return response.json();
}

/**
 * Search for tracks by query
 */
export async function searchTracks(
  query: string,
  sortBy: string = "relevance",
): Promise<SearchResult> {
  // Handle YouTube URL searches
  if (query.startsWith('youtube:')) {
    const videoId = query.replace('youtube:', '');
    return searchByVideoId(videoId);
  }

  try {
    // Try YouTube search via RapidAPI
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

    if (!ytData || (!ytData.contents && !ytData.videos && !ytData.items)) {
      throw new Error("Invalid response from YouTube API");
    }

    let videos = ytData.contents || ytData.videos || ytData.items || [];
    
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
  } catch (error) {
    console.error("YouTube search failed:", error);
    throw error;
  }
}

/**
 * Search for a specific YouTube video by ID
 */
export async function searchByVideoId(videoId: string): Promise<SearchResult> {
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
    console.error("Video search failed:", error);
    throw error;
  }
}

/**
 * Search by lyrics
 */
export async function searchByLyrics(lyrics: string): Promise<SearchResult> {
  try {
    // Try different possible endpoints
    let lyricsData;
    try {
      lyricsData = await rapidApiRequest(
        RAPIDAPI_HOST_LYRICS,
        '/search',
        { q: lyrics }
      );
    } catch (error) {
      lyricsData = await rapidApiRequest(
        RAPIDAPI_HOST_LYRICS,
        '/songs/search',
        { q: lyrics }
      );
    }

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
    console.error("Lyrics search failed:", error);
    throw error;
  }
}

/**
 * Download a track
 */
export async function downloadTrack(
  track: Track,
  format: string = "mp3",
): Promise<string> {
  try {
    // Try multiple endpoint patterns
    const endpointPatterns = [
      `/mp3/${track.videoId}`,
      `/${track.videoId}`,
      `/download/${track.videoId}`,
      `/api/mp3/${track.videoId}`,
      `/v1/mp3/${track.videoId}`
    ];
    
    for (const endpoint of endpointPatterns) {
      try {
        const downloadData = await rapidApiRequest(
          RAPIDAPI_HOST_YT_DOWNLOAD,
          endpoint,
          { quality: 'low' }
        );

        if (downloadData && (downloadData.link || downloadData.url || downloadData.download_url)) {
          return downloadData.link || downloadData.url || downloadData.download_url;
        }
      } catch (error) {
        console.log(`Endpoint ${endpoint} failed:`, error.message);
        continue;
      }
    }
    
    throw new Error("All download endpoints failed");
  } catch (error) {
    console.error("Download failed:", error);
    throw error;
  }
}

/**
 * Get lyrics for a track
 */
export async function getLyrics(
  title: string,
  artist: string,
): Promise<string> {
  try {
    // Search for the song on Genius
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
    console.error("Failed to get lyrics:", error);
    throw error;
  }
}