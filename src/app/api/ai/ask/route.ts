import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { generateAnswerStream, detectAnswerLength } from "@/lib/ai/gemini";
import { getAllChunks, findRelevantChunks, formatChunksForContext } from "@/lib/ai/chunk";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question, sessionContext } = await req.json();
    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    let relevantChunks: { content: string; source: string; chunkType: string; weekId: number }[] = [];

    const useRag = process.env.USE_RAG !== "false";
    const apiKey = process.env.GEMINI_API_KEY;

    const needsRag = !sessionContext?.currentLab && !sessionContext?.currentLesson;

    if (useRag && apiKey && needsRag) {
      try {
        const embedding = await generateEmbedding(question);

        const { data: chunks } = await supabase.rpc("match_knowledge_chunks", {
          query_embedding: embedding,
          match_threshold: 0.5,
          match_count: 5,
        });

        if (chunks && chunks.length > 0) {
          relevantChunks = chunks;
        } else {
          const allChunks = getAllChunks();
          relevantChunks = findRelevantChunks(question, allChunks);
        }
      } catch {
        const allChunks = getAllChunks();
        relevantChunks = findRelevantChunks(question, allChunks);
      }
    }

    if (sessionContext?.currentLab && relevantChunks.length === 0) {
      const allChunks = getAllChunks();
      relevantChunks = allChunks.filter(
        (c) => c.source.includes(`lab-${sessionContext.currentLab}`),
      );
    }

    if (sessionContext?.currentLesson && relevantChunks.length === 0) {
      const allChunks = getAllChunks();
      relevantChunks = allChunks.filter(
        (c) => c.source.includes(`lesson-${sessionContext.currentLesson}`),
      );
    }

    const contextStr =
      relevantChunks.length > 0
        ? formatChunksForContext(relevantChunks as any)
        : "No specific curriculum context available.";

    const length = detectAnswerLength(question);

    const lengthHint =
      length === "short"
        ? "The user wants a short answer. Keep it very brief."
        : length === "detailed"
          ? "The user wants a detailed explanation. Go deeper."
          : "Give a medium-length, well-structured answer.";

    const systemInstruction = `You are Pooki AI, a direct, no-fluff cybersecurity tutor on CipherNest. Your job is to answer questions concisely like a knowledgeable peer — not write essays.

Curriculum context:
${contextStr}

${lengthHint}

## Rules
- Answer in 1-3 sentences unless the question requires more depth.
- NO section headings (no "Short Answer", "Simple Explanation", etc). Just answer directly.
- NO filler phrases like "Great question!" or "Certainly". Answer immediately.
- Zero emoji. Zero exclamation marks.
- Use backticks for commands and code terms.
- If the context is relevant, use it. If not, give a plain answer.
- For lab questions: give hints, not flags.
- If unethical: say "I can't help with that." and nothing else.`;

    const sources = relevantChunks
      .filter((c) => c.source !== "platform-overview" && c.source !== "gamification-system")
      .map((c) => ({
        title: c.source,
        type: c.chunkType,
        week: c.weekId,
      }));

    const geminiStream = await generateAnswerStream(question, systemInstruction, length);

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = geminiStream.getReader();
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
          if (sources.length > 0) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "done", sources })}\n\n`,
              ),
            );
          }
        } catch (error) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", message: error instanceof Error ? error.message : "Stream error" })}\n\n`,
            ),
          );
        } finally {
          controller.close();
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
  } catch (error) {
    console.error("AI ask error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
