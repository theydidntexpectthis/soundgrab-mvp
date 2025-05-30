import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Search, Mic, Music, Shuffle, AlignLeft, Video, Headphones } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { debounce, cn } from "@/lib/utils";

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

export function SearchBox({ onSearch }: SearchBoxProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Function to detect if input is a URL
  const isURL = (str: string): boolean => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  // Function to extract video ID from YouTube URL
  const extractYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search term or URL",
        variant: "destructive",
      });
      return;
    }

    let finalQuery = searchQuery;

    // Check if the input is a URL
    if (isURL(searchQuery)) {
      const videoId = extractYouTubeVideoId(searchQuery);
      if (videoId) {
        // If it's a YouTube URL, use the video ID for search
        finalQuery = `youtube:${videoId}`;
        toast({
          title: "URL Detected",
          description: "Searching for the YouTube video...",
        });
      } else {
        toast({
          title: "URL Detected",
          description: "Attempting to extract audio from URL...",
        });
      }
    }

    onSearch(finalQuery);

    try {
      // Save search query to history
      await apiRequest("POST", "/api/searches", { query: finalQuery });
      // Invalidate recent searches cache
      queryClient.invalidateQueries({ queryKey: ["/api/searches/recent"] });
    } catch (error) {
      console.error("Failed to save search:", error);
    }
  };

  const handleVoiceSearch = async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      toast({
        title: "Error",
        description: "Voice search is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunksRef.current.push(event.data);
      });

      mediaRecorderRef.current.addEventListener("stop", async () => {
        setIsRecording(false);

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const formData = new FormData();
        formData.append("audio", audioBlob);

        try {
          toast({
            title: "Processing",
            description: "Converting speech to text...",
          });

          const response = await fetch("/api/speech-to-text", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Speech-to-text failed");
          }

          const { text } = await response.json();

          if (text) {
            setSearchQuery(text);
            onSearch(text);
          } else {
            toast({
              title: "Error",
              description: "Could not recognize speech",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Speech-to-text error:", error);
          toast({
            title: "Error",
            description: "Failed to process voice search",
            variant: "destructive",
          });
        }

        // Stop all tracks in the stream
        stream.getTracks().forEach((track) => track.stop());
      });

      mediaRecorderRef.current.start();
      setIsRecording(true);

      toast({
        title: "Recording",
        description: "Speak now... Click the microphone again to stop.",
      });

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state === "recording"
        ) {
          mediaRecorderRef.current.stop();
        }
      }, 10000);
    } catch (error) {
      console.error("Microphone access error:", error);
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const debouncedSearch = debounce(() => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  }, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    debouncedSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-surface rounded-xl p-6 shadow-lg">
      <div className="flex items-center bg-surface-light rounded-lg p-2 mb-4">
        <Search className="text-muted-foreground mx-2 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by song name, lyrics, URL, or describe the music..."
          className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 p-2 rounded-full bg-surface hover:bg-primary/20 transition-all"
          title="Voice search"
          onClick={handleVoiceSearch}
        >
          <Mic
            className={cn(
              "text-muted-foreground hover:text-primary transition-colors",
              isRecording && "text-red-500 animate-pulse",
            )}
          />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          className="px-3 py-1 rounded-full text-xs bg-surface-light hover:bg-primary/20 text-muted-foreground transition-all"
        >
          <Music className="h-3 w-3 mr-1" /> Songs
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="px-3 py-1 rounded-full text-xs bg-surface-light hover:bg-primary/20 text-muted-foreground transition-all"
        >
          <Mic className="h-3 w-3 mr-1" /> Artists
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="px-3 py-1 rounded-full text-xs bg-surface-light hover:bg-primary/20 text-muted-foreground transition-all"
        >
          <AlignLeft className="h-3 w-3 mr-1" /> Lyrics
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="px-3 py-1 rounded-full text-xs bg-surface-light hover:bg-primary/20 text-muted-foreground transition-all"
        >
          <Headphones className="h-3 w-3 mr-1" /> Podcasts
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="px-3 py-1 rounded-full text-xs bg-surface-light hover:bg-primary/20 text-muted-foreground transition-all"
        >
          <Video className="h-3 w-3 mr-1" /> Videos
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          className="flex-1 py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4 mr-2" /> Search
        </Button>
        <Button
          variant="outline"
          className="flex-1 py-2 px-4 bg-surface-light hover:bg-surface/90 text-foreground rounded-lg font-medium transition-all"
          onClick={() => {
            const feelingLuckyQueries = [
              "top hits 2023",
              "best songs of all time",
              "viral tiktok songs",
              "relaxing music",
              "workout playlist",
            ];
            const randomQuery =
              feelingLuckyQueries[
                Math.floor(Math.random() * feelingLuckyQueries.length)
              ];
            setSearchQuery(randomQuery);
            onSearch(randomQuery);
          }}
        >
          <Shuffle className="h-4 w-4 mr-2" /> I'm Feeling Lucky
        </Button>
      </div>
    </div>
  );
}

