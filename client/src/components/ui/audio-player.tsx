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

  useEffect(() => {
    if (audioRef.current) {
      // Set audio properties
      audioRef.current.preload = "auto";
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
      
      // Handle autoplay if enabled
      if (autoPlay) {
        // Small delay to ensure audio is loaded
        setTimeout(() => {
          audioRef.current
            ?.play()
            .then(() => setIsPlaying(true))
            .catch((err) => {
              console.error("Auto play failed:", err);
              // Try again with user interaction simulation
              document.addEventListener('click', function playOnClick() {
                audioRef.current?.play()
                  .then(() => setIsPlaying(true))
                  .catch(e => console.error("Play on click failed:", e));
                document.removeEventListener('click', playOnClick);
              }, { once: true });
            });
        }, 100);
      }
    }
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
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

      <div className="flex justify-between text-text-secondary text-xs">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
