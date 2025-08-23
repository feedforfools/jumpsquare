import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, detailRateLimit } from "@/lib/server-utils";

// Define types for the database relations
interface MovieDirectorRelation {
  v2_directors: {
    id: string;
    name: string;
  };
}

interface MovieGenreRelation {
  v2_genres: {
    id: string;
    name: string;
  };
}

interface MovieWithRelations {
  id: string;
  title: string;
  year: number;
  genre: string;
  rating: string;
  jumpscare_count: number;
  poster_url?: string;
  description?: string;
  runtime_minutes?: number;
  v2_movie_directors: MovieDirectorRelation[];
  v2_movie_genres: MovieGenreRelation[];
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const ip = request.headers.get("x-real-ip") ?? "127.0.0.1";
  const { success, limit, remaining, reset } = await detailRateLimit.limit(ip);
  const headers = {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": reset.toString(),
  };

  if (!success) {
    return new NextResponse(JSON.stringify({ error: "Too Many Requests" }), {
      status: 429,
      headers,
    });
  }

  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("v2_movies")
      .select(
        `
        *,
        v2_movie_directors ( v2_directors (id, name) ),
        v2_movie_genres ( v2_genres (id, name) )
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    // Type the data as MovieWithRelations
    const movieData = data as MovieWithRelations;

    const transformedMovie = {
      ...movieData,
      directors: movieData.v2_movie_directors.map((md) => md.v2_directors),
      genres: movieData.v2_movie_genres.map((mg) => mg.v2_genres),
    };

    return NextResponse.json(transformedMovie, { headers });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500, headers });
  }
}
