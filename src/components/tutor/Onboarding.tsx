"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SplashLanguage } from "@/components/onboarding/SplashLanguage";
import { MeetMascot } from "@/components/onboarding/MeetMascot";
import { AgeSelector } from "@/components/onboarding/AgeSelector";
import { DiagnosticChallenge } from "@/components/onboarding/DiagnosticChallenge";

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="splash"
            className="flex-1 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <SplashLanguage onNext={() => setStep(1)} />
          </motion.div>
        )}
        {step === 1 && (
          <motion.div
            key="mascot"
            className="flex-1 flex flex-col"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <MeetMascot onNext={() => setStep(2)} />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="age"
            className="flex-1 flex flex-col"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <AgeSelector onNext={() => setStep(3)} />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            key="diagnostic"
            className="flex-1 flex flex-col"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            <DiagnosticChallenge onComplete={onComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step dots */}
      <div className="flex justify-center gap-2 pb-6">
        {[0, 1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full transition-colors ${
              s === step ? "bg-primary" : s < step ? "bg-success" : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
