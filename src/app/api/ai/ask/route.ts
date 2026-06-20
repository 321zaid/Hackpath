import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { generateAnswer } from "@/lib/ai/gemini";
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

    const systemInstruction = `You are OpenCyber AI, a cybersecurity tutor on the OpenCyber platform. You help users learn ethical hacking and cybersecurity.

You have the following context from the OpenCyber curriculum:

${contextStr}

Rules:
- Answer based on the provided curriculum context. If the answer isn't in the context, say so and offer general cybersecurity knowledge.
- Be concise but thorough. Use bullet points and code examples when helpful.
- If the user asks about something dangerous/illegal (beyond ethical hacking scope), redirect them to legal testing practices.
- NEVER provide instructions for illegal activities or attacks on systems without authorization.
- ALWAYS remind users to only test systems they own or have permission to test.
- If the question relates to a specific lab, give hints rather than the direct flag.
- Format code blocks with triple backticks and the appropriate language.`;

    const answer = await generateAnswer(question, systemInstruction);

    const sources = relevantChunks
      .filter((c) => c.source !== "platform-overview" && c.source !== "gamification-system")
      .map((c) => ({
        title: c.source,
        type: c.chunkType,
        week: c.weekId,
      }));

    return NextResponse.json({ answer, sources });
  } catch (error) {
    console.error("AI ask error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
