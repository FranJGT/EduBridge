"use client";

import { motion } from "motion/react";
import { t } from "@/lib/i18n";
import { REGION_NAMES } from "@/lib/adaptive/engine";

interface Problem {
  statement: string;
  answer: number;
  difficulty: number;
  topic: string;
  hints: string[];
  solutionSteps: string[];
}

interface ProblemCardProps {
  problem: Problem;
  answer: string;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  language: string;
}

export function ProblemCard({
  problem,
  answer,
  onAnswerChange,
  onSubmit,
  loading,
  language,
}: ProblemCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && answer.trim()) {
      onSubmit();
    }
  };

  const regionName = REGION_NAMES[problem.topic] || t(`topics.${problem.topic}`, language);

  return (
    <div className="space-y-6">
      {/* Topic & Difficulty */}
      <div className="flex items-center justify-between">
        <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          {regionName}
        </span>
        <div className="flex gap-1" aria-label={`Difficulty ${problem.difficulty} of 10`}>
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < problem.difficulty ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Problem Statement */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-card border border-border shadow-sm"
      >
        <p className="text-lg leading-relaxed text-foreground text-center">
          {problem.statement}
        </p>
      </motion.div>

      {/* Answer Input */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <input
          type="text"
          inputMode="decimal"
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("student.typeAnswer", language)}
          className="w-full h-14 px-5 rounded-2xl border border-border bg-card text-xl text-center font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary"
          autoFocus
          aria-label="Your answer"
        />
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onSubmit}
          disabled={!answer.trim() || loading}
          className="w-full h-14 rounded-full bg-primary text-white text-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Submit answer"
        >
          {t("student.submit", language)}
        </motion.button>
      </motion.div>
    </div>
  );
}
