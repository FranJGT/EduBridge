"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Nuri } from "@/components/shared/Nuri";
import { t } from "@/lib/i18n";
import { useStudentStore } from "@/stores/student-store";

interface MeetMascotProps {
  onNext: () => void;
}

export function MeetMascot({ onNext }: MeetMascotProps) {
  const language = useStudentStore((s) => s.language);
  const setStudent = useStudentStore((s) => s.setStudent);
  const [name, setName] = useState("");

  const handleContinue = () => {
    if (!name.trim()) return;
    // Set temporary student name (full save happens after diagnostic)
    useStudentStore.getState().setStudent("pending", name.trim());
    onNext();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <Nuri expression="neutral" size={140} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-bold text-primary"
      >
        Nuri
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-sm p-5 rounded-2xl bg-card border border-border shadow-sm"
      >
        <p className="text-center text-base text-foreground leading-relaxed">
          {t("onboarding.nameLabel", language) === "onboarding.nameLabel"
            ? "Hi! I'm Nuri, your math guide. What should I call you?"
            : t("onboarding.nameLabel", language)}
        </p>
      </motion.div>

      <motion.input
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleContinue()}
        placeholder="..."
        className="w-full max-w-sm h-14 px-5 rounded-xl border border-border bg-card text-foreground text-lg text-center focus:outline-none focus:ring-2 focus:ring-primary"
        autoFocus
      />

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleContinue}
        disabled={!name.trim()}
        className="w-full max-w-sm h-14 rounded-full bg-primary text-white font-semibold text-lg hover:bg-primary-dark transition-colors disabled:opacity-40"
      >
        {t("onboarding.start", language) === "onboarding.start"
          ? "Continue"
          : t("onboarding.start", language)}
      </motion.button>
    </div>
  );
}
