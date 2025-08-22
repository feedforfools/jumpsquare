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

  // View selector component
  const ViewSelector = () => (
    <div className="flex items-center gap-1 p-1 border border-gray-800 rounded-2xl bg-app-surface">
      {[
        { key: "recent", label: "Recently Added", shortLabel: "Recent" },
        {
          key: "jumpscares",
          label: "Most Jumpscares",
          shortLabel: "Scares",
        },
        {
          key: "highestRated",
          label: "Highest Rated",
          shortLabel: "Rated",
        },
      ].map((tab) => {
        const active = view === (tab.key as any);
        return (
          <button
            key={tab.key}
            onClick={() => setView(tab.key as any)}
            className={`px-2 py-1 text-xs font-medium rounded-xl transition-all duration-200 md:px-3 md:py-1.5 md:text-sm md:rounded-1xl ${
              active
                ? "bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-lg"
                : "bg-app-surface text-app-text hover:text-brand-red hover:bg-brand-red-hover-light dark:hover:bg-brand-red-lighter"
            }`}
            aria-pressed={active}
          >
            <span className="hidden md:inline">{tab.label}</span>
            <span className="md:hidden">{tab.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-app-surface">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-hero-gradient pb-8 pt-8">
          <div className="container mx-auto px-4 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-app-surface backdrop-blur-sm border border-gray-800 text-brand-red text-xs md:text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse"></span>
              The Ultimate Jumpscare Database
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Know When the <span className="text-brand-red">Jumps</span> Are
              Coming
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-app-text-secondary mb-10 max-w-2xl mx-auto">
              Get precise timestamps, intensity levels, and descriptions for
              every jumpscare in thousands of movies.
            </p>

            <div className="relative group max-w-2xl mx-auto">
              {/* Search Bar Container */}
              <div className="relative bg-app-surface backdrop-blur-3xl rounded-3xl border border-gray-800 p-1">
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Search for a movie..."
                  className="w-full"
                  variant="hero"
                />
              </div>
            </div>
            {/* Popular Searches */}
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs sm:text-sm">
              <span className="text-app-text-secondary">Popular:</span>
              <button
                onClick={() => handleQuickSearch("The Conjuring")}
                className="text-brand-red hover:text-brand-red-hover transition-colors"
              >
                The Conjuring
              </button>
              <span className="text-app-text-secondary">•</span>
              <button
                onClick={() => handleQuickSearch("Hereditary")}
                className="text-brand-red hover:text-brand-red-hover transition-colors"
              >
                Hereditary
              </button>
              <span className="text-app-text-secondary">•</span>
              <button
                onClick={() => handleQuickSearch("A Quiet Place")}
                className="text-brand-red hover:text-brand-red-hover transition-colors"
              >
                A Quiet Place
              </button>
              <span className="text-app-text-secondary hidden sm:inline">
                •
              </span>
              <button
                onClick={() => handleQuickSearch("Insidious")}
                className="hidden sm:inline text-brand-red hover:text-brand-red-hover transition-colors"
              >
                Insidious
              </button>
            </div>
          </div>
        </section>

        {/* Movies Section */}
        <section id="movies-section" className="py-6 bg-app-surface">
          <div className="container mx-auto px-4 max-w-8xl">
            {isLoadingState ? (
              <>
                {/* Loading state header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-72 animate-pulse"></div>
                </div>
                <MovieGridSkeleton count={24} />
              </>
            ) : showSearchResults ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-lg md:text-xl font-bold">
                    Search Results for "{searchQuery}"
                  </h2>
                </div>
                <MovieGrid movies={searchResults} />
              </>
            ) : (
              discoverData && (
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <h2 className="text-lg md:text-xl font-bold flex-1 min-w-0">
                      {view === "recent"
                        ? "Recently Added"
                        : view === "jumpscares"
                        ? "Most Jumpscares"
                        : "Highest Rated"}
                    </h2>
                    <ViewSelector />
                  </div>
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
