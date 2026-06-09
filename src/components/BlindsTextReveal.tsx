"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlindsTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export default function BlindsTextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.04,
  once = true,
  as: Tag = "h1",
}: BlindsTextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  const chars = text.split("");

  return (
    <div ref={ref} className={cn("overflow-hidden inline-block", className)}>
      <Tag className="sr-only">{text}</Tag>
      <span aria-hidden="true" className="inline-flex flex-wrap">
        {chars.map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, y: 40, rotateX: -90 }}
            animate={
              isInView
                ? { opacity: 1, y: 0, rotateX: 0 }
                : { opacity: 0, y: 40, rotateX: -90 }
            }
            transition={{
              duration: 0.5,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    </div>
  );
}
