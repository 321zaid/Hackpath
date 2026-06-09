"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Beaker } from "lucide-react";
import Navbar from "@/components/Navbar";
import AnimatedLightRays from "@/components/AnimatedLightRays";
import TerminalLab from "@/components/TerminalLab";
import ScrollReveal from "@/components/ScrollReveal";
import { curriculum } from "@/data/curriculum";
import { completeItem, fetchProgress, type ProgressData } from "@/lib/supabase/progress";
import type { Lab } from "@/lib/types";

export default function LabPage() {
  const params = useParams();
  const labId = params.id as string;
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress().then((p) => {
      setProgress(p);
      setLoading(false);
    });
  }, []);

  let lab: Lab | null = null;
  let weekId = 0;
  for (const week of curriculum) {
    const found = week.labs.find((l) => l.id === labId);
    if (found) {
      lab = found;
      weekId = week.id;
      break;
    }
  }

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

  if (!lab) {
    return (
      <>
        <AnimatedLightRays />
        <Navbar />
        <main className="min-h-screen pt-24 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-red-400 font-mono">Lab not found.</p>
            <Link href="/roadmap" className="text-accent font-mono underline mt-4 block">
              Back to Roadmap
            </Link>
          </div>
        </main>
      </>
    );
  }

  const handleComplete = async (flag: string) => {
    const isCorrect = flag.trim() === lab.expectedFlag;
    if (isCorrect) {
      const p = await completeItem("lab", labId, lab.xpReward);
      setProgress(p);
      return true;
    }
    return false;
  };

  return (
    <>
      <AnimatedLightRays />
      <Navbar />
      <main className="min-h-screen pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link
              href={`/week/${weekId}`}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-gray-400)] hover:text-accent font-mono mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Week {weekId}
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <div className="px-2.5 py-1 border border-purple-500/30 text-purple-500 text-xs font-mono rounded-lg">
                <span className="flex items-center gap-1">
                  <Beaker className="w-3 h-3" />
                  Lab
                </span>
              </div>
              <span className="text-xs text-[var(--color-gray-500)] font-mono">+{lab.xpReward} XP on completion</span>
            </div>

            <h1 className="text-2xl font-bold text-foreground font-mono mb-6">{lab.title}</h1>

            <ScrollReveal>
              <TerminalLab
                challenge={lab.challenge}
                instructions={lab.instructions}
                hint={lab.hint}
                fakeCommands={lab.fakeCommands}
                fakeOutputs={lab.fakeOutputs}
                xpReward={lab.xpReward}
                onComplete={handleComplete}
              />
            </ScrollReveal>
          </motion.div>
        </div>
      </main>
    </>
  );
}
