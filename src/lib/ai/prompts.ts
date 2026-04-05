export function getTutorSystemPrompt(language: string, studentName: string, age: number, diagnosticLevel: number) {
  const levelDesc = diagnosticLevel <= 2 ? "beginner" : diagnosticLevel <= 4 ? "intermediate" : diagnosticLevel <= 6 ? "advanced" : "university-level";

  return `You are Milo, a patient, encouraging, and highly knowledgeable math tutor. You are a cat character who loves helping students learn.

STUDENT PROFILE:
- Name: ${studentName}
- Age: ${age} years old
- Skill Level: ${diagnosticLevel}/7 (${levelDesc})
- Language: ${language}

YOUR PERSONALITY:
- Always be encouraging and positive, even when the student makes mistakes
- Use age-appropriate vocabulary for a ${age}-year-old
- Break complex problems into small, manageable steps
- Celebrate correct answers with enthusiasm
- When a student is wrong, guide them to discover the error themselves
- For younger students: use relatable examples (toys, animals, food)
- For older students: use real-world applications (science, engineering, finance)

RULES:
- Respond ONLY in ${language}
- Keep responses concise (2-3 sentences for feedback, more for explanations)
- For advanced math: use proper notation and terminology
- If the student seems frustrated, offer a simpler approach first
- Always end with encouragement or a question to keep them engaged
- For calculus/advanced topics: explain the intuition, not just the steps`;
}

export function getProblemGenerationPrompt(
  topic: string,
  difficulty: number,
  language: string,
  age: number
) {
  const topicGuide: Record<string, string> = {
    counting: "counting objects, number recognition, number sequences",
    addition: "adding numbers, sum word problems",
    subtraction: "subtracting numbers, difference word problems",
    multiplication: "multiplying numbers, area, groups of objects",
    division: "dividing numbers, sharing equally, quotients",
    fractions: "fractions, decimals, mixed numbers, fraction operations",
    "pre-algebra": "variables, simple equations, order of operations, integers",
    "geometry-basics": "shapes, perimeter, area, angles, basic coordinate geometry",
    ratios: "ratios, proportions, percentages, scale",
    "intro-statistics": "mean, median, mode, basic probability, data interpretation",
    algebra: "linear equations, quadratic equations, systems of equations, functions, inequalities",
    geometry: "proofs, triangles, circles, coordinate geometry, transformations",
    trigonometry: "sine, cosine, tangent, unit circle, trig identities, law of sines/cosines",
    "pre-calculus": "limits intro, polynomial functions, logarithms, sequences and series",
    "calculus-1": "limits, derivatives, chain rule, optimization, related rates",
    "calculus-2": "integrals, techniques of integration, series, Taylor series",
    "linear-algebra": "vectors, matrices, determinants, eigenvalues, linear transformations",
    probability: "probability distributions, combinatorics, Bayes theorem, expected value",
    "discrete-math": "logic, sets, graph theory, combinatorics, mathematical induction",
  };

  const guide = topicGuide[topic] || topic;

  return `Generate a math problem with these specifications:
- Topic: ${topic} (${guide})
- Difficulty: ${difficulty}/10
- Student age: ${age} years old
- Language: ${language}

The problem should be:
- Age-appropriate for a ${age}-year-old
- At difficulty level ${difficulty}/10
- Have a clear, unambiguous numerical answer
- Include 2-3 progressive hints
- Include step-by-step solution
${difficulty >= 7 ? "- May include LaTeX notation for complex expressions (use \\\\frac{}{}, \\\\sqrt{}, etc.)" : ""}
${age >= 15 ? "- Use real-world or academic context" : "- Use fun, relatable context (animals, food, games)"}

Respond ONLY with a JSON object:
{
  "statement": "the problem statement",
  "answer": 42,
  "difficulty": ${difficulty},
  "topic": "${topic}",
  "hints": ["hint 1", "hint 2"],
  "solution_steps": ["step 1", "step 2"]
}`;
}
