import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * MVP approach: returns the Gemini API key to the authenticated frontend.
 *
 * This is a pragmatic compromise for a demo:
 * - Production: use ephemeral tokens + backend proxy
 * - Demo: expose key via same-origin endpoint
 *
 * The key still doesn't appear in bundled JS or public env vars.
 * It only lives on the Vercel server and is fetched at runtime by our own frontend.
 *
 * For stricter security, add origin/referer checks here.
 */
export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  return NextResponse.json({ key: apiKey });
}
