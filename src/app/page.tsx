"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Choice } from "@/data/scenarios";
import { scene1, scene2 } from "@/data/scenarios";
import { PhoneFrame } from "@/components/PhoneFrame";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { SceneScreen } from "@/components/SceneScreen";
import { FeedbackScreen } from "@/components/FeedbackScreen";
import { Button } from "@/components/Button";

type Step =
  | "welcome"
  | "scene1"
  | "feedback1"
  | "scene2"
  | "feedback2"
  | "complete";

export default function Home() {
  const [step, setStep] = useState<Step>("welcome");
  const [choice1, setChoice1] = useState<Choice | null>(null);
  const [choice2, setChoice2] = useState<Choice | null>(null);

  const reset = () => {
    setChoice1(null);
    setChoice2(null);
    setStep("welcome");
  };

  return (
    <PhoneFrame>
      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <WelcomeScreen key="welcome" onBegin={() => setStep("scene1")} />
        )}

        {step === "scene1" && (
          <SceneScreen
            key="scene1"
            scene={scene1}
            onChoose={(c) => {
              setChoice1(c);
              setStep("feedback1");
            }}
          />
        )}

        {step === "feedback1" && choice1 && (
          <FeedbackScreen
            key="feedback1"
            choice={choice1}
            continueLabel="Next round"
            onContinue={() => setStep("scene2")}
          />
        )}

        {step === "scene2" && (
          <SceneScreen
            key="scene2"
            scene={scene2}
            onChoose={(c) => {
              setChoice2(c);
              setStep("feedback2");
            }}
          />
        )}

        {step === "feedback2" && choice2 && (
          <FeedbackScreen
            key="feedback2"
            choice={choice2}
            continueLabel="See how you did"
            onContinue={() => setStep("complete")}
          />
        )}

        {step === "complete" && choice1 && choice2 && (
          <CompleteScreen
            key="complete"
            choice1={choice1}
            choice2={choice2}
            onRestart={reset}
          />
        )}
      </AnimatePresence>
    </PhoneFrame>
  );
}

function CompleteScreen({
  choice1,
  choice2,
  onRestart,
}: {
  choice1: Choice;
  choice2: Choice;
  onRestart: () => void;
}) {
  const landed = [choice1, choice2].filter((c) => c.verdict === "lands").length;

  const headline =
    landed === 2
      ? "You read the room — both times."
      : landed === 1
      ? "One landed, one slipped."
      : "Two chances, two closed doors.";

  const body =
    landed === 2
      ? "You matched energy, added something of yourself, and handed the conversation back. That's the whole move — and you did it in both rooms, at both stakes."
      : landed === 1
      ? "Small talk isn't about being clever — it's about leaving the door open. You caught it once. The other time you answered the question and forgot the person."
      : "You answered what was asked. That's not the same as having a conversation. Small talk earns you a second moment only when you put something of yourself on the table — a joke, a hook, a question back.";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 flex flex-col px-6 pt-[50px] pb-8 overflow-y-auto no-scrollbar"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-7"
      >
        <div className="text-[10px] tracking-[0.25em] uppercase text-brand-light font-semibold mb-2.5">
          Session complete
        </div>
        <h2 className="font-serif font-light text-[30px] leading-[1.1] tracking-[-0.02em]">
          {headline
            .split(" — ")
            .map((part, i, arr) =>
              i === arr.length - 1 && arr.length > 1 ? (
                <span key={i}>
                  {" — "}
                  <em className="not-italic italic text-gradient-brand font-normal">
                    {part}
                  </em>
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mb-7"
      >
        <p className="text-[14px] leading-relaxed text-ink-dim">{body}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="flex flex-col gap-4 mb-6"
      >
        <SummaryRow
          label="Elevator · Monday morning"
          verdict={choice1.verdict}
          tag={choice1.tag}
        />
        <SummaryRow
          label="Party · snack table"
          verdict={choice2.verdict}
          tag={choice2.tag}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-auto"
      >
        <Button onClick={onRestart}>Try again</Button>
      </motion.div>
    </motion.div>
  );
}

function SummaryRow({
  label,
  verdict,
  tag,
}: {
  label: string;
  verdict: "lands" | "closed" | "mixed";
  tag: string;
}) {
  const positive = verdict === "lands";
  return (
    <div className="flex items-center gap-3 border-t border-line pt-4">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] flex-shrink-0 ${
          positive
            ? "bg-positive-soft text-positive"
            : "bg-warning-soft text-warning"
        }`}
      >
        {positive ? "✓" : "!"}
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="text-[10px] tracking-[0.22em] uppercase text-ink-dim font-semibold">
          {label}
        </div>
        <div
          className={`text-[13px] font-medium ${
            positive ? "text-positive" : "text-warning"
          }`}
        >
          {tag}
        </div>
      </div>
    </div>
  );
}
