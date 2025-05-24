import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play } from "lucide-react";
import { SearchHistory } from "@shared/schema";
import { usePlayback } from "./Layout";
import { getSearchHistory } from "@/services/apiService";

interface RecentSearchesProps {
  onSelect: (query: string) => void;
}

export function RecentSearches({ onSelect }: RecentSearchesProps) {
  const { data: recentSearches, isLoading } = useQuery<SearchHistory[]>({
    queryKey: ['search-history'],
    queryFn: () => getSearchHistory(),
  });
  
  const { setCurrentTrack, addToQueue } = usePlayback();
  
  const handlePlayTrack = (track: any) => {
    if (track) {
      setCurrentTrack(track);
      addToQueue(track);
    }
  };
  
  const handleSelect = (query: string) => {
    onSelect(query);
  };
  
  return (
    <section className="mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading font-bold">Recent Searches</h2>
          <Button variant="link" className="text-sm text-primary hover:underline">
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading ? (
            // Loading skeleton
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="bg-surface p-3 rounded-lg">
                <CardContent className="p-0">
                  <Skeleton className="w-full h-32 rounded-md mb-2" />
                  <Skeleton className="w-3/4 h-4 mb-2" />
                  <Skeleton className="w-1/2 h-3" />
                </CardContent>
              </Card>
            ))
          ) : recentSearches && recentSearches.length > 0 ? (
            recentSearches.map((item) => (
              <Card 
                key={item.id} 
                className="bg-surface p-3 rounded-lg hover:bg-surface-light transition-all cursor-pointer"
                onClick={() => handleSelect(item.query)}
              >
                <CardContent className="p-0">
                  <div className="relative mb-2">
                    {/* Audio visualization SVG */}
                    <svg 
                      viewBox="0 0 100 100" 
                      className="w-full h-32 object-cover rounded-md"
                      style={{ background: "hsl(var(--surface-light))" }}
                    >
                      {/* Generate random audio waveform */}
                      {Array(20).fill(0).map((_, i) => {
                        const height = 30 + Math.random() * 40;
                        return (
                          <rect 
                            key={i} 
                            x={i * 5} 
                            y={(100 - height) / 2}
                            width="3" 
                            height={height}
                            rx="1"
                            fill="hsl(var(--primary))"
                            opacity={0.6 + Math.random() * 0.4}
                          />
                        );
                      })}
                    </svg>
                    
                    <Button
                      size="icon"
                      className="absolute bottom-2 right-2 bg-primary hover:bg-primary/90 text-white rounded-full p-2 opacity-90 hover:opacity-100 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.track) {
                          handlePlayTrack(item.track);
                        } else {
                          handleSelect(item.query);
                        }
                      }}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                  <h3 className="font-medium text-sm truncate">{item.query}</h3>
                  {item.track && (
                    <p className="text-text-secondary text-xs truncate">{item.track.artist}</p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-4 bg-surface p-6 rounded-lg text-center">
              <p className="text-text-secondary">No recent searches yet</p>
              <p className="text-text-secondary text-sm mt-2">
                Search for songs to see them here
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
