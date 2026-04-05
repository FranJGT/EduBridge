"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useStudentStore } from "@/stores/student-store";
import { Milo } from "@/components/shared/Milo";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Home() {
  const studentId = useStudentStore((s) => s.studentId);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-6 pt-16 pb-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-md mx-auto w-full flex flex-col items-center gap-6"
        >
          {/* Offline badge */}
          <motion.div
            variants={item}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-semibold"
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
          <motion.div variants={item}>
            <Milo expression="happy" size={140} />
          </motion.div>

          {/* Title */}
          <motion.div variants={item} className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground tracking-tight" style={{ fontFamily: "var(--font-funnel-sans, var(--font-sans))" }}>
              EduBridge
            </h1>
            <p className="text-base text-muted leading-relaxed">
              Your personal math tutor.
              <br />
              Any language. Zero internet.
            </p>
          </motion.div>

          {/* Impact stats */}
          <motion.div variants={item} className="flex gap-4 w-full">
            <ImpactStat value="2.2B" label="Without reliable internet" />
            <ImpactStat value="250M" label="Children out of school" />
            <ImpactStat value="140+" label="Languages supported" />
          </motion.div>

          {/* Feature cards */}
          <motion.div variants={item} className="grid grid-cols-2 gap-3 w-full">
            <FeatureCard icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
            } title="Reads Handwriting" desc="Snap a photo of your work" />
            <FeatureCard icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
            } title="6 Languages" desc="English to Swahili" />
            <FeatureCard icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
            } title="Adapts to You" desc="AI adjusts difficulty" />
            <FeatureCard icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2l3 6h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z"/></svg>
            } title="Earn Stars" desc="Track your progress" />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={item} className="flex flex-col gap-3 w-full pt-2">
            <Link href={studentId ? "/student" : "/student?onboarding=true"}>
              <motion.div
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center h-14 rounded-full bg-primary text-white font-semibold text-lg shadow-lg hover:bg-primary-dark transition-colors gap-2"
              >
                {studentId ? "Continue Learning" : "Start Learning"}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.div>
            </Link>
            <Link href="/dashboard">
              <motion.div
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center h-12 rounded-full border border-border text-foreground font-medium hover:bg-card transition-colors"
              >
                Parent / Teacher Dashboard
              </motion.div>
            </Link>
          </motion.div>

          {/* Tech badge */}
          <motion.p variants={item} className="text-xs text-muted text-center pt-2">
            Powered by <span className="font-semibold text-foreground">Gemma 4</span> &middot; Runs locally via Ollama &middot; No data leaves your device
          </motion.p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted border-t border-border">
        EduBridge &mdash; Education without boundaries
      </footer>
    </div>
  );
}

function ImpactStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 text-center p-3 rounded-xl bg-card border border-border">
      <div className="text-xl font-bold text-primary">{value}</div>
      <div className="text-[10px] text-muted leading-tight mt-1">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border text-center">
      <div className="text-primary">{icon}</div>
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <div className="text-xs text-muted">{desc}</div>
    </div>
  );
}
