import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Music } from "lucide-react";

interface LyricsSearchBoxProps {
  onSearch: (lyrics: string) => void;
  isSearching?: boolean;
}

export function LyricsSearchBox({ onSearch, isSearching = false }: LyricsSearchBoxProps) {
  const [lyrics, setLyrics] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lyrics.trim()) {
      onSearch(lyrics.trim());
    }
  };
  
  return (
    <Card className="bg-surface shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <Music size={18} className="text-primary" />
              <h3 className="text-lg font-medium">Search by Lyrics</h3>
            </div>
            
            <p className="text-text-secondary text-sm mb-2">
              Paste a few lines of lyrics to find the song you're looking for
            </p>
            
            <Textarea
              placeholder="Enter lyrics here... (e.g. 'never gonna give you up, never gonna let you down')"
              className="min-h-[120px] resize-y bg-surface-light"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
            />
            
            <Button 
              type="submit" 
              className="mt-2 bg-primary hover:bg-primary/90 flex items-center gap-2"
              disabled={isSearching || !lyrics.trim()}
            >
              <Search size={16} />
              {isSearching ? "Searching..." : "Find Song"}
            </Button>
            
            <div className="mt-2 text-xs text-text-secondary">
              <p>Tips:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Enter at least a full line of lyrics for better results</li>
                <li>Include a unique part of the song if possible</li>
                <li>The more accurate the lyrics, the better the results</li>
              </ul>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}