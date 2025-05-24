import { useState } from "react";
import { Link } from "wouter";
import { SearchBox } from "@/components/SearchBox";
import { RecentSearches } from "@/components/RecentSearches";
import { SearchResults } from "@/components/SearchResults";
import { DownloadSection } from "@/components/DownloadSection";
import { FAQSection } from "@/components/FAQSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Music, History, Download } from "lucide-react";

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
      
      {/* Feature Highlights Section */}
      {!searchQuery && (
        <section className="mb-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Multiple Ways to Find Your Music</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Regular Search */}
              <Card className="bg-surface hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Search className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Quick Search</h3>
                    <p className="text-text-secondary mb-4">
                      Search by artist name, song title, or album to find exactly what you're looking for
                    </p>
                    <Link href="/search">
                      <Button variant="outline" className="mt-2">
                        Try Quick Search
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              {/* Lyrics Search */}
              <Card className="bg-surface hover:shadow-lg transition-shadow border-primary/20">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Music className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Lyrics Search</h3>
                    <p className="text-text-secondary mb-4">
                      Only remember part of the lyrics? Paste any lyrics snippet to find the right song
                    </p>
                    <Link href="/lyrics-search">
                      <Button variant="default" className="mt-2 bg-primary hover:bg-primary/90">
                        Try Lyrics Search
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Searches */}
              <Card className="bg-surface hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <History className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Recent Activity</h3>
                    <p className="text-text-secondary mb-4">
                      Quickly access your recent searches and downloads for faster access
                    </p>
                    <Link href="/recent">
                      <Button variant="outline" className="mt-2">
                        View History
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
      
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
