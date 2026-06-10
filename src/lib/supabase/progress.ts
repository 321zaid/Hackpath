import { createClient } from "./client";

type ItemType = "lesson" | "lab" | "quiz";

export interface ProgressData {
  current_week: number;
  total_xp: number;
  level: number;
  streak: number;
  last_login_date: string;
  completed_lessons: string[];
  completed_labs: string[];
  completed_quizzes: string[];
  badges: string[];
}

const defaultProgress: ProgressData = {
  current_week: 1,
  total_xp: 0,
  level: 1,
  streak: 0,
  last_login_date: new Date().toISOString().split("T")[0],
  completed_lessons: [],
  completed_labs: [],
  completed_quizzes: [],
  badges: [],
};

function computeLevel(xp: number): number {
  if (xp >= 10000) return 5;
  if (xp >= 5000) return 4;
  if (xp >= 2000) return 3;
  if (xp >= 500) return 2;
  return 1;
}

async function getUserId(): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

export async function fetchProgress(): Promise<ProgressData> {
  const supabase = createClient();
  const userId = await getUserId();
  if (!userId) return { ...defaultProgress };

  try {
    const [progressResult, completedResult, badgesResult] = await Promise.all([
      supabase.from("user_progress").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("completed_items").select("item_type, item_id").eq("user_id", userId),
      supabase.from("user_badges").select("badge_id").eq("user_id", userId),
    ]);

    const progress = progressResult.data;
    const completed = completedResult.data;
    const badges = badgesResult.data;

    const completedLessons =
      completed?.filter((c) => c.item_type === "lesson").map((c) => c.item_id) ?? [];
    const completedLabs =
      completed?.filter((c) => c.item_type === "lab").map((c) => c.item_id) ?? [];
    const completedQuizzes =
      completed?.filter((c) => c.item_type === "quiz").map((c) => c.item_id) ?? [];
    const userBadges = badges?.map((b) => b.badge_id) ?? [];

    return {
      current_week: progress?.current_week ?? 1,
      total_xp: progress?.total_xp ?? 0,
      level: progress?.level ?? computeLevel(progress?.total_xp ?? 0),
      streak: progress?.streak ?? 0,
      last_login_date:
        progress?.last_login_date ?? new Date().toISOString().split("T")[0],
      completed_lessons: completedLessons,
      completed_labs: completedLabs,
      completed_quizzes: completedQuizzes,
      badges: userBadges,
    };
  } catch {
    return { ...defaultProgress };
  }
}

export async function completeItem(
  itemType: ItemType,
  itemId: string,
  xpEarned: number,
): Promise<ProgressData> {
  const supabase = createClient();
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("completed_items")
    .select("id")
    .eq("user_id", userId)
    .eq("item_type", itemType)
    .eq("item_id", itemId)
    .maybeSingle();

  if (!existing) {
    await supabase.from("completed_items").insert({
      user_id: userId,
      item_type: itemType,
      item_id: itemId,
      xp_earned: xpEarned,
    });

    const { data: current } = await supabase
      .from("user_progress")
      .select("total_xp")
      .eq("user_id", userId)
      .maybeSingle();

    const newTotal = (current?.total_xp ?? 0) + xpEarned;
    const newLevel = computeLevel(newTotal);

    await supabase
      .from("user_progress")
      .update({ total_xp: newTotal, level: newLevel })
      .eq("user_id", userId);
  }

  return fetchProgress();
}

export async function awardBadge(badgeId: string): Promise<ProgressData> {
  const supabase = createClient();
  const userId = await getUserId();
  if (!userId) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("user_badges")
    .select("id")
    .eq("user_id", userId)
    .eq("badge_id", badgeId)
    .maybeSingle();

  if (!existing) {
    await supabase.from("user_badges").insert({
      user_id: userId,
      badge_id: badgeId,
    });

    await supabase.rpc("increment_xp", { amount: 100, uid: userId });
  }

  return fetchProgress();
}

export interface LeaderboardEntry {
  username: string;
  total_xp: number;
  level: number;
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = createClient();

  try {
    const { data } = await supabase
      .from("user_progress")
      .select("total_xp, level, user_id")
      .order("total_xp", { ascending: false })
      .limit(50);

    if (!data || data.length === 0) return [];

    const userIds = data.map((d) => d.user_id);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", userIds);

    const profileMap = new Map(profiles?.map((p) => [p.id, p.username]) ?? []);

    return data.map((entry) => ({
      username: profileMap.get(entry.user_id) ?? "unknown",
      total_xp: entry.total_xp,
      level: entry.level,
    }));
  } catch {
    return [];
  }
}

export async function fetchProfile() {
  const supabase = createClient();
  const userId = await getUserId();
  if (!userId) return null;

  try {
    const [profileResult, progressResult] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("user_progress").select("*").eq("user_id", userId).maybeSingle(),
    ]);

    const profile = profileResult.data;
    const progress = progressResult.data;

    return {
      id: userId,
      username: profile?.username ?? "unknown",
      display_name: profile?.display_name ?? null,
      progress: progress ?? null,
    };
  } catch {
    return null;
  }
}
