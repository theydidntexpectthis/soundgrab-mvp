import { useState } from "react";
import { SearchBox } from "@/components/SearchBox";
import { SearchResults } from "@/components/SearchResults";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      <section className="mb-8 mt-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-center">
            Search and Download <span className="text-primary">Music</span>
          </h1>
          <p className="text-text-secondary text-center mb-8">
            Use natural language, lyrics, or voice to find exactly what you're
            looking for
          </p>

          <SearchBox onSearch={handleSearch} />
        </div>
      </section>

      {searchQuery && <SearchResults searchQuery={searchQuery} />}

      {!searchQuery && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="max-w-md text-center">
            <h2 className="text-xl font-heading font-semibold mb-2">
              Start Your Search
            </h2>
            <p className="text-text-secondary mb-4">
              Type a song title, artist, lyrics, or even describe the music
              you're looking for.
            </p>
            <p className="text-text-secondary text-sm">Examples:</p>
            <ul className="text-text-secondary text-sm mt-2 space-y-1">
              <li>"That upbeat song from the 80s with saxophone"</li>
              <li>"I heard that you're settled down, that you found a girl"</li>
              <li>"Relaxing piano music for studying"</li>
              <li>"Latest hit by The Weeknd"</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
