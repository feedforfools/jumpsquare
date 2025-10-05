import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, extensionRateLimit } from "@/lib/server-utils";

export async function GET(request: NextRequest) {
  // Apply Rate Limiting
  const ip = request.headers.get("x-real-ip") ?? "127.0.0.1";
  const { success, limit, remaining, reset } = await extensionRateLimit.limit(
    ip
  );
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
    const title = searchParams.get("title");
    const year = searchParams.get("year");

    if (!title) {
      return NextResponse.json(
        { error: "Movie title is required" },
        { status: 400, headers }
      );
    }

    // Use the robust single-query RPC function
    const { data: movies, error: searchError } = await supabaseAdmin.rpc(
      "find_movie_exact",
      {
        search_title: title,
        search_year: year ? parseInt(year) : null,
      }
    );

    if (searchError) {
      console.error("Error searching movies:", searchError);
      return NextResponse.json(
        { error: "Search failed" },
        { status: 500, headers }
      );
    }

    const movie = movies?.[0];
    if (!movie) {
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404, headers }
      );
    }

    // Fetch jumpscares for the found movie
    const { data: jumpscares, error: jumpscaresError } = await supabaseAdmin
      .from("v3_jumpscares")
      .select("id, timestamp_minutes, timestamp_seconds, description, category")
      .eq("movie_id", movie.id)
      .order("timestamp_minutes", { ascending: true })
      .order("timestamp_seconds", { ascending: true });

    if (jumpscaresError) {
      console.error("Error fetching jumpscares:", jumpscaresError);
      return NextResponse.json(
        { error: "Error fetching jumpscares" },
        { status: 500, headers }
      );
    }

    return NextResponse.json(
      {
        movie: {
          id: movie.id,
          title: movie.title,
          year: movie.year,
        },
        jumpscares: jumpscares || [],
        debug: {
          match_type: movie.match_type,
          year_distance: movie.year_distance,
        },
      },
      { headers }
    );
  } catch (error: unknown) {
    console.error("Extension API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500, headers });
  }
}
