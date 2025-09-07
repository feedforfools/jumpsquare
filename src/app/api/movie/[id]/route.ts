import { NextRequest, NextResponse } from "next/server";
import {
  supabaseAdmin,
  detailRateLimit,
  transformMovieForCard,
} from "@/lib/server-utils";

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
      .from("v3_movies")
      .select(
        `
        *,
        v3_movie_directors(v3_directors(*)),
        v3_movie_genres(v3_genres(*))
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Movie not found" },
          { status: 404, headers }
        );
      }
      throw error;
    }

    const transformedMovie = transformMovieForCard(data);
    return NextResponse.json(transformedMovie, { headers });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500, headers });
  }
}
