"use client";

import { motion } from "motion/react";
import { REGION_NAMES, getNextRegion } from "@/lib/adaptive/engine";
import { SpeechBubble } from "@/components/shared/SpeechBubble";
import { useStudentStore } from "@/stores/student-store";
import { t } from "@/lib/i18n";

interface MasteryCelebrationProps {
  topic: string;
  accuracy: number;
  totalProblems: number;
  bestStreak: number;
  studentName: string;
  onContinue: (nextTopic: string) => void;
}

export function MasteryCelebration({
  topic,
  accuracy,
  totalProblems,
  bestStreak,
  studentName,
  onContinue,
}: MasteryCelebrationProps) {
  const language = useStudentStore((s) => s.language);
  const regionName = REGION_NAMES[topic] || topic;
  const nextTopic = getNextRegion(topic);
  const nextRegionName = nextTopic ? REGION_NAMES[nextTopic] : null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 relative overflow-hidden">
      {/* Sparkles */}
      {[
        { x: 50, y: 80, size: 22, delay: 0 },
        { x: 310, y: 120, size: 16, delay: 0.3 },
        { x: 330, y: 250, size: 18, delay: 0.6 },
        { x: 40, y: 300, size: 20, delay: 0.9 },
      ].map((sp, i) => (
        <motion.div
          key={i}
          className="absolute text-secondary"
          style={{ left: sp.x, top: sp.y }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ delay: sp.delay, duration: 0.6, type: "spring" }}
        >
          <svg width={sp.size} height={sp.size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
          </svg>
        </motion.div>
      ))}

      {/* Trophy */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-32 h-32 rounded-full bg-card flex items-center justify-center shadow-lg"
        style={{ boxShadow: "0 0 40px rgba(212,145,58,0.3)" }}
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-b from-[#F5D76E] to-[#D4913A] flex flex-col items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
            <path d="M12 2l3 6h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z" />
          </svg>
          <span className="text-[10px] font-bold text-white tracking-widest">
            {t("mastery.master", language)}
          </span>
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-foreground">
          {regionName}
        </h2>
        <p className="text-2xl font-bold text-foreground">{t("mastery.complete", language)}</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3 w-full max-w-sm"
      >
        <StatCard value={`${Math.round(accuracy * 100)}%`} label={t("student.accuracy", language)} color="text-success" />
        <StatCard value={`${totalProblems}`} label={t("student.problems", language)} color="text-secondary" />
        <StatCard value={`${bestStreak}`} label={t("student.bestStreak", language)} color="text-secondary" />
      </motion.div>

      {/* Milo message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-sm"
      >
        <SpeechBubble
          text={`You're a natural at ${topic.replace("-", " ")}, ${studentName}! Ready for a new adventure?`}
        />
      </motion.div>

      {/* Unlock */}
      {nextRegionName && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-success/10 text-success"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span className="text-sm font-semibold">
            {t("mastery.unlocked", language).replace("{region}", nextRegionName || "")}
          </span>
        </motion.div>
      )}

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        onClick={() => onContinue(nextTopic || topic)}
        className="w-full max-w-sm h-14 rounded-full bg-primary text-white font-semibold text-lg shadow-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
      >
        {nextRegionName
          ? t("mastery.explore", language).replace("{region}", nextRegionName)
          : t("mastery.continuePractice", language)}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </motion.button>
    </div>
  );
}

function StatCard({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="flex-1 p-4 rounded-xl bg-card border border-border text-center">
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-muted mt-1">{label}</div>
    </div>
  );
}
