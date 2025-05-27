// User types for future database integration
export interface User {
  id: number;
  username: string;
  password: string;
}

export interface InsertUser {
  username: string;
  password: string;
}

// Track interface for audio tracks
export interface Track {
  id: string;
  videoId: string;
  title: string;
  artist: string;
  thumbnailUrl?: string;
  duration: number;
  views: number;
  description?: string;
  publishDate?: string;
  lyrics?: string;
  audioUrl?: string;
  previewUrl?: string; // URL for audio preview/streaming
}

// Search results interface
export interface SearchResult {
  mainResult: Track;
  otherResults: Track[];
}

// Search history type
export interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
  results: Track[];
  track?: Track; // Optional track directly associated with this search
}

// Download interface for tracking active and completed downloads
export interface Download {
  id: string;
  track: Track;
  title: string; // Track title for easy access
  artist: string; // Track artist for easy access
  progress: number; // 0-100
  status: 'queued' | 'downloading' | 'processing' | 'completed' | 'error';
  error?: string;
  startTime: Date;
  completedTime?: Date;
  fileSize?: number; // in bytes
  downloadedBytes?: number; // bytes downloaded so far
  totalBytes?: number; // total bytes to download
  filePath?: string;
  fileName?: string;
}
