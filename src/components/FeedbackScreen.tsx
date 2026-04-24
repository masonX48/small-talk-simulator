"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reactionDone, setReactionDone] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const positive = choice.verdict === "lands";

  useEffect(() => {
    setReactionDone(false);
    setVideoError(false);

    const v = videoRef.current;
    if (!v) return;

    v.currentTime = 0;
    const p = v.play();
    if (p) {
      p.catch(() => {
        // Autoplay blocked — skip to feedback card
        setVideoError(true);
        setReactionDone(true);
      });
    }
  }, [choice.reactionVideoSrc]);

  const bgClass = positive
    ? "[background:radial-gradient(ellipse_at_50%_25%,rgba(139,111,255,0.18)_0%,transparent_65%),linear-gradient(180deg,#1f1a3c_0%,#0a0915_100%)]"
    : "[background:radial-gradient(ellipse_at_50%_25%,rgba(255,179,102,0.12)_0%,transparent_65%),linear-gradient(180deg,#2a2214_0%,#0a0915_100%)]";

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
      className="absolute inset-0 bg-black overflow-hidden"
    >
      {/* === VIDEO PHASE === */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        preload="auto"
        onEnded={() => setReactionDone(true)}
        onError={() => {
          setVideoError(true);
          setReactionDone(true);
        }}
      >
        <source src={choice.reactionVideoSrc} type="video/mp4" />
      </video>

      {/* Fallback if video errors */}
      {videoError && (
        <div
          className={`absolute inset-0 ${bgClass} flex items-center justify-center`}
        />
      )}

      {/* Top vignette (status bar area) */}
      <div className="absolute top-0 inset-x-0 h-[120px] bg-gradient-to-b from-black/65 via-black/20 to-transparent pointer-events-none z-10" />

      {/* === REACTION LABEL (during video) === */}
      <AnimatePresence>
        {!reactionDone && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-[70px] left-1/2 -translate-x-1/2 z-20"
          >
            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.22em] font-semibold backdrop-blur-md ${
                positive
                  ? "bg-positive/15 border border-positive/30 text-positive"
                  : "bg-warning/15 border border-warning/30 text-warning"
              }`}
            >
              <span>{positive ? "✓" : "!"}</span>
              {choice.tag}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === FEEDBACK CARD (after video ends) === */}
      <AnimatePresence>
        {reactionDone && (
          <>
            {/* Dim the video */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className={`absolute inset-0 ${bgClass} opacity-90`}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-app/60 to-bg-app/95"
            />

            {/* Card */}
            <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 pt-[50px] pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.45 }}
                className="bg-bg-card/90 backdrop-blur-xl border border-line-strong rounded-[20px] p-6 mb-4"
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
              >
                <Button onClick={onContinue}>{continueLabel}</Button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
