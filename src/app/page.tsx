"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SearchBar } from "@/components/search-bar";
import { MovieGrid } from "@/components/movie-grid";
import { mockMovies } from "@/data/mock-data";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMovies = useMemo(() => {
    if (!searchQuery.trim()) return mockMovies;

    const query = searchQuery.toLowerCase();
    return mockMovies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(query) ||
        movie.genre.toLowerCase().includes(query) ||
        movie.year.toString().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-red-50 to-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">
              Know When the <span className="text-red-600">Scares</span> Are
              Coming
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The ultimate database of movie jumpscares. Watch horror movies
              with confidence or avoid the scares entirely.
            </p>
            <div className="flex justify-center">
              <SearchBar
                onSearch={setSearchQuery}
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
                {filteredMovies.length} movie
                {filteredMovies.length !== 1 ? "s" : ""} found
              </div>
            </div>

            <MovieGrid movies={filteredMovies} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
