"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useStudentStore } from "@/stores/student-store";
import { getStudentSkills, REGION_NAMES, TOPICS } from "@/lib/adaptive/engine";
import { Nuri } from "@/components/shared/Nuri";
import { t } from "@/lib/i18n";
import type { SkillRecord } from "@/lib/db/local";
import { db } from "@/lib/db/local";

// Warm-tinted region colors matching JourneyMap
const REGION_COLORS: Record<string, string> = {
  addition: "#6B8C4E",
  subtraction: "#5A7A9B",
  multiplication: "#7B6B9E",
  division: "#B8863A",
  fractions: "#5A8C7A",
  "word-problems": "#A06B70",
  algebra: "#6E5A9E",
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export function ProgressView() {
  const { studentId, studentName, totalStars, streak, worldProgress, language } =
    useStudentStore();
  const [skills, setSkills] = useState<SkillRecord[]>([]);
  const [totalProblems, setTotalProblems] = useState(0);

  useEffect(() => {
    if (!studentId) return;
    getStudentSkills(studentId).then(setSkills);
    db.answers
      .where("studentId")
      .equals(studentId)
      .count()
      .then(setTotalProblems);
  }, [studentId]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex-1 flex flex-col px-6 pt-4 pb-28 gap-5"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center gap-4">
        <Nuri expression="happy" size={56} />
        <div>
          <h1
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-funnel-sans, var(--font-sans))" }}
          >
            {t("progress.title", language).replace("{name}", studentName)}
          </h1>
          <p className="text-sm text-muted">{t("student.keepGoing", language)}</p>
        </div>
      </motion.div>

      {/* Stats cards */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <div className="text-2xl font-bold text-secondary">{totalStars}</div>
          <div className="text-xs text-muted mt-1">{t("student.stars", language)}</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <div className="text-2xl font-bold text-success">{totalProblems}</div>
          <div className="text-xs text-muted mt-1">{t("student.problems", language)}</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border text-center">
          <div className="text-2xl font-bold text-primary">{streak}</div>
          <div className="text-xs text-muted mt-1">
            {t("student.streak", language)} {streak >= 3 ? "\uD83D\uDD25" : ""}
          </div>
        </div>
      </motion.div>

      {/* Topic mastery */}
      <motion.div variants={item} className="p-5 rounded-xl bg-card border border-border">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">
          {t("progress.topicMastery", language)}
        </h2>
        <div className="space-y-4">
          {TOPICS.map((topic) => {
            const skill = skills.find((s) => s.topic === topic);
            const level = skill?.level ?? 0;
            const accuracy = skill?.accuracy ?? 0;
            const progress = worldProgress[topic] || 0;
            const color = REGION_COLORS[topic] || "var(--primary)";

            return (
              <div key={topic} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {REGION_NAMES[topic]}
                  </span>
                  <span className="text-muted text-xs">
                    {skill?.totalAttempts
                      ? `${Math.round(accuracy * 100)}% \u00B7 ${progress}/10`
                      : t("progress.notStarted", language)}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-surface-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(level / 10) * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div variants={item} className="p-5 rounded-xl bg-card border border-border">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
          {t("progress.achievements", language)}
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: "\u2B50", key: "progress.firstStep", earned: totalProblems >= 1 },
            { icon: "\uD83D\uDD25", key: "progress.onFire", earned: streak >= 5 },
            { icon: "\uD83C\uDF3F", key: "progress.meadowPro", earned: (worldProgress["addition"] || 0) >= 10 },
            { icon: "\uD83D\uDCF8", key: "progress.scanner", earned: false },
          ].map((badge) => (
            <div
              key={badge.key}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center ${
                badge.earned
                  ? "bg-secondary/10 border-secondary/30"
                  : "bg-surface-secondary/50 border-border opacity-40"
              }`}
            >
              <span className="text-2xl">{badge.icon}</span>
              <span className="text-[10px] font-medium text-foreground">
                {t(badge.key, language)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
