"use client";

import { motion } from "motion/react";
import { Nuri } from "@/components/shared/Nuri";
import { useStudentStore } from "@/stores/student-store";
import { t } from "@/lib/i18n";

interface AgeSelectorProps {
  onNext: () => void;
}

const AGES = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

export function AgeSelector({ onNext }: AgeSelectorProps) {
  const { studentName, language, age, setAge } = useStudentStore();

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" }}
      >
        <Nuri expression="neutral" size={100} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-sm p-4 rounded-2xl bg-card border border-border shadow-sm"
      >
        <p className="text-center text-lg font-medium text-foreground">
          How old are you, {studentName}?
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-6 gap-3 max-w-xs"
      >
        {AGES.map((a, i) => (
          <motion.button
            key={a}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 + i * 0.03, type: "spring" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setAge(a)}
            className={`w-14 h-14 rounded-full text-lg font-semibold transition-all ${
              age === a
                ? "bg-primary text-white shadow-md"
                : "bg-card border border-border text-foreground hover:border-primary/50"
            }`}
          >
            {a}
          </motion.button>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="w-full max-w-sm h-14 rounded-full bg-primary text-white font-semibold text-lg hover:bg-primary-dark transition-colors"
      >
        Let&apos;s Go!
      </motion.button>
    </div>
  );
}
