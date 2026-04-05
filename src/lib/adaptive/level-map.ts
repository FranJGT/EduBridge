export type AgeGroup = "early" | "developing" | "intermediate" | "advancing" | "advanced";

export function getAgeGroup(age: number): AgeGroup {
  if (age <= 7) return "early";
  if (age <= 9) return "developing";
  if (age <= 11) return "intermediate";
  if (age <= 13) return "advancing";
  return "advanced";
}

export function getDifficultyCeiling(age: number): number {
  if (age <= 7) return 4;
  if (age <= 9) return 6;
  if (age <= 11) return 7;
  if (age <= 13) return 9;
  return 10;
}
