"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JumpscareTable } from "@/components/jumpscare-table";
import { MovieDetailSkeleton } from "@/components/movie-detail-skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// import { ComingSoon } from "@/components/ui/coming-soon";
import { Movie, Jumpscare } from "@/types";
import { Calendar, Zap, User, Clock, ChevronLeft } from "lucide-react";
import { getGenreDisplay } from "@/lib/utils";
import { getJumpscareIntensity } from "@/lib/jumpscare-utils";

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [jumpscares, setJumpscares] = useState<Jumpscare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useExtendedTimeFormat, setUseExtendedTimeFormat] = useState(false);
  const hasLoadedRef = useRef(false);

  // Helper function to format movie duration
  const formatMovieDuration = (minutes: number) => {
    if (!useExtendedTimeFormat) {
      return `${minutes} minutes`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes}m`;
    }

    return `${hours}h ${remainingMinutes}m`;
  };

  // Helper function to format jumpscare timestamps
  const formatJumpscareTimestamp = (minutes: number, seconds: number) => {
    if (!useExtendedTimeFormat) {
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const formattedSeconds = seconds.toString().padStart(2, "0");
      return `${formattedMinutes}:${formattedSeconds}`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = remainingMinutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const toggleTimeFormat = () => {
    setUseExtendedTimeFormat(!useExtendedTimeFormat);
  };

  useEffect(() => {
    // Skip if we've already loaded the data
    if (hasLoadedRef.current) return;
    if (!movieId) return;

    const abortController = new AbortController();

    const loadMovieData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch both movie details and jumpscares from our new APIs in parallel
        const [movieRes, jumpscaresRes] = await Promise.all([
          fetch(`/api/movie/${movieId}`, { signal: abortController.signal }),
          fetch(`/api/movie/${movieId}/jumpscares`, {
            signal: abortController.signal,
          }),
        ]);

        if (!movieRes.ok) {
          if (movieRes.status === 404) setError("Movie not found");
          else throw new Error("Failed to load movie details");
        }
        if (!jumpscaresRes.ok) {
          throw new Error("Failed to load jumpscares");
        }

        const movieData = await movieRes.json();
        const jumpscareData = await jumpscaresRes.json();

        // Only update state if we haven't been aborted
        if (!abortController.signal.aborted) {
          setMovie(movieData);
          setJumpscares(jumpscareData);
          hasLoadedRef.current = true; // Mark as loaded
        }
      } catch (err: unknown) {
        // Only handle non-abort errors
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Error loading movie data:", err);
          setError(err.message || "Failed to load movie data");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadMovieData();

    // Cleanup function to abort requests
    return () => {
      abortController.abort();
    };
  }, [movieId]); // Only re-run if movieId changes

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-app-surface">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="neutral"
              disabled
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4 -ml-1" />
              <span>Back</span>
            </Button>
          </div>

          <MovieDetailSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex flex-col bg-app-surface">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {error || "Movie Not Found"}
            </h1>
            <p className="text-app-text-secondary mb-8">
              {error === "Movie not found"
                ? "The movie you're looking for doesn't exist in our database."
                : "Something went wrong while loading the movie data."}
            </p>
            <Button variant="neutral" onClick={() => router.push("/")}>
              <ChevronLeft className="h-4 w-4 -ml-1" />
              Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const intensityLevel = getJumpscareIntensity(movie.jumpscare_count);

  return (
    <div className="min-h-screen flex flex-col bg-app-surface bg-dot-pattern">
      <Header />

      <main className="flex-1">
        {/* Add gradient background section */}
        <section className="pb-8 pt-8">
          <div className="container mx-auto px-4">
            {/* Back Button */}
            <div className="mb-6">
              <Button variant="neutral" onClick={() => router.back()}>
                <ChevronLeft className="h-4 w-4 -ml-1" />
                <span>Back</span>
              </Button>
            </div>

            {/* Movie Header */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
                {/* Movie Info */}
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                    {movie.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-900" />
                      <span>{movie.year}</span>
                    </div>
                    <Badge variant="neutral" className="bg-app-surface">
                      {movie.rating}
                    </Badge>
                    <Badge variant="neutral" className="bg-app-surface">
                      {getGenreDisplay(movie)}
                    </Badge>
                    {movie.runtime_minutes && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-900" />
                        <button
                          onClick={toggleTimeFormat}
                          className="hover:text-brand-red transition-colors cursor-pointer underline decoration-dotted underline-offset-2"
                          title="Click to toggle time format"
                        >
                          {formatMovieDuration(movie.runtime_minutes)}
                        </button>
                      </div>
                    )}
                  </div>

                  {movie.directors && movie.directors.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 text-gray-900">
                        <User className="h-4 w-4" />
                        <span className="font-medium">
                          Directed by{" "}
                          {movie.directors.map((d) => d.name).join(", ")}
                        </span>
                      </div>
                    </div>
                  )}

                  {movie.description && (
                    <p className="text-md sm:text-lg text-gray-900 mb-6 leading-relaxed">
                      {movie.description}
                    </p>
                  )}
                </div>

                {/* Stats Card */}
                <Card className="lg:w-90">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <span>Jumpscare Stats</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Total Jumpscares
                      </span>
                      <Badge variant="neutral" className="text-base">
                        {movie.jumpscare_count}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Intensity Level
                      </span>
                      <Badge className={intensityLevel.colorClasses}>
                        {intensityLevel.label}
                      </Badge>
                    </div>

                    <Separator />

                    <div className="text-sm text-app-text-secondary">
                      <p className="mb-2">
                        <strong>Tip:</strong> Use the timeline below to know
                        exactly when jumpscares occur.
                      </p>
                      <p>
                        Times are approximate and may vary by version/cut of the
                        film.
                      </p>
                      <p className="text-xs mt-2 text-app-text-muted">
                        💡 Click on any timestamp to toggle time format
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of the content with white background */}
        <section className="flex-1 min-h-0">
          <div className="container mx-auto px-4 pb-8">
            {/* Jumpscare Timeline */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Jumpscare Timeline
                </h2>
                {/* <ComingSoon
                  size="xs"
                  position="bottom-right"
                  badgeColor="bg-main"
                  tilt={3}
                > */}
                <Button variant="neutral" size="sm" disabled>
                  Export as SRT
                </Button>
                {/* </ComingSoon> */}
              </div>

              <JumpscareTable
                jumpscares={jumpscares}
                formatTimestamp={formatJumpscareTimestamp}
                onTimestampClick={toggleTimeFormat}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pb-8">
              {/* <ComingSoon
                size="xs"
                position="top-left"
                badgeColor="bg-main"
                tilt={-7}
              > */}
              <Button variant="neutral" disabled>
                Suggest Edit
              </Button>
              {/* </ComingSoon> */}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
