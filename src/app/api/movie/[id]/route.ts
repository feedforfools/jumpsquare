import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, detailRateLimit } from "@/lib/server-utils";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
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

    const transformedMovie = {
      ...data,
      directors: data.v2_movie_directors.map((md: any) => md.v2_directors),
      genres: data.v2_movie_genres.map((mg: any) => mg.v2_genres),
    };

    return NextResponse.json(transformedMovie, { headers });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers }
    );
  }
}
