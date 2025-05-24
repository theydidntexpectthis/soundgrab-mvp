import { SearchResult, Track } from "@shared/schema";

// Mock tracks for testing the UI
export const mockTracks: Track[] = [
  {
    id: "dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    title: "Never Gonna Give You Up",
    artist: "Rick Astley",
    thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    duration: 212,
    views: 1234567890,
    description: "The classic 1987 hit song by Rick Astley",
    publishDate: "2009-10-25",
    lyrics: "We're no strangers to love\nYou know the rules and so do I\nA full commitment's what I'm thinking of\nYou wouldn't get this from any other guy\nI just wanna tell you how I'm feeling\nGotta make you understand\n\nNever gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you"
  },
  {
    id: "y6120QOlsfU",
    videoId: "y6120QOlsfU",
    title: "Darude - Sandstorm",
    artist: "Darude",
    thumbnailUrl: "https://i.ytimg.com/vi/y6120QOlsfU/hqdefault.jpg",
    duration: 235,
    views: 284000000,
    description: "Darude - Sandstorm, the legendary electronic track",
    publishDate: "2010-01-26"
  },
  {
    id: "9bZkp7q19f0",
    videoId: "9bZkp7q19f0",
    title: "Gangnam Style",
    artist: "PSY",
    thumbnailUrl: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
    duration: 253,
    views: 4600000000,
    description: "PSY's global hit from 2012",
    publishDate: "2012-07-15"
  },
  {
    id: "kJQP7kiw5Fk",
    videoId: "kJQP7kiw5Fk",
    title: "Despacito",
    artist: "Luis Fonsi ft. Daddy Yankee",
    thumbnailUrl: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
    duration: 281,
    views: 7900000000,
    description: "Luis Fonsi - Despacito ft. Daddy Yankee",
    publishDate: "2017-01-12"
  },
  {
    id: "JGwWNGJdvx8",
    videoId: "JGwWNGJdvx8",
    title: "Shape of You",
    artist: "Ed Sheeran",
    thumbnailUrl: "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg",
    duration: 263,
    views: 5800000000,
    description: "Ed Sheeran's hit single from the album ÷ (Divide)",
    publishDate: "2017-01-30"
  }
];

// Mock search results
export const mockSearchResults: SearchResult = {
  mainResult: mockTracks[0],
  otherResults: mockTracks.slice(1)
};

// Mock search history
export const mockSearchHistory = [
  {
    id: "1",
    query: "never gonna give you up",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    results: [mockTracks[0]],
    track: mockTracks[0]
  },
  {
    id: "2",
    query: "sandstorm",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    results: [mockTracks[1]],
    track: mockTracks[1]
  },
  {
    id: "3",
    query: "gangnam style",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    results: [mockTracks[2]],
    track: mockTracks[2]
  }
];

// Mock downloads
export const mockDownloads = [
  {
    id: "dl_1",
    videoId: mockTracks[0].videoId,
    title: mockTracks[0].title,
    artist: mockTracks[0].artist,
    format: "mp3",
    filePath: "/downloads/rick_astley-never_gonna_give_you_up.mp3",
    downloadDate: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: "dl_2",
    videoId: mockTracks[1].videoId,
    title: mockTracks[1].title,
    artist: mockTracks[1].artist,
    format: "mp3",
    filePath: "/downloads/darude-sandstorm.mp3",
    downloadDate: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
  }
];