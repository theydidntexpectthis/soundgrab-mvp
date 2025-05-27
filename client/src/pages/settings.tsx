import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    geniusApiKey: "",
    downloadFormat: "mp3",
    downloadPath: "~/Downloads",
    saveSearchHistory: true,
    playbackQuality: "high",
  });

  const handleSaveSettings = () => {
    // In a real implementation, this would save to localStorage or an API
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleClearHistory = () => {
    // In a real implementation, this would clear history from storage
    toast({
      title: "History Cleared",
      description: "Your search and download history has been cleared.",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-surface">
          <CardHeader>
            <CardTitle>API Connections</CardTitle>
            <CardDescription>
              Connect to external services to enhance functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="genius-api-key">Genius API Key</Label>
                <Input
                  id="genius-api-key"
                  type="password"
                  placeholder="Enter your Genius API key"
                  value={settings.geniusApiKey}
                  onChange={(e) =>
                    setSettings({ ...settings, geniusApiKey: e.target.value })
                  }
                  className="bg-surface-light mt-1"
                />
                <p className="text-text-secondary text-xs mt-1">
                  Used for lyrics search and retrieval. Get a key at{" "}
                  <a
                    href="https://genius.com/api-clients"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    genius.com/api-clients
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface">
          <CardHeader>
            <CardTitle>Download Settings</CardTitle>
            <CardDescription>
              Configure how your music is downloaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="download-format">Default Format</Label>
                <Select
                  value={settings.downloadFormat}
                  onValueChange={(value) =>
                    setSettings({ ...settings, downloadFormat: value })
                  }
                >
                  <SelectTrigger
                    id="download-format"
                    className="bg-surface-light mt-1"
                  >
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp3">MP3</SelectItem>
                    <SelectItem value="wav">WAV</SelectItem>
                    <SelectItem value="mp4">MP4 (Audio)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="download-path">Download Location</Label>
                <Input
                  id="download-path"
                  placeholder="Path to download folder"
                  value={settings.downloadPath}
                  onChange={(e) =>
                    setSettings({ ...settings, downloadPath: e.target.value })
                  }
                  className="bg-surface-light mt-1"
                />
              </div>

              <div>
                <Label htmlFor="playback-quality">Playback Quality</Label>
                <Select
                  value={settings.playbackQuality}
                  onValueChange={(value) =>
                    setSettings({ ...settings, playbackQuality: value })
                  }
                >
                  <SelectTrigger
                    id="playback-quality"
                    className="bg-surface-light mt-1"
                  >
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (64kbps)</SelectItem>
                    <SelectItem value="medium">Medium (128kbps)</SelectItem>
                    <SelectItem value="high">High (256kbps)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the application's look and feel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme-mode">Dark Mode</Label>
                  <p className="text-text-secondary text-xs">
                    Use dark theme for a more comfortable viewing experience in
                    low light
                  </p>
                </div>
                <Switch
                  id="theme-mode"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface">
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>Manage your data and history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="save-history">Save Search History</Label>
                  <p className="text-text-secondary text-xs">
                    Remember your recent searches for quicker access
                  </p>
                </div>
                <Switch
                  id="save-history"
                  checked={settings.saveSearchHistory}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, saveSearchHistory: checked })
                  }
                />
              </div>

              <div>
                <Button
                  variant="destructive"
                  onClick={handleClearHistory}
                  className="w-full"
                >
                  Clear Search & Download History
                </Button>
                <p className="text-text-secondary text-xs mt-1">
                  This will permanently remove all your search and download
                  records
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={handleSaveSettings}
        >
          Save Settings
        </Button>
      </div>

      {/* Ad placement */}
      <div className="mt-8 bg-surface-light rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-text-secondary mb-1">Sponsored</p>
          <div className="text-sm mb-1">Upgrade to SoundGrab Premium</div>
          <p className="text-xs text-text-secondary">
            Remove ads, unlock unlimited downloads, and get priority support.
          </p>
        </div>
        <Button className="bg-accent text-white px-4 py-2 rounded-lg text-sm">
          Go Premium
        </Button>
      </div>
    </div>
  );
}
