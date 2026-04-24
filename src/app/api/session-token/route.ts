import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Creates an ephemeral auth token for Gemini Live API.
 * This lets the browser connect to the Live WebSocket without
 * ever seeing our main API key.
 */
export async function POST() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const nowSeconds = Math.floor(Date.now() / 1000);

    const token = await ai.authTokens.create({
      config: {
        // Usable for one session, valid for 10 minutes
        uses: 1,
        expireTime: new Date((nowSeconds + 10 * 60) * 1000).toISOString(),
        newSessionExpireTime: new Date(
          (nowSeconds + 60) * 1000
        ).toISOString(),
      },
    });

    return NextResponse.json({ token: token.name });
  } catch (error) {
    console.error("Failed to create Gemini auth token:", error);
    return NextResponse.json(
      {
        error:
          "Could not create session token. Check that your GEMINI_API_KEY is valid and that the Live API is enabled for your project.",
      },
      { status: 500 }
    );
  }
}
