"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useStudentStore } from "@/stores/student-store";
import { Milo } from "@/components/shared/Milo";
import { SpeechBubble } from "@/components/shared/SpeechBubble";
import { t } from "@/lib/i18n";
import { db } from "@/lib/db/local";

const MATH_TIPS = [
  "Multiplying by 9 is easy — the digits always add up to 9!",
  "To check subtraction, add the answer to the smaller number.",
  "Fractions are just division! 3/4 means 3 divided by 4.",
  "Even numbers always end in 0, 2, 4, 6, or 8.",
  "To multiply by 5, multiply by 10 and divide by 2!",
  "A square number times itself: 4x4=16, 5x5=25, 6x6=36.",
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

interface DailyHubProps {
  onNavigate: (view: "journey" | "scan" | "quickPractice") => void;
}

export function DailyHub({ onNavigate }: DailyHubProps) {
  const { studentName, totalStars, streak, language } = useStudentStore();
  const [todayCount, setTodayCount] = useState(0);
  const dailyGoal = 5;

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    db.answers
      .filter((a) => a.answeredAt.startsWith(today))
      .count()
      .then(setTodayCount);
  }, []);

  const tip = MATH_TIPS[0];
  const goalProgress = Math.min(todayCount / dailyGoal, 1);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex-1 flex flex-col px-6 pt-4 pb-28 gap-5"
    >
      {/* Header stats */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-lg font-bold">
            {studentName?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{studentName}</p>
            <p className="text-xs text-muted">
              {streak > 0 ? `${streak} ${t("student.streak", language)} 🔥` : t("hub.startStreak", language)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--secondary)" aria-hidden="true">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
            </svg>
            <span className="text-sm font-bold text-foreground">{totalStars}</span>
          </div>
          {/* Daily goal ring */}
          <div className="relative w-9 h-9" aria-label={`Daily goal: ${todayCount} of ${dailyGoal} complete`} role="progressbar" aria-valuenow={todayCount} aria-valuemax={dailyGoal}>
            <svg width="36" height="36" viewBox="0 0 36 36" className="rotate-[-90deg]">
              <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke="var(--primary)" strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${goalProgress * 94.2} 94.2`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-foreground">
              {todayCount}/{dailyGoal}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Welcome */}
      <motion.div variants={item} className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-funnel-sans, var(--font-sans))" }}>
          {t("student.welcome", language)}, {studentName}!
        </h1>
        <p className="text-sm text-muted">{t("student.keepUp", language)}</p>
      </motion.div>

      {/* Primary CTA */}
      <motion.button
        variants={item}
        whileTap={{ scale: 0.97 }}
        onClick={() => onNavigate("journey")}
        className="flex items-center justify-center gap-3 h-16 rounded-xl bg-primary text-white font-semibold text-lg shadow-lg hover:bg-primary-dark transition-colors"
        style={{ boxShadow: "0 6px 20px rgba(125,107,61,0.3)" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
        {t("hub.continueJourney", language)}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </motion.button>

      {/* Secondary CTAs */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate("scan")}
          className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span className="text-sm font-semibold text-foreground">{t("hub.scanWork", language)}</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate("quickPractice")}
          className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span className="text-sm font-semibold text-foreground">{t("hub.quickPractice", language)}</span>
        </motion.button>
      </motion.div>

      {/* Milo's Tip */}
      <motion.div variants={item}>
        <SpeechBubble
          text={tip}
          label={t("hub.miloTip", language)}
          className="bg-card"
        />
      </motion.div>
    </motion.div>
  );
}
