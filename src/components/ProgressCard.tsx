"use client";

import { motion } from "framer-motion";

interface ProgressCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: React.ReactNode;
}

export default function ProgressCard({ label, value, sublabel, icon }: ProgressCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="border border-border bg-surface rounded-xl p-4 font-mono hover:cyber-glow transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-[var(--color-gray-500)] uppercase tracking-wider">{label}</span>
        {icon && <span className="text-accent">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-accent">{value}</div>
      {sublabel && <div className="text-xs text-[var(--color-gray-500)] mt-0.5">{sublabel}</div>}
    </motion.div>
  );
}
