import { db, type SkillRecord } from "../db/local";
import { getDifficultyCeiling } from "./level-map";

// Full curriculum: basics to university
export const TRACKS = [
  {
    id: "foundations",
    name: "Foundations",
    ageRange: "5-10",
    topics: ["counting", "addition", "subtraction", "multiplication", "division", "fractions"],
  },
  {
    id: "middle",
    name: "Middle School",
    ageRange: "10-14",
    topics: ["pre-algebra", "geometry-basics", "ratios", "intro-statistics"],
  },
  {
    id: "high-school",
    name: "High School",
    ageRange: "14-18",
    topics: ["algebra", "geometry", "trigonometry", "pre-calculus"],
  },
  {
    id: "university",
    name: "University",
    ageRange: "17+",
    topics: ["calculus-1", "calculus-2", "linear-algebra", "probability", "discrete-math"],
  },
] as const;

export const TOPICS = TRACKS.flatMap((t) => t.topics);

export type MathTopic = (typeof TOPICS)[number];

export const REGION_NAMES: Record<string, string> = {
  counting: "Counting & Numbers",
  addition: "Addition",
  subtraction: "Subtraction",
  multiplication: "Multiplication",
  division: "Division",
  fractions: "Fractions & Decimals",
  "pre-algebra": "Pre-Algebra",
  "geometry-basics": "Geometry Basics",
  ratios: "Ratios & Proportions",
  "intro-statistics": "Intro to Statistics",
  algebra: "Algebra I & II",
  geometry: "Geometry",
  trigonometry: "Trigonometry",
  "pre-calculus": "Pre-Calculus",
  "calculus-1": "Calculus I",
  "calculus-2": "Calculus II",
  "linear-algebra": "Linear Algebra",
  probability: "Probability & Statistics",
  "discrete-math": "Discrete Mathematics",
};

export const TOPIC_PREREQUISITES: Record<string, string[]> = {
  counting: [],
  addition: ["counting"],
  subtraction: ["addition"],
  multiplication: ["addition"],
  division: ["multiplication"],
  fractions: ["division"],
  "pre-algebra": ["fractions"],
  "geometry-basics": ["fractions"],
  ratios: ["fractions"],
  "intro-statistics": ["ratios"],
  algebra: ["pre-algebra"],
  geometry: ["geometry-basics", "algebra"],
  trigonometry: ["geometry", "algebra"],
  "pre-calculus": ["trigonometry"],
  "calculus-1": ["pre-calculus"],
  "calculus-2": ["calculus-1"],
  "linear-algebra": ["algebra"],
  probability: ["intro-statistics", "algebra"],
  "discrete-math": ["algebra"],
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
  return db.skills.where("studentId").equals(studentId).toArray();
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

  const allTopics = TOPICS;
  const candidates = allTopics
    .filter((topic) => {
      const prereqs = TOPIC_PREREQUISITES[topic] ?? [];
      return prereqs.every((p) => {
        const prereqSkill = skills.find((sk) => sk.topic === p);
        return prereqSkill && prereqSkill.level >= 3;
      });
    })
    .map((topic) => {
      const s = skills.find((sk) => sk.topic === topic);
      const level = s?.level ?? 1;
      const accuracy = s?.accuracy ?? 0.5;
      return {
        topic,
        score: Math.abs(0.7 - accuracy) * -1 + (level < 8 ? 0.5 : 0),
      };
    })
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
  const idx = TOPICS.indexOf(currentTopic as typeof TOPICS[number]);
  if (idx < 0 || idx >= TOPICS.length - 1) return null;
  return TOPICS[idx + 1];
}

export function getTrackForTopic(topic: string): (typeof TRACKS)[number] | undefined {
  return TRACKS.find((t) => (t.topics as readonly string[]).includes(topic));
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
