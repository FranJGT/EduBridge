"use client";

import { motion } from "motion/react";
import { Milo } from "@/components/shared/Milo";
import { useStudentStore } from "@/stores/student-store";
import { t } from "@/lib/i18n";

interface AgeSelectorProps {
  onNext: () => void;
}

const AGE_GROUPS = [
  { label: "5-10", value: 8, desc: "Elementary" },
  { label: "11-14", value: 12, desc: "Middle School" },
  { label: "15-18", value: 16, desc: "High School" },
  { label: "18-25", value: 20, desc: "University" },
  { label: "25+", value: 30, desc: "Lifelong Learner" },
];

export function AgeSelector({ onNext }: AgeSelectorProps) {
  const { studentName, language, age, setAge } = useStudentStore();

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" }}
      >
        <Milo expression="neutral" size={100} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-sm p-4 rounded-xl bg-card border border-border shadow-sm"
      >
        <p className="text-center text-lg font-medium text-foreground">
          How old are you, {studentName}?
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col gap-3 w-full max-w-sm"
      >
        {AGE_GROUPS.map((group, i) => (
          <motion.button
            key={group.value}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.06 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setAge(group.value)}
            className={`flex items-center justify-between px-5 py-4 rounded-xl text-left transition-all ${
              age === group.value
                ? "bg-primary text-white shadow-md"
                : "bg-card border border-border text-foreground hover:border-primary/50"
            }`}
          >
            <div>
              <span className="text-lg font-bold">{group.label}</span>
              <span className={`text-sm ml-2 ${age === group.value ? "text-white/70" : "text-muted"}`}>
                {group.desc}
              </span>
            </div>
            {age === group.value && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            )}
          </motion.button>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="w-full max-w-sm h-14 rounded-xl bg-primary text-white font-semibold text-lg hover:bg-primary-dark transition-colors"
      >
        Let&apos;s Go!
      </motion.button>
    </div>
  );
}
