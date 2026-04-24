"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Scene, Choice } from "@/data/scenarios";
import { RoundPill } from "./RoundPill";
import { StakesMeter } from "./StakesMeter";

interface SceneScreenProps {
  scene: Scene;
  onChoose: (choice: Choice) => void;
}

export function SceneScreen({ scene, onChoose }: SceneScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCaption, setShowCaption] = useState(false);
  const [optionsReady, setOptionsReady] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    setShowCaption(false);
    setOptionsReady(false);
    setTimerStarted(false);
    setSelectedId(null);
    setVideoError(false);

    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Autoplay blocked — show options immediately
        setVideoError(true);
        handleVideoEnd();
      });
    }

    // Show caption 1.2s after start
    const captionTimer = setTimeout(() => setShowCaption(true), 1200);
    return () => clearTimeout(captionTimer);
  }, [scene.id]);

  const handleVideoEnd = () => {
    setShowCaption(false);
    setTimeout(() => {
      setOptionsReady(true);
      setTimeout(() => setTimerStarted(true), 350);
    }, 200);
  };

  const handleChoose = (choice: Choice) => {
    if (selectedId) return;
    setSelectedId(choice.id);
    setTimeout(() => onChoose(choice), 450);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 bg-black overflow-hidden"
    >
      {/* Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        onError={() => {
          setVideoError(true);
          handleVideoEnd();
        }}
      >
        <source src={scene.videoSrc} type="video/mp4" />
      </video>

      {/* If video failed, show a placeholder background */}
      {videoError && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(139,111,255,0.2)_0%,transparent_70%),linear-gradient(180deg,#1f1a3c_0%,#0a0915_100%)] flex items-center justify-center">
          <div className="text-ink-dim text-sm text-center px-8">
            <div className="font-serif italic text-xl mb-2">{scene.name}</div>
            <div className="text-xs">{scene.setting}</div>
          </div>
        </div>
      )}

      {/* Top darken gradient */}
      <div className="absolute top-0 inset-x-0 h-[140px] bg-gradient-to-b from-black/65 via-black/20 to-transparent pointer-events-none z-10" />

      {/* Bottom darken gradient — fades in with options */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: optionsReady ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        className="absolute bottom-0 inset-x-0 h-[55%] bg-gradient-to-t from-bg-app via-bg-app/90 to-transparent pointer-events-none z-10"
      />

      {/* Top bar */}
      <div className="absolute top-[14px] inset-x-0 flex justify-between items-center px-6 z-20 pt-[36px]">
        <RoundPill round={scene.id as 1 | 2} onLight />
        <StakesMeter level={scene.stakes} onLight />
      </div>

      {/* Caption during video */}
      <AnimatePresence>
        {showCaption && !optionsReady && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-[48%] z-20
              bg-black/55 backdrop-blur-sm rounded-lg px-3.5 py-2
              text-sm text-white font-medium max-w-[85%] text-center"
          >
            &ldquo;{scene.openerLine}&rdquo;
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options panel */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: optionsReady ? 0 : "100%" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 inset-x-0 z-30 px-5 pt-5 pb-7 flex flex-col gap-2.5"
      >
        <div className="text-[10px] tracking-[0.22em] uppercase text-brand-light font-semibold pl-0.5">
          Your move · 5s
        </div>

        {/* Timer bar */}
        <div className="h-[2px] bg-brand-light/15 rounded overflow-hidden mb-1">
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: timerStarted ? 0 : 1 }}
            transition={{ duration: 5, ease: "linear" }}
            style={{ transformOrigin: "left" }}
            className="h-full bg-gradient-brand"
          />
        </div>

        {scene.choices.map((choice, i) => (
          <motion.button
            key={choice.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: optionsReady ? 1 : 0,
              y: optionsReady ? 0 : 10,
            }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            onClick={() => handleChoose(choice)}
            disabled={!!selectedId}
            className={`
              text-left flex gap-3 items-center
              bg-bg-card/82 backdrop-blur-md border rounded-2xl px-4 py-3
              transition-all
              ${
                selectedId === choice.id
                  ? "border-brand bg-brand/20"
                  : "border-line-strong hover:border-brand-softer hover:bg-bg-card/95"
              }
            `}
          >
            <div className="w-[22px] h-[22px] border border-line-strong rounded-full flex items-center justify-center text-[11px] text-brand-light font-semibold flex-shrink-0">
              {choice.id}
            </div>
            <div className="text-[13px] leading-snug text-ink">
              {choice.text}
            </div>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
