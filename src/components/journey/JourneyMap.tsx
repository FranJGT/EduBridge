"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useStudentStore } from "@/stores/student-store";
import { getStudentSkills, TOPICS, REGION_NAMES, type MathTopic } from "@/lib/adaptive/engine";
import type { SkillRecord } from "@/lib/db/local";

const REGION_THEME: Record<string, { gradient: string; color: string; icon: React.ReactNode }> = {
  addition: {
    gradient: "from-[#7BC97B] to-[#5A8C4E]",
    color: "#5A8C4E",
    icon: <path d="M12 5v14M5 12h14" strokeWidth="2.5" strokeLinecap="round" />,
  },
  subtraction: {
    gradient: "from-[#60A5FA] to-[#3B82F6]",
    color: "#3B82F6",
    icon: <path d="M5 12h14" strokeWidth="2.5" strokeLinecap="round" />,
  },
  multiplication: {
    gradient: "from-[#A78BFA] to-[#8B5CF6]",
    color: "#8B5CF6",
    icon: <><path d="M18 6L6 18M6 6l12 12" strokeWidth="2.5" strokeLinecap="round" /></>,
  },
  division: {
    gradient: "from-[#FCD34D] to-[#F59E0B]",
    color: "#F59E0B",
    icon: <><circle cx="12" cy="6" r="1.5" fill="currentColor" /><path d="M5 12h14" strokeWidth="2.5" strokeLinecap="round" /><circle cx="12" cy="18" r="1.5" fill="currentColor" /></>,
  },
  fractions: {
    gradient: "from-[#34D399] to-[#10B981]",
    color: "#10B981",
    icon: <path d="M5 19L19 5M7 5h4M13 19h4" strokeWidth="2" strokeLinecap="round" />,
  },
  "word-problems": {
    gradient: "from-[#F9A8D4] to-[#EC4899]",
    color: "#EC4899",
    icon: <><path d="M4 7V4h16v3M9 20h6M12 4v16" strokeWidth="2" strokeLinecap="round" /></>,
  },
  algebra: {
    gradient: "from-[#C4B5FD] to-[#7C3AED]",
    color: "#7C3AED",
    icon: <text x="7" y="17" fontSize="14" fontWeight="bold" fill="currentColor" stroke="none">x</text>,
  },
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

interface JourneyMapProps {
  onSelectTopic: (topic: string) => void;
}

export function JourneyMap({ onSelectTopic }: JourneyMapProps) {
  const { studentId, worldProgress } = useStudentStore();
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-0 px-6 pb-28"
    >
      <h2 className="text-lg font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-funnel-sans, var(--font-sans))" }}>
        Your Journey
      </h2>

      {TOPICS.map((topic, i) => {
        const theme = REGION_THEME[topic];
        const skill = skills.find((s) => s.topic === topic);
        const level = skill?.level ?? 1;
        const accuracy = skill?.accuracy ?? 0;
        const progress = worldProgress[topic] || 0;
        const unlocked = isUnlocked(topic);
        const regionName = REGION_NAMES[topic];

        return (
          <div key={topic} className="flex flex-col items-center">
            <motion.button
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: unlocked ? 1 : 0.5, x: 0 }}
              transition={{ delay: i * 0.06 }}
              whileTap={unlocked ? { scale: 0.97 } : {}}
              onClick={() => unlocked && onSelectTopic(topic)}
              disabled={!unlocked}
              className={`flex items-center gap-4 w-full p-4 rounded-2xl border transition-all ${
                unlocked
                  ? "bg-card border-border hover:border-primary/50 shadow-sm"
                  : "bg-card/50 border-border/50 cursor-not-allowed"
              }`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-b ${theme.gradient} flex items-center justify-center text-white shrink-0`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round">
                  {theme.icon}
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {regionName}
                </p>
                {unlocked ? (
                  <>
                    <div className="flex gap-1 mt-1.5">
                      {Array.from({ length: 10 }, (_, j) => (
                        <div
                          key={j}
                          className="h-1.5 flex-1 rounded-full"
                          style={{
                            backgroundColor: j < progress ? theme.color : "var(--border)",
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs mt-1" style={{ color: theme.color }}>
                      {progress}/10 &middot; {Math.round(accuracy * 100)}%
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-muted mt-1">
                    Complete {PREREQS[topic]?.map(p => REGION_NAMES[p]).join(" & ")} to unlock
                  </p>
                )}
              </div>

              {/* Arrow or lock */}
              {unlocked ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              )}
            </motion.button>

            {/* Connector */}
            {i < TOPICS.length - 1 && (
              <div className="w-0.5 h-4 bg-border rounded-full" />
            )}
          </div>
        );
      })}
    </motion.div>
  );
}
