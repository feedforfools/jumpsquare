"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SearchBar } from "@/components/search-bar";
import { MovieGrid } from "@/components/movie-grid";
import { Pagination } from "@/components/pagination";
import {
  getMovies,
  searchMovies,
  PaginatedMoviesResponse,
} from "@/lib/database";
import { Movie } from "@/types";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load movies for current page
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const response: PaginatedMoviesResponse = await getMovies(currentPage);
        setMovies(response.movies);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
      } catch (error) {
        console.error("Failed to load movies:", error);
      } finally {
        setLoading(false);
      }
    };

    // Only load if there's no search query
    if (!searchQuery) {
      loadMovies();
    }
  }, [currentPage, searchQuery]);

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setSearching(true);
    setCurrentPage(1); // Reset to first page on new search

    try {
      const response: PaginatedMoviesResponse = await searchMovies(query, 1);
      setMovies(response.movies);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleQuickSearch = (title: string) => {
    handleSearch(title);
  };

  // Handle search pagination
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery && currentPage > 1) {
        setSearching(true);
        try {
          const response: PaginatedMoviesResponse = await searchMovies(
            searchQuery,
            currentPage
          );
          setMovies(response.movies);
          setTotalPages(response.totalPages);
          setTotalCount(response.totalCount);
        } catch (error) {
          console.error("Search pagination failed:", error);
        } finally {
          setSearching(false);
        }
      }
    };

    performSearch();
  }, [currentPage, searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of movies section
    const moviesSection = document.getElementById("movies-section");
    if (moviesSection) {
      moviesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const isLoadingState = loading || searching;

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
            {/* <div className="flex justify-center">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search for a movie..."

              />
            </div> */}

            <div className="relative group max-w-2xl mx-auto">
              {/* Glow Effect */}
              {/* <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div> */}

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
          </div>
        </section>

        {/* Movies Section */}
        <section id="movies-section" className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg md:text-xl font-bold">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : "Featured Movies"}
              </h2>
              <div className="text-sm text-gray-600">
                {!isLoadingState && (
                  <>
                    {totalCount} movie{totalCount !== 1 ? "s" : ""}
                    {totalPages > 1 && (
                      <span className="ml-1">
                        • Page {currentPage} of {totalPages}
                      </span>
                    )}
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
              <>
                <MovieGrid movies={movies} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="mt-8"
                  />
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
