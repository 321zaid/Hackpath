"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Brain } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimatedLightRays from "@/components/AnimatedLightRays";
import QuizCard from "@/components/QuizCard";
import ScrollReveal from "@/components/ScrollReveal";
import { curriculum } from "@/data/curriculum";
import { completeItem, type ProgressData } from "@/lib/supabase/progress";
import { fetchProgress } from "@/lib/supabase/progress";
import type { Quiz } from "@/lib/types";

export default function QuizPage() {
  const params = useParams();
  const quizId = params.id as string;
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress().then((p) => {
      setProgress(p);
      setLoading(false);
    });
  }, []);

  let quiz: Quiz | null = null;
  let weekId = 0;
  for (const week of curriculum) {
    if (week.quiz.id === quizId) {
      quiz = week.quiz;
      weekId = week.id;
      break;
    }
  }

  const handleComplete = async (passed: boolean) => {
    if (passed) {
      const p = await completeItem("quiz", quizId, quiz!.xpReward);
      setProgress(p);
    }
  };

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

  if (!quiz) {
    return (
      <>
        <AnimatedLightRays />
        <Navbar />
        <main className="min-h-screen pt-24 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-red-400 font-mono">Quiz not found.</p>
            <Link href="/roadmap" className="text-accent font-mono underline mt-4 block">
              Back to Roadmap
            </Link>
          </div>
        </main>
      </>
    );
  }

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
              Back to Week {weekId}
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <div className="px-2.5 py-1 border border-yellow-500/30 text-yellow-500 text-xs font-mono rounded-lg">
                <span className="flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  Quiz
                </span>
              </div>
              <span className="text-xs text-[var(--color-gray-500)] font-mono">
                {quiz.passScore}% to pass · +{quiz.xpReward} XP on pass
              </span>
            </div>

            <ScrollReveal>
              <QuizCard
                title={quiz.title}
                questions={quiz.questions}
                passScore={quiz.passScore}
                xpReward={quiz.xpReward}
                onComplete={handleComplete}
              />
            </ScrollReveal>
          </motion.div>
        </div>
      </main>
    </>
  );
}
