"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
  distance?: number;
  stagger?: boolean;
  staggerDelay?: number;
  blur?: boolean;
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.5,
  once = true,
  distance = 30,
  stagger = false,
  staggerDelay = 0.08,
  blur = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-30px" });

  const getInitial = () => {
    const base: Record<string, unknown> = blur ? { filter: "blur(8px)" } : {};
    switch (direction) {
      case "up": return { opacity: 0, y: distance, ...base };
      case "down": return { opacity: 0, y: -distance, ...base };
      case "left": return { opacity: 0, x: distance, ...base };
      case "right": return { opacity: 0, x: -distance, ...base };
      case "none": return { opacity: 0, scale: 0.95, ...base };
    }
  };

  const getVisible = () => {
    const base: Record<string, unknown> = blur ? { filter: "blur(0px)" } : {};
    return { opacity: 1, x: 0, y: 0, scale: 1, ...base };
  };

  if (stagger) {
    return (
      <div ref={ref} className={cn("", className)}>
        {isInView ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: staggerDelay } },
            }}
          >
            {Array.isArray(children)
              ? children.map((child, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: getInitial(),
                      visible: getVisible(),
                    }}
                    transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {child}
                  </motion.div>
                ))
              : children}
          </motion.div>
        ) : (
          children
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("", className)}>
      <motion.div
        initial={getInitial()}
        animate={isInView ? getVisible() : getInitial()}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
