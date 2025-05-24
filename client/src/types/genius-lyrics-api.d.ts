declare module 'genius-lyrics-api' {
  interface GeniusOptions {
    apiKey: string;
    title: string;
    artist: string;
    optimizeQuery?: boolean;
  }

  interface GeniusSong {
    id: number;
    title: string;
    artist: string;
    lyrics: string;
    albumArt?: string;
  }

  export function getLyrics(options: GeniusOptions): Promise<string | null>;
  export function getSong(options: GeniusOptions): Promise<GeniusSong | null>;
  export function searchSong(options: GeniusOptions): Promise<GeniusSong | null>;
}