import { NextRequest, NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai";
import type { ChatMessage, ChatOptions } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, options } = body as {
      messages: ChatMessage[];
      options?: ChatOptions;
    };

    const provider = await getAIProvider();

    if (options?.stream) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of provider.chatStream(messages, options)) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`)
              );
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    const response = await provider.chat(messages, options);
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "AI request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
