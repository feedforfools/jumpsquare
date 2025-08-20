"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SearchBar } from "@/components/search-bar";
import { MovieGrid } from "@/components/movie-grid";
import { MovieGridSkeleton } from "@/components/movie-grid-skeleton";
import { Movie } from "@/types";

interface DiscoverResponse {
  recentlyAdded: Movie[];
  highestRated: Movie[];
  mostJumpscares: Movie[];
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [discoverData, setDiscoverData] = useState<DiscoverResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [view, setView] = useState<"recent" | "jumpscares" | "highestRated">(
    "recent"
  );

  // Fetch initial discovery data for the homepage
  useEffect(() => {
    const fetchDiscoverData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/discover");
        const data: DiscoverResponse = await response.json();
        setDiscoverData(data);
      } catch (error) {
        console.error("Failed to fetch discovery data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscoverData();
  }, []);

  // Handle a new search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query || query.length < 3) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const params = new URLSearchParams({ query });
      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();
      setSearchResults(data.movies || []);
    } catch (error) {
      console.error("Failed to fetch search data:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickSearch = (title: string) => {
    handleSearch(title);
  };

  const isLoadingState = loading || isSearching;
  const showSearchResults = searchQuery.length >= 3;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-red-100 to-white pb-12 pt-8">
          <div className="container mx-auto px-4 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/70 backdrop-blur-sm border border-black text-red-600 text-xs md:text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              The Ultimate Jumpscare Database
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Know When the <span className="text-red-600">Jumps</span> Are
              Coming
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Get precise timestamps, intensity levels, and descriptions for
              every jumpscare in thousands of movies.
            </p>

            <div className="relative group max-w-2xl mx-auto">
              {/* Search Bar Container */}
              <div className="relative bg-white backdrop-blur-3xl rounded-3xl border border-gray-800 p-1">
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Search for a movie..."
                  className="w-full"
                  variant="hero"
                />
              </div>
            </div>
            {/* Popular Searches */}
            <div className="mt-2 flex flex-wrap justify-center gap-2 text-xs sm:text-sm">
              <span className="text-gray-600">Popular:</span>
              <button
                onClick={() => handleQuickSearch("The Conjuring")}
                className="text-red-600 hover:text-red-300 transition-colors"
              >
                The Conjuring
              </button>
              <span className="text-gray-600">•</span>
              <button
                onClick={() => handleQuickSearch("Hereditary")}
                className="text-red-600 hover:text-red-300 transition-colors"
              >
                Hereditary
              </button>
              <span className="text-gray-600">•</span>
              <button
                onClick={() => handleQuickSearch("A Quiet Place")}
                className="text-red-600 hover:text-red-300 transition-colors"
              >
                A Quiet Place
              </button>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <button
                onClick={() => handleQuickSearch("Insidious")}
                className="hidden sm:inline text-red-600 hover:text-red-300 transition-colors"
              >
                Insidious
              </button>
            </div>
            {/* View Selector: Recently Added / Most Jumpscares / Highest Rated */}
            <div className="mt-6 flex justify-center gap-2">
              {[
                { key: "recent", label: "Recently Added" },
                { key: "jumpscares", label: "Most Jumpscares" },
                { key: "highestRated", label: "Highest Rated" },
              ].map((tab) => {
                const active = view === (tab.key as any);
                return (
                  <button
                    key={tab.key}
                    onClick={() => setView(tab.key as any)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                      active
                        ? "bg-red-600 text-white"
                        : "bg-white border border-gray-200 text-red-600"
                    }`}
                    aria-pressed={active}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Movies Section */}
        <section id="movies-section" className="py-2">
          <div className="container mx-auto px-4 max-w-8xl">
            {isLoadingState ? (
              <MovieGridSkeleton count={24} />
            ) : showSearchResults ? (
              <>
                <h2 className="text-lg md:text-xl font-bold mb-5">
                  Search Results for "{searchQuery}"
                </h2>
                <MovieGrid movies={searchResults} />
              </>
            ) : (
              discoverData && (
                <div>
                  <h2 className="text-lg md:text-xl font-bold mb-5">
                    {view === "recent"
                      ? "Recently Added"
                      : view === "jumpscares"
                      ? "Most Jumpscares"
                      : "Highest Rated"}
                  </h2>
                  <MovieGrid
                    movies={
                      view === "recent"
                        ? discoverData.recentlyAdded
                        : view === "jumpscares"
                        ? discoverData.mostJumpscares
                        : discoverData.highestRated
                    }
                  />
                </div>
              )
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
