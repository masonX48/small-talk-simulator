"use client";

import { motion } from "framer-motion";
import { Button } from "./Button";

interface WelcomeScreenProps {
  onBegin: () => void;
}

export function WelcomeScreen({ onBegin }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 flex flex-col justify-between px-8 pt-[60px] pb-12
      [background:radial-gradient(ellipse_at_50%_40%,rgba(139,111,255,0.12)_0%,transparent_55%),#07061a]"
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex items-center gap-2"
      >
        <div className="w-[22px] h-[22px] rounded-md bg-gradient-brand flex items-center justify-center text-white font-bold text-xs">
          R
        </div>
        <div className="text-[10px] tracking-[0.3em] text-ink-dim uppercase font-semibold">
          RiseGuide · Small Talk Simulator
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        <h1 className="font-serif font-light text-[38px] leading-[1.05] tracking-[-0.02em]">
          Let&apos;s see
          <br />
          how you{" "}
          <em className="not-italic italic text-gradient-brand font-normal">
            hold&nbsp;up
          </em>
          .
        </h1>
        <p className="text-sm text-ink-dim leading-relaxed max-w-[260px]">
          Two rooms. Two moments. Honest feedback on how you showed up.
        </p>
        <div className="flex gap-5 mt-2">
          {[
            { num: "2", label: "Scenes" },
            { num: "2", label: "Choices" },
            { num: "1", label: "Debrief" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-0.5">
              <div className="font-serif text-[22px] font-normal text-brand-light">
                {item.num}
              </div>
              <div className="text-[10px] text-ink-dim tracking-[0.1em] uppercase">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
      >
        <Button onClick={onBegin}>Begin</Button>
      </motion.div>
    </motion.div>
  );
}
