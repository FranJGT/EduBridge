import type { ToolDefinition } from "./types";

export const TUTOR_TOOLS: ToolDefinition[] = [
  {
    type: "function",
    function: {
      name: "evaluate_answer",
      description:
        "Evaluate a student's answer to a math problem. Returns whether correct and feedback.",
      parameters: {
        type: "object",
        properties: {
          is_correct: {
            type: "boolean",
            description: "Whether the student's answer is correct",
          },
          student_answer: {
            type: "string",
            description: "The student's answer as interpreted",
          },
          correct_answer: {
            type: "string",
            description: "The correct answer",
          },
          feedback: {
            type: "string",
            description:
              "Encouraging, age-appropriate feedback explaining the result",
          },
          hint: {
            type: "string",
            description:
              "A helpful hint for the student if incorrect (empty if correct)",
          },
          error_type: {
            type: "string",
            description:
              "Type of error if incorrect: calculation, conceptual, reading, or none",
          },
        },
        required: [
          "is_correct",
          "student_answer",
          "correct_answer",
          "feedback",
        ],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generate_problem",
      description:
        "Generate a new math problem at a specific difficulty level for the student.",
      parameters: {
        type: "object",
        properties: {
          statement: {
            type: "string",
            description: "The problem statement",
          },
          answer: {
            type: "number",
            description: "The correct numerical answer",
          },
          difficulty: {
            type: "number",
            description: "Difficulty level from 1-10",
          },
          topic: {
            type: "string",
            description:
              "Math topic: addition, subtraction, multiplication, division, fractions, word-problems",
          },
          hints: {
            type: "array",
            description: "List of progressive hints",
            items: { type: "string" },
          },
          solution_steps: {
            type: "array",
            description: "Step-by-step solution",
            items: { type: "string" },
          },
        },
        required: [
          "statement",
          "answer",
          "difficulty",
          "topic",
          "hints",
          "solution_steps",
        ],
      },
    },
  },
];

export const HANDWRITING_PROMPT = `You are an expert math tutor analyzing a student's handwritten work.

Look at this image of handwritten math work and:
1. Identify the math problem(s) the student is trying to solve
2. Read the student's work and answer
3. Determine if the answer is correct
4. If incorrect, identify exactly where the error occurred

Respond in JSON format:
{
  "problems_found": [
    {
      "problem": "the math problem identified",
      "student_work": "what the student wrote step by step",
      "student_answer": "the student's final answer",
      "correct_answer": "the correct answer",
      "is_correct": true/false,
      "error_location": "where the error is, if any",
      "error_type": "calculation/conceptual/reading/none"
    }
  ],
  "overall_feedback": "encouraging feedback about the student's work",
  "skill_areas": ["topics demonstrated, e.g. multiplication, addition"]
}`;
