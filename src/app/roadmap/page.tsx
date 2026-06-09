"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Compass, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimatedLightRays from "@/components/AnimatedLightRays";
import RoadmapCard from "@/components/RoadmapCard";
import ScrollReveal from "@/components/ScrollReveal";
import { curriculum } from "@/data/curriculum";
import { fetchProgress, type ProgressData } from "@/lib/supabase/progress";

export default function RoadmapPage() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress().then((p) => {
      setProgress(p);
      setLoading(false);
    });
  }, []);

  function getWeekStatus(weekId: number, p: ProgressData) {
    if (weekId < p.current_week) return "completed";
    if (weekId === p.current_week) return "active";
    return "locked";
  }

  function getWeekProgress(week: typeof curriculum[0], p: ProgressData) {
    const totalLessons = week.lessons.length;
    const totalLabs = week.labs.length;
    const completedLessons = week.lessons.filter((l) =>
      p.completed_lessons.includes(l.id)
    ).length;
    const completedLabs = week.labs.filter((l) =>
      p.completed_labs.includes(l.id)
    ).length;
    const completedQuiz = p.completed_quizzes.includes(week.quiz.id) ? 1 : 0;
    const total = totalLessons + totalLabs + 1;
    const completed = completedLessons + completedLabs + completedQuiz;
    return Math.round((completed / total) * 100);
  }

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

  return (
    <>
      <AnimatedLightRays />
      <Navbar />
      <main className="min-h-screen pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Compass className="w-6 h-6 text-accent" />
              <h1 className="text-2xl font-bold font-mono">
                <span className="text-foreground">12-Week</span>{" "}
                <span className="text-accent">Roadmap</span>
              </h1>
            </div>
            <p className="text-[var(--color-gray-500)] font-mono text-sm mb-2 max-w-xl">
              Your structured path from beginner to ethical hacker. Complete each week to unlock the next.
            </p>
            <div className="flex items-center gap-2 mb-10 text-xs text-[var(--color-gray-600)] font-mono">
              <MapPin className="w-3 h-3" />
              <span>12 weeks · ~140 hours total</span>
            </div>

            <div className="space-y-4 relative">
              <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-accent/30 via-accent/10 to-transparent hidden sm:block" />
              {curriculum.map((week, index) => {
                const status = getWeekStatus(week.id, progress);
                const weekProg = getWeekProgress(week, progress);
                return (
                  <ScrollReveal key={week.id} delay={index * 0.06} direction="up">
                    <RoadmapCard
                      weekId={week.id}
                      title={week.title}
                      tagline={week.tagline}
                      progress={weekProg}
                      status={status as "locked" | "active" | "completed"}
                      xpReward={week.xpReward}
                    />
                  </ScrollReveal>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
