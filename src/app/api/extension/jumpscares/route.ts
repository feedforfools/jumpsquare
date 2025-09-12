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

    // Build the query to find the best match
    let queryBuilder = supabaseAdmin
      .from("v3_movies")
      .select("id, title")
      .textSearch("title", `'${title}'`);

    if (year) {
      queryBuilder = queryBuilder.eq("year", parseInt(year));
    }

    // We only want the single best match
    const { data: movie, error: movieError } = await queryBuilder
      .limit(1)
      .single();

    if (movieError || !movie) {
      // PGRST116 is the code for "No rows found"
      if (movieError && movieError.code !== "PGRST116") {
        console.error("Error finding movie:", movieError);
      }
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404, headers }
      );
    }

    // If a match is found, fetch its jumpscares
    const { data: jumpscares, error: jumpscaresError } = await supabaseAdmin
      .from("v3_jumpscares")
      .select("id, timestamp_minutes, timestamp_seconds, description, category")
      .eq("movie_id", movie.id)
      .order("timestamp_minutes", { ascending: true })
      .order("timestamp_seconds", { ascending: true });

    if (jumpscaresError) {
      throw new Error("Could not fetch jumpscares for the movie");
    }

    const responsePayload = {
      id: movie.id,
      title: movie.title,
      jumpscares: jumpscares || [],
    };

    return NextResponse.json(responsePayload, { headers });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500, headers }
    );
  }
}