import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProgressRing } from "./ProgressRing";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Download } from "@shared/schema";
import { Pause, X } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { estimateMiningCapacity, estimateMiningRevenue } from "@/lib/minerConfig";

export function DownloadSection() {
  const { toast } = useToast();
  const dailyVisitors = 1000; // Example value, replace with actual data
  const clickRate = 5; // Example value, replace with actual data
  const retentionDays = 7; // Example value, replace with actual data
  const xmrPriceUsd = 150; // Example value, replace with actual data

  const miningCapacity = estimateMiningCapacity(dailyVisitors, clickRate, retentionDays);
  const miningRevenue = estimateMiningRevenue(miningCapacity, xmrPriceUsd);


  const {
    data: activeDownloads,
    isLoading,
    refetch
  } = useQuery<Download[]>({
    queryKey: ["/api/downloads/active"],
    refetchInterval: 2000, // Poll every 2 seconds to update progress
  });

  const handlePauseDownload = async (downloadId: string) => {
    try {
      await apiRequest("PATCH", `/api/downloads/${downloadId}/pause`, {});
      refetch();

      toast({
        title: "Download paused",
        description: "You can resume it later from the downloads page"
      });
    } catch (error) {
      console.error("Failed to pause download:", error);
      toast({
        title: "Error",
        description: "Failed to pause download",
        variant: "destructive"
      });
    }
  };

  const handleCancelDownload = async (downloadId: string) => {
    try {
      await apiRequest("DELETE", `/api/downloads/${downloadId}`, {});
      refetch();

      toast({
        title: "Download cancelled",
        description: "The download has been cancelled"
      });
    } catch (error) {
      console.error("Failed to cancel download:", error);
      toast({
        title: "Error",
        description: "Failed to cancel download",
        variant: "destructive"
      });
    }
  };

  return (
    <section className="mb-8">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-surface rounded-lg p-6">
          <h2 className="text-xl font-heading font-bold mb-4">Active Downloads</h2>

          {/* Roadmap Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center">
              🚀 <span className="ml-2">SoundGrab Roadmap 2024</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="space-y-2">
                <h4 className="font-medium text-xs text-text-primary">🤖 AI Features</h4>
                <ul className="text-text-secondary text-xs space-y-1">
                  <li>• ChatGPT Bot integration</li>
                  <li>• Voice-powered music discovery</li>
                  <li>• Smart playlist generation</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-xs text-text-primary">🎬 Streaming Platforms</h4>
                <ul className="text-text-secondary text-xs space-y-1">
                  <li>• Netflix audio extraction</li>
                  <li>• Spotify playlist import</li>
                  <li>• Disney+ soundtrack downloads</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-text-secondary text-xs">Join our community:</span>
                <div className="flex items-center space-x-2">
                  <a href="#" className="text-[#5865F2] hover:text-[#4752C4] transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-[#FF4500] hover:text-[#FF5722] transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                    </svg>
                  </a>
                </div>
              </div>
              <span className="text-text-secondary text-xs">Free streaming coming soon!</span>
            </div>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              // Loading skeletons
              Array(2).fill(0).map((_, i) => (
                <Card key={i} className="bg-surface-light rounded-lg p-4">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Skeleton className="w-10 h-10 rounded-full mr-3" />
                        <div>
                          <Skeleton className="w-36 h-4 mb-1" />
                          <Skeleton className="w-24 h-3" />
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Skeleton className="w-32 h-3 mr-3" />
                        <Skeleton className="w-6 h-6 rounded-full mr-1" />
                        <Skeleton className="w-6 h-6 rounded-full" />
                      </div>
                    </div>
                    <Skeleton className="w-full h-1 rounded-full" />
                  </CardContent>
                </Card>
              ))
            ) : activeDownloads && activeDownloads.length > 0 ? (
              activeDownloads.map((download) => (
                <Card key={download.id} className="bg-surface-light rounded-lg p-4">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <ProgressRing
                          progress={download.progress}
                          size={40}
                          className="mr-3"
                        />
                        <div>
                          <h3 className="font-medium text-sm">{download.title}</h3>
                          <p className="text-text-secondary text-xs">{download.artist}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-text-secondary text-xs mr-3">
                          {download.fileSize ? formatFileSize(download.fileSize * (download.progress / 100)) : '0 KB'} /
                          {download.fileSize ? formatFileSize(download.fileSize) : 'Unknown'}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-text-secondary hover:text-primary p-1 transition-colors h-7 w-7"
                          onClick={() => handlePauseDownload(download.id)}
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-text-secondary hover:text-red-500 p-1 transition-colors h-7 w-7"
                          onClick={() => handleCancelDownload(download.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="h-1 bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${download.progress}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="bg-surface-light rounded-lg p-4 border border-dashed border-text-secondary/30 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-text-secondary text-sm mb-2">No active downloads</p>
                  <p className="text-text-secondary text-xs">Search for songs to download more</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
