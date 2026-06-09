"use client";

import { motion } from "framer-motion";
import type { Badge } from "@/lib/types";
import {
  Terminal,
  Database,
  Search,
  Lock,
  GraduationCap,
  Globe,
  Wifi,
  Bird,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Terminal: <Terminal className="w-6 h-6" />,
  Database: <Database className="w-6 h-6" />,
  Search: <Search className="w-6 h-6" />,
  Lock: <Lock className="w-6 h-6" />,
  GraduationCap: <GraduationCap className="w-6 h-6" />,
  Globe: <Globe className="w-6 h-6" />,
  Wifi: <Wifi className="w-6 h-6" />,
  Bird: <Bird className="w-6 h-6" />,
};

interface BadgeCardProps {
  badge: Badge;
  earned: boolean;
}

export default function BadgeCard({ badge, earned }: BadgeCardProps) {
  return (
    <motion.div
      whileHover={earned ? { scale: 1.05, y: -4 } : undefined}
      className={`relative border rounded-xl p-4 text-center font-mono transition-all duration-300 overflow-hidden ${
        earned
          ? "border-accent/30 bg-accent-dim"
          : "border-[var(--color-gray-800)] bg-[var(--color-overlay-dim)] opacity-40"
      }`}
    >
      {earned && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-accent/10 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}
      <motion.div
        className={`relative z-10 mb-2 ${earned ? "text-accent" : "text-[var(--color-gray-600)]"}`}
        initial={earned ? { scale: 0, rotate: -180 } : undefined}
        animate={earned ? { scale: 1, rotate: 0 } : undefined}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
      >
        {iconMap[badge.icon] || <Terminal className="w-6 h-6 mx-auto" />}
      </motion.div>
      <h4 className={`relative z-10 text-sm font-semibold mb-1 ${earned ? "text-foreground" : "text-[var(--color-gray-500)]"}`}>
        {badge.name}
      </h4>
      <p className="relative z-10 text-xs text-[var(--color-gray-500)]">{badge.description}</p>
    </motion.div>
  );
}
