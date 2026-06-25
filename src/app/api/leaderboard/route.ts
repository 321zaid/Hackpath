import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface LeaderboardEntry {
  username: string;
  total_xp: number;
  level: number;
}

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: progressData, error: progressError } = await supabase
      .from("user_progress")
      .select("user_id, total_xp, level")
      .order("total_xp", { ascending: false })
      .limit(50);

    if (progressError || !progressData) {
      return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }

    if (progressData.length === 0) {
      return NextResponse.json([]);
    }

    const userIds = progressData.map((d) => d.user_id);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", userIds);

    const profileMap = new Map(profiles?.map((p) => [p.id, p.username]) ?? []);

    const leaderboard: LeaderboardEntry[] = progressData.map((entry) => ({
      username: profileMap.get(entry.user_id) ?? "unknown",
      total_xp: entry.total_xp,
      level: entry.level,
    }));

    return NextResponse.json(leaderboard);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
