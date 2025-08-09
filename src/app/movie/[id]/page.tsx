"use client";

import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JumpscareTable } from "@/components/jumpscare-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockMovies, getJumpscaresByMovieId } from "@/data/mock-data";
import { ArrowLeft, Calendar, Zap, Users, User, Clock } from "lucide-react";

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id as string;

  const movie = mockMovies.find((m) => m.id === movieId);
  const jumpscares = getJumpscaresByMovieId(movieId);

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
            <p className="text-gray-600 mb-8">
              The movie you&apos;re looking for doesn&apos;t exist in our
              database.
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
              <Button variant="outline" size="sm">
                Export as SRT
              </Button>
            </div>

            <JumpscareTable jumpscares={jumpscares} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button>Report Issue</Button>
            <Button variant="outline">Suggest Edit</Button>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Rate This Data
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
