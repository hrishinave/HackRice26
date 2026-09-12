import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_MUSIC_URL = "https://api.elevenlabs.io/v1/music";

function buildMusicPrompt(
  goals: string,
  musicStyle: string,
  neurotype: string
): string {
  return `Compose a piece of background music designed to help a ${neurotype} listener stay focused while working on: ${goals}. The music should be in a ${musicStyle} style, with a steady, non-distracting rhythm, minimal abrupt changes, and no lyrics, so it supports sustained concentration rather than pulling attention away from the task.`;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY is not configured on the server" },
      { status: 500 }
    );
  }

  let body: {
    goals?: string;
    musicStyle?: string;
    neurotype?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { goals, musicStyle, neurotype } = body;
  if (!goals || typeof goals !== "string") {
    return NextResponse.json(
      { error: "'goals' is required and must be a string" },
      { status: 400 }
    );
  }
  if (!musicStyle || typeof musicStyle !== "string") {
    return NextResponse.json(
      { error: "'musicStyle' is required and must be a string" },
      { status: 400 }
    );
  }
  if (!neurotype || typeof neurotype !== "string") {
    return NextResponse.json(
      { error: "'neurotype' is required and must be a string" },
      { status: 400 }
    );
  }

  const prompt = buildMusicPrompt(goals, musicStyle, neurotype);

  const elevenLabsResponse = await fetch(ELEVENLABS_MUSIC_URL, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!elevenLabsResponse.ok || !elevenLabsResponse.body) {
    const errorText = await elevenLabsResponse.text();
    return NextResponse.json(
      { error: "ElevenLabs request failed", details: errorText },
      { status: elevenLabsResponse.status }
    );
  }

  const contentType =
    elevenLabsResponse.headers.get("Content-Type") ?? "audio/mpeg";

  return new NextResponse(elevenLabsResponse.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": 'inline; filename="song.mp3"',
    },
  });
}
