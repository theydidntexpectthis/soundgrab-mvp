import { useState, useRef, useEffect } from "react";
import { cn, formatTime } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  src: string;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  autoPlay?: boolean;
}

export function AudioPlayer({
  src,
  className,
  onPlay,
  onPause,
  onEnded,
  autoPlay = false,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // State to track loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (audioRef.current) {
      // Set audio properties
      audioRef.current.preload = "auto";
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
      audioRef.current.crossOrigin = "anonymous"; // Enable CORS for external audio
      
      // Reset error state when source changes
      setHasError(false);
      setErrorMessage("");
      
      // Add error handler
      const handleError = (e: Event) => {
        console.error("Audio error:", e);
        setHasError(true);
        setIsPlaying(false);
        setErrorMessage("Could not play this audio file. The file may be missing or in an unsupported format.");
      };
      
      audioRef.current.addEventListener("error", handleError);
      
      // Handle autoplay if enabled
      if (autoPlay) {
        setIsLoading(true);
        // Verify file exists before attempting to play
        fetch(src, { method: 'HEAD' })
          .then(response => {
            if (!response.ok) {
              throw new Error("File not found");
            }
            // Small delay to ensure audio is loaded
            return new Promise(resolve => setTimeout(resolve, 100));
          })
          .then(() => {
            if (audioRef.current) {
              return audioRef.current.play();
            }
          })
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error("Auto play failed:", err);
            setIsLoading(false);
            
            // Try again with user interaction simulation
            document.addEventListener('click', function playOnClick() {
              setIsLoading(true);
              audioRef.current?.play()
                .then(() => {
                  setIsPlaying(true);
                  setIsLoading(false);
                })
                .catch(e => {
                  console.error("Play on click failed:", e);
                  setIsLoading(false);
                  setHasError(true);
                  setErrorMessage("Could not play this audio file after user interaction.");
                });
              document.removeEventListener('click', playOnClick);
            }, { once: true });
          });
      }
    }
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("error", () => {});
      }
    };
  }, [autoPlay, src, volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        onPause?.();
      } else {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            onPlay?.();
          })
          .catch((err) => console.error("Play failed:", err));
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      setIsMuted(!isMuted);
      audioRef.current.muted = !isMuted;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
        audioRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  const handleSeek = (value: number[]) => {
    const seekTime = value[0];
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  return (
    <div className={cn("flex flex-col w-full", className)}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
      />

      {hasError && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs p-2 rounded-md mb-2">
          {errorMessage}
        </div>
      )}

      <div className="flex items-center space-x-2 mb-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={togglePlay}
          className="h-8 w-8 rounded-full"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </Button>

        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="flex-1"
        />

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={toggleMute}
          className="h-8 w-8 rounded-full"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </Button>

        <Slider
          value={[isMuted ? 0 : volume]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="w-20"
        />
      </div>

      <div className="flex justify-between text-black dark:text-gray-300 text-xs">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
