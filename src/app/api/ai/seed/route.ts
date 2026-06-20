import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { getAllChunks } from "@/lib/ai/chunk";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const seedSecret = process.env.SEED_SECRET;

    if (!seedSecret || !authHeader || authHeader !== `Bearer ${seedSecret}`) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = createAdminClient();

    const { count: existingCount } = await supabase
      .from("knowledge_chunks")
      .select("*", { count: "exact", head: true });

    if (existingCount && existingCount > 0) {
      return NextResponse.json({
        message: "Knowledge base already seeded",
        count: existingCount,
      });
    }

    const chunks = getAllChunks();
    const total = chunks.length;
    const logs: string[] = [];

    const rows: Record<string, unknown>[] = [];

    for (let i = 0; i < total; i++) {
      const chunk = chunks[i];
      const log = `Embedding chunk ${i + 1}/${total} (${chunk.source})`;
      console.log(log);
      logs.push(log);

      const embedding = await generateEmbedding(chunk.content);

      rows.push({
        content: chunk.content,
        source: chunk.source,
        chunk_type: chunk.chunkType,
        week_id: chunk.weekId,
        embedding,
        metadata: chunk.metadata,
      });
    }

    const batchSize = 20;
    let inserted = 0;

    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      const { error } = await supabase.from("knowledge_chunks").insert(batch);
      if (error) {
        console.error(`Batch insert error at index ${i}:`, error);
        throw error;
      }
      inserted += batch.length;
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(total / batchSize)}`);
    }

    return NextResponse.json({
      message: "Knowledge base seeded successfully",
      count: inserted,
      logs,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
