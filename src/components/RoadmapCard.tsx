"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, CheckCircle, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoadmapCardProps {
  weekId: number;
  title: string;
  tagline: string;
  progress: number;
  status: "locked" | "active" | "completed";
  xpReward: number;
}

const statusStyles = {
  locked:
    "border-[var(--color-gray-800)] bg-[var(--color-overlay-dim)] opacity-50 cursor-not-allowed backdrop-blur-sm",
  active:
    "border-accent/40 bg-accent-dim hover:border-accent/60 hover:bg-accent/10 cyber-glow",
  completed:
    "border-accent/20 bg-surface hover:border-accent/30",
};

export default function RoadmapCard({
  weekId,
  title,
  tagline,
  progress,
  status,
  xpReward,
}: RoadmapCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={status !== "locked" ? { scale: 1.01, x: 4 } : undefined}
    >
      <Link
        href={status === "locked" ? "#" : `/week/${weekId}`}
        className={cn(
          "block p-5 border rounded-xl transition-all duration-300 font-mono group relative overflow-hidden",
          statusStyles[status]
        )}
      >
        {status === "active" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        )}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <motion.div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border",
                  status === "locked" && "border-[var(--color-gray-700)] text-[var(--color-gray-600)]",
                  status === "active" && "border-accent/40 text-accent bg-accent/10",
                  status === "completed" && "border-accent/30 text-accent bg-accent/10"
                )}
                whileHover={status !== "locked" ? { rotate: 5, scale: 1.05 } : undefined}
              >
                {status === "completed" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </motion.div>
                ) : status === "active" ? (
                  <span className="relative">
                    W{weekId}
                    <motion.span
                      className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </span>
                ) : (
                  `W${weekId}`
                )}
              </motion.div>
              <div>
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                <p className="text-xs text-[var(--color-gray-500)] mt-0.5">{tagline}</p>
              </div>
            </div>
            {status === "locked" && <Lock className="w-4 h-4 text-[var(--color-gray-600)]" />}
            {status === "completed" && <Sparkles className="w-4 h-4 text-accent/60" />}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1 h-1.5 bg-[var(--color-overlay-light)] border border-border rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    status === "completed" && "bg-accent",
                    status === "active" && "bg-gradient-to-r from-accent/60 to-accent",
                    status === "locked" && "bg-gray-700"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs text-[var(--color-gray-500)] shrink-0">{progress}%</span>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-4">
              <span className="text-xs text-accent/60">+{xpReward} XP</span>
              {status !== "locked" && (
                <ChevronRight className="w-4 h-4 text-accent/60 group-hover:translate-x-1 transition-transform" />
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
