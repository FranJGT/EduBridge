"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Milo } from "@/components/shared/Milo";
import { useStudentStore } from "@/stores/student-store";
import { t } from "@/lib/i18n";

export function MiloThinking() {
  const language = useStudentStore((s) => s.language);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    t("thinking.step1", language),
    t("thinking.step2", language),
    t("thinking.step3", language),
  ];

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setActiveStep(i + 1), (i + 1) * 800)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Milo expression="thinking" size={100} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-sm p-6 rounded-2xl bg-card border border-border shadow-sm"
      >
        <h3 className="text-lg font-bold text-primary text-center mb-5">
          {t("thinking.title", language)}
        </h3>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.5 }}
              className="flex items-center gap-3"
            >
              {i < activeStep ? (
                <svg className="w-5 h-5 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : i === activeStep ? (
                <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-border shrink-0" />
              )}
              <span className={`text-sm ${i < activeStep ? "text-foreground" : i === activeStep ? "text-primary font-medium" : "text-muted"}`}>
                {step}
              </span>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-muted text-center mt-5">
          {t("thinking.powered", language)}
        </p>
      </motion.div>
    </div>
  );
}
