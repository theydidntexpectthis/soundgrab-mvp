import { useState } from "react";
import { VoiceSearchBox } from "@/components/VoiceSearchBox";
import { SearchResults } from "@/components/SearchResults";

export default function VoiceSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    // Simulate a delay for the search process
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Voice Search</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <VoiceSearchBox onSearch={handleSearch} isSearching={isSearching} />

          {/* Tips and guide */}
          <div className="mt-6 p-4 bg-surface rounded-lg">
            <h3 className="text-lg font-medium mb-2">How it works</h3>
            <p className="text-text-secondary text-sm mb-3">
              Our voice recognition technology allows you to search for songs by
              speaking the title, artist name, or even lyrics. Simply click the
              button and start speaking.
            </p>

            <h4 className="font-medium text-sm mt-4 mb-1">Try saying:</h4>
            <div className="space-y-2 mt-2">
              {[
                "Play Shape of You by Ed Sheeran",
                "Find songs by Taylor Swift",
                "Search for songs about love",
                "Never gonna give you up",
              ].map((example, index) => (
                <div
                  key={index}
                  className="block w-full text-left p-2 text-sm bg-surface-light rounded-md text-text-primary"
                >
                  "{example}"
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {searchQuery ? (
            <SearchResults searchQuery={searchQuery} />
          ) : (
            <div className="flex flex-col items-center justify-center h-72 bg-surface rounded-lg">
              <div className="text-text-secondary text-center p-6">
                <h3 className="text-xl font-medium mb-2">
                  Use your voice to find music
                </h3>
                <p className="max-w-md">
                  Click the "Start Voice Search" button and speak naturally to
                  search for your favorite songs. You can search by artist,
                  title, or even lyrics you remember.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ad placement */}
      <div className="mt-8 bg-surface-light rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-text-secondary mb-1">Sponsored</p>
          <div className="text-sm mb-1">Premium Sound Quality</div>
          <p className="text-xs text-text-secondary">
            Upgrade for crystal-clear audio and higher bitrates.
          </p>
        </div>
        <button className="bg-accent text-white px-4 py-2 rounded-lg text-sm">
          Try Premium
        </button>
      </div>
    </div>
  );
}
