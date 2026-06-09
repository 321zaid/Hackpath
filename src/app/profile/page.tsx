"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Zap, Brain, Flame, Shield, Award, BookOpen, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimatedLightRays from "@/components/AnimatedLightRays";
import ProgressCard from "@/components/ProgressCard";
import XPBar from "@/components/XPBar";
import BadgeCard from "@/components/BadgeCard";
import ScrollReveal from "@/components/ScrollReveal";
import { badges } from "@/data/badges";
import { curriculum } from "@/data/curriculum";
import { getLevel } from "@/lib/utils";
import { fetchProgress, fetchProfile, fetchLeaderboard, type ProgressData } from "@/lib/supabase/progress";

export default function ProfilePage() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [username, setUsername] = useState("");
  const [rank, setRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [p, profile, leaderboard] = await Promise.all([
        fetchProgress(),
        fetchProfile(),
        fetchLeaderboard(),
      ]);
      setProgress(p);
      if (profile?.username) setUsername(profile.username);
      const userRank = leaderboard.findIndex((e) => e.username === profile?.username) + 1;
      setRank(userRank > 0 ? userRank : null);
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !progress) {
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

  const { name: levelName, level } = getLevel(progress.total_xp);
  const allLessons = curriculum.flatMap((w) => w.lessons);
  const allLabs = curriculum.flatMap((w) => w.labs);
  const completedWeeks = curriculum.filter((w) =>
    w.lessons.every((l) => progress.completed_lessons.includes(l.id)) &&
    w.labs.every((l) => progress.completed_labs.includes(l.id)) &&
    progress.completed_quizzes.includes(w.quiz.id)
  ).length;

  return (
    <>
      <AnimatedLightRays />
      <Navbar />
      <main className="min-h-screen pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full border-2 border-accent/30 bg-accent-dim flex items-center justify-center">
                  <User className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold font-mono text-foreground">
                    {username}
                  </h1>
                  <p className="text-sm text-[var(--color-gray-500)] font-mono">
                    Level {level} {levelName} · {completedWeeks}/12 weeks completed
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <ProgressCard label="Total XP" value={progress.total_xp} icon={<Zap className="w-4 h-4" />} />
              <ProgressCard label="Level" value={level} sublabel={levelName} icon={<Brain className="w-4 h-4" />} />
              <ProgressCard label="Streak" value={`${progress.streak} days`} icon={<Flame className="w-4 h-4" />} />
              <ProgressCard label="Rank" value={rank ? `#${rank}` : "—"} sublabel={rank ? "Leaderboard" : "Unranked"} icon={<Shield className="w-4 h-4" />} />
            </div>

            <div className="mb-6">
              <XPBar currentXP={progress.total_xp} maxXP={10000} level={level} levelName={levelName} />
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <ScrollReveal delay={0.1}>
                <div className="border border-border bg-surface rounded-xl p-6">
                  <h2 className="text-lg font-bold text-accent font-mono mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Progress
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-[var(--color-gray-400)]">Lessons</span>
                        <span className="text-accent">{progress.completed_lessons.length} / {allLessons.length}</span>
                      </div>
                      <div className="h-1.5 bg-[var(--color-overlay)] border border-accent/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-accent rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(progress.completed_lessons.length / allLessons.length) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-[var(--color-gray-400)]">Labs</span>
                        <span className="text-accent">{progress.completed_labs.length} / {allLabs.length}</span>
                      </div>
                      <div className="h-1.5 bg-[var(--color-overlay)] border border-accent/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-accent rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(progress.completed_labs.length / allLabs.length) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-[var(--color-gray-400)]">Weeks Completed</span>
                        <span className="text-accent">{completedWeeks} / 12</span>
                      </div>
                      <div className="h-1.5 bg-[var(--color-overlay)] border border-accent/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-accent rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(completedWeeks / 12) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div className="border border-border bg-surface rounded-xl p-6">
                  <h2 className="text-lg font-bold text-accent font-mono mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Future Features
                  </h2>
                  <div className="space-y-3 text-sm text-[var(--color-gray-500)] font-mono">
                    <div className="p-3 border border-dashed border-border rounded-lg">
                      <p className="text-yellow-500/60">Certificate of Completion</p>
                      <p className="text-xs text-[var(--color-gray-600)] mt-1">Complete all 12 weeks to unlock</p>
                    </div>
                    <div className="p-3 border border-dashed border-border rounded-lg">
                      <p className="text-blue-500/60">Portfolio Builder</p>
                      <p className="text-xs text-[var(--color-gray-600)] mt-1">Showcase your write-ups and achievements</p>
                    </div>
                    <div className="p-3 border border-dashed border-border rounded-lg">
                      <p className="text-purple-500/60">Mentorship Program</p>
                      <p className="text-xs text-[var(--color-gray-600)] mt-1">Connect with graduates and mentors</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.2}>
              <div className="border border-border bg-surface rounded-xl p-6">
                <h2 className="text-lg font-bold text-accent font-mono mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  Badges ({progress.badges.length}/{badges.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {badges.map((badge) => (
                    <BadgeCard
                      key={badge.id}
                      badge={badge}
                      earned={progress.badges.includes(badge.id)}
                    />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </motion.div>
        </div>
      </main>
    </>
  );
}
