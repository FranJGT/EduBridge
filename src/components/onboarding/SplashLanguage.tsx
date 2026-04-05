"use client";

import { motion } from "motion/react";
import { Milo } from "@/components/shared/Milo";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n";
import { useStudentStore } from "@/stores/student-store";

interface SplashLanguageProps {
  onNext: () => void;
}

export function SplashLanguage({ onNext }: SplashLanguageProps) {
  const language = useStudentStore((s) => s.language);
  const setLanguage = useStudentStore((s) => s.setLanguage);

  const handleSelect = (code: string) => {
    setLanguage(code);
    setTimeout(onNext, 400);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
      {/* Offline badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success/10 text-success text-xs font-semibold"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0119 12.55" />
          <path d="M5 12.55a10.94 10.94 0 015.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0122.56 9" />
          <path d="M1.42 9a15.91 15.91 0 014.7-2.88" />
          <path d="M8.53 16.11a6 6 0 016.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
        Works Offline
      </motion.div>

      {/* Milo mascot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
      >
        <Milo expression="happy" size={140} />
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-bold text-foreground">EduBridge</h1>
        <p className="text-base text-muted leading-relaxed">
          Your personal math tutor.
          <br />
          Any language. Zero internet.
        </p>
      </motion.div>

      {/* Language label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xs font-semibold text-muted tracking-wider uppercase"
      >
        Choose your language
      </motion.p>

      {/* Language grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap justify-center gap-2.5 max-w-xs"
      >
        {SUPPORTED_LANGUAGES.map((lang, i) => (
          <motion.button
            key={lang.code}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(lang.code)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              language === lang.code
                ? "bg-primary text-white shadow-md"
                : "bg-card border border-border text-foreground hover:border-primary/50 shadow-sm"
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
