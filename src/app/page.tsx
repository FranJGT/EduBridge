"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useStudentStore } from "@/stores/student-store";
import { Milo } from "@/components/shared/Milo";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function Home() {
  const studentId = useStudentStore((s) => s.studentId);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex flex-col items-center px-6 pt-14 pb-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-md mx-auto w-full flex flex-col items-center gap-5"
        >
          {/* Offline badge */}
          <motion.div
            variants={item}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-secondary border border-border text-xs font-semibold text-success"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="1" y1="1" x2="23" y2="23" /><path d="M16.72 11.06A10.94 10.94 0 0119 12.55" /><path d="M5 12.55a10.94 10.94 0 015.17-2.39" /><path d="M8.53 16.11a6 6 0 016.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
            Works Offline
          </motion.div>

          {/* Milo */}
          <motion.div variants={item}>
            <Milo expression="happy" size={140} />
          </motion.div>

          {/* Title */}
          <motion.div variants={item} className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
              EduBridge
            </h1>
            <p className="text-base text-muted leading-relaxed">
              Math mastery from counting
              <br />
              to calculus. Powered by AI.
            </p>
          </motion.div>

          {/* Impact stats */}
          <motion.div variants={item} className="flex gap-3 w-full">
            <StatCard value="2.2B" label="Without internet" />
            <StatCard value="250M" label="Out of school" />
            <StatCard value="19" label="Math courses" />
          </motion.div>

          {/* Feature cards */}
          <motion.div variants={item} className="flex gap-3 w-full">
            <FeatureCard icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
            } title="Scan Work" />
            <FeatureCard icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
            } title="6 Languages" />
            <FeatureCard icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 2a8 8 0 018 8c0 6-8 12-8 12S4 16 4 10a8 8 0 018-8z"/><circle cx="12" cy="10" r="3"/></svg>
            } title="AI Adaptive" />
          </motion.div>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-col gap-3 w-full pt-2">
            <Link href={studentId ? "/student" : "/student?onboarding=true"}>
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center h-[52px] rounded-xl bg-primary text-white font-semibold text-base shadow-md hover:bg-primary-dark transition-colors gap-2"
              >
                {studentId ? "Continue Learning" : "Start Learning"}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.div>
            </Link>
            <Link href="/dashboard">
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center h-12 rounded-xl border border-border text-muted font-medium text-sm hover:bg-card transition-colors"
              >
                Parent / Teacher Dashboard
              </motion.div>
            </Link>
          </motion.div>

          {/* Footer */}
          <motion.p variants={item} className="text-[11px] text-muted text-center pt-1">
            Powered by Gemma 4 &middot; Runs locally &middot; No data leaves your device
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 text-center py-3 px-2 rounded-xl bg-card border border-border">
      <div className="text-xl font-extrabold text-primary">{value}</div>
      <div className="text-[10px] text-muted leading-tight mt-1">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl bg-card border border-border text-center">
      <div className="text-primary">{icon}</div>
      <div className="text-xs font-semibold text-foreground">{title}</div>
    </div>
  );
}
