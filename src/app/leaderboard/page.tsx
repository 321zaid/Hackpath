"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimatedLightRays from "@/components/AnimatedLightRays";
import ScrollReveal from "@/components/ScrollReveal";
import { getLevel, cn } from "@/lib/utils";
import { fetchLeaderboard, fetchProfile } from "@/lib/supabase/progress";

interface LeaderboardUser {
  username: string;
  total_xp: number;
  level: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [currentUsername, setCurrentUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [leaderboard, profile] = await Promise.all([
        fetchLeaderboard(),
        fetchProfile(),
      ]);
      setUsers(leaderboard);
      if (profile?.username) setCurrentUsername(profile.username);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <>
        <AnimatedLightRays />
        <Navbar />
        <main className="min-h-screen pt-24 px-4 pb-12 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </main>
      </>
    );
  }

  const weekly = [...users];
  const allTime = [...users];

  const rankIcon = (rank: number) => {
    if (rank === 0) return <Trophy className="w-4 h-4 text-yellow-400" />;
    if (rank === 1) return <Medal className="w-4 h-4 text-[var(--color-gray-300)]" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-amber-600" />;
    return <span className="text-[var(--color-gray-600)] text-sm w-4 text-center">{rank + 1}</span>;
  };

  const UserRow = ({ user, rank }: { user: LeaderboardUser; rank: number }) => {
    const { name } = getLevel(user.total_xp);
    const isCurrentUser = user.username === currentUsername;
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: rank * 0.05 }}
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border transition-all font-mono",
          isCurrentUser
            ? "border-accent/30 bg-accent-dim"
            : "border-border bg-surface hover:border-accent/20"
        )}
      >
        <div className="w-8 flex justify-center">{rankIcon(rank)}</div>
        <div className="w-8 h-8 rounded-full border border-accent/20 bg-accent-dim flex items-center justify-center">
          <User className="w-4 h-4 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm truncate",
              isCurrentUser ? "text-accent" : "text-foreground"
            )}>
              {user.username}
            </span>
            {isCurrentUser && (
              <span className="px-1.5 py-0.5 text-[10px] border border-accent/30 text-accent rounded">
                YOU
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-gray-500)]">
            <span>Lvl {user.level} {name}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-foreground">{user.total_xp.toLocaleString()}</div>
          <div className="text-[10px] text-[var(--color-gray-600)]">XP</div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <AnimatedLightRays />
      <Navbar />
      <main className="min-h-screen pt-24 px-4 pb-12">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-8">
              <Trophy className="w-6 h-6 text-accent" />
              <h1 className="text-2xl font-bold font-mono text-foreground">
                Leader<span className="text-accent">board</span>
              </h1>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <ScrollReveal delay={0.1}>
                <div className="border border-border bg-surface rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-border bg-accent-dim">
                    <h2 className="text-sm font-bold text-accent font-mono">Weekly Rankings</h2>
                  </div>
                  <div className="p-3 space-y-2">
                    {weekly.slice(0, 5).map((user, i) => (
                      <UserRow key={user.username} user={user} rank={i} />
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div className="border border-border bg-surface rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-border bg-accent-dim">
                    <h2 className="text-sm font-bold text-accent font-mono">All-Time Rankings</h2>
                  </div>
                  <div className="p-3 space-y-2">
                    {allTime.map((user, i) => (
                      <UserRow key={user.username} user={user} rank={i} />
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.2}>
              <div className="border border-border bg-surface rounded-xl p-4">
                <h3 className="text-sm text-accent font-mono font-semibold mb-2 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" />
                  XP Leader
                </h3>
                <p className="text-sm text-[var(--color-gray-500)] font-mono">
                  {allTime[0]?.username ?? "—"} leads with {allTime[0]?.total_xp?.toLocaleString() ?? 0} XP
                </p>
              </div>
            </ScrollReveal>
          </motion.div>
        </div>
      </main>
    </>
  );
}
