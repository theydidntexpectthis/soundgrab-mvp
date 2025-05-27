import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { PlayerBar } from "./PlayerBar";
import { Track } from "@shared/schema";

interface LayoutProps {
  children: React.ReactNode;
}

export interface PlaybackContext {
  currentTrack: Track | null;
  isPlaying: boolean;
  setCurrentTrack: (track: Track | null) => void;
  togglePlayback: () => void;
  queue: Track[];
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  skipNext: () => void;
  skipPrevious: () => void;
}

// Create a context for global playback state
import { createContext, useContext } from "react";

export const PlaybackContext = createContext<PlaybackContext | undefined>(
  undefined,
);

export function usePlayback() {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error("usePlayback must be used within a PlaybackProvider");
  }
  return context;
}

export function Layout({ children }: LayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);

  // Playback control functions
  const togglePlayback = () => {
    setIsPlaying((prev) => !prev);
  };

  const addToQueue = (track: Track) => {
    setQueue((prev) => [...prev, track]);
  };

  const removeFromQueue = (trackId: string) => {
    setQueue((prev) => prev.filter((t) => t.id !== trackId));
  };

  const skipNext = () => {
    if (queue.length > 0 && currentTrack) {
      const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
      if (currentIndex < queue.length - 1) {
        setCurrentTrack(queue[currentIndex + 1]);
      } else if (queue.length > 0) {
        // Loop back to first track
        setCurrentTrack(queue[0]);
      }
    }
  };

  const skipPrevious = () => {
    if (queue.length > 0 && currentTrack) {
      const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
      if (currentIndex > 0) {
        setCurrentTrack(queue[currentIndex - 1]);
      } else if (queue.length > 0) {
        // Loop to last track
        setCurrentTrack(queue[queue.length - 1]);
      }
    }
  };

  const playbackValue: PlaybackContext = {
    currentTrack,
    isPlaying,
    setCurrentTrack,
    togglePlayback,
    queue,
    addToQueue,
    removeFromQueue,
    skipNext,
    skipPrevious,
  };

  return (
    <PlaybackContext.Provider value={playbackValue}>
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar
          isOpen={isMobileSidebarOpen}
          onToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        <main className="flex-1 md:ml-64 p-4">{children}</main>

        {currentTrack && <PlayerBar />}
      </div>
    </PlaybackContext.Provider>
  );
}
