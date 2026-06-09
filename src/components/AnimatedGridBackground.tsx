"use client";

import { motion } from "framer-motion";

export default function AnimatedGridBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[var(--color-background)]" />
      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 65, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 65, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "0px 60px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF41]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF41]/20 to-transparent" />
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-[#00FF41]/15 via-transparent to-transparent" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-[#00FF41]/15 via-transparent to-transparent" />
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,255,65,0.04) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
