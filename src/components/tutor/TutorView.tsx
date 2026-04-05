"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useStudentStore } from "@/stores/student-store";
import { ProblemCard } from "./ProblemCard";
import { HandwritingCapture } from "./HandwritingCapture";
import { FeedbackPanel } from "./FeedbackPanel";
import { NuriThinking } from "./NuriThinking";
import { MasteryCelebration } from "./MasteryCelebration";
import { DailyHub } from "@/components/hub/DailyHub";
import { ProgressView } from "./ProgressView";
import { JourneyMap } from "@/components/journey/JourneyMap";
import { BottomTabBar, type TabId } from "@/components/shared/BottomTabBar";
import { OfflineIndicator } from "@/components/shared/OfflineIndicator";
import {
  selectNextTopic,
  getSkill,
  getDifficultyForSkill,
  updateSkill,
  getStreak,
  isMastered,
} from "@/lib/adaptive/engine";
import { parseAnswer, answersMatch } from "@/lib/adaptive/parse-answer";
import { db } from "@/lib/db/local";
import { t } from "@/lib/i18n";

interface Problem {
  statement: string;
  answer: number;
  difficulty: number;
  topic: string;
  hints: string[];
  solutionSteps: string[];
}

interface Feedback {
  isCorrect: boolean;
  feedback: string;
  hint?: string;
  correctAnswer?: string;
  scanBonus?: number;
  starsEarned?: number;
}

type View = "hub" | "journey" | "progress" | "problem" | "camera" | "thinking" | "feedback" | "mastery";

// parseAnswer imported from @/lib/adaptive/parse-answer

export function TutorView() {
  const store = useStudentStore();
  const {
    studentId,
    studentName,
    language,
    age,
    currentSessionId,
    setCurrentTopic,
    addStars,
    setStreak,
    updateWorldProgress,
    worldProgress,
  } = store;

  const [view, setView] = useState<View>("hub");
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [problem, setProblem] = useState<Problem | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [masteryData, setMasteryData] = useState<{
    topic: string;
    accuracy: number;
    total: number;
    streak: number;
  } | null>(null);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    if (tab === "home") setView("hub");
    else if (tab === "journey") setView("journey");
    else if (tab === "scan") setView("camera");
    else if (tab === "progress") setView("progress");
  };

  const handleHubNavigate = (target: "journey" | "scan" | "quickPractice") => {
    if (target === "journey") {
      setView("journey");
      setActiveTab("journey");
    } else if (target === "scan") {
      setView("camera");
      setActiveTab("scan");
    } else {
      handleQuickPractice();
    }
  };

  const handleQuickPractice = async () => {
    if (!studentId) return;
    const topic = await selectNextTopic(studentId);
    setCurrentTopic(topic);
    loadProblem(topic);
  };

  const loadProblem = useCallback(
    async (topic: string) => {
      if (!studentId) return;
      setLoading(true);
      setAnswer("");
      setFeedback(null);
      setError(null);
      const currentStatement = problem?.statement;

      try {
        const skill = await getSkill(studentId, topic);
        const difficulty = getDifficultyForSkill(skill, age);

        const res = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, difficulty, language, age }),
          signal: AbortSignal.timeout(30000),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.problem) {
            const p = data.problem;
            const parsedAIAnswer = parseAnswer(p.answer);
            if (isNaN(parsedAIAnswer)) {
              console.warn("AI returned unparseable answer:", p.answer);
            }
            setProblem({
              statement: p.statement,
              answer: parsedAIAnswer,
              difficulty: Number(p.difficulty) || 3,
              topic: p.topic || topic,
              hints: p.hints || [],
              solutionSteps: p.solution_steps || p.solutionSteps || [],
            });
            try {
              await db.problems.add({
                id: `gen-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                topic: p.topic || topic,
                difficulty: Number(p.difficulty),
                statement: p.statement,
                answer: Number(p.answer),
                hints: p.hints || [],
                solutionSteps: p.solution_steps || p.solutionSteps || [],
                language,
              });
            } catch {}
            setStartTime(Date.now());
            setView("problem");
            setActiveTab("journey");
            return;
          }
        }

        // Fallback to cache
        const cached = await db.problems
          .where("[topic+difficulty]")
          .between([topic, Math.max(1, (skill?.level ?? 1) - 1)], [topic, (skill?.level ?? 1) + 1])
          .toArray();
        const fallback = cached.find((p) => p.statement !== currentStatement) || cached[0];
        if (fallback) {
          setProblem({
            statement: fallback.statement,
            answer: fallback.answer,
            difficulty: fallback.difficulty,
            topic: fallback.topic,
            hints: fallback.hints,
            solutionSteps: fallback.solutionSteps,
          });
          setStartTime(Date.now());
          setView("problem");
        } else {
          setError("No problems available. Connect to AI or try another topic.");
          setView("journey");
        }
      } catch (err) {
        console.error("Failed to load problem:", err);
        try {
          const cached = await db.problems.where("topic").equals(topic).toArray();
          const fallback = cached.find((p) => p.statement !== currentStatement) || cached[0];
          if (fallback) {
            setProblem({ statement: fallback.statement, answer: fallback.answer, difficulty: fallback.difficulty, topic: fallback.topic, hints: fallback.hints, solutionSteps: fallback.solutionSteps });
            setStartTime(Date.now());
            setView("problem");
          } else {
            setError("Offline and no cached problems. Try another topic.");
            setView("journey");
          }
        } catch {
          setError("Could not load problem.");
          setView("hub");
        }
      } finally {
        setLoading(false);
      }
    },
    [studentId, language, age, problem?.statement]
  );

  const handleSubmitAnswer = async () => {
    if (!problem || !studentId || !currentSessionId) return;

    const isCorrect = answersMatch(answer, problem.answer);
    const timeSpent = Date.now() - startTime;

    setView("thinking");

    const skill = await updateSkill(studentId, problem.topic, isCorrect);

    try {
      await db.answers.add({
        studentId, sessionId: currentSessionId, problemId: `p-${Date.now()}`,
        topic: problem.topic, difficulty: problem.difficulty,
        studentAnswer: answer, correctAnswer: String(problem.answer),
        isCorrect, timeSpentMs: timeSpent,
        feedback: isCorrect ? "Correct!" : "Incorrect",
        answeredAt: new Date().toISOString(),
      });
      const session = await db.sessions.get(currentSessionId);
      if (session) {
        await db.sessions.update(currentSessionId, {
          problemsAttempted: session.problemsAttempted + 1,
          problemsCorrect: session.problemsCorrect + (isCorrect ? 1 : 0),
        });
      }
    } catch (err) {
      console.error("Failed to save answer:", err);
    }

    if (isCorrect) {
      const stars = Math.min(30, 10 + problem.difficulty * 2);
      addStars(stars);
      const current = worldProgress[problem.topic] || 0;
      updateWorldProgress(problem.topic, current + 1);
    }
    const streakCount = await getStreak(studentId);
    setStreak(streakCount);

    // Check mastery
    if (isCorrect && isMastered(skill)) {
      const progress = (worldProgress[problem.topic] || 0) + 1;
      if (progress >= 10) {
        setMasteryData({ topic: problem.topic, accuracy: skill.accuracy, total: skill.totalAttempts, streak: streakCount });
        setTimeout(() => setView("mastery"), 2000);
        return;
      }
    }

    // Get AI feedback
    const starsEarned = isCorrect ? Math.min(30, 10 + problem.difficulty * 2) : 0;
    const fallbackFeedback: Feedback = {
      isCorrect,
      feedback: isCorrect ? "Great job!" : "Not quite right. Keep trying!",
      correctAnswer: String(problem.answer),
      hint: !isCorrect && problem.hints.length > 0 ? problem.hints[0] : undefined,
      starsEarned,
    };

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `The student answered "${answer}" to: "${problem.statement}". Correct answer is ${problem.answer}. ${isCorrect ? "Correct!" : "Wrong."} Give brief encouraging feedback in ${language}. 2-3 sentences. Be specific about what they did right or wrong.` }],
          options: { temperature: 0.7 },
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const data = await res.json();
        setFeedback({ ...fallbackFeedback, feedback: data.content?.trim() || fallbackFeedback.feedback });
      } else {
        setFeedback(fallbackFeedback);
      }
    } catch {
      setFeedback(fallbackFeedback);
    }

    setTimeout(() => setView("feedback"), 2500);
  };

  const handleNextProblem = async () => {
    if (!studentId) return;
    const topic = await selectNextTopic(studentId);
    setCurrentTopic(topic);
    loadProblem(topic);
  };

  const handleTopicSelect = (topic: string) => {
    setCurrentTopic(topic);
    loadProblem(topic);
  };

  const handleImageAnalysis = async (analysis: Record<string, unknown>) => {
    const problems = analysis.problems_found as Array<Record<string, unknown>> | undefined;
    const isCorrect = !!(problems && problems.length > 0 && problems[0].is_correct);
    if (isCorrect) addStars(30);

    if (problems && problems.length > 0) {
      const first = problems[0];
      setFeedback({
        isCorrect,
        feedback: (analysis.overall_feedback as string) || "Work analyzed!",
        correctAnswer: first.correct_answer as string,
        hint: first.error_location as string,
        scanBonus: isCorrect ? 30 : undefined,
      });
    } else {
      setFeedback({
        isCorrect: false,
        feedback: "Could not identify problems in the image. Try a clearer photo.",
      });
    }
    setView("feedback");
  };

  const showTabBar = ["hub", "journey", "camera", "progress"].includes(view);

  return (
    <div className="flex flex-col min-h-screen">
      <OfflineIndicator />

      <main className="flex-1 flex flex-col pt-10">
        {error && (
          <div className="mx-4 mb-2 p-3 rounded-xl bg-secondary/10 border border-secondary text-sm text-center">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {view === "hub" && (
            <motion.div key="hub" className="flex-1 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }}>
              <DailyHub onNavigate={handleHubNavigate} />
            </motion.div>
          )}

          {view === "journey" && (
            <motion.div key="journey" className="flex-1 flex flex-col" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <JourneyMap onSelectTopic={handleTopicSelect} />
            </motion.div>
          )}

          {view === "progress" && (
            <motion.div key="progress" className="flex-1 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProgressView />
            </motion.div>
          )}

          {view === "problem" && problem && (
            <motion.div key="problem" className="flex-1 flex flex-col justify-center p-4 max-w-lg mx-auto w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ProblemCard problem={problem} answer={answer} onAnswerChange={setAnswer} onSubmit={handleSubmitAnswer} loading={loading} language={language} />
            </motion.div>
          )}

          {view === "camera" && (
            <motion.div key="camera" className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HandwritingCapture language={language} onAnalysis={handleImageAnalysis} onBack={() => { setView("hub"); setActiveTab("home"); }} />
            </motion.div>
          )}

          {view === "thinking" && (
            <motion.div key="thinking" className="flex-1 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <NuriThinking />
            </motion.div>
          )}

          {view === "feedback" && feedback && (
            <motion.div key="feedback" className="flex-1 flex flex-col justify-center p-4 max-w-lg mx-auto w-full" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <FeedbackPanel
                feedback={feedback}
                onNext={handleNextProblem}
                onRetry={() => { setAnswer(""); setFeedback(null); setView("problem"); }}
                onTopics={() => { setView("journey"); setActiveTab("journey"); }}
                language={language}
              />
            </motion.div>
          )}

          {view === "mastery" && masteryData && (
            <motion.div key="mastery" className="flex-1 flex flex-col" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <MasteryCelebration
                topic={masteryData.topic}
                accuracy={masteryData.accuracy}
                totalProblems={masteryData.total}
                bestStreak={masteryData.streak}
                studentName={studentName}
                onContinue={(nextTopic) => { setCurrentTopic(nextTopic); loadProblem(nextTopic); }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {loading && view === "problem" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-30">
            <div className="text-center space-y-3" role="status">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted text-sm">Generating problem...</p>
            </div>
          </div>
        )}
      </main>

      {showTabBar && <BottomTabBar active={activeTab} onTabChange={handleTabChange} />}
    </div>
  );
}
