"use client";

import { motion } from "framer-motion";
import type { Choice } from "@/data/scenarios";
import { Button } from "./Button";

interface FeedbackScreenProps {
  choice: Choice;
  onContinue: () => void;
  continueLabel?: string;
}

export function FeedbackScreen({
  choice,
  onContinue,
  continueLabel = "Continue",
}: FeedbackScreenProps) {
  const positive = choice.verdict === "lands";
  const bgClass = positive
    ? "[background:radial-gradient(ellipse_at_50%_25%,rgba(139,111,255,0.18)_0%,transparent_65%),linear-gradient(180deg,#1f1a3c_0%,#0a0915_100%)]"
    : choice.verdict === "closed"
    ? "[background:radial-gradient(ellipse_at_50%_25%,rgba(255,179,102,0.12)_0%,transparent_65%),linear-gradient(180deg,#2a2214_0%,#0a0915_100%)]"
    : "[background:radial-gradient(ellipse_at_50%_25%,rgba(184,165,255,0.1)_0%,transparent_65%),linear-gradient(180deg,#1c1a2e_0%,#0a0915_100%)]";

  const iconColor = positive
    ? "bg-positive-soft text-positive"
    : "bg-warning-soft text-warning";
  const tagColor = positive ? "text-positive" : "text-warning";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 bg-bg-app"
    >
      <div className={`absolute inset-0 ${bgClass} blur-sm opacity-70`} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-app/85 to-bg-app/95" />

      <div className="relative z-10 h-full flex flex-col justify-end px-6 pt-[50px] pb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="bg-bg-card/85 backdrop-blur-xl border border-line-strong rounded-[20px] p-6 mb-4"
        >
          <div className="flex items-center gap-3 mb-3.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[15px] ${iconColor}`}
            >
              {positive ? "✓" : "!"}
            </div>
            <div
              className={`text-[10px] tracking-[0.2em] uppercase font-semibold ${tagColor}`}
            >
              {choice.tag}
            </div>
          </div>
          <h2 className="font-serif text-[22px] font-normal leading-[1.25] tracking-[-0.01em] mb-2.5">
            {choice.headline}
          </h2>
          <p
            className="text-[13px] leading-relaxed text-ink-dim [&_em]:text-ink [&_em]:not-italic [&_em]:font-medium"
            dangerouslySetInnerHTML={{ __html: choice.body }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-bg-card/60 border border-line rounded-xl px-4 py-3.5 mb-4"
        >
          <div className="text-[9px] tracking-[0.22em] uppercase text-ink-dim font-semibold mb-1.5">
            Her response
          </div>
          <div className="font-serif italic text-sm leading-snug text-ink">
            &ldquo;{choice.herResponse}&rdquo;
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <Button onClick={onContinue}>{continueLabel}</Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
