"use client";

import { useEffect, useState } from "react";
import {
  db,
  type Student,
  type SkillRecord,
  type AnswerRecord,
} from "@/lib/db/local";
import { TOPICS, REGION_NAMES } from "@/lib/adaptive/engine";
import { OfflineIndicator } from "@/components/shared/OfflineIndicator";

interface StudentWithStats extends Student {
  skills: SkillRecord[];
  recentAnswers: AnswerRecord[];
  totalProblems: number;
  accuracy: number;
}

export default function DashboardPage() {
  const [students, setStudents] = useState<StudentWithStats[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    const allStudents = await db.students.toArray();
    const enriched = await Promise.all(
      allStudents.map(async (student) => {
        const skills = await db.skills
          .where("studentId")
          .equals(student.id)
          .toArray();
        const recentAnswers = await db.answers
          .where("studentId")
          .equals(student.id)
          .reverse()
          .limit(50)
          .toArray();
        const totalProblems = recentAnswers.length;
        const correct = recentAnswers.filter((a) => a.isCorrect).length;
        return {
          ...student,
          skills,
          recentAnswers,
          totalProblems,
          accuracy: totalProblems > 0 ? correct / totalProblems : 0,
        };
      })
    );
    setStudents(enriched);
  }

  async function generateInsight(student: StudentWithStats) {
    setAiInsight(null);
    const weakTopics = student.skills
      .filter((s) => s.accuracy < 0.7 && s.totalAttempts > 3)
      .map((s) => `${s.topic} (${Math.round(s.accuracy * 100)}%)`)
      .join(", ");

    const strongTopics = student.skills
      .filter((s) => s.accuracy >= 0.8 && s.totalAttempts > 3)
      .map((s) => s.topic)
      .join(", ");

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `You are Milo, an AI math tutor. Summarize this student's learning progress in 2 sentences for their parent/teacher:
Student: ${student.name}, Age: ${student.age}
Strong topics: ${strongTopics || "none yet"}
Weak topics: ${weakTopics || "none"}
Total problems attempted: ${student.totalProblems}
Overall accuracy: ${Math.round(student.accuracy * 100)}%
Give specific, actionable advice. Be encouraging but honest.`,
            },
          ],
          options: { temperature: 0.7 },
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const data = await res.json();
        setAiInsight(data.content?.trim() || null);
      }
    } catch {
      setAiInsight(
        `${student.name} has attempted ${student.totalProblems} problems with ${Math.round(student.accuracy * 100)}% accuracy. ${weakTopics ? `Focus areas: ${weakTopics}` : "Great progress across all topics!"}`
      );
    }
  }

  const selected = students.find((s) => s.id === selectedStudent);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only re-run when selection changes
  useEffect(() => {
    if (selected) generateInsight(selected);
  }, [selectedStudent]);

  return (
    <div className="min-h-screen bg-background">
      <OfflineIndicator />

      <div className="pt-12 px-4 sm:px-8 max-w-6xl mx-auto">
        <header className="py-6 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground">
            Parent Dashboard
          </h1>
          <p className="text-muted text-sm mt-1">
            {students.length} student{students.length !== 1 ? "s" : ""}{" "}
            registered
          </p>
        </header>

        {students.length === 0 ? (
          <div className="py-20 text-center text-muted">
            <p className="text-lg">No students yet</p>
            <p className="text-sm mt-2">
              Students will appear here after they complete onboarding
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted uppercase tracking-wide">
                Students
              </h2>
              {students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    selectedStudent === student.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        {student.name}
                      </p>
                      <p className="text-xs text-muted">
                        Age {student.age} &middot; {student.totalProblems}{" "}
                        problems
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          student.accuracy >= 0.7
                            ? "text-success"
                            : student.accuracy >= 0.4
                              ? "text-secondary"
                              : "text-danger"
                        }`}
                      >
                        {Math.round(student.accuracy * 100)}%
                      </p>
                      <p className="text-xs text-muted">accuracy</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2">
              {selected ? (
                <StudentDetail student={selected} insight={aiInsight} />
              ) : (
                <div className="flex items-center justify-center h-64 rounded-xl border border-border bg-card text-muted">
                  Select a student to view details
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StudentDetail({
  student,
  insight,
}: {
  student: StudentWithStats;
  insight: string | null;
}) {
  const topics = [...TOPICS];

  const TOPIC_COLORS: Record<string, { bar: string; text: string }> = {
    addition: { bar: "bg-success", text: "text-success" },
    subtraction: { bar: "bg-[#3B82F6]", text: "text-[#3B82F6]" },
    multiplication: { bar: "bg-[#8B5CF6]", text: "text-[#8B5CF6]" },
    division: { bar: "bg-[#F59E0B]", text: "text-[#F59E0B]" },
    fractions: { bar: "bg-[#10B981]", text: "text-[#10B981]" },
    "word-problems": { bar: "bg-secondary", text: "text-secondary" },
    algebra: { bar: "bg-[#8B5CF6]", text: "text-[#8B5CF6]" },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
          {student.name[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {student.name}&apos;s Progress
          </h2>
          <p className="text-sm text-muted">
            Age {student.age} &middot; Level {student.diagnosticLevel}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3">
        <StatBox
          value={String(student.totalProblems)}
          label="Problems"
          color="text-primary"
        />
        <StatBox
          value={`${Math.round(student.accuracy * 100)}%`}
          label="Accuracy"
          color="text-success"
        />
        <StatBox
          value={`L${student.diagnosticLevel}`}
          label="Level"
          color="text-[#3B82F6]"
        />
      </div>

      {/* AI Insight */}
      {insight && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F59E0B12] border border-[#F59E0B33]">
          <svg
            className="w-5 h-5 text-secondary shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-secondary mb-1">
              Milo&apos;s AI Insight
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {insight}
            </p>
          </div>
        </div>
      )}

      {/* Mastery bars */}
      <div className="p-5 rounded-xl border border-border bg-card">
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">
          Topic Mastery
        </h3>
        <div className="space-y-4">
          {topics.map((topic) => {
            const skill = student.skills.find((s) => s.topic === topic);
            const level = skill?.level ?? 0;
            const accuracy = skill?.accuracy ?? 0;
            const attempts = skill?.totalAttempts ?? 0;
            const colors = TOPIC_COLORS[topic] || {
              bar: "bg-primary",
              text: "text-primary",
            };
            const regionName = REGION_NAMES[topic] || topic;

            return (
              <div key={topic} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {regionName}
                  </span>
                  <span className={`font-bold ${colors.text}`}>
                    {attempts > 0 ? `${Math.round(accuracy * 100)}%` : "—"}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-surface-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colors.bar} transition-all`}
                    style={{ width: `${(level / 10) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-5 rounded-xl border border-border bg-card">
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">
          Recent Activity
        </h3>
        {student.recentAnswers.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {student.recentAnswers.slice(0, 15).map((answer, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white ${
                      answer.isCorrect ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {answer.isCorrect ? "\u2713" : "\u2717"}
                  </span>
                  <span className="text-sm text-foreground capitalize">
                    {answer.topic.replace("-", " ")}
                  </span>
                </div>
                <span className="text-xs text-muted">
                  {new Date(answer.answeredAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No activity yet</p>
        )}
      </div>
    </div>
  );
}

function StatBox({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="flex-1 p-4 rounded-xl bg-card border border-border text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-muted mt-1">{label}</div>
    </div>
  );
}
