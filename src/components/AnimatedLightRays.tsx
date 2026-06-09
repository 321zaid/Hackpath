"use client";

import { motion } from "framer-motion";

const rayConfigs = [
  { angle: -15, width: "30%", blur: 120, opacity: 0.06, color: "#00FF41", duration: 12 },
  { angle: 5, width: "25%", blur: 100, opacity: 0.04, color: "#00BFFF", duration: 15 },
  { angle: 25, width: "20%", blur: 150, opacity: 0.05, color: "#00FF41", duration: 18 },
  { angle: -5, width: "35%", blur: 80, opacity: 0.03, color: "#0088FF", duration: 14 },
  { angle: 15, width: "15%", blur: 200, opacity: 0.04, color: "#00FF88", duration: 20 },
];

export default function AnimatedLightRays() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {rayConfigs.map((ray, i) => (
        <motion.div
          key={i}
          className="absolute top-0 h-[200%] origin-top"
          style={{
            left: `${10 + i * 18}%`,
            width: ray.width,
            background: `linear-gradient(180deg, transparent 0%, ${ray.color} 50%, transparent 100%)`,
            filter: `blur(${ray.blur}px)`,
            opacity: ray.opacity,
            transform: `rotate(${ray.angle}deg)`,
          }}
          animate={{
            y: ["-50%", "0%", "-50%"],
            opacity: [ray.opacity, ray.opacity * 1.5, ray.opacity],
            scaleX: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: ray.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--color-background) 20%, transparent), var(--color-background))" }} />
    </div>
  );
}
