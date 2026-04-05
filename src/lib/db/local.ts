import Dexie, { type EntityTable } from "dexie";

export interface Student {
  id: string;
  name: string;
  language: string;
  age: number;
  diagnosticLevel: number;
  createdAt: string;
  lastActiveAt: string;
}

export interface SkillRecord {
  id?: number;
  studentId: string;
  topic: string;
  level: number;
  accuracy: number;
  totalAttempts: number;
  correctAttempts: number;
  lastAttemptAt: string;
}

export interface SessionRecord {
  id?: number;
  studentId: string;
  startedAt: string;
  endedAt?: string;
  problemsAttempted: number;
  problemsCorrect: number;
}

export interface AnswerRecord {
  id?: number;
  studentId: string;
  sessionId: number;
  problemId: string;
  topic: string;
  difficulty: number;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpentMs: number;
  feedback: string;
  answeredAt: string;
}

export interface CachedProblem {
  id: string;
  topic: string;
  difficulty: number;
  ageGroup?: string;
  statement: string;
  answer: number;
  hints: string[];
  solutionSteps: string[];
  language: string;
}

export interface Achievement {
  id?: number;
  studentId: string;
  type: string;
  earnedAt: string;
}

export interface SyncQueue {
  id?: number;
  table: string;
  recordId: string;
  operation: "insert" | "update";
  data: string;
  createdAt: string;
  synced: boolean;
}

const db = new Dexie("EduBridgeDB") as Dexie & {
  students: EntityTable<Student, "id">;
  skills: EntityTable<SkillRecord, "id">;
  sessions: EntityTable<SessionRecord, "id">;
  answers: EntityTable<AnswerRecord, "id">;
  problems: EntityTable<CachedProblem, "id">;
  achievements: EntityTable<Achievement, "id">;
  syncQueue: EntityTable<SyncQueue, "id">;
};

db.version(1).stores({
  students: "id, name, lastActiveAt",
  skills: "++id, studentId, topic, [studentId+topic]",
  sessions: "++id, studentId, startedAt",
  answers: "++id, studentId, sessionId, topic, answeredAt",
  problems: "id, topic, difficulty, [topic+difficulty]",
  syncQueue: "++id, table, synced, createdAt",
});

db.version(2).stores({
  students: "id, name, lastActiveAt",
  skills: "++id, studentId, topic, [studentId+topic]",
  sessions: "++id, studentId, startedAt",
  answers: "++id, studentId, sessionId, topic, answeredAt",
  problems: "id, topic, difficulty, [topic+difficulty]",
  achievements: "++id, studentId, type, earnedAt",
  syncQueue: "++id, table, synced, createdAt",
});

export { db };
