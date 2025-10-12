import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, extensionRateLimit } from "@/lib/server-utils";

export async function GET(request: NextRequest) {
  // Parse upfront for logging
  const ip = request.headers.get("x-real-ip") ?? "127.0.0.1";
  const instanceId = request.headers.get("x-extension-instance-id") ?? null;
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  const year = searchParams.get("year");
  const nowIso = new Date().toISOString();

  // Helper: find or create installation, increment total_queries
  async function getOrCreateInstallation(): Promise<number | null> {
    if (!instanceId) return null;

    const { data: existing, error: selErr } = await supabaseAdmin
      .from("v3_extension_installations")
      .select("id, total_queries")
      .eq("instance_id", instanceId)
      .single();

    if (existing) {
      const { error: updErr } = await supabaseAdmin
        .from("v3_extension_installations")
        .update({
          last_seen_at: nowIso,
          total_queries: existing.total_queries + 1,
        })
        .eq("id", existing.id);
      if (updErr) console.error("Install update error:", updErr);
      return existing.id;
    }

    // PGRST116 = no rows, create new record
    if (selErr && selErr.code !== "PGRST116") {
      console.error("Install select error:", selErr);
      return null;
    }

    const { data: inserted, error: insErr } = await supabaseAdmin
      .from("v3_extension_installations")
      .insert({
        instance_id: instanceId,
        first_seen_at: nowIso,
        last_seen_at: nowIso,
        total_queries: 1,
      })
      .select("id")
      .single();

    if (insErr) {
      console.error("Install insert error:", insErr);
      return null;
    }
    return inserted?.id ?? null;
  }

  // Helper: write query log (best-effort)
  async function logQuery(
    installationId: number | null,
    statusCode: number,
    responseSummary: Record<string, unknown>
  ) {
    if (!installationId) return;
    const { error } = await supabaseAdmin
      .from("v3_extension_query_logs")
      .insert({
        installation_id: installationId,
        query_params: { title, year },
        response_summary: responseSummary,
        status_code: statusCode,
      });
    if (error) console.error("Log insert error:", error);
  }

  // Rate limit headers
  const { success, limit, remaining, reset } = await extensionRateLimit.limit(
    ip
  );
  const headers = {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": reset.toString(),
  };

  // Count this request (even if rate-limited)
  const installationId = await getOrCreateInstallation();

  if (!success) {
    await logQuery(installationId, 429, { error: "Too Many Requests" });
    return new NextResponse(JSON.stringify({ error: "Too Many Requests" }), {
      status: 429,
      headers,
    });
  }

  try {
    if (!title) {
      await logQuery(installationId, 400, { error: "Movie title is required" });
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
      await logQuery(installationId, 500, { error: "Search failed" });
      return NextResponse.json(
        { error: "Search failed" },
        { status: 500, headers }
      );
    }

    const movie = movies?.[0];
    if (!movie) {
      await logQuery(installationId, 404, { error: "Movie not found" });
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
      await logQuery(installationId, 500, {
        error: "Error fetching jumpscares",
      });
      return NextResponse.json(
        { error: "Error fetching jumpscares" },
        { status: 500, headers }
      );
    }

    const payload = {
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
    };

    await logQuery(installationId, 200, {
      movieId: movie.id,
      jumpscaresCount: (jumpscares || []).length,
    });

    return NextResponse.json(payload, { headers });
  } catch (error: unknown) {
    console.error("Extension API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    await logQuery(installationId, 500, { error: errorMessage });
    return NextResponse.json({ error: errorMessage }, { status: 500, headers });
  }
}
