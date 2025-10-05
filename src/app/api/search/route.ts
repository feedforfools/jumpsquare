import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, searchRateLimit } from "@/lib/server-utils";
import { transformMovieForCard } from "@/lib/server-utils";
import { MOVIES_PER_PAGE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  // Apply Rate Limiting
  const ip = request.headers.get("x-real-ip") ?? "127.0.0.1";
  const { success, limit, remaining, reset } = await searchRateLimit.limit(ip);
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
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    // 1. Require a query
    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400, headers }
      );
    }
    // 2. Enforce minimum query length
    if (query.length < 3) {
      return NextResponse.json({ movies: [], totalCount: 0 }, { headers });
    }

    // Search using custom RPC function with hybrid full-text + ILIKE search
    // See: /docs/database-setup.md for complete setup documentation
    const { data, error, count } = await supabaseAdmin.rpc("search_movies", {
      search_query: query,
      result_limit: MOVIES_PER_PAGE,
    });

    if (error) {
      console.error("Search error:", error);
      // Fallback to original search if RPC fails
      return await fallbackSearch(query, headers);
    }

    const transformedMovies = data.map(transformMovieForCard);

    return NextResponse.json(
      {
        movies: transformedMovies,
        totalCount: count || transformedMovies.length,
      },
      { headers }
    );
  } catch (error: unknown) {
    console.error("Search API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500, headers });
  }
}

// Fallback search function using Supabase's built-in textSearch
// Uses GIN indexes created in database-setup.md for performance
async function fallbackSearch(query: string, headers: Record<string, string>) {
  const { data, error, count } = await supabaseAdmin
    .from("v3_movies")
    .select(
      `*, v3_movie_directors(v3_directors(id, name)), v3_movie_genres(v3_genres(id, name)), v3_movie_translations(iso_639_1, title, iso_3166_1)`,
      { count: "exact" }
    )
    .textSearch("title", `'${query}'`)
    .limit(MOVIES_PER_PAGE);

  if (error) throw error;

  const transformedMovies = data.map(transformMovieForCard);

  return NextResponse.json(
    {
      movies: transformedMovies,
      totalCount: count,
    },
    { headers }
  );
}
