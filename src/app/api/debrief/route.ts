import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface TranscriptEntry {
  role: "user" | "assistant";
  text: string;
}

const DEBRIEF_SYSTEM = `You are a communication coach analyzing a 2-minute small-talk practice conversation.

Your job: produce a short, honest, human debrief. No scores. No percentages. No bullet lists. Just three short paragraphs that sound like a thoughtful mentor talking to the user after the session.

THE THREE SECTIONS (in this order):

1. CONTENT — what they actually said
   - Did they add something of themselves, or just respond?
   - Did they miss openings the other person handed them?
   - Were their hooks specific or vague?

2. DELIVERY — how they said it
   - Pace, hesitation, pacing of sentences, confidence in voice
   - Filler habits, over-qualifying, rushing
   - Note: you only have the transcript, not audio — infer from word choice, sentence length, and rhythm

3. FLOW — the shape of the conversation
   - Did they sustain the back-and-forth?
   - Did they recover from stalls?
   - Did they bridge between topics?

RULES:
- Each section: 2-3 sentences. No more.
- Speak directly to the user: "you", not "the user"
- Be specific. Name ONE real moment per section when possible.
- Wrap one key phrase per section in <em>…</em> — this will be highlighted in the UI.
- Do not praise for the sake of praise. If something was weak, name it calmly.
- Do not mention that you are an AI or that you were given a transcript.
- Tone: warm but honest. Like a coach, not a cheerleader and not a judge.`;

const DEBRIEF_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    content: {
      type: Type.STRING,
      description:
        "Feedback on WHAT the user said — their substance, hooks, openings. 2-3 sentences, include one <em>…</em>.",
    },
    delivery: {
      type: Type.STRING,
      description:
        "Feedback on HOW the user said it — pace, rhythm, confidence, filler. 2-3 sentences, include one <em>…</em>.",
    },
    flow: {
      type: Type.STRING,
      description:
        "Feedback on the SHAPE of the conversation — sustaining, recovering, bridging. 2-3 sentences, include one <em>…</em>.",
    },
  },
  required: ["content", "delivery", "flow"],
};

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
        "You didn&apos;t get a chance to say much this time. <em>That&apos;s the first thing to fix</em> — stepping in is half the skill.",
      delivery:
        "There&apos;s not enough here to comment on delivery. <em>Next round, let yourself speak before the perfect sentence arrives.</em>",
      flow:
        "The conversation never really got going. That&apos;s fine — <em>the next try is the actual try</em>.",
    });
  }

  const personaName = body.personaName ?? "the other person";
  const transcriptText = transcript
    .map((e) => `${e.role === "user" ? "YOU" : personaName.toUpperCase()}: ${e.text.trim()}`)
    .join("\n");

  const prompt = `Here is the transcript of a small-talk practice conversation. The user ("YOU") was practicing a 2-minute hallway conversation with ${personaName}, a senior colleague they just met.

Transcript:
${transcriptText}

Produce the debrief.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: DEBRIEF_SYSTEM,
        responseMimeType: "application/json",
        responseSchema: DEBRIEF_SCHEMA,
        temperature: 0.7,
      },
    });

    const text = response.text ?? "";
    let parsed: { content: string; delivery: string; flow: string };
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("Model returned invalid JSON.");
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Debrief generation failed:", err);
    return NextResponse.json(
      {
        error:
          "Could not generate debrief. Try again in a moment.",
      },
      { status: 500 }
    );
  }
}
