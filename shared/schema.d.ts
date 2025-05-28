export interface User {
    id: number;
    username: string;
    password: string;
}
export interface InsertUser {
    username: string;
    password: string;
}
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
    previewUrl?: string;
}
export interface SearchResult {
    mainResult: Track;
    otherResults: Track[];
}
export interface SearchHistory {
    id: string;
    query: string;
    timestamp: Date;
    results: Track[];
    track?: Track;
}
export interface Download {
    id: string;
    track: Track;
    title: string;
    artist: string;
    progress: number;
    status: 'queued' | 'downloading' | 'processing' | 'completed' | 'error';
    error?: string;
    startTime: Date;
    completedTime?: Date;
    fileSize?: number;
    downloadedBytes?: number;
    totalBytes?: number;
    filePath?: string;
    fileName?: string;
}
//# sourceMappingURL=schema.d.ts.map