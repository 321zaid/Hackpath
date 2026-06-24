"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Beaker, Brain, Award, Target, ChevronRight, CheckCircle, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimatedLightRays from "@/components/AnimatedLightRays";
import LessonCard from "@/components/LessonCard";
import ProgressCard from "@/components/ProgressCard";
import ScrollReveal from "@/components/ScrollReveal";
import { curriculum } from "@/data/curriculum";
import { fetchProgress, type ProgressData } from "@/lib/supabase/progress";
import { cn } from "@/lib/utils";

export default function WeekPage() {
  const params = useParams();
  const router = useRouter();
  const weekId = parseInt(params.id as string);
  const week = curriculum.find((w) => w.id === weekId);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchProgress().then((p) => {
      if (!cancelled) setProgress(p);
    }).catch(() => {
      // keep defaults
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  if (loading || !progress) {
    return (
      <>
        <AnimatedLightRays />
        <Navbar />
        <main className="min-h-screen pt-24 px-4 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </main>
      </>
    );
  }

  if (!week) {
    return (
      <>
        <AnimatedLightRays />
        <Navbar />
        <main className="min-h-screen pt-24 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-red-400 font-mono">Week not found.</p>
            <Link href="/roadmap" className="text-accent font-mono underline mt-4 block">
              Back to Roadmap
            </Link>
          </div>
        </main>
      </>
    );
  }

  const completedLessons = week.lessons.filter((l) => progress.completed_lessons.includes(l.id));
  const completedLabs = week.labs.filter((l) => progress.completed_labs.includes(l.id));
  const quizCompleted = progress.completed_quizzes.includes(week.quiz.id);

  return (
    <>
      <AnimatedLightRays />
      <Navbar />
      <main className="min-h-screen pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-gray-400)] hover:text-accent font-mono mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Roadmap
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative border border-border bg-surface rounded-xl p-6 mb-8 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-dim via-transparent to-transparent opacity-40" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="px-3 py-1 border border-accent/30 text-accent text-xs font-mono rounded-lg bg-accent-dim">
                    Week {week.id}
                  </div>
                  {week.badgeReward && (
                    <div className="px-3 py-1 border border-yellow-500/30 text-yellow-500 text-xs font-mono rounded-lg">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Badge: {week.badgeReward.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </div>
                  )}
                  <div className="px-3 py-1 border border-accent/20 text-accent/60 text-xs font-mono rounded-lg">
                    +{week.xpReward} XP
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-foreground font-mono mb-2">{week.title}</h1>
                <p className="text-[var(--color-gray-400)] font-mono text-sm mb-3">{week.tagline}</p>
                <p className="text-[var(--color-gray-500)] font-mono text-sm leading-relaxed">{week.objective}</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <ScrollReveal delay={0.1}>
                <ProgressCard label="Lessons" value={`${completedLessons.length}/${week.lessons.length}`} icon={<BookOpen className="w-4 h-4" />} />
              </ScrollReveal>
              <ScrollReveal delay={0.15}>
                <ProgressCard label="Labs" value={`${completedLabs.length}/${week.labs.length}`} icon={<Beaker className="w-4 h-4" />} />
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <ProgressCard label="Quiz" value={quizCompleted ? "Passed" : "Pending"} icon={<Brain className="w-4 h-4" />} />
              </ScrollReveal>
              <ScrollReveal delay={0.25}>
                <ProgressCard label="Reward" value={`+${week.xpReward} XP`} icon={<Award className="w-4 h-4" />} />
              </ScrollReveal>
            </div>

            <div className="space-y-6">
              <ScrollReveal delay={0.3}>
                <section>
                  <h2 className="text-lg font-bold text-accent font-mono mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Core Topics
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {week.topics.map((topic) => (
                      <span
                        key={topic}
                          className="px-3 py-1 text-xs border border-accent/20 bg-accent-dim text-[var(--color-gray-300)] font-mono rounded-lg"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </section>
              </ScrollReveal>

              {(week.days ?? []).length > 0 ? (
                week.days!.map((day, di) => {
                  const dayLessons = week.lessons.filter((l) => l.day === day.day);
                  const dayLabs = week.labs.filter((l) => l.day === day.day);
                  if (dayLessons.length === 0 && dayLabs.length === 0) return null;
                  return (
                    <section key={di}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="px-2 py-0.5 border border-accent/20 text-accent text-[10px] font-mono rounded">
                          Day {day.day}
                        </div>
                        <h3 className="text-sm font-bold text-foreground font-mono">{day.title}</h3>
                      </div>
                      <div className="space-y-2 mb-6">
                        {dayLessons.map((lesson, i) => (
                          <ScrollReveal key={lesson.id} delay={0.01 * i}>
                            <LessonCard
                              id={lesson.id}
                              title={lesson.title}
                              xpReward={lesson.xpReward}
                              completed={progress.completed_lessons.includes(lesson.id)}
                              onClick={() => router.push(`/lesson/${lesson.id}`)}
                            />
                          </ScrollReveal>
                        ))}
                        {dayLabs.map((lab, i) => (
                          <motion.button
                            key={lab.id}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => router.push(`/lab/${lab.id}`)}
                            className={cn(
                              "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all font-mono group",
                              progress.completed_labs.includes(lab.id)
                                ? "border-accent/20 bg-accent-dim opacity-60"
                                : "border-border bg-surface hover:border-accent/30 hover:bg-accent/5"
                            )}
                          >
                            {progress.completed_labs.includes(lab.id) ? (
                              <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                            ) : (
                              <Beaker className="w-5 h-5 text-[var(--color-gray-600)] shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-sm truncate", progress.completed_labs.includes(lab.id) ? "text-[var(--color-gray-500)]" : "text-foreground")}>
                                {lab.title}
                              </p>
                            </div>
                            <span className="text-xs text-accent/60 shrink-0">+{lab.xpReward} XP</span>
                          </motion.button>
                        ))}
                      </div>
                    </section>
                  );
                })
              ) : (
                <>
                  <section>
                    <h2 className="text-lg font-bold text-accent font-mono mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Lessons
                    </h2>
                    <div className="space-y-2">
                      {week.lessons.map((lesson, i) => (
                        <ScrollReveal key={lesson.id} delay={0.35 + i * 0.05}>
                          <LessonCard
                            id={lesson.id}
                            title={lesson.title}
                            xpReward={lesson.xpReward}
                            completed={progress.completed_lessons.includes(lesson.id)}
                            onClick={() => router.push(`/lesson/${lesson.id}`)}
                          />
                        </ScrollReveal>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h2 className="text-lg font-bold text-accent font-mono mb-3 flex items-center gap-2">
                      <Beaker className="w-4 h-4" />
                      Labs
                    </h2>
                    <div className="space-y-2">
                      {week.labs.map((lab, i) => (
                        <ScrollReveal key={lab.id} delay={0.4 + i * 0.05}>
                          <motion.button
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => router.push(`/lab/${lab.id}`)}
                            className={cn(
                              "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all font-mono group",
                              progress.completed_labs.includes(lab.id)
                                ? "border-accent/20 bg-accent-dim opacity-60"
                                : "border-border bg-surface hover:border-accent/30 hover:bg-accent/5"
                            )}
                          >
                            {progress.completed_labs.includes(lab.id) ? (
                              <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                            ) : (
                              <Beaker className="w-5 h-5 text-[var(--color-gray-600)] shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-sm truncate", progress.completed_labs.includes(lab.id) ? "text-[var(--color-gray-500)]" : "text-foreground")}>
                                {lab.title}
                              </p>
                            </div>
                            <span className="text-xs text-accent/60 shrink-0">+{lab.xpReward} XP</span>
                          </motion.button>
                        </ScrollReveal>
                      ))}
                    </div>
                  </section>
                </>
              )}

              <section>
                <h2 className="text-lg font-bold text-accent font-mono mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Quiz
                </h2>
                <ScrollReveal delay={0.45}>
                  <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => router.push(`/quiz/${week.quiz.id}`)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all font-mono group",
                      quizCompleted
                        ? "border-accent/20 bg-accent-dim opacity-60"
                        : "border-border bg-surface hover:border-accent/30 hover:bg-accent/5"
                    )}
                  >
                    {quizCompleted ? (
                      <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                    ) : (
                      <Brain className="w-5 h-5 text-[var(--color-gray-600)] shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={cn("text-sm", quizCompleted ? "text-[var(--color-gray-500)]" : "text-foreground")}>
                        {week.quiz.title}
                      </p>
                      <p className="text-xs text-[var(--color-gray-600)] mt-0.5">
                        {week.quiz.questions.length} questions · {week.quiz.passScore}% to pass
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-accent/60">+{week.quiz.xpReward} XP</span>
                      <ChevronRight className="w-4 h-4 text-[var(--color-gray-600)] group-hover:text-accent/60 transition-colors" />
                    </div>
                  </motion.button>
                </ScrollReveal>
              </section>

              <ScrollReveal delay={0.5}>
                <section className="border border-border bg-surface rounded-xl p-6">
                  <h2 className="text-lg font-bold text-accent font-mono mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Outcomes
                  </h2>
                  <ul className="space-y-2">
                    {week.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-start gap-2 text-sm text-[var(--color-gray-400)] font-mono">
                        <ChevronRight className="w-3 h-3 text-accent mt-0.5 shrink-0" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </section>
              </ScrollReveal>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
