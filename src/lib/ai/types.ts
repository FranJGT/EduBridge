export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  images?: string[]; // base64 encoded
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

export interface ToolCall {
  id: string;
  function: {
    name: string;
    arguments: Record<string, unknown>;
  };
}

export interface ToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, unknown>;
      required?: string[];
    };
  };
}

export interface ChatOptions {
  system?: string;
  tools?: ToolDefinition[];
  stream?: boolean;
  temperature?: number;
}

export interface ChatResponse {
  content: string;
  tool_calls?: ToolCall[];
  done: boolean;
}

export interface StreamChunk {
  content: string;
  done: boolean;
}

export interface AIProvider {
  /** Text chat with optional system prompt */
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse>;

  /** Stream chat response */
  chatStream(
    messages: ChatMessage[],
    options?: ChatOptions
  ): AsyncGenerator<StreamChunk>;

  /** Analyze an image (handwriting, diagrams, etc.) */
  analyzeImage(imageBase64: string, prompt: string): Promise<string>;

  /** Check if the provider is available */
  isAvailable(): Promise<boolean>;

  /** Provider name for display */
  name: string;
}
