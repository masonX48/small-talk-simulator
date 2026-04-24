"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { TranscriptEntry } from "@/lib/geminiLive";
import { Button } from "./Button";

interface DebriefData {
  content: string;
  delivery: string;
  flow: string;
}

interface DebriefScreenProps {
  transcript: TranscriptEntry[];
  personaName: string;
  onRestart: () => void;
}

export function DebriefScreen({
  transcript,
  personaName,
  onRestart,
}: DebriefScreenProps) {
  const [data, setData] = useState<DebriefData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/debrief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript, personaName }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "Could not generate debrief.");
        }
        const json = await res.json();
        if (cancelled) return;
        setData(json);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [transcript, personaName]);

  if (!data && !error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8"
      >
        <div className="w-14 h-14 rounded-full border border-brand-light/30 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full border-2 border-brand-light border-t-transparent"
          />
        </div>
        <div className="text-center flex flex-col gap-2">
          <div className="font-serif text-[22px] font-light text-gradient-brand">
            Listening back…
          </div>
          <div className="text-[13px] text-ink-dim max-w-[240px] leading-relaxed">
            Reading the conversation and thinking about what actually happened.
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8 text-center"
      >
        <div className="font-serif text-[22px] text-ink">
          Couldn&apos;t generate the debrief.
        </div>
        <div className="text-sm text-ink-dim max-w-[260px] leading-relaxed">
          {error}
        </div>
        <div className="w-full max-w-[280px]">
          <Button onClick={onRestart}>Try again from the start</Button>
        </div>
      </motion.div>
    );
  }

  const sections = [
    { label: "Content", body: data!.content },
    { label: "Delivery", body: data!.delivery },
    { label: "Flow", body: data!.flow },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 overflow-y-auto no-scrollbar bg-bg-app"
    >
      <div className="flex flex-col min-h-full px-6 pt-[50px] pb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-7"
        >
          <div className="text-[10px] tracking-[0.25em] uppercase text-brand-light font-semibold mb-2.5">
            Debrief
          </div>
          <h2 className="font-serif font-light text-[30px] leading-[1.1] tracking-[-0.02em]">
            Here&apos;s what
            <br />I{" "}
            <em className="not-italic italic text-gradient-brand font-normal">
              heard
            </em>
            .
          </h2>
        </motion.div>

        <div className="flex flex-col gap-5 mb-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              className="border-t border-line pt-4"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_8px_#8B6FFF]" />
                <div className="text-[10px] tracking-[0.25em] uppercase text-ink-dim font-semibold">
                  {section.label}
                </div>
              </div>
              <p
                className="text-[13px] leading-relaxed text-ink [&_em]:not-italic [&_em]:text-gradient-brand [&_em]:font-medium"
                dangerouslySetInnerHTML={{ __html: section.body }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-auto flex flex-col gap-2.5"
        >
          <Button onClick={onRestart}>Try again</Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
