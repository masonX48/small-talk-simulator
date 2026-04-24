"use client";

import { motion } from "framer-motion";

interface VoiceOrbProps {
  state: "idle" | "listening" | "speaking";
}

export function VoiceOrb({ state }: VoiceOrbProps) {
  const isSpeaking = state === "speaking";
  const isListening = state === "listening";

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer ring */}
      <motion.div
        animate={{
          scale: isSpeaking ? [1, 1.08, 1] : [1, 1.02, 1],
          opacity: isSpeaking ? [0.3, 0.5, 0.3] : [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: isSpeaking ? 1.4 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[280px] h-[280px] rounded-full border border-brand-light"
      />
      {/* Middle ring */}
      <motion.div
        animate={{
          scale: isSpeaking ? [1, 1.06, 1] : [1, 1.015, 1],
          opacity: isSpeaking ? [0.25, 0.5, 0.25] : [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: isSpeaking ? 1.2 : 2.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.1,
        }}
        className="absolute w-[230px] h-[230px] rounded-full border border-brand-light"
      />
      {/* Core orb */}
      <motion.div
        animate={{
          scale: isSpeaking ? [1, 1.04, 1] : [1, 1.01, 1],
          filter: isSpeaking
            ? ["brightness(1)", "brightness(1.2)", "brightness(1)"]
            : ["brightness(0.92)", "brightness(1)", "brightness(0.92)"],
        }}
        transition={{
          duration: isSpeaking ? 0.9 : 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-[180px] h-[180px] rounded-full shadow-orb"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #D4C4FF 0%, #8B6FFF 45%, #4B2FCF 100%)",
        }}
      />
      {/* Subtle inner highlight */}
      <motion.div
        animate={{
          opacity: isSpeaking ? [0.4, 0.7, 0.4] : [0.3, 0.45, 0.3],
        }}
        transition={{
          duration: isSpeaking ? 0.9 : 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[80px] h-[80px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)",
          transform: "translate(-30px, -30px)",
        }}
      />
    </div>
  );
}
