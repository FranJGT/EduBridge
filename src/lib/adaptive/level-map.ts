export type AgeGroup = "child" | "middle" | "teen" | "university" | "adult";

export function getAgeGroup(age: number): AgeGroup {
  if (age <= 10) return "child";
  if (age <= 14) return "middle";
  if (age <= 18) return "teen";
  if (age <= 25) return "university";
  return "adult";
}

export function getDifficultyCeiling(age: number): number {
  if (age <= 7) return 4;
  if (age <= 10) return 6;
  if (age <= 14) return 7;
  if (age <= 18) return 9;
  return 10; // No ceiling for adults
}

export function getRecommendedTrack(age: number): string {
  if (age <= 10) return "foundations";
  if (age <= 14) return "middle";
  if (age <= 18) return "high-school";
  return "university";
}
