import type { AIProvider } from "./types";
import { OllamaProvider } from "./ollama-provider";
import { CloudProvider } from "./cloud-provider";

let cachedProvider: AIProvider | null = null;

export async function getAIProvider(): Promise<AIProvider> {
  if (cachedProvider) return cachedProvider;

  const ollama = new OllamaProvider();
  if (await ollama.isAvailable()) {
    cachedProvider = ollama;
    return ollama;
  }

  const cloud = new CloudProvider();
  if (await cloud.isAvailable()) {
    cachedProvider = cloud;
    return cloud;
  }

  throw new Error(
    "No AI provider available. Install Ollama with Gemma 4, or set GOOGLE_AI_API_KEY."
  );
}

export function resetProvider() {
  cachedProvider = null;
}

export type { AIProvider, ChatMessage, ChatOptions, ChatResponse, StreamChunk, ToolDefinition, ToolCall } from "./types";
