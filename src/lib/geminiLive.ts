"use client";

import {
  GoogleGenAI,
  Modality,
  type Session,
  type LiveServerMessage,
} from "@google/genai";
import { AudioPlaybackQueue, startMicCapture } from "./audio";

export type GeminiConnState =
  | "idle"
  | "connecting"
  | "listening"
  | "speaking"
  | "ending"
  | "closed"
  | "error";

export interface TranscriptEntry {
  role: "user" | "assistant";
  text: string;
  final?: boolean;
}

export interface GeminiLiveOptions {
  apiKey: string;
  systemPrompt: string;
  voice?: string;
  firstLine?: string; // Optional line to prompt AI to say first
  onStateChange?: (state: GeminiConnState) => void;
  onTranscript?: (entry: TranscriptEntry) => void;
  onError?: (err: Error) => void;
}

export class GeminiLiveClient {
  private session: Session | null = null;
  private ai: GoogleGenAI;
  private stopMic: (() => void) | null = null;
  private playback = new AudioPlaybackQueue();
  private state: GeminiConnState = "idle";
  private opts: GeminiLiveOptions;

  private userPartial = "";
  private aiPartial = "";

  constructor(opts: GeminiLiveOptions) {
    this.opts = opts;
    this.ai = new GoogleGenAI({ apiKey: opts.apiKey });
    this.playback.onPlaybackChange((isPlaying) => {
      if (this.state === "ending" || this.state === "closed") return;
      this.setState(isPlaying ? "speaking" : "listening");
    });
  }

  private setState(s: GeminiConnState) {
    if (this.state === s) return;
    this.state = s;
    this.opts.onStateChange?.(s);
  }

  async start() {
    if (this.state !== "idle") return;
    this.setState("connecting");

    try {
      this.session = await this.ai.live.connect({
        model: "gemini-live-2.5-flash-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: this.opts.systemPrompt,
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: this.opts.voice ?? "Aoede",
              },
            },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            this.setState("listening");
            // Trigger the AI to start speaking first.
            // Gemini Live needs SOME user input to generate — we send a minimal nudge.
            // The system prompt tells it what to say.
            if (this.session) {
              try {
                this.session.sendClientContent({
                  turns: [
                    {
                      role: "user",
                      parts: [{ text: "." }],
                    },
                  ],
                  turnComplete: true,
                });
              } catch (e) {
                console.warn("Initial nudge send failed:", e);
              }
            }
          },
          onmessage: (msg: LiveServerMessage) => this.handleServerMessage(msg),
          onerror: (e: ErrorEvent) => {
            console.error("Gemini Live error:", e);
            this.opts.onError?.(
              new Error(e.message || "Live connection error")
            );
            this.setState("error");
          },
          onclose: () => {
            this.setState("closed");
          },
        },
      });

      this.stopMic = await startMicCapture((b64) => {
        if (!this.session) return;
        this.session.sendRealtimeInput({
          audio: { data: b64, mimeType: "audio/pcm;rate=16000" },
        });
      });
    } catch (err) {
      console.error("Failed to start Live session:", err);
      this.opts.onError?.(err instanceof Error ? err : new Error(String(err)));
      this.setState("error");
    }
  }

  private handleServerMessage(msg: LiveServerMessage) {
    const sc = msg.serverContent;
    if (!sc) return;

    const parts = sc.modelTurn?.parts;
    if (Array.isArray(parts)) {
      for (const p of parts) {
        const inline = p.inlineData;
        if (
          inline?.data &&
          typeof inline.mimeType === "string" &&
          inline.mimeType.startsWith("audio/")
        ) {
          this.playback.enqueuePcm24k(inline.data);
        }
      }
    }

    if (sc.interrupted) {
      this.playback.flush();
    }

    const inputTx = sc.inputTranscription;
    if (inputTx?.text) {
      this.userPartial += inputTx.text;
      this.opts.onTranscript?.({
        role: "user",
        text: this.userPartial,
        final: false,
      });
    }

    const outputTx = sc.outputTranscription;
    if (outputTx?.text) {
      this.aiPartial += outputTx.text;
      this.opts.onTranscript?.({
        role: "assistant",
        text: this.aiPartial,
        final: false,
      });
    }

    if (sc.turnComplete) {
      if (this.userPartial.trim()) {
        this.opts.onTranscript?.({
          role: "user",
          text: this.userPartial,
          final: true,
        });
      }
      if (this.aiPartial.trim()) {
        this.opts.onTranscript?.({
          role: "assistant",
          text: this.aiPartial,
          final: true,
        });
      }
      this.userPartial = "";
      this.aiPartial = "";
    }
  }

  async wrapUp() {
    if (!this.session) return;
    try {
      this.session.sendClientContent({
        turns: [
          {
            role: "user",
            parts: [
              {
                text: "[SYSTEM: time is up. Wrap up naturally in ONE short sentence, then stop.]",
              },
            ],
          },
        ],
        turnComplete: true,
      });
    } catch (e) {
      console.warn("wrapUp send failed:", e);
    }
  }

  async close() {
    this.setState("ending");
    try {
      this.stopMic?.();
      this.stopMic = null;
    } catch {
      /* no-op */
    }
    try {
      this.session?.close();
    } catch {
      /* no-op */
    }
    this.session = null;
    this.playback.close();
    this.setState("closed");
  }
}
