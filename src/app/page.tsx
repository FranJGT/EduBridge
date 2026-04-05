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
      <main className="flex-1 flex flex-col items-center px-6 pt-16 pb-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-md mx-auto w-full flex flex-col items-center gap-8"
        >
          {/* Milo */}
          <motion.div variants={item}>
            <Milo expression="happy" size={120} />
          </motion.div>

          {/* Title — Apple style: black, heavy weight, tight */}
          <motion.div variants={item} className="text-center space-y-3">
            <h1 className="text-5xl font-black text-foreground tracking-tight leading-none">
              EduBridge
            </h1>
            <p className="text-lg text-foreground/70 leading-relaxed font-light">
              Math mastery from counting to calculus.
              <br />
              <span className="text-muted">Powered by AI. Works offline.</span>
            </p>
          </motion.div>

          {/* Impact — minimal, Apple number style */}
          <motion.div variants={item} className="flex gap-6 text-center">
            <div>
              <div className="text-3xl font-black text-foreground">2.2B</div>
              <div className="text-xs text-muted mt-0.5">without internet</div>
            </div>
            <div className="w-px bg-border" />
            <div>
              <div className="text-3xl font-black text-foreground">250M</div>
              <div className="text-xs text-muted mt-0.5">out of school</div>
            </div>
            <div className="w-px bg-border" />
            <div>
              <div className="text-3xl font-black text-foreground">19</div>
              <div className="text-xs text-muted mt-0.5">courses</div>
            </div>
          </motion.div>

          {/* Features — subtle pills */}
          <motion.div variants={item} className="flex flex-wrap justify-center gap-2">
            {["Scan handwriting", "6 languages", "Adapts to you", "Works offline"].map((f) => (
              <span key={f} className="px-3.5 py-1.5 rounded-lg bg-card border border-border text-xs font-medium text-foreground/70">
                {f}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-col gap-3 w-full pt-2">
            <Link href={studentId ? "/student" : "/student?onboarding=true"}>
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center h-[52px] rounded-xl bg-foreground text-background font-semibold text-base gap-2 transition-opacity hover:opacity-90"
              >
                {studentId ? "Continue Learning" : "Get Started"}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.div>
            </Link>
            <Link href="/dashboard">
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center h-11 rounded-xl text-muted font-medium text-sm hover:text-foreground/70 transition-colors"
              >
                Parent & Teacher Dashboard
              </motion.div>
            </Link>
          </motion.div>

          {/* Footer */}
          <motion.p variants={item} className="text-[11px] text-muted text-center">
            Powered by Gemma 4 &middot; No data leaves your device
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}
