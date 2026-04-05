"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { useStudentStore } from "@/stores/student-store";
import {
  getStudentSkills,
  TRACKS,
  REGION_NAMES,
  TOPIC_PREREQUISITES,
} from "@/lib/adaptive/engine";
import { Milo } from "@/components/shared/Milo";
import { t } from "@/lib/i18n";
import type { SkillRecord } from "@/lib/db/local";

const TRACK_COLORS: Record<string, { accent: string; bg: string }> = {
  foundations: { accent: "#10B981", bg: "#ECFDF5" },
  middle: { accent: "#3B82F6", bg: "#EFF6FF" },
  "high-school": { accent: "#8B5CF6", bg: "#F5F3FF" },
  university: { accent: "#EC4899", bg: "#FDF2F8" },
};

interface JourneyMapProps {
  onSelectTopic: (topic: string) => void;
}

export function JourneyMap({ onSelectTopic }: JourneyMapProps) {
  const { studentId, worldProgress, language, totalStars } = useStudentStore();
  const [skills, setSkills] = useState<SkillRecord[]>([]);
  const currentRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!studentId) return;
    getStudentSkills(studentId).then(setSkills);
  }, [studentId]);

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
      <div className="flex items-center justify-between px-6 pt-14 pb-4">
        <h2 className="text-xl font-bold text-foreground">
          {t("journey.title", language)}
        </h2>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--secondary)" aria-hidden="true">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
          </svg>
          <span className="text-sm font-bold text-foreground">{totalStars}</span>
        </div>
      </div>

      {TRACKS.map((track, trackIdx) => {
        const colors = TRACK_COLORS[track.id] || TRACK_COLORS.foundations;

        return (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: trackIdx * 0.1 }}
            className="mb-2"
          >
            <div className="flex items-center gap-3 px-6 py-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }} />
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider">
                {track.name} <span className="font-normal">({track.ageRange})</span>
              </h3>
            </div>

            <div className="flex flex-col gap-1.5 px-6">
              {track.topics.map((topic, topicIdx) => {
                const skill = skills.find((s) => s.topic === topic);
                const level = skill?.level ?? 0;
                const accuracy = skill?.accuracy ?? 0;
                const progress = worldProgress[topic] || 0;
                const unlocked = isUnlocked(topic);
                const regionName = REGION_NAMES[topic] || topic;
                const isCurrent = unlocked && progress < 10 && level < 8;

                return (
                  <motion.button
                    key={topic}
                    ref={isCurrent ? currentRef : undefined}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: unlocked ? 1 : 0.4, x: 0 }}
                    transition={{ delay: trackIdx * 0.1 + topicIdx * 0.04 }}
                    whileTap={unlocked ? { scale: 0.98 } : {}}
                    onClick={() => unlocked && onSelectTopic(topic)}
                    disabled={!unlocked}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all ${
                      isCurrent
                        ? "bg-card border-2 shadow-sm"
                        : unlocked
                          ? "bg-card border border-border hover:border-primary/30"
                          : "bg-surface-secondary/50 border border-transparent cursor-not-allowed"
                    }`}
                    style={{ borderColor: isCurrent ? colors.accent : undefined }}
                    aria-label={unlocked ? `${regionName} - ${Math.round(accuracy * 100)}%` : `${regionName} - locked`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: unlocked ? `${colors.accent}15` : "var(--surface-secondary)" }}
                    >
                      {progress >= 10 ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={colors.accent} aria-hidden="true">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      ) : unlocked ? (
                        <span className="text-sm font-bold" style={{ color: colors.accent }}>{topicIdx + 1}</span>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" aria-hidden="true">
                          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${unlocked ? "text-foreground" : "text-muted"}`}>
                        {regionName}
                      </p>
                      {unlocked && skill?.totalAttempts ? (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${(level / 10) * 100}%`, backgroundColor: colors.accent }}
                            />
                          </div>
                          <span className="text-xs text-muted">{Math.round(accuracy * 100)}%</span>
                        </div>
                      ) : unlocked ? (
                        <p className="text-xs text-muted mt-0.5">Start learning</p>
                      ) : null}
                    </div>

                    {isCurrent && (
                      <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        <Milo expression="happy" size={32} />
                      </motion.div>
                    )}

                    {unlocked && !isCurrent && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
