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

export function DownloadSection() {
  const { toast } = useToast();
  
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
                          {formatFileSize(download.downloadedBytes)} / {formatFileSize(download.totalBytes)}
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
