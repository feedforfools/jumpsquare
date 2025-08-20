"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JumpscareTable } from "@/components/jumpscare-table";
import { MovieDetailSkeleton } from "@/components/movie-detail-skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ComingSoon } from "@/components/ui/coming-soon";
import { Movie, Jumpscare } from "@/types";
import {
  ArrowLeft,
  Calendar,
  Zap,
  User,
  Clock,
  ChevronLeft,
} from "lucide-react";

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [jumpscares, setJumpscares] = useState<Jumpscare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useExtendedTimeFormat, setUseExtendedTimeFormat] = useState(false);

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
    const loadMovieData = async () => {
      if (!movieId) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch both movie details and jumpscares from our new APIs in parallel
        const [movieRes, jumpscaresRes] = await Promise.all([
          fetch(`/api/movie/${movieId}`),
          fetch(`/api/movie/${movieId}/jumpscares`),
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

        setMovie(movieData);
        setJumpscares(jumpscareData);
      } catch (err: any) {
        console.error("Error loading movie data:", err);
        setError(err.message || "Failed to load movie data");
      } finally {
        setLoading(false);
      }
    };

    loadMovieData();
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              disabled
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {error || "Movie Not Found"}
            </h1>
            <p className="text-gray-600 mb-8">
              {error === "Movie not found"
                ? "The movie you're looking for doesn't exist in our database."
                : "Something went wrong while loading the movie data."}
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="gap-1 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200 ease-in-out group"
            >
              <ChevronLeft className="h-4 w-4 group-hover:transform group-hover:-translate-x-1 transition-transform" />
              Back to Movies
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getIntensityLevel = (count: number) => {
    if (count <= 3)
      return { label: "Mild", color: "bg-green-100 text-green-800" };
    if (count <= 7)
      return { label: "Moderate", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Intense", color: "bg-red-100 text-red-800" };
  };

  const intensityLevel = getIntensityLevel(movie.jumpscare_count);

  // Get genre display text
  const getGenreDisplay = () => {
    if (movie.genres && movie.genres.length > 0) {
      return movie.genres.map((g) => g.name).join(", ");
    }
    return movie.genre || "Horror";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Add gradient background section */}
        <section className="bg-gradient-to-b from-red-100 to-white pb-8 pt-8">
          <div className="container mx-auto px-4">
            {/* Back Button */}
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="gap-1 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200 ease-in-out group"
              >
                <ChevronLeft className="h-4 w-4 group-hover:transform group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </Button>
            </div>

            {/* Movie Header */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
                {/* Movie Info */}
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-900" />
                      <span>{movie.year}</span>
                    </div>
                    <Badge variant="outline">{movie.rating}</Badge>
                    <Badge variant="outline">{getGenreDisplay()}</Badge>
                    {movie.runtime_minutes && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-900" />
                        <button
                          onClick={toggleTimeFormat}
                          className="hover:text-red-600 transition-colors cursor-pointer underline decoration-dotted underline-offset-2"
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
                    <p className="text-lg text-gray-900 mb-6 leading-relaxed">
                      {movie.description}
                    </p>
                  )}
                </div>

                {/* Stats Card */}
                <Card className="lg:w-90 bg-white">
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
                      <Badge variant="outline" className="text-base">
                        {movie.jumpscare_count}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Intensity Level
                      </span>
                      <Badge className={intensityLevel.color}>
                        {intensityLevel.label}
                      </Badge>
                    </div>

                    <Separator />

                    <div className="text-sm text-gray-600">
                      <p className="mb-2">
                        <strong>Tip:</strong> Use the timeline below to know
                        exactly when jumpscares occur.
                      </p>
                      <p>
                        Times are approximate and may vary by version/cut of the
                        film.
                      </p>
                      <p className="text-xs mt-2 text-gray-500">
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
        <section className="bg-white">
          <div className="container mx-auto px-4">
            {/* Jumpscare Timeline */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Jumpscare Timeline</h2>
                <ComingSoon
                  position="bottom-right"
                  badgeColor="bg-gradient-to-r from-blue-500 to-cyan-500"
                  tilt={3}
                >
                  <Button variant="outline" size="sm">
                    Export as SRT
                  </Button>
                </ComingSoon>
              </div>

              <JumpscareTable
                jumpscares={jumpscares}
                formatTimestamp={formatJumpscareTimestamp}
                onTimestampClick={toggleTimeFormat}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pb-8">
              <ComingSoon
                position="top-left"
                badgeColor="bg-gradient-to-r from-green-500 to-emerald-500"
                tilt={-7}
              >
                <Button variant="outline">Suggest Edit</Button>
              </ComingSoon>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
