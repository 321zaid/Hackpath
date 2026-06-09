"use client";

import { CheckCircle, Circle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LessonCardProps {
  id: string;
  title: string;
  xpReward: number;
  completed: boolean;
  onClick: () => void;
}

export default function LessonCard({ title, xpReward, completed, onClick }: LessonCardProps) {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all font-mono group",
        completed
          ? "border-accent/20 bg-accent-dim opacity-60"
          : "border-border bg-surface hover:border-accent/30 hover:bg-accent/5"
      )}
    >
      {completed ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <CheckCircle className="w-5 h-5 text-accent shrink-0" />
        </motion.div>
      ) : (
        <Circle className="w-5 h-5 text-[var(--color-gray-600)] shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm truncate", completed ? "text-[var(--color-gray-500)]" : "text-foreground")}>
          {title}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-accent/60">+{xpReward} XP</span>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--color-gray-600)] group-hover:text-accent/60 transition-colors" />
      </div>
    </motion.button>
  );
}
