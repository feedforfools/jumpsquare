import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, exportRateLimit } from "@/lib/server-utils";
import { Jumpscare } from "@/types";

const IDEAL_INTRO_START_TIME = 30; // in seconds
const INTRO_DURATION = 17; // in seconds (8s + 1s gap + 8s)
const INTRO_SINGLE_SUBTITLE_DURATION = 8; // in seconds

// Helper function to format time for SRT files
const formatSrtTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  // SRT format uses a comma for the millisecond separator
  return `${hours}:${minutes}:${seconds},000`;
};

// Helper function to generate the SRT content
const generateSrtContent = (jumpscares: Jumpscare[]): string => {
  let srtContent = "";
  let sequence = 1;

  const introPosition = getBestIntroductionStartingTimestamp(jumpscares);
  const introStartTime = introPosition.seconds;
  const introInsertIndex = introPosition.index;

  // Intro subtitles
  const intro1 = {
    text: "Jumpscare subtitles by\nheresthejump.com",
  };
  const intro2 = {
    text: "Know when the jumps are coming...\nEnjoy the movie! :)",
  };

  // Calculate intro timing
  const intro1StartTime = introStartTime;
  const intro2StartTime = introStartTime + INTRO_SINGLE_SUBTITLE_DURATION + 1; // +1s gap

  // Process jumpscares and insert intro at the right position
  jumpscares.forEach((jumpscare) => {
    // Insert intro before this jumpscare if this is the insertion point
    if (sequence === introInsertIndex) {
      // Add the first intro subtitle
      srtContent += `${sequence++}\n`;
      srtContent += `${formatSrtTime(intro1StartTime)} --> ${formatSrtTime(intro1StartTime + INTRO_SINGLE_SUBTITLE_DURATION)}\n`;
      srtContent += `${intro1.text}\n\n`;

      // Add the second intro subtitle
      srtContent += `${sequence++}\n`;
      srtContent += `${formatSrtTime(intro2StartTime)} --> ${formatSrtTime(intro2StartTime + INTRO_SINGLE_SUBTITLE_DURATION)}\n`;
      srtContent += `${intro2.text}\n\n`;
    }

    // Add jumpscare warning
    const totalSeconds = jumpscare.timestamp_minutes * 60 + jumpscare.timestamp_seconds;
    const startTime = totalSeconds - 5;
    const endTime = totalSeconds;

    const category = jumpscare.category;
    let alertText = "";

    switch (category) {
      case "major":
        alertText = "Major jumpscare incoming!\nWatch out!";
        break;
      case "minor":
        alertText = "Minor jumpscare incoming!";
        break;
      default:
        alertText = "Upcoming jumpscare!";
        break;
    }
      
    srtContent += `${sequence++}\n`;
    srtContent += `${formatSrtTime(startTime)} --> ${formatSrtTime(endTime)}\n`;
    srtContent += `${alertText}\n\n`;
  });

  // If intro should be inserted after all jumpscares
  if (introInsertIndex >= sequence) {
    // Add the first intro subtitle
    srtContent += `${sequence++}\n`;
    srtContent += `${formatSrtTime(intro1StartTime)} --> ${formatSrtTime(intro1StartTime + INTRO_SINGLE_SUBTITLE_DURATION)}\n`;
    srtContent += `${intro1.text}\n\n`;

    // Add the second intro subtitle
    srtContent += `${sequence++}\n`;
    srtContent += `${formatSrtTime(intro2StartTime)} --> ${formatSrtTime(intro2StartTime + INTRO_SINGLE_SUBTITLE_DURATION)}\n`;
    srtContent += `${intro2.text}\n\n`;
  }

  return srtContent;
};

const getBestIntroductionStartingTimestamp = (jumpscares: Jumpscare[]): { index: number; seconds: number } => {
    const firstJumpscareTimeInSeconds = jumpscares[0].timestamp_minutes * 60 + jumpscares[0].timestamp_seconds;
    if (firstJumpscareTimeInSeconds > IDEAL_INTRO_START_TIME + INTRO_DURATION) {
        return { index: 1, seconds: IDEAL_INTRO_START_TIME };
    }

    const adjustedStartTime = firstJumpscareTimeInSeconds - INTRO_DURATION - 5; // 5 seconds before the first jumpscare warning
    if (adjustedStartTime >= 0) {
        return { index: 1, seconds: adjustedStartTime };
    }

    // Search for a long enough gap between jumpscares, at the beginning of the movie, that can fit the intro sequence
    for (let i = 0; i < jumpscares.length - 1; i++) {
        const currentJumpscareTime = jumpscares[i].timestamp_minutes * 60 + jumpscares[i].timestamp_seconds;
        const nextJumpscareTime = jumpscares[i + 1].timestamp_minutes * 60 + jumpscares[i + 1].timestamp_seconds;
        const gap = nextJumpscareTime - currentJumpscareTime;

        if (gap >= 3 * INTRO_DURATION) { // 3 times the intro duration to ensure enough space
            return { index: i + 1 + 1, seconds: currentJumpscareTime + 1.5 * gap - INTRO_DURATION / 2 }; // Center the intro in the gap
        }
    }

    const lastIndex = jumpscares.length - 1;
    return { index: lastIndex + 1 + 1, seconds: jumpscares[lastIndex].timestamp_minutes * 60 + jumpscares[lastIndex].timestamp_seconds + 10 }; // After the last jumpscare (+10s buffer)
}


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Apply Rate Limiting
  const ip = request.headers.get("x-real-ip") ?? "127.0.0.1";
  const { success, limit, remaining, reset } = await exportRateLimit.limit(ip);

  const rateLimitHeaders = {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": reset.toString(),
  };

  if (!success) {
    return new NextResponse(JSON.stringify({ error: "Too Many Requests" }), {
      status: 429,
      headers: rateLimitHeaders,
    });
  }

  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Movie ID is required" },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // Fetch the movie to get the title for the filename
    const { data: movieData, error: movieError } = await supabaseAdmin
      .from("v3_movies")
      .select("title, year")
      .eq("id", id)
      .single();

    if (movieError) {
        if (movieError.code === 'PGRST116') {
            return new NextResponse(JSON.stringify({ error: "Movie not found" }), {
                status: 404,
                headers: rateLimitHeaders,
            });
        }
        throw movieError;
    }


    // Fetch jumpscares for the movie
    const { data: jumpscares, error: jumpscaresError } = await supabaseAdmin
      .from("v3_jumpscares")
      .select("*")
      .eq("movie_id", id)
      .order("timestamp_minutes", { ascending: true })
      .order("timestamp_seconds", { ascending: true });

    if (jumpscaresError) throw jumpscaresError;

    if (!jumpscares || jumpscares.length === 0) {
      return new NextResponse("No jumpscares found for this movie.", {
        status: 404,
        headers: rateLimitHeaders,
      });
    }

    const srtContent = generateSrtContent(jumpscares);
    
    // Sanitize the movie title for filename use
    const sanitizedTitle = movieData.title
      .replace(/[:\\/?"<>|*]/g, "") // Remove characters not allowed in filenames
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/--+/g, "-") // Replace multiple consecutive dashes with single dash
      .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
    
    const fileName = `${sanitizedTitle}_${movieData.year}_heresthejump.srt`;

    // Set headers to trigger file download
    const headers = new Headers(rateLimitHeaders);
    headers.set("Content-Type", "application/x-subrip; charset=utf-8");
    headers.set("Content-Disposition", `attachment; filename="${fileName}"`);

    return new NextResponse(srtContent, { status: 200, headers });

  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500, headers: rateLimitHeaders });
  }
}