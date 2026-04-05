"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { useStudentStore } from "@/stores/student-store";
import {
  getStudentSkills,
  TOPICS,
  REGION_NAMES,
  TOPIC_PREREQUISITES,
} from "@/lib/adaptive/engine";
import { Milo } from "@/components/shared/Milo";
import { t } from "@/lib/i18n";
import type { SkillRecord } from "@/lib/db/local";

// Heritage Warmth-tinted region colors (warm-shifted, not stock Tailwind)
const REGION_STYLE: Record<
  string,
  { bg: string; color: string; gradFrom: string; gradTo: string; symbol: string }
> = {
  addition: { bg: "#E6EDDB", color: "#6B8C4E", gradFrom: "#8CB86E", gradTo: "#6B8C4E", symbol: "+" },
  subtraction: { bg: "#DDE6EF", color: "#5A7A9B", gradFrom: "#7FA3C2", gradTo: "#5A7A9B", symbol: "\u2212" },
  multiplication: { bg: "#E8E0F0", color: "#7B6B9E", gradFrom: "#9B8BBF", gradTo: "#7B6B9E", symbol: "\u00D7" },
  division: { bg: "#F0E8D8", color: "#B8863A", gradFrom: "#D4A85C", gradTo: "#B8863A", symbol: "\u00F7" },
  fractions: { bg: "#DBE8E2", color: "#5A8C7A", gradFrom: "#7BB8A0", gradTo: "#5A8C7A", symbol: "\u00BD" },
  "word-problems": { bg: "#EDDDDF", color: "#A06B70", gradFrom: "#C49298", gradTo: "#A06B70", symbol: "\u270D" },
  algebra: { bg: "#E2DCED", color: "#6E5A9E", gradFrom: "#9484BF", gradTo: "#6E5A9E", symbol: "x" },
};

// Zigzag positions for nodes (x as %, y offset)
const NODE_POSITIONS = [
  { x: 18, y: 8 }, { x: 32, y: 50 }, { x: 48, y: 12 },
  { x: 62, y: 48 }, { x: 78, y: 10 }, { x: 68, y: 52 },
];

interface JourneyMapProps {
  onSelectTopic: (topic: string) => void;
}

export function JourneyMap({ onSelectTopic }: JourneyMapProps) {
  const { studentId, worldProgress, language, totalStars } = useStudentStore();
  const [skills, setSkills] = useState<SkillRecord[]>([]);
  const currentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!studentId) return;
    getStudentSkills(studentId).then(setSkills);
  }, [studentId]);

  // Auto-scroll to current region
  useEffect(() => {
    if (skills.length > 0 && currentRef.current) {
      currentRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [skills]);

  const isUnlocked = (topic: string) => {
    const prereqs = TOPIC_PREREQUISITES[topic] || [];
    return prereqs.every((p) => {
      const skill = skills.find((s) => s.topic === p);
      return skill && skill.level >= 3;
    });
  };

  return (
    <div className="flex-1 flex flex-col pb-28 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-14 pb-3">
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
          <span className="text-sm font-bold text-foreground">{totalStars}</span>
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
        const isCurrentRegion = unlocked && progress < 10;
        const nodesCount = Math.min(progress + 2, 6);

        return (
          <motion.div
            key={topic}
            ref={isCurrentRegion ? currentRef : undefined}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: unlocked ? 1 : 0.45, y: 0 }}
            transition={{ delay: regionIdx * 0.06 }}
            className="relative"
            style={{
              background: `linear-gradient(180deg, ${style.bg} 0%, ${style.bg}88 100%)`,
              minHeight: unlocked ? 190 : 110,
              filter: unlocked ? "none" : "grayscale(0.6)",
            }}
          >
            {/* Region title + icon */}
            <div className="flex items-start justify-between px-6 pt-3">
              <div>
                <p className="text-xs font-bold tracking-wider uppercase" style={{ color: style.color }}>
                  {regionName}
                </p>
                {!unlocked && (
                  <p className="text-[10px] text-muted mt-0.5">
                    {t("journey.unlockRequires", language).replace(
                      "{region}",
                      (TOPIC_PREREQUISITES[topic] || []).map((p) => REGION_NAMES[p]).join(" & ")
                    )}
                  </p>
                )}
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                style={{
                  background: `linear-gradient(180deg, ${style.gradFrom}, ${style.gradTo})`,
                  opacity: unlocked ? 1 : 0.3,
                }}
              >
                <span className="text-white text-2xl font-bold">{style.symbol}</span>
              </div>
            </div>

            {/* Path with nodes — unlocked regions */}
            {unlocked && (
              <div className="relative mx-6 mt-2" style={{ height: 100 }}>
                {/* Curved SVG path */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 320 100"
                  fill="none"
                  aria-hidden="true"
                  preserveAspectRatio="none"
                >
                  {Array.from({ length: nodesCount - 1 }, (_, i) => {
                    const p1 = NODE_POSITIONS[i];
                    const p2 = NODE_POSITIONS[i + 1];
                    const x1 = (p1.x / 100) * 320;
                    const y1 = p1.y + 20;
                    const x2 = (p2.x / 100) * 320;
                    const y2 = p2.y + 20;
                    const cpx = (x1 + x2) / 2;
                    const cpy = Math.min(y1, y2) - 15;
                    const completed = i < progress;
                    return (
                      <path
                        key={i}
                        d={`M${x1},${y1} Q${cpx},${cpy} ${x2},${y2}`}
                        stroke={completed ? `${style.color}77` : "var(--border)"}
                        strokeWidth="2.5"
                        strokeDasharray="7 5"
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>

                {/* Nodes */}
                {Array.from({ length: nodesCount }, (_, i) => {
                  const isCompleted = i < progress;
                  const isCurrent = i === progress;
                  const pos = NODE_POSITIONS[i];
                  const size = 48;

                  return (
                    <div
                      key={i}
                      className="absolute flex flex-col items-center"
                      style={{
                        left: `${pos.x}%`,
                        top: pos.y,
                        width: size,
                        transform: "translateX(-50%)",
                      }}
                    >
                      {/* Milo bouncing on current node */}
                      {isCurrent && (
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut" }}
                          className="mb-1"
                        >
                          <Milo expression="happy" size={40} />
                        </motion.div>
                      )}

                      {/* Node circle */}
                      <motion.button
                        whileTap={isCurrent ? { scale: 0.9 } : {}}
                        onClick={() => isCurrent && onSelectTopic(topic)}
                        disabled={!isCurrent}
                        animate={
                          isCurrent
                            ? {
                                boxShadow: [
                                  `0 0 12px ${style.color}44`,
                                  `0 0 24px ${style.color}88`,
                                  `0 0 12px ${style.color}44`,
                                ],
                              }
                            : {}
                        }
                        transition={isCurrent ? { repeat: Infinity, duration: 1.5 } : {}}
                        className="flex items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-primary"
                        style={{
                          width: size,
                          height: size,
                          backgroundColor: isCompleted
                            ? style.color
                            : isCurrent
                              ? "var(--card)"
                              : "var(--surface-secondary)",
                          border: isCurrent
                            ? `3px solid ${style.color}`
                            : isCompleted
                              ? "3px solid var(--card)"
                              : "2px solid var(--border)",
                        }}
                        aria-label={
                          isCompleted
                            ? `${t("topics." + topic, language)} ${i + 1} - ${t("student.correct", language)}`
                            : isCurrent
                              ? `${t("topics." + topic, language)} ${i + 1} - ${t("student.submit", language)}`
                              : `${t("topics." + topic, language)} ${i + 1}`
                        }
                      >
                        {isCompleted ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
                          </svg>
                        ) : (
                          <span
                            className="text-sm font-bold"
                            style={{ color: isCurrent ? style.color : "var(--muted)" }}
                          >
                            {i + 1}
                          </span>
                        )}
                      </motion.button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Locked nodes */}
            {!unlocked && (
              <div className="flex gap-4 px-6 mt-3 items-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--surface-secondary)", border: "2px solid var(--border)" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>
                ))}
              </div>
            )}

            {/* Progress bar */}
            {unlocked && (
              <div className="flex items-center gap-2 px-6 pb-3 mt-1">
                <div className="flex gap-1">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div
                      key={i}
                      className="w-4 h-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          i < Math.ceil((progress / 10) * 6) ? style.color : "var(--border)",
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium" style={{ color: style.color }}>
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
