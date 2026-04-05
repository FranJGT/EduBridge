import { Ollama } from "ollama";
import type {
  AIProvider,
  ChatMessage,
  ChatOptions,
  ChatResponse,
  StreamChunk,
} from "./types";

const MODEL = "gemma4";
const OLLAMA_HOST = "http://127.0.0.1:11434";

export class OllamaProvider implements AIProvider {
  name = "Ollama (offline)";
  private client: Ollama;

  constructor() {
    this.client = new Ollama({ host: OLLAMA_HOST });
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${OLLAMA_HOST}/api/tags`, {
        signal: AbortSignal.timeout(2000),
      });
      if (!response.ok) return false;
      const data = await response.json();
      return data.models?.some(
        (m: { name: string }) =>
          m.name.startsWith("gemma4") || m.name.startsWith("gemma4:")
      );
    } catch {
      return false;
    }
  }

  async chat(
    messages: ChatMessage[],
    options?: ChatOptions
  ): Promise<ChatResponse> {
    const ollamaMessages = this.toOllamaMessages(messages, options?.system);

    const response = await this.client.chat({
      model: MODEL,
      messages: ollamaMessages,
      tools: options?.tools as Parameters<typeof this.client.chat>[0]["tools"],
      options: {
        temperature: options?.temperature ?? 0.7,
      },
      stream: false,
    });

    return {
      content: response.message.content,
      tool_calls: response.message.tool_calls?.map((tc, i) => ({
        id: `call_${i}`,
        function: {
          name: tc.function.name,
          arguments:
            typeof tc.function.arguments === "string"
              ? JSON.parse(tc.function.arguments)
              : tc.function.arguments,
        },
      })),
      done: true,
    };
  }

  async *chatStream(
    messages: ChatMessage[],
    options?: ChatOptions
  ): AsyncGenerator<StreamChunk> {
    const ollamaMessages = this.toOllamaMessages(messages, options?.system);

    const stream = await this.client.chat({
      model: MODEL,
      messages: ollamaMessages,
      options: {
        temperature: options?.temperature ?? 0.7,
      },
      stream: true,
    });

    for await (const chunk of stream) {
      yield {
        content: chunk.message.content,
        done: chunk.done,
      };
    }
  }

  async analyzeImage(imageBase64: string, prompt: string): Promise<string> {
    const response = await this.client.chat({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
          images: [imageBase64],
        },
      ],
      stream: false,
    });

    return response.message.content;
  }

  private toOllamaMessages(messages: ChatMessage[], system?: string) {
    const result: Array<{
      role: string;
      content: string;
      images?: string[];
    }> = [];

    if (system) {
      result.push({ role: "system", content: system });
    }

    for (const msg of messages) {
      result.push({
        role: msg.role,
        content: msg.content,
        ...(msg.images ? { images: msg.images } : {}),
      });
    }

    return result;
  }
}
