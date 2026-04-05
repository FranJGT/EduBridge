import { db } from "../db/local";

export interface DiagnosticProblem {
  id: number;
  topic: string;
  question: string;
  answer: number;
  level: number;
  latex?: string;
}

export const DIAGNOSTIC_PROBLEMS: DiagnosticProblem[] = [
  { id: 1, topic: "addition", question: "3 + 5 = ?", answer: 8, level: 1 },
  { id: 2, topic: "subtraction", question: "24 - 9 = ?", answer: 15, level: 2 },
  { id: 3, topic: "multiplication", question: "6 x 7 = ?", answer: 42, level: 3 },
  { id: 4, topic: "fractions", question: "What is 3/4 of 12?", answer: 9, level: 4 },
  { id: 5, topic: "algebra", question: "2x + 3 = 11. What is x?", answer: 4, level: 5, latex: "2x + 3 = 11" },
  { id: 6, topic: "trigonometry", question: "sin(30°) = ?", answer: 0.5, level: 6, latex: "\\sin(30°)" },
  { id: 7, topic: "calculus-1", question: "d/dx of x² = ?", answer: 2, level: 7, latex: "\\frac{d}{dx} x^2 \\text{ at } x=1" },
];

export function runDiagnostic(
  results: Array<{ level: number; correct: boolean }>
): number {
  let diagnosticLevel = 1;
  for (const r of results) {
    if (r.correct) {
      diagnosticLevel = r.level;
    } else {
      break;
    }
  }
  return diagnosticLevel;
}

export async function seedSkillsFromDiagnostic(
  studentId: string,
  diagnosticLevel: number,
  results: Array<{ level: number; correct: boolean; topic: string }>
) {
  const topicResults: Record<string, boolean> = {};
  for (const r of results) {
    topicResults[r.topic] = r.correct;
  }

  // Seed basic topics based on diagnostic level
  const seeds: Record<string, { level: number; accuracy: number }> = {
    counting: { level: Math.min(diagnosticLevel * 2, 10), accuracy: 0.95 },
    addition: { level: Math.min(diagnosticLevel * 1.5, 10), accuracy: topicResults["addition"] ? 0.9 : 0.3 },
    subtraction: { level: Math.max(diagnosticLevel * 1.2, 1), accuracy: topicResults["subtraction"] ? 0.85 : 0.2 },
    multiplication: { level: Math.max(diagnosticLevel - 1, 1), accuracy: topicResults["multiplication"] ? 0.8 : 0.15 },
    division: { level: Math.max(diagnosticLevel - 2, 1), accuracy: diagnosticLevel >= 3 ? 0.7 : 0 },
    fractions: { level: Math.max(diagnosticLevel - 3, 1), accuracy: topicResults["fractions"] ? 0.7 : 0 },
    "pre-algebra": { level: Math.max(diagnosticLevel - 3, 1), accuracy: diagnosticLevel >= 4 ? 0.5 : 0 },
    algebra: { level: Math.max(diagnosticLevel - 4, 1), accuracy: topicResults["algebra"] ? 0.7 : 0 },
    trigonometry: { level: Math.max(diagnosticLevel - 5, 1), accuracy: topicResults["trigonometry"] ? 0.6 : 0 },
    "calculus-1": { level: Math.max(diagnosticLevel - 6, 1), accuracy: topicResults["calculus-1"] ? 0.5 : 0 },
  };

  for (const [topic, seed] of Object.entries(seeds)) {
    const existing = await db.skills
      .where("[studentId+topic]")
      .equals([studentId, topic])
      .first();

    if (!existing) {
      const attempts = topicResults[topic] !== undefined ? 1 : 0;
      const correct = topicResults[topic] ? 1 : 0;

      await db.skills.add({
        studentId,
        topic,
        level: seed.level,
        accuracy: seed.accuracy,
        totalAttempts: attempts,
        correctAttempts: correct,
        lastAttemptAt: new Date().toISOString(),
      });
    }
  }
}
