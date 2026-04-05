"use client";

import { motion } from "motion/react";
import { useStudentStore } from "@/stores/student-store";
import { t } from "@/lib/i18n";

export type TabId = "home" | "journey" | "scan" | "progress";

interface BottomTabBarProps {
  active: TabId;
  onTabChange: (tab: TabId) => void;
}

const TAB_ICONS: Record<TabId, (active: boolean) => React.ReactNode> = {
  home: (a) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  journey: (a) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  scan: (a) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
    </svg>
  ),
  progress: (a) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
};

const TAB_KEYS: Record<TabId, string> = {
  home: "nav.home",
  journey: "nav.journey",
  scan: "nav.scan",
  progress: "nav.progress",
};

export function BottomTabBar({ active, onTabChange }: BottomTabBarProps) {
  const language = useStudentStore((s) => s.language);

  return (
    <nav aria-label="Main navigation" className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-5 pb-5 pt-3 bg-gradient-to-t from-background via-background to-transparent">
      <div role="tablist" className="flex w-full max-w-md h-16 rounded-[32px] bg-card border border-border shadow-lg overflow-hidden">
        {(["home", "journey", "scan", "progress"] as TabId[]).map((tab) => {
          const isActive = active === tab;
          return (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.93 }}
              onClick={() => onTabChange(tab)}
              role="tab"
              className={`flex-1 flex flex-col items-center justify-center gap-1 rounded-[28px] mx-1 my-1 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                isActive ? "bg-primary text-white" : "text-muted hover:text-foreground"
              }`}
              aria-label={t(TAB_KEYS[tab], language)}
              aria-selected={isActive}
            >
              {TAB_ICONS[tab](isActive)}
              <span className="text-[10px] font-semibold tracking-wider">
                {t(TAB_KEYS[tab], language)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
