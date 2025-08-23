import { NextRequest, NextResponse } from "next/server";
import {
  supabaseAdmin,
  discoverRateLimit,
  transformMovieForCard,
} from "@/lib/server-utils";
import { MOVIES_PER_PAGE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  // Apply Rate Limiting
  const ip = request.headers.get("x-real-ip") ?? "127.0.0.1";
  const { success, limit, remaining, reset } = await discoverRateLimit.limit(
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
    const selectQuery = `*, v2_movie_directors(v2_directors(id, name)), v2_movie_genres(v2_genres(id, name))`;

    // Fetch a few different categories in parallel
    const [recentlyAddedRes, highestRatedRes, mostJumpscaresRes] =
      await Promise.all([
        supabaseAdmin
          .from("v2_movies")
          .select(selectQuery)
          .order("created_at", { ascending: false })
          .limit(MOVIES_PER_PAGE),
        supabaseAdmin
          .from("v2_movies")
          .select(selectQuery)
          .order("year", { ascending: false })
          .limit(MOVIES_PER_PAGE),
        supabaseAdmin
          .from("v2_movies")
          .select(selectQuery)
          .order("jumpscare_count", { ascending: false })
          .limit(MOVIES_PER_PAGE),
      ]);

    if (
      recentlyAddedRes.error ||
      highestRatedRes.error ||
      mostJumpscaresRes.error
    ) {
      console.error(
        "Error fetching discovery data:",
        recentlyAddedRes.error ||
          highestRatedRes.error ||
          mostJumpscaresRes.error
      );
      throw new Error("Could not fetch discovery data");
    }

    const discoverData = {
      recentlyAdded: recentlyAddedRes.data.map(transformMovieForCard),
      highestRated: highestRatedRes.data.map(transformMovieForCard),
      mostJumpscares: mostJumpscaresRes.data.map(transformMovieForCard),
    };

    return NextResponse.json(discoverData, { headers });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500, headers });
  }
}
