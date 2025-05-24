import { useState } from "react";
import { SearchBox } from "@/components/SearchBox";
import { RecentSearches } from "@/components/RecentSearches";
import { SearchResults } from "@/components/SearchResults";
import { DownloadSection } from "@/components/DownloadSection";
import { FAQSection } from "@/components/FAQSection";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  return (
    <>
      {/* SearchSection */}
      <section className="mb-8 mt-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-center">
            Download Any Song <span className="text-primary">Instantly</span>
          </h1>
          <p className="text-text-secondary text-center mb-8">
            Find and download music using natural language, lyrics, or voice input - no URL needed
          </p>
          
          <SearchBox onSearch={handleSearch} />
        </div>
      </section>
      
      {/* Show recent searches if no search is active */}
      {!searchQuery && <RecentSearches onSelect={handleSearch} />}
      
      {/* Show search results if search is active */}
      {searchQuery && <SearchResults searchQuery={searchQuery} />}
      
      {/* Downloads section */}
      <DownloadSection />
      
      {/* FAQ section */}
      <FAQSection />
    </>
  );
}
