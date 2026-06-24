"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, ArrowRight, Sparkles, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimatedLightRays from "@/components/AnimatedLightRays";
import CyberButton from "@/components/CyberButton";
import InteractiveLesson from "@/components/InteractiveLesson";
import QuizCard from "@/components/QuizCard";
import { curriculum } from "@/data/curriculum";
import { fetchProgress, completeItem, type ProgressData } from "@/lib/supabase/progress";
import type { Lesson } from "@/lib/types";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [justCompleted, setJustCompleted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
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

  const handleOpenChat = useCallback((context: string) => {
    const event = new CustomEvent("opencode-ai-chat", { detail: { context } });
    window.dispatchEvent(event);
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
    try {
      const p = await completeItem("lesson", lessonId, lesson.xpReward);
      setProgress(p);
      setJustCompleted(true);
    } catch {
      // silently fail — user can retry
    }
  };

  const handleQuizComplete = async (passed: boolean) => {
    if (passed && lesson.quiz) {
      try {
        const p = await completeItem("lesson", lessonId, lesson.xpReward + lesson.quiz.xpReward);
        setProgress(p);
        setJustCompleted(true);
        setQuizPassed(true);
      } catch {
        // silently fail
      }
    }
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

            <div className="border border-border bg-surface rounded-xl p-6 mb-8">
              <InteractiveLesson
                lesson={lesson}
                onComplete={handleComplete}
                completed={completed}
                onAskAITutor={handleOpenChat}
              />
            </div>

            {lesson.quiz && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-accent font-mono mb-4">Lesson Quiz</h2>
                <QuizCard
                  title={lesson.quiz ? `${lesson.title} Quiz` : "Quiz"}
                  questions={lesson.quiz.questions}
                  passScore={lesson.quiz.passScore}
                  xpReward={lesson.quiz.xpReward}
                  onComplete={handleQuizComplete}
                  onAskAITutor={handleOpenChat}
                  lessonId={lessonId}
                  lessonTitle={lesson.title}
                  weekId={weekId}
                  nextLessonId={nextLesson?.id}
                  nextLessonTitle={nextLesson?.title}
                />
              </div>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              {lesson.quiz && quizPassed && (
                <div className="flex items-center gap-2 px-4 py-2 border border-accent/20 bg-accent-dim rounded-xl">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="text-sm text-accent font-mono">Completed</span>
                </div>
              )}

              {nextLesson && (completed || quizPassed) && (
                <CyberButton variant="secondary" onClick={() => router.push(`/lesson/${nextLesson.id}`)} icon={<ArrowRight className="w-4 h-4" />}>
                  Next: {nextLesson.title}
                </CyberButton>
              )}

              <CyberButton variant="secondary" onClick={() => handleOpenChat(`I'm learning "${lesson.title}" in the CipherNest curriculum. Can you help me understand this better?`)} icon={<MessageSquare className="w-4 h-4" />}>
                Ask AI Tutor
              </CyberButton>
            </div>

            {justCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 border border-accent/30 bg-accent-dim rounded-xl"
              >
                <p className="text-sm text-accent font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  +{lesson.xpReward}{lesson.quiz ? ` + ${lesson.quiz.xpReward}` : ""} XP earned!
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
}
