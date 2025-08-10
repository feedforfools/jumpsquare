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
        <section id="movies-section" className="py-12">
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
                    {totalCount} movie{totalCount !== 1 ? "s" : ""} found
                    {totalPages > 1 && (
                      <span className="ml-2">
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
