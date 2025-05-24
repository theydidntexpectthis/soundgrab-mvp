# SoundGrab - YouTube to MP3 Downloader

SoundGrab is an AI-powered YouTube-to-MP3 downloader with natural language and lyrics-based search capabilities. The application allows users to search for songs using song titles, artist names, or even lyrics snippets, then download them in various formats.

## Features

- **Intelligent Search**: Find tracks using natural language descriptions or lyrics snippets
- **Multi-format Downloads**: Download audio in MP3, WAV, or MP4 formats
- **Preview Functionality**: Listen to tracks before downloading
- **Search History**: Keep track of previous searches for quick access
- **Download History**: Access previously downloaded tracks easily
- **Audio Player**: Built-in player with queue management
- **Dark Mode Support**: Eye-friendly interface for night usage

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui components
- **Backend**: Express.js, Node.js
- **Libraries**:
  - ytdl-core: For YouTube video downloading
  - genius-lyrics-api: For lyrics search and retrieval
  - @tanstack/react-query: For data fetching and caching
  - wouter: For client-side routing

## API Integration

The application integrates with two primary external services:

1. **YouTube**: Used to search for and download videos
2. **Genius Lyrics API**: Used to search for lyrics by song or artist

## Setup and Configuration

### Prerequisites

- Node.js 16.x or higher
- Genius API Key (for lyrics search)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
GENIUS_API_KEY=your_genius_api_key_here
```

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Ad Placement Guide

SoundGrab includes strategic ad placements throughout the application to monetize the service while maintaining a good user experience.

### Ad Placement Locations

1. **Home Page**
   - Banner ad between search section and recent searches
   - Rectangle ad in the footer

2. **Search Results Page**
   - Rectangle ad between main result and other results
   - Small banner at the bottom of the page

3. **Downloads Page**
   - Rectangle ad at the bottom of the page

4. **Sidebar**
   - Small rectangle ad at the bottom of the sidebar
   - "Premium" upgrade promotion above it

### Ad Implementation

Ads are implemented as simple components that can be replaced with actual ad network code:

```jsx
<div className="bg-surface-light rounded-lg p-4 mb-6 flex items-center justify-between">
  <div>
    <p className="text-xs text-text-secondary mb-1">Sponsored</p>
    <div className="text-sm mb-1">Premium Music Production Tools</div>
    <p className="text-xs text-text-secondary">Professional-grade audio editing software.</p>
  </div>
  <Button className="bg-accent text-white px-4 py-2 rounded-lg text-sm">
    Try Free
  </Button>
</div>
```

To implement real ads:

1. Sign up for an ad network (Google AdSense, Media.net, etc.)
2. Replace the placeholder components with the ad network's code snippets
3. Make sure to follow the ad network's guidelines and policies

## Legal Considerations

SoundGrab is designed for educational purposes and personal use. Users should be aware of copyright laws in their respective countries and use the application responsibly. We recommend:

1. Using the application only for content you have the right to download
2. Not distributing downloaded content commercially
3. Supporting artists by purchasing their music through official channels

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.