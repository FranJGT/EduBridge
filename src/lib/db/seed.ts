import { db } from "./local";

const SEED_URL = "/curriculum/math/problems/grade-3.json";

export async function seedCurriculumIfEmpty() {
  const count = await db.problems.count();
  if (count > 0) return;

  try {
    const res = await fetch(SEED_URL);
    if (!res.ok) return;

    const problems = await res.json();
    if (!Array.isArray(problems)) return;

    await db.problems.bulkAdd(
      problems.map((p: Record<string, unknown>) => ({
        id: p.id as string,
        topic: p.topic as string,
        difficulty: p.difficulty as number,
        statement: p.statement as string,
        answer: p.answer as number,
        hints: (p.hints as string[]) || [],
        solutionSteps: (p.solutionSteps as string[]) || [],
        language: (p.language as string) || "en",
      }))
    );

    console.log(`Seeded ${problems.length} problems into local database`);
  } catch (err) {
    console.warn("Could not seed curriculum:", err);
  }
}
