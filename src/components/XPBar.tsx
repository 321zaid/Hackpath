"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  levelName: string;
}

export default function XPBar({ currentXP, maxXP, level, levelName }: XPBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const percent = Math.min((currentXP / maxXP) * 100, 100);

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="text-accent">Level {level} — {levelName}</span>
        <span className="text-[var(--color-gray-500)]">{currentXP} / {maxXP} XP</span>
      </div>
      <div className="h-2.5 bg-[var(--color-overlay-light)] border border-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-accent/60 to-accent rounded-full relative overflow-hidden"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percent}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
