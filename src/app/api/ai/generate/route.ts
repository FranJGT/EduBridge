import { NextRequest, NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai";
import { getProblemGenerationPrompt } from "@/lib/ai/prompts";
import { TUTOR_TOOLS } from "@/lib/ai/tools";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, difficulty, language, age } = body as {
      topic: string;
      difficulty: number;
      language: string;
      age: number;
    };

    const provider = await getAIProvider();
    const prompt = getProblemGenerationPrompt(
      topic,
      difficulty,
      language,
      age ?? 8
    );

    // Try with function calling first (works with Ollama/Gemma 4)
    try {
      const response = await provider.chat(
        [{ role: "user", content: prompt }],
        { tools: TUTOR_TOOLS, temperature: 0.8 }
      );

      const toolCall = response.tool_calls?.find(
        (tc) => tc.function.name === "generate_problem"
      );
      if (toolCall) {
        return NextResponse.json({ problem: toolCall.function.arguments });
      }

      // Check if text response contains JSON
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return NextResponse.json({ problem: JSON.parse(jsonMatch[0]) });
      }
    } catch {
      // Function calling not supported, fall through to JSON mode
    }

    // Fallback: ask for JSON directly (works with all models)
    const jsonPrompt = `${prompt}

Respond ONLY with a JSON object in this exact format, no other text:
{
  "statement": "the problem statement",
  "answer": 42,
  "difficulty": ${difficulty},
  "topic": "${topic}",
  "hints": ["hint 1", "hint 2"],
  "solution_steps": ["step 1", "step 2"]
}`;

    const jsonResponse = await provider.chat(
      [{ role: "user", content: jsonPrompt }],
      { temperature: 0.8 }
    );

    const match = jsonResponse.content.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return NextResponse.json({ problem: parsed });
    }

    return NextResponse.json(
      { error: "Could not generate problem" },
      { status: 500 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
