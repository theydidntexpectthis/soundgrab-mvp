import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LyricsSearchBox } from "@/components/LyricsSearchBox";
import { SearchResults } from "@/components/SearchResults";
import { searchByLyrics } from "@/services/apiService";
import { SearchResult } from "@shared/schema";

export default function LyricsSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['lyrics-search', searchQuery],
    queryFn: () => searchByLyrics(searchQuery),
    enabled: !!searchQuery, // Only run query when searchQuery is not empty
  });
  
  const handleSearch = (lyrics: string) => {
    setSearchQuery(lyrics);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Lyrics Search</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LyricsSearchBox onSearch={handleSearch} isSearching={isLoading} />
          
          {/* Tips and guide */}
          <div className="mt-6 p-4 bg-surface rounded-lg">
            <h3 className="text-lg font-medium mb-2">How it works</h3>
            <p className="text-text-secondary text-sm mb-3">
              Our lyrics search uses AI to find songs that match the lyrics you enter. 
              The more accurate the lyrics, the better the results.
            </p>
            
            <h4 className="font-medium text-sm mt-4 mb-1">Popular lyric searches:</h4>
            <div className="space-y-2 mt-2">
              {[
                "Never gonna give you up, never gonna let you down",
                "Despacito, quiero respirar tu cuello despacito",
                "Oppa Gangnam Style",
                "I'm in love with the shape of you"
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(example)}
                  className="block w-full text-left p-2 text-sm bg-surface-light hover:bg-primary/10 rounded-md text-text-primary transition-colors"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {searchQuery ? (
            isLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="bg-destructive/20 text-destructive p-4 rounded-lg">
                <h3 className="font-medium mb-1">Error</h3>
                <p className="text-sm">Failed to search for lyrics. Please try again.</p>
              </div>
            ) : (
              <SearchResults searchQuery={searchQuery} />
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-72 bg-surface rounded-lg">
              <div className="text-text-secondary text-center p-6">
                <h3 className="text-xl font-medium mb-2">Enter lyrics to search</h3>
                <p className="max-w-md">
                  Type or paste lyrics in the search box to find matching songs. The more lyrics you provide, the more accurate the results will be.
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
          <div className="text-sm mb-1">Try our premium lyrics search</div>
          <p className="text-xs text-text-secondary">Find songs even with misheard lyrics and get exclusive content.</p>
        </div>
        <button className="bg-accent text-white px-4 py-2 rounded-lg text-sm">
          Upgrade
        </button>
      </div>
    </div>
  );
}