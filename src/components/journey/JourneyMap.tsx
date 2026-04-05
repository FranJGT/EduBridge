"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useStudentStore } from "@/stores/student-store";
import { getStudentSkills, TOPICS, REGION_NAMES } from "@/lib/adaptive/engine";
import { Nuri } from "@/components/shared/Nuri";
import { t } from "@/lib/i18n";
import type { SkillRecord } from "@/lib/db/local";

const REGION_STYLE: Record<
  string,
  { bg: string; color: string; gradFrom: string; gradTo: string; symbol: string }
> = {
  addition: { bg: "#E2F0D9", color: "#5A8C4E", gradFrom: "#7BC97B", gradTo: "#5A8C4E", symbol: "+" },
  subtraction: { bg: "#E0EFFF", color: "#3B82F6", gradFrom: "#60A5FA", gradTo: "#3B82F6", symbol: "\u2212" },
  multiplication: { bg: "#F0ECFF", color: "#8B5CF6", gradFrom: "#A78BFA", gradTo: "#8B5CF6", symbol: "\u00D7" },
  division: { bg: "#FEF3C7", color: "#F59E0B", gradFrom: "#FCD34D", gradTo: "#F59E0B", symbol: "\u00F7" },
  fractions: { bg: "#D1FAE5", color: "#10B981", gradFrom: "#34D399", gradTo: "#10B981", symbol: "\u00BD" },
  "word-problems": { bg: "#FCE7F3", color: "#EC4899", gradFrom: "#F9A8D4", gradTo: "#EC4899", symbol: "\u270D" },
  algebra: { bg: "#EDE9FE", color: "#7C3AED", gradFrom: "#C4B5FD", gradTo: "#7C3AED", symbol: "x" },
};

const PREREQS: Record<string, string[]> = {
  addition: [],
  subtraction: ["addition"],
  multiplication: ["addition"],
  division: ["multiplication"],
  fractions: ["division"],
  "word-problems": ["addition", "subtraction"],
  algebra: ["fractions", "multiplication"],
};

// Zigzag x positions for nodes on the path
const NODE_X = [0.2, 0.35, 0.5, 0.65, 0.8, 0.65, 0.5, 0.35, 0.2, 0.35];

interface JourneyMapProps {
  onSelectTopic: (topic: string) => void;
}

export function JourneyMap({ onSelectTopic }: JourneyMapProps) {
  const { studentId, worldProgress, language } = useStudentStore();
  const [skills, setSkills] = useState<SkillRecord[]>([]);

  useEffect(() => {
    if (!studentId) return;
    getStudentSkills(studentId).then(setSkills);
  }, [studentId]);

  const isUnlocked = (topic: string) => {
    const prereqs = PREREQS[topic] || [];
    return prereqs.every((p) => {
      const skill = skills.find((s) => s.topic === p);
      return skill && skill.level >= 3;
    });
  };

  return (
    <div className="flex-1 flex flex-col pb-28 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-3">
        <h2
          className="text-lg font-bold text-foreground"
          style={{ fontFamily: "var(--font-funnel-sans, var(--font-sans))" }}
        >
          {t("journey.title", language)}
        </h2>
        <div className="flex items-center gap-1.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--secondary)" aria-hidden="true">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
          </svg>
          <span className="text-sm font-bold text-foreground">
            {useStudentStore.getState().totalStars}
          </span>
        </div>
      </div>

      {/* Regions */}
      {TOPICS.map((topic, regionIdx) => {
        const style = REGION_STYLE[topic];
        const skill = skills.find((s) => s.topic === topic);
        const accuracy = skill?.accuracy ?? 0;
        const progress = worldProgress[topic] || 0;
        const unlocked = isUnlocked(topic);
        const regionName = REGION_NAMES[topic];
        const nodesCount = Math.min(progress + 2, 6); // Show up to 6 visible nodes

        return (
          <motion.div
            key={topic}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: unlocked ? 1 : 0.5, y: 0 }}
            transition={{ delay: regionIdx * 0.08 }}
            className="relative"
            style={{
              background: `linear-gradient(180deg, ${style.bg}FF 0%, ${style.bg}88 100%)`,
              minHeight: unlocked ? 160 : 120,
              cursor: unlocked ? "pointer" : "default",
            }}
            onClick={() => unlocked && onSelectTopic(topic)}
          >
            {/* Region title + icon */}
            <div className="flex items-start justify-between px-5 pt-3">
              <div>
                <p
                  className="text-xs font-bold tracking-wider"
                  style={{ color: style.color }}
                >
                  {regionName}
                </p>
                {!unlocked && (
                  <p className="text-[10px] text-muted mt-0.5">
                    {t("journey.unlockRequires", language).replace(
                      "{region}",
                      PREREQS[topic]?.map((p) => REGION_NAMES[p]).join(" & ") || ""
                    )}
                  </p>
                )}
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                style={{
                  background: `linear-gradient(180deg, ${style.gradFrom}, ${style.gradTo})`,
                  opacity: unlocked ? 1 : 0.4,
                }}
              >
                <span className="text-white text-2xl font-bold">{style.symbol}</span>
              </div>
            </div>

            {/* Path with nodes */}
            {unlocked && (
              <div className="relative h-20 mx-4 mt-1">
                {/* Dashed connections */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 350 80"
                  fill="none"
                  aria-hidden="true"
                >
                  {Array.from({ length: nodesCount - 1 }, (_, i) => {
                    const x1 = NODE_X[i] * 350;
                    const y1 = 20 + (i % 2 === 0 ? 0 : 20);
                    const x2 = NODE_X[i + 1] * 350;
                    const y2 = 20 + ((i + 1) % 2 === 0 ? 0 : 20);
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={i < progress ? `${style.color}88` : "#DCD8CB88"}
                        strokeWidth="2"
                        strokeDasharray="6 4"
                      />
                    );
                  })}
                </svg>

                {/* Nodes */}
                {Array.from({ length: nodesCount }, (_, i) => {
                  const isCompleted = i < progress;
                  const isCurrent = i === progress;
                  const x = NODE_X[i] * 100;
                  const y = i % 2 === 0 ? 10 : 30;
                  const size = isCurrent ? 42 : isCompleted ? 36 : 30;

                  return (
                    <div
                      key={i}
                      className="absolute flex items-center justify-center"
                      style={{
                        left: `${x}%`,
                        top: y,
                        width: size,
                        height: size,
                        transform: "translateX(-50%)",
                      }}
                    >
                      {/* Current node — Nuri sits above */}
                      {isCurrent && (
                        <div className="absolute -top-9">
                          <Nuri expression="happy" size={32} />
                        </div>
                      )}
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: isCompleted
                            ? style.color
                            : isCurrent
                              ? "#FFFFFF"
                              : "#E8E4D8",
                          border: isCurrent
                            ? `3px solid ${style.color}`
                            : isCompleted
                              ? "3px solid #FFFFFF"
                              : "2px solid #DCD8CB",
                          boxShadow: isCurrent
                            ? `0 0 16px ${style.color}55`
                            : "none",
                        }}
                      >
                        {isCompleted ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
                          </svg>
                        ) : isCurrent ? (
                          <span
                            className="text-xs font-bold"
                            style={{ color: style.color }}
                          >
                            {i + 1}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-muted">
                            {i + 1}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Locked nodes */}
            {!unlocked && (
              <div className="flex gap-3 px-5 mt-4 items-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-surface-secondary border-2 border-border flex items-center justify-center"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>
                ))}
                <div className="w-6 h-0.5 bg-border rounded-full" />
                <div className="w-6 h-0.5 bg-border rounded-full" />
              </div>
            )}

            {/* Progress bar */}
            {unlocked && (
              <div className="flex items-center gap-2 px-5 pb-3 mt-1">
                <div className="flex gap-1">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div
                      key={i}
                      className="w-4 h-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          i < Math.ceil((progress / 10) * 6)
                            ? style.color
                            : "#DCD8CB",
                      }}
                    />
                  ))}
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: style.color }}
                >
                  {progress}/10 &middot; {Math.round(accuracy * 100)}%
                </span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
