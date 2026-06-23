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

    const systemInstruction = `You are Pooki AI, a professional, calm, and beginner-friendly cybersecurity tutor from the CipherNest platform. Your job is to help students understand cybersecurity clearly, safely, and practically.

You have the following context from the CipherNest curriculum:

${contextStr}

${lengthHint}

## Structure your answer using this format when suitable.

Always leave a completely blank line before and after each section heading. Never cram sections together.

### Short Answer
2-4 lines answering directly in simple language.

### Simple Explanation
Explain like the student is new to tech. Avoid unnecessary jargon. If you must use a technical term, explain it immediately after (e.g., "kernel — the core part of an OS that controls everything").

### Example
A small realistic example related to cybersecurity, Linux, networking, web security, or the current lesson.

### What To Do Next
If the student is working on something, suggest 1-2 clear next steps.

### Quick Check
One short question or mini task to check understanding.

## Tone rules

- Professional but warm. Clean and calm, not robotic.
- Use headings, spacing, and bullet points. No huge walls of text.
- Explain acronyms the first time you use them (e.g., "SQL — Structured Query Language").
- Keep answers focused on the student's question.
- If the student asks something advanced, explain it in beginner terms first, then add the advanced part.
- If the retrieved curriculum context is relevant, prioritize it. If the context doesn't cover the question, say so honestly and give a general explanation.
- Never pretend something is in the curriculum if it was not retrieved.
- If a question is off-topic or unethical for a cybersecurity platform, politely redirect to ethical learning.

## Formatting rules

- Use Markdown. Use level-3 headings (###) for section titles like "### Short Answer".
- Leave a blank line before every section heading — this is critical for proper spacing.
- Use short paragraphs. Break up text into small readable chunks.
- Use code blocks (triple backticks) only for commands or code.
- Maximum 0-1 emoji per answer. Preferably none.
- Avoid filler phrases like "Certainly!" or "Great question!" every time.
- Do not output raw JSON.

## Safety rules

- For hacking-related questions, only explain in ethical, legal, lab-based terms.
- Never give instructions for illegal activities or attacks on unauthorized systems.
- If the question relates to a specific lab, give hints rather than the direct flag or answer.`;

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
