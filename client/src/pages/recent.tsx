import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Clock, Search } from "lucide-react";
import { SearchHistory } from "@shared/schema";
import { usePlayback } from "@/components/Layout";
import { Link } from "wouter";

export default function RecentPage() {
  const {
    data: searchHistory,
    isLoading,
    isError,
  } = useQuery<SearchHistory[]>({
    queryKey: ["/api/searches/history"],
  });

  const { setCurrentTrack, addToQueue } = usePlayback();

  const handlePlayTrack = (track: any) => {
    if (track) {
      setCurrentTrack(track);
      addToQueue(track);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-heading font-bold">
            Recent Searches
          </h1>

          <Link href="/search">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Search className="h-4 w-4 mr-2" /> New Search
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="bg-surface">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <Skeleton className="w-12 h-12 rounded-md" />
                        <div>
                          <Skeleton className="w-48 h-5 mb-2" />
                          <Skeleton className="w-24 h-4" />
                        </div>
                      </div>
                      <Skeleton className="w-24 h-10 rounded-md" />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : isError ? (
          <Card className="bg-surface p-6 text-center">
            <h2 className="text-xl font-medium mb-2">Error Loading History</h2>
            <p className="text-text-secondary mb-4">
              There was a problem loading your search history.
            </p>
            <Button>Try Again</Button>
          </Card>
        ) : !searchHistory || searchHistory.length === 0 ? (
          <Card className="bg-surface p-6 text-center">
            <h2 className="text-xl font-medium mb-2">No Search History</h2>
            <p className="text-text-secondary mb-4">
              You haven't searched for any songs yet. Start by searching for
              your favorite music.
            </p>
            <Link href="/search">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Search Now
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {searchHistory.map((item) => (
              <Card
                key={item.id}
                className="bg-surface hover:bg-surface/90 transition-duration-200"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-md bg-surface-light flex items-center justify-center">
                        {item.track ? (
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            {Array(8)
                              .fill(0)
                              .map((_, i) => {
                                const height = 20 + Math.random() * 60;
                                return (
                                  <rect
                                    key={i}
                                    x={i * 12 + 4}
                                    y={(100 - height) / 2}
                                    width="8"
                                    height={height}
                                    rx="2"
                                    fill="hsl(var(--primary))"
                                    opacity={0.6 + Math.random() * 0.4}
                                  />
                                );
                              })}
                          </svg>
                        ) : (
                          <Search className="h-6 w-6 text-text-secondary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{item.query}</h3>
                        <div className="flex items-center text-text-secondary text-sm">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link href={`/search?q=${encodeURIComponent(item.query)}`}>
                      <Button variant="outline" size="sm" className="mr-2">
                        Search Again
                      </Button>
                    </Link>

                    {item.track && (
                      <Button
                        size="icon"
                        className="bg-primary hover:bg-primary/90 text-white rounded-full"
                        onClick={() => handlePlayTrack(item.track)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
