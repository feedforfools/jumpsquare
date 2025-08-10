"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JumpscareTable } from "@/components/jumpscare-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ComingSoon } from "@/components/ui/coming-soon";
import { getMovieById, getJumpscaresByMovieId } from "@/lib/database";
import { Movie, Jumpscare } from "@/types";
import { ArrowLeft, Calendar, Zap, User, Clock, Loader2 } from "lucide-react";

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [jumpscares, setJumpscares] = useState<Jumpscare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovieData = async () => {
      if (!movieId) return;

      setLoading(true);
      setError(null);

      try {
        const [movieData, jumpscareData] = await Promise.all([
          getMovieById(movieId),
          getJumpscaresByMovieId(movieId),
        ]);

        if (!movieData) {
          setError("Movie not found");
          return;
        }

        setMovie(movieData);
        setJumpscares(jumpscareData);
      } catch (err) {
        console.error("Error loading movie data:", err);
        setError("Failed to load movie data");
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
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            <span className="ml-2 text-gray-600">Loading movie details...</span>
          </div>
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
            <Button onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
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
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{movie.year}</span>
                  </div>
                  <Badge variant="outline">{movie.rating}</Badge>
                  <Badge variant="secondary">{movie.genre}</Badge>
                  {movie.runtime_minutes && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{movie.runtime_minutes} minutes</span>
                    </div>
                  )}
                </div>

                {movie.directors && movie.directors.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <User className="h-4 w-4" />
                      <span className="font-medium">
                        Directed by{" "}
                        {movie.directors.map((d) => d.name).join(", ")}
                      </span>
                    </div>
                  </div>
                )}

                {movie.description && (
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    {movie.description}
                  </p>
                )}
              </div>

              {/* Stats Card */}
              <Card className="lg:w-80">
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
                    <span className="text-sm font-medium">Intensity Level</span>
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
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

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

            <JumpscareTable jumpscares={jumpscares} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {/* <ComingSoon
              position="top-right"
              badgeColor="bg-gradient-to-r from-yellow-500 to-amber-500"
            >
              <Button>Report Issue</Button>
            </ComingSoon> */}

            <ComingSoon
              position="top-left"
              badgeColor="bg-gradient-to-r from-green-500 to-emerald-500"
              tilt={-7}
            >
              <Button variant="outline">Suggest Edit</Button>
            </ComingSoon>

            {/* <ComingSoon
              position="top-right"
              badgeColor="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Rate This Data
              </Button>
            </ComingSoon> */}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// So I would like to refine a little bit the UI of this project.

// Only minor things but a moderate amount, could you please handle them providing the code necessary to do them?

// 1. I need to disable any buttons that are now not being used yet, maybe adding something subtle to enforce that those buttons and functionalities are "coming soon"; this will include most definitely the Submit Movie button in the header, the Suggest Edit button, the Report Issue button, the Rate this Data button, the Export as SRT button. (Do you think it's a good idea or is it better to have them removed completely?)
// 2. I would probably need a separate page for preventing the scraping of the content I will add in the future, not sure how to do that and what to write, but basically what I would love to is to prevent other people to "legally" scrape all the simple data I show in my website. Just for you know, the original website I'm taking the data from has no such a page and I took all the data with a scraper bot knowing that I will not face any legal consequences because these data cannot be copyrighted and most importantly there was no usage terms to oblige to.
// 3. We should remove the Movies button in the header because with the main logo user can go back to homepage already
// 4. I would love to make the homepage "hero" section with search bar more appealing. Nothing too fancy, but improving a bit on the current thing could be beneficial.
// 5. I think we should limit the number of movies shown in the homepage by paginating them maybe? (which also would improve the DB access I suppose, considering that in the future we will have a lot of movies in my DB and not just 15 mock entries) Such that the vertical space that the homepage is taking in the browser window is a little bit more contained and the footer is always visible.
