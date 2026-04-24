"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Choice } from "@/data/scenarios";
import { scene1, scene2, scene3 } from "@/data/scenarios";
import type { TranscriptEntry } from "@/lib/geminiLive";
import { PhoneFrame } from "@/components/PhoneFrame";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { SceneScreen } from "@/components/SceneScreen";
import { FeedbackScreen } from "@/components/FeedbackScreen";
import { Round3Setup } from "@/components/Round3Setup";
import { Round3Live } from "@/components/Round3Live";
import { DebriefScreen } from "@/components/DebriefScreen";
import { Button } from "@/components/Button";

type Step =
  | "welcome"
  | "scene1"
  | "feedback1"
  | "scene2"
  | "feedback2"
  | "setup3"
  | "live3"
  | "debrief"
  | "error";

export default function Home() {
  const [step, setStep] = useState<Step>("welcome");
  const [choice1, setChoice1] = useState<Choice | null>(null);
  const [choice2, setChoice2] = useState<Choice | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const reset = () => {
    setChoice1(null);
    setChoice2(null);
    setTranscript([]);
    setErrorMsg("");
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
            continueLabel="Round 3 — live"
            onContinue={() => setStep("setup3")}
          />
        )}

        {step === "setup3" && (
          <Round3Setup
            key="setup3"
            scene={scene3}
            onReady={() => setStep("live3")}
          />
        )}

        {step === "live3" && (
          <Round3Live
            key="live3"
            scene={scene3}
            onFinish={(t) => {
              setTranscript(t);
              setStep("debrief");
            }}
            onError={(msg) => {
              setErrorMsg(msg);
              setStep("error");
            }}
          />
        )}

        {step === "debrief" && (
          <DebriefScreen
            key="debrief"
            transcript={transcript}
            personaName={scene3.personaName}
            onRestart={reset}
          />
        )}

        {step === "error" && (
          <div
            key="error"
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8 text-center"
          >
            <div className="font-serif text-[22px] text-ink">
              Something went wrong.
            </div>
            <div className="text-sm text-ink-dim max-w-[270px] leading-relaxed">
              {errorMsg ||
                "The live conversation couldn't start. Check mic permissions and that GEMINI_API_KEY is valid."}
            </div>
            <div className="w-full max-w-[280px]">
              <Button onClick={reset}>Back to start</Button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </PhoneFrame>
  );
}
