import { GoogleGenAI } from "@google/genai";
import type {
  AIProvider,
  ChatMessage,
  ChatOptions,
  ChatResponse,
  StreamChunk,
} from "./types";

// Use gemma-3-27b-it (available via Google AI Studio API).
// Switch to gemma-4 when available via API.
const MODEL = process.env.GEMMA_MODEL || "gemma-3-27b-it";

export class CloudProvider implements AIProvider {
  name = "Google AI Studio (cloud)";
  private client: GoogleGenAI | null = null;

  private getClient(): GoogleGenAI {
    if (!this.client) {
      const apiKey = process.env.GOOGLE_AI_API_KEY;
      if (!apiKey) throw new Error("GOOGLE_AI_API_KEY not configured");
      this.client = new GoogleGenAI({ apiKey });
    }
    return this.client;
  }

  async isAvailable(): Promise<boolean> {
    return !!process.env.GOOGLE_AI_API_KEY;
  }

  async chat(
    messages: ChatMessage[],
    options?: ChatOptions
  ): Promise<ChatResponse> {
    const ai = this.getClient();
    const contents = this.toGoogleContents(messages);

    const config: Record<string, unknown> = {
      temperature: options?.temperature ?? 0.7,
    };

    if (options?.system) {
      config.systemInstruction = options.system;
    }

    if (options?.tools) {
      config.tools = [
        {
          functionDeclarations: options.tools.map((t) => ({
            name: t.function.name,
            description: t.function.description,
            parameters: t.function.parameters,
          })),
        },
      ];
    }

    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config,
    });

    const text = response.text ?? "";
    const functionCalls = response.functionCalls;

    return {
      content: text,
      tool_calls: functionCalls
        ?.filter((fc): fc is typeof fc & { name: string } => !!fc.name)
        .map((fc, i) => ({
          id: `call_${i}`,
          function: {
            name: fc.name,
            arguments: (fc.args as Record<string, unknown>) ?? {},
          },
        })),
      done: true,
    };
  }

  async *chatStream(
    messages: ChatMessage[],
    options?: ChatOptions
  ): AsyncGenerator<StreamChunk> {
    const ai = this.getClient();
    const contents = this.toGoogleContents(messages);

    const config: Record<string, unknown> = {
      temperature: options?.temperature ?? 0.7,
    };

    if (options?.system) {
      config.systemInstruction = options.system;
    }

    const stream = await ai.models.generateContentStream({
      model: MODEL,
      contents,
      config,
    });

    for await (const chunk of stream) {
      yield {
        content: chunk.text ?? "",
        done: false,
      };
    }
    yield { content: "", done: true };
  }

  async analyzeImage(imageBase64: string, prompt: string): Promise<string> {
    const ai = this.getClient();

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
            { text: prompt },
          ],
        },
      ],
    });

    return response.text ?? "";
  }

  private toGoogleContents(messages: ChatMessage[]) {
    return messages
      .filter((m) => m.role !== "system")
      .map((msg) => {
        const parts: Array<Record<string, unknown>> = [];

        if (msg.images?.length) {
          for (const img of msg.images) {
            parts.push({
              inlineData: { mimeType: "image/jpeg", data: img },
            });
          }
        }

        if (msg.content) {
          parts.push({ text: msg.content });
        }

        return {
          role: msg.role === "assistant" ? "model" : "user",
          parts,
        };
      });
  }
}
