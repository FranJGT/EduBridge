import { NextRequest, NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai";
import { HANDWRITING_PROMPT } from "@/lib/ai/tools";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, language } = body as { image: string; language?: string };

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const provider = await getAIProvider();
    const prompt =
      language && language !== "en"
        ? `${HANDWRITING_PROMPT}\n\nIMPORTANT: Write the "overall_feedback" field in ${language}.`
        : HANDWRITING_PROMPT;

    const result = await provider.analyzeImage(image, prompt);

    // Try to parse as JSON
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ analysis: parsed, raw: result });
      }
    } catch {
      // Not valid JSON, return raw
    }

    return NextResponse.json({ analysis: null, raw: result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
