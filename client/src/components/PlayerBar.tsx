import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Download,
  List,
} from "lucide-react";
import { usePlayback } from "./Layout";
import { formatTime } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { checkFileExists, getDownloadedFileUrl } from "@/lib/downloadUtils";

export function PlayerBar() {
  const { currentTrack, isPlaying, togglePlayback, skipNext, skipPrevious } =
    usePlayback();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const { toast } = useToast();

  // Audio element reference
  const [audio] = useState(new Audio());

  useEffect(() => {
    // Set up audio element
    if (currentTrack) {
      // Get the downloaded file path using our utility function
      const downloadedFilePath = getDownloadedFileUrl(currentTrack, "mp3");
      
      // Create an async function to check if the file exists
      const setupAudio = async () => {
        // Check if the downloaded file exists
        const fileExists = await checkFileExists(downloadedFilePath)
          .catch(() => false);
        
        console.log(`Downloaded file ${downloadedFilePath} exists: ${fileExists}`);
        
        // Use previewUrl, audioUrl, downloaded file (if it exists), or fallback to a demo audio
        const audioSrc =
          currentTrack.previewUrl ||
          currentTrack.audioUrl ||
          (fileExists ? downloadedFilePath : null);

        // Ensure the audio source is valid with a proper fallback
        const validAudioSrc = audioSrc || `https://www.soundjay.com/misc/sounds/bell-ringing-01.mp3`;
        
        console.log("Attempting to play audio from:", validAudioSrc);

        audio.src = validAudioSrc;
        audio.volume = volume;
        audio.muted = isMuted;
        audio.crossOrigin = "anonymous"; // Enable CORS for external audio
        audio.preload = "auto"; // Preload audio data

        console.log(
          "Setting up audio for:",
          currentTrack.title,
          "with URL:",
          validAudioSrc,
        );

        if (isPlaying) {
          // Create a loading promise with timeout
          const playWithTimeout = () => {
            return Promise.race([
              audio.play(),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Playback timeout")), 3000)
              )
            ]);
          };

          // Try to play the audio
          playWithTimeout().catch((error) => {
            console.error("Failed to play audio:", error);
            toast({
              title: "Playback Error",
              description: "Could not play this track. Trying alternative source...",
              variant: "destructive",
            });

            // Check if the file exists on the server before trying an alternative
            fetch(audio.src, { method: 'HEAD' })
              .then(response => {
                if (!response.ok) {
                  throw new Error("File not found");
                }
                // File exists, try playing again
                return audio.play();
              })
              .catch(err => {
                console.error("File not found or cannot be played:", err);
                
                // Try an alternative source with MP3 format for better compatibility
                const alternativeSource = `https://www.soundjay.com/misc/sounds/bell-ringing-0${Math.floor(Math.random() * 5) + 1}.mp3`;
                console.log("Trying alternative source:", alternativeSource);
                audio.src = alternativeSource;
                
                // Try to play again
                audio.play().catch((playErr) => {
                  console.error("Alternative audio also failed:", playErr);
                  toast({
                    title: "Playback Failed",
                    description: "Could not play audio from any source. Please try another track.",
                    variant: "destructive",
                  });
                });
              });
          });
        } else {
          audio.pause();
        }
      };
      
      // Execute the async function
      setupAudio();

      // Set up event listeners
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        console.log("Audio loaded, duration:", audio.duration);
      };

      const handleEnded = () => {
        console.log("Audio ended, skipping to next");
        skipNext();
      };

      const handleError = (e: Event) => {
        console.error("Audio error:", e);
        toast({
          title: "Audio Error",
          description: "There was a problem loading the audio file.",
          variant: "destructive",
        });
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("error", handleError);

      // Clean up
      return () => {
        audio.pause();
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("error", handleError);
      };
    }
  }, [currentTrack, isPlaying, volume, isMuted, audio, skipNext, toast]);

  const handleSeek = (value: number[]) => {
    if (audio) {
      const newTime = value[0];
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audio) {
      audio.volume = newVolume;

      if (newVolume === 0) {
        setIsMuted(true);
        audio.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        audio.muted = false;
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audio) {
      audio.muted = !isMuted;
    }
  };

  const handleDownload = async () => {
    if (!currentTrack) return;

    try {
      toast({
        title: "Starting download",
        description: `Preparing ${currentTrack.title} for download...`,
      });

      const response = await apiRequest("POST", "/api/downloads", {
        videoId: currentTrack.videoId,
        format: "mp3",
        title: currentTrack.title,
        artist: currentTrack.artist,
      });

      if (response.ok) {
        toast({
          title: "Download started",
          description: `${currentTrack.title} will be downloaded shortly`,
        });
      } else {
        throw new Error("Download failed");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "There was an error preparing your download",
        variant: "destructive",
      });
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-surface-light p-3 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center w-1/4">
          <div className="w-12 h-12 rounded-md mr-3 bg-surface-light flex items-center justify-center overflow-hidden">
            {/* Audio visualization SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {Array(8)
                .fill(0)
                .map((_, i) => {
                  const height = isPlaying ? 30 + Math.random() * 40 : 20;
                  return (
                    <rect
                      key={i}
                      x={i * 12 + 4}
                      y={(100 - height) / 2}
                      width="8"
                      height={height}
                      rx="2"
                      fill="hsl(var(--primary))"
                      opacity={0.7 + Math.random() * 0.3}
                    />
                  );
                })}
            </svg>
          </div>
          <div className="truncate">
            <h4 className="font-medium text-sm truncate">
              {currentTrack.title}
            </h4>
            <p className="text-black dark:text-gray-300 text-xs truncate">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-md">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-text-secondary hover:text-text-primary transition-colors"
              onClick={skipPrevious}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-white p-2 rounded-full transition-all h-10 w-10"
              onClick={togglePlayback}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-text-secondary hover:text-text-primary transition-colors"
              onClick={skipNext}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center mt-1">
            <span className="text-black dark:text-gray-300 text-xs mr-2">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="flex-1 h-1"
            />
            <span className="text-black dark:text-gray-300 text-xs ml-2">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end w-1/4 space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-text-secondary hover:text-text-primary transition-colors"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-20 h-1"
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-text-secondary hover:text-text-primary transition-colors"
            onClick={handleDownload}
          >
            <Download className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <List className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
