import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface TranscriptEntry {
  role: "user" | "assistant";
  text: string;
}

const DEBRIEF_SYSTEM = `You are a communication coach analyzing a ~1 minute small-talk practice conversation.

Your job: produce a short, honest, human debrief in exactly three sections — Content, Delivery, Flow. No scores. No percentages. No bullet lists. Each section is 2-3 sentences of prose.

CONTENT — what they said: Did they add something of themselves, or just respond? Did they miss openings the other person handed them? Were their hooks specific or vague?

DELIVERY — how they said it: Pace, hesitation, confidence. Infer from word choice, sentence length, and rhythm in the transcript.

FLOW — the shape of the conversation: Did they sustain the back-and-forth? Did they recover from stalls? Did they bridge between topics?

RULES:
- Each section: 2-3 sentences MAX.
- Speak directly to the user as "you".
- Be specific. Name ONE real moment per section when possible.
- Wrap one key phrase per section in <em>…</em>.
- Be warm but honest. Don't praise for the sake of praise.
- Don't mention that you are an AI or that you saw a transcript.

Return ONLY valid JSON in this exact shape, no markdown, no code fences:
{"content": "...", "delivery": "...", "flow": "..."}`;

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured." },
      { status: 500 }
    );
  }

  let body: { transcript: TranscriptEntry[]; personaName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const transcript = (body.transcript ?? []).filter(
    (e) => e && typeof e.text === "string" && e.text.trim().length > 0
  );

  if (transcript.length === 0) {
    return NextResponse.json({
      content:
        "You didn't say much this time. <em>That's the first thing to fix</em> — stepping in is half the skill.",
      delivery:
        "There's not enough here to comment on delivery. <em>Next round, let yourself speak before the perfect sentence arrives.</em>",
      flow: "The conversation never really got going. That's fine — <em>the next try is the actual try</em>.",
    });
  }

  const personaName = body.personaName ?? "the other person";
  const transcriptText = transcript
    .map((e) => `${e.role === "user" ? "YOU" : personaName.toUpperCase()}: ${e.text.trim()}`)
    .join("\n");

  const prompt = `Transcript of a small-talk practice between YOU (the user) and ${personaName}:

${transcriptText}

Produce the debrief now.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: DEBRIEF_SYSTEM }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Gemini API error:", res.status, errBody);
      return NextResponse.json(
        { error: `Gemini returned ${res.status}` },
        { status: 500 }
      );
    }

    const json = await res.json();
    const text =
      json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let parsed: { content: string; delivery: string; flow: string };
    try {
      parsed = JSON.parse(text);
    } catch {
      console.error("Invalid JSON from Gemini:", text);
      return NextResponse.json(
        { error: "Model returned invalid JSON." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Debrief generation failed:", err);
    return NextResponse.json(
      { error: "Could not generate debrief. Try again in a moment." },
      { status: 500 }
    );
  }
}
