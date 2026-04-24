"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { LiveScene } from "@/data/scenarios";
import {
  GeminiLiveClient,
  type GeminiConnState,
  type TranscriptEntry,
} from "@/lib/geminiLive";
import { VoiceOrb } from "./VoiceOrb";

interface Round3LiveProps {
  scene: LiveScene;
  onFinish: (transcript: TranscriptEntry[]) => void;
  onError: (message: string) => void;
}

function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function Round3Live({ scene, onFinish, onError }: Round3LiveProps) {
  const [connState, setConnState] = useState<GeminiConnState>("idle");
  const [remaining, setRemaining] = useState(scene.durationSeconds);
  const clientRef = useRef<GeminiLiveClient | null>(null);
  const transcriptRef = useRef<TranscriptEntry[]>([]);
  const wrappedRef = useRef(false);
  const endingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/live-key");
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "Could not get API key.");
        }
        const { key } = await res.json();
        if (cancelled) return;

        const client = new GeminiLiveClient({
          apiKey: key,
          systemPrompt: scene.personaSystemPrompt,
          voice: "Aoede",
          firstLine: scene.openerLine,
          onStateChange: (s) => setConnState(s),
          onTranscript: (entry) => {
            const list = transcriptRef.current;
            const last = list[list.length - 1];
            if (last && last.role === entry.role && !last.final) {
              list[list.length - 1] = entry;
            } else {
              list.push(entry);
            }
          },
          onError: (err) => onError(err.message),
        });
        clientRef.current = client;
        await client.start();
      } catch (err) {
        if (cancelled) return;
        onError(
          err instanceof Error
            ? err.message
            : "Could not start the conversation."
        );
      }
    })();

    return () => {
      cancelled = true;
      clientRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (connState !== "listening" && connState !== "speaking") return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        if (next <= 10 && !wrappedRef.current) {
          wrappedRef.current = true;
          clientRef.current?.wrapUp();
        }
        if (next <= 0 && !endingRef.current) {
          endingRef.current = true;
          finishConversation();
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connState]);

  const finishConversation = async () => {
    endingRef.current = true;
    setTimeout(async () => {
      await clientRef.current?.close();
      onFinish([...transcriptRef.current]);
    }, 1200);
  };

  const handleEndClick = () => {
    if (endingRef.current) return;
    finishConversation();
  };

  const orbState: "idle" | "listening" | "speaking" =
    connState === "speaking"
      ? "speaking"
      : connState === "listening"
      ? "listening"
      : "idle";

  const statusLabel = (() => {
    switch (connState) {
      case "connecting":
        return "Connecting…";
      case "speaking":
        return `${scene.personaName} is speaking`;
      case "listening":
        return "Your turn";
      case "ending":
        return "Wrapping up…";
      case "error":
        return "Something went wrong";
      default:
        return " ";
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 overflow-hidden
        [background:radial-gradient(ellipse_at_50%_45%,rgba(139,111,255,0.22)_0%,transparent_60%),#07061a]"
    >
      <div className="absolute top-[14px] inset-x-0 flex justify-between items-start px-6 pt-[36px] z-10">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] tracking-[0.2em] uppercase text-ink-dim">
            You&apos;re talking to
          </span>
          <span className="font-serif text-[15px] text-ink">
            {scene.personaName}
          </span>
        </div>
        <div className="text-right">
          <div className="text-[10px] tracking-[0.2em] uppercase text-ink-dim mb-1">
            Remaining
          </div>
          <div className="font-serif text-[16px] text-brand-light tabular-nums">
            {formatClock(remaining)}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-14">
        <VoiceOrb state={orbState} />
        <AnimatePresence mode="wait">
          <motion.div
            key={statusLabel}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="text-[12px] text-ink-dim tracking-wider"
          >
            <span className="text-brand-light font-medium">
              {connState === "speaking" ? scene.personaName : ""}
            </span>
            <span className={connState === "speaking" ? "ml-1" : ""}>
              {connState === "speaking" ? "is speaking…" : statusLabel}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 inset-x-0 flex justify-center pb-8 z-10">
        <button
          onClick={handleEndClick}
          disabled={connState === "ending"}
          className="bg-transparent border border-line-strong text-ink-dim px-6 py-3 rounded-full text-[12px] tracking-[0.08em] uppercase hover:border-brand-softer hover:text-ink transition-colors disabled:opacity-50"
        >
          End conversation
        </button>
      </div>
    </motion.div>
  );
}
