"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
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
          className="flex-1 bg-transparent text-white placeholder-gray-500 px-5 py-1 md:py-2 text-sm md:text-lg focus:outline-none"
        />
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
      <Button type="submit" size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
