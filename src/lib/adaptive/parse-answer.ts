/** Parse an answer from string input or AI response.
 * Handles: integers, decimals, fractions ("3/8"), strings, numbers, text-wrapped numbers.
 */
export function parseAnswer(input: unknown): number {
  if (typeof input === "number") return input;
  if (typeof input !== "string") return NaN;

  const trimmed = String(input).trim();

  // Handle fractions: "3/8" → 0.375
  if (trimmed.includes("/")) {
    const parts = trimmed.split("/").map((s) => s.trim());
    if (parts.length === 2) {
      const num = Number(parts[0]);
      const den = Number(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        return num / den;
      }
    }
  }

  // Try direct parse
  const direct = Number(trimmed);
  if (!isNaN(direct)) return direct;

  // Try extracting a number from text like "The answer is 632"
  const match = trimmed.match(/-?\d+\.?\d*/);
  if (match) return Number(match[0]);

  return NaN;
}

/** Compare two answers with tolerance for floating point */
export function answersMatch(studentAnswer: unknown, correctAnswer: unknown, tolerance = 0.1): boolean {
  const parsed = parseAnswer(studentAnswer);
  const correct = parseAnswer(correctAnswer);
  if (isNaN(parsed) || isNaN(correct)) return false;
  return Math.abs(parsed - correct) < tolerance;
}
