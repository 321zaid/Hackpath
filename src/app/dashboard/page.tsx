"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Beaker, Brain, Zap, Flame, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimatedLightRays from "@/components/AnimatedLightRays";
import ProgressCard from "@/components/ProgressCard";
import XPBar from "@/components/XPBar";
import CyberButton from "@/components/CyberButton";
import ScrollReveal from "@/components/ScrollReveal";
import { curriculum } from "@/data/curriculum";
import { getLevel } from "@/lib/utils";
import { fetchProgress, fetchProfile, type ProgressData } from "@/lib/supabase/progress";

export default function DashboardPage() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [username, setUsername] = useState("Agent");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [p, profile] = await Promise.all([fetchProgress(), fetchProfile()]);
        if (cancelled) return;
        setProgress(p);
        if (profile?.username) setUsername(profile.username);
      } catch {
        // session or network error — keep default state
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading || !progress) {
    return (
      <>
        <AnimatedLightRays />
        <Navbar />
        <main className="min-h-screen pt-24 px-4 pb-12">
          <div className="max-w-5xl mx-auto flex items-center justify-center h-64">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        </main>
      </>
    );
  }

  const { name: levelName, level } = getLevel(progress.total_xp);
  const currentWeek = curriculum.find((w) => w.id === progress.current_week);
  const nextWeekXP = progress.current_week < 12 ? 500 * (progress.current_week + 1) : 10000;
  const completedCount = progress.completed_lessons.length;

  const weekProgress = currentWeek
    ? getWeekProgressCalc(currentWeek.id, currentWeek, progress)
    : 0;

  const allLessons = curriculum.flatMap((w) => w.lessons);
  const totalLessons = allLessons.length;

  return (
    <>
      <AnimatedLightRays />
      <Navbar />
      <main className="min-h-screen pt-24 px-4 pb-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-2xl font-bold font-mono">
                    <span className="text-foreground">Welcome back,</span>{" "}
                    <span className="text-accent">{username}</span>
                  </h1>
                  <p className="text-sm text-[var(--color-gray-500)] font-mono mt-1">
                    Continue your hacking journey
                  </p>
                </motion.div>
              </div>
              <Link href="/profile">
                <CyberButton variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                  View Profile
                </CyberButton>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <ScrollReveal delay={0.1}>
                <ProgressCard label="Total XP" value={progress.total_xp} icon={<Zap className="w-4 h-4" />} />
              </ScrollReveal>
              <ScrollReveal delay={0.15}>
                <ProgressCard label="Level" value={level} sublabel={levelName} icon={<Brain className="w-4 h-4" />} />
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <ProgressCard label="Streak" value={`${progress.streak} days`} icon={<Flame className="w-4 h-4" />} />
              </ScrollReveal>
              <ScrollReveal delay={0.25}>
                <ProgressCard label="Completed" value={`${completedCount}/${totalLessons}`} sublabel="Lessons" icon={<BookOpen className="w-4 h-4" />} />
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.3}>
              <div className="mb-6">
                <XPBar currentXP={progress.total_xp} maxXP={nextWeekXP} level={level} levelName={levelName} />
              </div>
            </ScrollReveal>

            {currentWeek && (
              <ScrollReveal delay={0.35}>
                <motion.div
                  className="relative border border-border bg-surface rounded-xl p-6 mb-6 overflow-hidden cyber-glow"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-dim via-transparent to-transparent opacity-60" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-4 h-4 text-accent" />
                          <p className="text-xs text-accent font-mono tracking-wider uppercase">Current Week</p>
                        </div>
                        <h2 className="text-lg font-bold text-foreground font-mono">
                          Week {currentWeek.id}: {currentWeek.title}
                        </h2>
                      </div>
                      <Link href={`/week/${currentWeek.id}`}>
                        <CyberButton variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                          Continue
                        </CyberButton>
                      </Link>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-[var(--color-gray-500)]">Week Progress</span>
                        <span className="text-accent">{weekProgress}%</span>
                      </div>
                      <div className="h-2 bg-[var(--color-overlay)] border border-border rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-accent/60 to-accent rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${weekProgress}%` }}
                          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <ScrollReveal delay={0.4}>
                <Link
                  href="/roadmap"
                  className="group block border border-border bg-surface rounded-xl p-5 hover:cyber-glow transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-accent-dim flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-foreground font-mono font-semibold">Roadmap</h3>
                  </div>
                  <p className="text-sm text-[var(--color-gray-500)] font-mono pl-[52px]">
                    View all 12 weeks and track your progress
                  </p>
                </Link>
              </ScrollReveal>
              <ScrollReveal delay={0.45}>
                <Link
                  href="/leaderboard"
                  className="group block border border-border bg-surface rounded-xl p-5 hover:cyber-glow transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-accent-dim flex items-center justify-center">
                      <Beaker className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-foreground font-mono font-semibold">Leaderboard</h3>
                  </div>
                  <p className="text-sm text-[var(--color-gray-500)] font-mono pl-[52px]">
                    See how you rank against other hackers
                  </p>
                </Link>
              </ScrollReveal>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}

function getWeekProgressCalc(weekId: number, week: typeof curriculum[0], progress: ProgressData) {
  const totalLessons = week.lessons.length;
  const totalLabs = week.labs.length;
  const completedLessons = week.lessons.filter((l) =>
    progress.completed_lessons.includes(l.id)
  ).length;
  const completedLabs = week.labs.filter((l) =>
    progress.completed_labs.includes(l.id)
  ).length;
  const completedQuiz = progress.completed_quizzes.includes(week.quiz.id) ? 1 : 0;
  const total = totalLessons + totalLabs + 1;
  const completed = completedLessons + completedLabs + completedQuiz;
  return Math.round((completed / total) * 100);
}
