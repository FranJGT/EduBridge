import { db, type SkillRecord } from "../db/local";
import { getDifficultyCeiling } from "./level-map";

export const TOPICS = [
  "addition",
  "subtraction",
  "multiplication",
  "division",
  "fractions",
  "word-problems",
  "algebra",
] as const;

export type MathTopic = (typeof TOPICS)[number];

export const REGION_NAMES: Record<string, string> = {
  addition: "Addition Meadows",
  subtraction: "Subtraction Shores",
  multiplication: "Multiplication Mountains",
  division: "Division Desert",
  fractions: "Fraction Forest",
  "word-problems": "Word Problem Wonderland",
  algebra: "Algebra Peak",
};

export const TOPIC_PREREQUISITES: Record<string, string[]> = {
  addition: [],
  subtraction: ["addition"],
  multiplication: ["addition"],
  division: ["multiplication"],
  fractions: ["division"],
  "word-problems": ["addition", "subtraction"],
  algebra: ["fractions", "multiplication"],
};

export async function getSkill(
  studentId: string,
  topic: string
): Promise<SkillRecord> {
  const existing = await db.skills
    .where("[studentId+topic]")
    .equals([studentId, topic])
    .first();

  if (existing) return existing;

  const newSkill: SkillRecord = {
    studentId,
    topic,
    level: 1,
    accuracy: 0,
    totalAttempts: 0,
    correctAttempts: 0,
    lastAttemptAt: new Date().toISOString(),
  };

  const id = await db.skills.add(newSkill);
  return { ...newSkill, id: id as number };
}

export async function getStudentSkills(
  studentId: string
): Promise<SkillRecord[]> {
  const skills = await db.skills
    .where("studentId")
    .equals(studentId)
    .toArray();

  for (const topic of TOPICS) {
    if (!skills.find((s) => s.topic === topic)) {
      const skill = await getSkill(studentId, topic);
      skills.push(skill);
    }
  }

  return skills;
}

export async function updateSkill(
  studentId: string,
  topic: string,
  isCorrect: boolean
): Promise<SkillRecord> {
  const skill = await getSkill(studentId, topic);

  skill.totalAttempts += 1;
  if (isCorrect) skill.correctAttempts += 1;
  skill.accuracy =
    skill.totalAttempts > 0 ? skill.correctAttempts / skill.totalAttempts : 0;
  skill.lastAttemptAt = new Date().toISOString();

  if (isCorrect) {
    skill.level = Math.min(10, skill.level + 0.3 * (1 - skill.accuracy + 0.3));
  } else {
    skill.level = Math.max(1, skill.level - 0.2);
  }

  await db.skills.update(skill.id!, skill);
  return skill;
}

export async function selectNextTopic(studentId: string): Promise<string> {
  const skills = await getStudentSkills(studentId);

  const candidates = skills
    .filter((s) => {
      const prereqs = TOPIC_PREREQUISITES[s.topic] ?? [];
      return prereqs.every((p) => {
        const prereqSkill = skills.find((sk) => sk.topic === p);
        return prereqSkill && prereqSkill.level >= 3;
      });
    })
    .map((s) => ({
      ...s,
      score:
        Math.abs(0.7 - (s.accuracy || 0.5)) * -1 + (s.level < 8 ? 0.5 : 0),
    }))
    .sort((a, b) => b.score - a.score);

  return candidates[0]?.topic ?? "addition";
}

export function getDifficultyForSkill(skill: SkillRecord, age?: number): number {
  const base = Math.max(1, Math.min(10, Math.round(skill.level)));
  if (age) {
    const ceiling = getDifficultyCeiling(age);
    return Math.min(base, ceiling);
  }
  return base;
}

export function isMastered(skill: SkillRecord): boolean {
  return skill.level >= 8 && skill.accuracy >= 0.9 && skill.totalAttempts >= 10;
}

export function getNextRegion(currentTopic: string): string | null {
  const idx = TOPICS.indexOf(currentTopic as MathTopic);
  if (idx < 0 || idx >= TOPICS.length - 1) return null;
  return TOPICS[idx + 1];
}

export async function getStreak(studentId: string): Promise<number> {
  const recentAnswers = await db.answers
    .where("studentId")
    .equals(studentId)
    .toArray();

  recentAnswers.sort(
    (a, b) =>
      new Date(b.answeredAt).getTime() - new Date(a.answeredAt).getTime()
  );

  let streak = 0;
  for (const answer of recentAnswers) {
    if (answer.isCorrect) streak++;
    else break;
  }
  return streak;
}
