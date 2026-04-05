"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Milo } from "@/components/shared/Milo";
import {
  DIAGNOSTIC_PROBLEMS,
  runDiagnostic,
  seedSkillsFromDiagnostic,
} from "@/lib/adaptive/diagnostic";
import { answersMatch } from "@/lib/adaptive/parse-answer";
import { useStudentStore } from "@/stores/student-store";
import { db } from "@/lib/db/local";
import { v4 as uuid } from "uuid";

interface DiagnosticChallengeProps {
  onComplete: () => void;
}

export function DiagnosticChallenge({ onComplete }: DiagnosticChallengeProps) {
  const { studentName, language, age, setStudent, setDiagnosticLevel } =
    useStudentStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState<
    Array<{ level: number; correct: boolean; topic: string }>
  >([]);

  const total = DIAGNOSTIC_PROBLEMS.length;
  const current = DIAGNOSTIC_PROBLEMS[currentIdx];

  const finish = useCallback(
    async (finalResults: Array<{ level: number; correct: boolean; topic: string }>) => {
      const level = runDiagnostic(finalResults);
      const id = uuid();

      // Save to store
      setStudent(id, studentName);
      setDiagnosticLevel(level);

      // Save to DB
      await db.students.add({
        id,
        name: studentName,
        language,
        age,
        diagnosticLevel: level,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      });

      // Seed skills with diagnostic results
      await seedSkillsFromDiagnostic(id, level, finalResults);

      onComplete();
    },
    [studentName, language, age, setStudent, setDiagnosticLevel, onComplete]
  );

  const handleCheck = () => {
    const correct = answersMatch(answer, current.answer);
    const newResults = [...results, { level: current.level, correct, topic: current.topic }];
    setResults(newResults);
    advance(newResults);
  };

  const handleSkip = () => {
    const newResults = [...results, { level: current.level, correct: false, topic: current.topic }];
    setResults(newResults);
    advance(newResults);
  };

  const advance = (newResults: Array<{ level: number; correct: boolean; topic: string }>) => {
    setAnswer("");
    // If skipped/wrong 2 in a row, or finished all, end diagnostic
    const lastTwo = newResults.slice(-2);
    if (
      currentIdx >= total - 1 ||
      (lastTwo.length === 2 && !lastTwo[0].correct && !lastTwo[1].correct)
    ) {
      finish(newResults);
    } else {
      setCurrentIdx((i) => i + 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
      {/* Progress bar */}
      <div className="flex gap-1.5 w-full max-w-sm">
        {DIAGNOSTIC_PROBLEMS.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-xl transition-colors ${
              i < results.length
                ? results[i]?.correct
                  ? "bg-success"
                  : "bg-secondary"
                : i === currentIdx
                  ? "bg-primary"
                  : "bg-border"
            }`}
          />
        ))}
      </div>

      <p className="text-sm text-muted">
        Challenge {currentIdx + 1} of {total}
      </p>

      <Milo expression="neutral" size={80} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="w-full max-w-sm p-6 rounded-xl bg-card border border-border shadow-md text-center"
        >
          <p className="text-xs font-semibold text-primary tracking-wider uppercase mb-2">
            {current.topic}
          </p>
          <p className="text-3xl font-bold text-foreground">{current.question}</p>
        </motion.div>
      </AnimatePresence>

      <input
        type="text"
        inputMode="decimal"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && answer.trim() && handleCheck()}
        placeholder=""
        className="w-40 h-16 rounded-xl border-2 border-primary bg-card text-2xl font-bold text-center text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        autoFocus
      />

      <div className="flex gap-3 w-full max-w-sm">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleCheck}
          disabled={!answer.trim()}
          className="flex-1 h-14 rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Check!
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSkip}
          className="flex-1 h-14 rounded-xl border border-border text-muted font-medium hover:bg-card transition-colors"
        >
          Not sure? Skip
        </motion.button>
      </div>

      <p className="text-xs text-muted text-center max-w-xs leading-relaxed">
        It&apos;s okay to skip &mdash; this helps Milo find the right level for
        you!
      </p>
    </div>
  );
}
