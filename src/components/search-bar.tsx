"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  variant?: "default" | "hero";
}

export function SearchBar({
  onSearch,
  placeholder = "Search movies...",
  className,
  variant = "default",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [lastSubmittedQuery, setLastSubmittedQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLastSubmittedQuery(query);
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    // Only auto-submit if the current query was the last submitted query
    if (query === lastSubmittedQuery) {
      setLastSubmittedQuery("");
      onSearch("");
    }
  };

  if (variant === "hero") {
    return (
      <form
        onSubmit={handleSubmit}
        className={cn("flex items-center", className)}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-app-text placeholder-gray-500 px-5 py-1 md:py-2 text-sm md:text-lg focus:outline-none"
        />
        {query && (
          <Button
            type="button"
            onClick={handleClear}
            className="text-app-text hover:text-app-text-secondary mr-1 p-1 h-6 md:h-9 transition-all transform hover:scale-105 active:scale-95 bg-transparent border-0 shadow-none"
          >
            <X className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        )}
        <Button
          type="submit"
          className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white mr-1 px-3 py-2 md:px-4 md:py-2 h-6 md:h-9 rounded-2xl text-xs md:text-sm transition-all transform hover:scale-105 active:scale-95 shadow-lg border-0"
        >
          <Search className="h-4 w-4" />
          Search
        </Button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex w-full max-w-sm items-center space-x-2", className)}
    >
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1"
      />
      {query && (
        <Button
          type="button"
          onClick={handleClear}
          className="text-app-text-muted hover:text-gray-700 p-1 h-auto w-auto bg-transparent border-0 shadow-none"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <Button type="submit" size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
