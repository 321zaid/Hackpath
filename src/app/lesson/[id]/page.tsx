"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, ArrowRight, Terminal, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimatedLightRays from "@/components/AnimatedLightRays";
import CyberButton from "@/components/CyberButton";
import ScrollReveal from "@/components/ScrollReveal";
import { curriculum } from "@/data/curriculum";
import { fetchProgress, completeItem, type ProgressData } from "@/lib/supabase/progress";
import type { Lesson } from "@/lib/types";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [justCompleted, setJustCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  let lesson: Lesson | null = null;
  let weekId = 0;
  let weekTitle = "";
  for (const week of curriculum) {
    const found = week.lessons.find((l) => l.id === lessonId);
    if (found) {
      lesson = found;
      weekId = week.id;
      weekTitle = week.title;
      break;
    }
  }

  useEffect(() => {
    fetchProgress().then((p) => {
      setProgress(p);
      setLoading(false);
    });
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

  if (!lesson) {
    return (
      <>
        <AnimatedLightRays />
        <Navbar />
        <main className="min-h-screen pt-24 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-red-400 font-mono">Lesson not found.</p>
            <Link href="/roadmap" className="text-accent font-mono underline mt-4 block">
              Back to Roadmap
            </Link>
          </div>
        </main>
      </>
    );
  }

  const completed = progress.completed_lessons.includes(lessonId);

  const handleComplete = async () => {
    const p = await completeItem("lesson", lessonId, lesson.xpReward);
    setProgress(p);
    setJustCompleted(true);
  };

  const currentWeek = curriculum.find((w) => w.id === weekId);
  const lessonIndex = currentWeek?.lessons.findIndex((l) => l.id === lessonId) ?? -1;
  const nextLesson = currentWeek?.lessons[lessonIndex + 1];

  return (
    <>
      <AnimatedLightRays />
      <Navbar />
      <main className="min-h-screen pt-24 px-4 pb-12">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link
              href={`/week/${weekId}`}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-gray-400)] hover:text-accent font-mono mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Week {weekId}: {weekTitle}
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <div className="px-3 py-1 border border-accent/30 text-accent text-xs font-mono rounded-lg bg-accent-dim">
                Lesson
              </div>
              <span className="text-xs text-accent/60 font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3" />+{lesson.xpReward} XP
              </span>
            </div>

            <h1 className="text-2xl font-bold text-foreground font-mono mb-6">{lesson.title}</h1>

            <ScrollReveal>
              <div className="border border-border bg-surface rounded-xl p-6 mb-8">
                {lesson.content.split("\n\n").map((paragraph: string, i: number) => (
                  <p key={i} className="text-[var(--color-gray-300)] font-mono text-sm leading-relaxed mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="mb-8">
                <h2 className="text-lg font-bold text-accent font-mono mb-3">Key Concepts</h2>
                <ul className="space-y-2">
                  {lesson.keyConcepts.map((concept: string) => (
                    <li key={concept} className="flex items-start gap-2 text-sm text-[var(--color-gray-400)] font-mono">
                      <Terminal className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                      {concept}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            {lesson.commandBlocks && lesson.commandBlocks.length > 0 && (
              <div className="space-y-4 mb-8">
                <h2 className="text-lg font-bold text-accent font-mono">Command Blocks</h2>
                {lesson.commandBlocks.map((block, i: number) => (
                  <ScrollReveal key={i} delay={0.15 + i * 0.1}>
                    <div className="border border-border bg-surface rounded-xl overflow-hidden">
                      <div className="px-4 py-2 bg-accent-dim border-b border-border">
                        <span className="text-xs text-accent font-mono">{block.title}</span>
                      </div>
                      <pre className="p-4 text-sm text-green-400 font-mono overflow-x-auto bg-[#0a0a0a]">
                        <code>{block.code}</code>
                      </pre>
                      <div className="px-4 py-2 border-t border-border bg-[var(--color-overlay-dim)]">
                        <p className="text-xs text-[var(--color-gray-500)] font-mono">{block.explanation}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              {!completed ? (
                <CyberButton variant="primary" onClick={handleComplete} icon={<CheckCircle className="w-4 h-4" />}>
                  Mark as Complete
                </CyberButton>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 border border-accent/20 bg-accent-dim rounded-xl">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="text-sm text-accent font-mono">Completed</span>
                </div>
              )}

              {nextLesson && (
                <CyberButton variant="secondary" onClick={() => router.push(`/lesson/${nextLesson.id}`)} icon={<ArrowRight className="w-4 h-4" />}>
                  Next: {nextLesson.title}
                </CyberButton>
              )}
            </div>

            {justCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 border border-accent/30 bg-accent-dim rounded-xl"
              >
                <p className="text-sm text-accent font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  +{lesson.xpReward} XP earned!
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
}
