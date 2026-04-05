"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStudentStore } from "@/stores/student-store";
import { OfflineIndicator } from "@/components/shared/OfflineIndicator";
import { Onboarding } from "@/components/tutor/Onboarding";
import { TutorView } from "@/components/tutor/TutorView";
import { db } from "@/lib/db/local";
import { seedCurriculumIfEmpty } from "@/lib/db/seed";

export default function StudentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <StudentContent />
    </Suspense>
  );
}

function StudentContent() {
  const searchParams = useSearchParams();
  const studentId = useStudentStore((s) => s.studentId);
  const setAIProvider = useStudentStore((s) => s.setAIProvider);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!studentId || searchParams.get("onboarding") === "true") {
      setShowOnboarding(true);
    }
  }, [studentId, searchParams]);

  // Seed curriculum on first launch
  useEffect(() => {
    seedCurriculumIfEmpty();
  }, []);

  // Detect AI provider on mount
  useEffect(() => {
    async function detectProvider() {
      try {
        const res = await fetch("http://127.0.0.1:11434/api/tags", {
          signal: AbortSignal.timeout(2000),
        });
        if (res.ok) {
          setAIProvider("Ollama (offline)");
          return;
        }
      } catch {
        // Ollama not available
      }
      setAIProvider("Cloud (online)");
    }
    detectProvider();
  }, [setAIProvider]);

  // Create/update session
  useEffect(() => {
    if (!studentId) return;
    const startSession = async () => {
      const sessionId = await db.sessions.add({
        studentId,
        startedAt: new Date().toISOString(),
        problemsAttempted: 0,
        problemsCorrect: 0,
      });
      useStudentStore.getState().setSessionId(sessionId as number);
    };
    startSession();
  }, [studentId]);

  if (showOnboarding) {
    return (
      <>
        <OfflineIndicator />
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      </>
    );
  }

  return (
    <>
      <OfflineIndicator />
      <TutorView />
    </>
  );
}
