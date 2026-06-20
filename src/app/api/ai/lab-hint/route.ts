import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateAnswer } from "@/lib/ai/gemini";
import { getAllChunks, formatChunksForContext } from "@/lib/ai/chunk";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { labId, userInput, userStuck } = await req.json();
    if (!labId) {
      return NextResponse.json({ error: "labId is required" }, { status: 400 });
    }

    const allChunks = getAllChunks();
    const labChunks = allChunks.filter((c) => c.source.includes(`lab-${labId}`));
    const weekChunks = allChunks.filter(
      (c) => c.weekId > 0 && (c.chunkType === "lesson" || c.chunkType === "reference"),
    );

    const contextStr = formatChunksForContext(labChunks.length > 0 ? labChunks : weekChunks.slice(0, 5) as any);

    const systemInstruction = `You are OpenCyber AI Lab Assistant. You help users complete cybersecurity labs without giving away the flag directly.

Lab context:
${contextStr}

User's current input: ${userInput || "none yet"}
User stuck: ${userStuck ? "Yes, they need help" : "No"}

Rules:
- Guide the user step by step. Give hints, not direct answers.
- NEVER reveal the flag or expected output directly.
- Explain the concepts they need to understand to solve it.
- If they show you a command attempt, explain what it does and whether it's on the right track.
- Use the lab context to give specific, relevant hints.
- Format code examples with triple backticks.`;

    const prompt = userStuck
      ? `The user is stuck on lab "${labId}". They say: "${userInput || "I need help"}". Give them a progressive hint (start subtle, escalate only if needed).`
      : `The user is working on lab "${labId}" and entered: "${userInput || "nothing yet"}". Offer guidance or next steps.`;

    const answer = await generateAnswer(prompt, systemInstruction);

    return NextResponse.json({ hint: answer });
  } catch (error) {
    console.error("Lab hint error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
