"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SearchBar } from "@/components/search-bar";
import { MovieGrid } from "@/components/movie-grid";
import { getMovies, searchMovies } from "@/lib/database";
import { Movie } from "@/types";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // Load all movies on initial render
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const allMovies = await getMovies();
        setMovies(allMovies);
      } catch (error) {
        console.error("Failed to load movies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setSearching(true);

    try {
      const results = await searchMovies(query);
      setMovies(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  const isLoadingState = loading || searching;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-red-50 to-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">
              Know When the <span className="text-red-600">Jumps</span> Are
              Coming
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The ultimate database of movie jumpscares. Watch horror movies
              with confidence or avoid the jumps entirely.
            </p>
            <div className="flex justify-center">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search for a movie..."
              />
            </div>
          </div>
        </section>

        {/* Movies Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : "Featured Movies"}
              </h2>
              <div className="text-sm text-gray-600">
                {!isLoadingState && (
                  <>
                    {movies.length} movie{movies.length !== 1 ? "s" : ""} found
                  </>
                )}
              </div>
            </div>

            {isLoadingState ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                <span className="ml-2 text-gray-600">
                  {loading ? "Loading movies..." : "Searching..."}
                </span>
              </div>
            ) : (
              <MovieGrid movies={movies} />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
