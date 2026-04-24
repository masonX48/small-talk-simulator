"use client";

import { motion } from "framer-motion";
import type { LiveScene } from "@/data/scenarios";
import { Button } from "./Button";
import { RoundPill } from "./RoundPill";
import { StakesMeter } from "./StakesMeter";

interface Round3SetupProps {
  scene: LiveScene;
  onReady: () => void;
}

export function Round3Setup({ scene, onReady }: Round3SetupProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 flex flex-col justify-between px-7 pt-[60px] pb-10
        [background:radial-gradient(ellipse_at_50%_30%,rgba(139,111,255,0.12)_0%,transparent_60%),#07061a]"
    >
      <div className="flex flex-col gap-1">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex justify-between items-center mb-5"
        >
          <RoundPill round={3} />
          <StakesMeter level={3} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="font-serif font-light text-[40px] leading-none tracking-[-0.02em]"
        >
          No{" "}
          <em className="not-italic italic text-gradient-brand font-normal">
            options
          </em>
          <br />
          this time.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-sm text-ink-dim leading-relaxed mt-4 max-w-[280px]"
        >
          {scene.setting}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6 p-4 bg-bg-card border border-line rounded-2xl"
        >
          <div className="text-[9px] tracking-[0.25em] uppercase text-brand-light font-semibold mb-1.5">
            {scene.personaName} will open with
          </div>
          <div className="font-serif italic text-[14px] leading-snug text-ink">
            &ldquo;{scene.openerLine}&rdquo;
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-5 flex items-start gap-2.5 text-[12px] text-ink-dim leading-relaxed"
        >
          <span className="text-brand-light mt-0.5">●</span>
          <span>
            You&apos;ll have 2 minutes. Speak naturally — {scene.personaName} hears
            you in real time.
          </span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Button onClick={onReady}>I&apos;m ready — allow mic &amp; start</Button>
      </motion.div>
    </motion.div>
  );
}
