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
        className={cn(
          "flex w-full items-center gap-2 rounded-base border-2 border-border bg-secondary-background p-2 shadow-shadow",
          className
        )}
      >
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent border-0 text-foreground placeholder:text-foreground/50 text-sm md:text-base focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {query && (
          <Button
            type="button"
            onClick={handleClear}
            variant="reverse"
            size="icon"
            className="h-7 w-7 shrink-0 bg-secondary-background text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="reverse"
          type="submit"
          size="sm"
          className="hidden sm:inline-flex -mr-2 px-4 h-10"
        >
          <span className="font-bold text-base">Search</span>
        </Button>
        <Button
          variant="reverse"
          type="submit"
          size="icon"
          className="h-9 w-9 shrink-0 sm:hidden px-4.5 h-10"
        >
          <Search className="h-5 w-5" strokeWidth={4} />
        </Button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full items-center gap-2 rounded-base border-2 border-border bg-background p-2 shadow-shadow",
        className
      )}
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
          variant="neutral"
          size="icon"
          className="h-7 w-7 shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      {/* Show text button on small screens and up */}
      <Button type="submit" size="sm" className="hidden sm:inline-flex">
        Search
      </Button>
      {/* Show icon button only on small screens */}
      <Button type="submit" size="icon" className="sm:hidden">
        <Search className="h-4 w-4" strokeWidth={2.5} />
      </Button>
    </form>
  );
}
