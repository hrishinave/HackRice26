import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_MUSIC_URL = "https://api.elevenlabs.io/v1/music";

export async function POST(request: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY is not configured on the server" },
      { status: 500 }
    );
  }

  let body: {
    prompt?: string;
    musicLengthMs?: number;
    forceInstrumental?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { prompt, musicLengthMs, forceInstrumental } = body;
  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json(
      { error: "'prompt' is required and must be a string" },
      { status: 400 }
    );
  }

  const elevenLabsResponse = await fetch(ELEVENLABS_MUSIC_URL, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      ...(musicLengthMs ? { music_length_ms: musicLengthMs } : {}),
      ...(forceInstrumental !== undefined
        ? { force_instrumental: forceInstrumental }
        : {}),
    }),
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
