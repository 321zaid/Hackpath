"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CyberButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}

export default function CyberButton({
  children,
  onClick,
  href,
  variant = "primary",
  size = "md",
  icon,
  className,
  disabled,
  type = "button",
}: CyberButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  const variantClasses = {
    primary:
      "bg-accent text-[var(--color-pill-text)] font-bold border border-accent hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]",
    secondary:
      "border border-accent/40 text-accent bg-accent-dim hover:bg-accent/10 hover:border-accent/60",
    ghost:
      "border border-border text-[var(--color-gray-400)] hover:text-accent hover:border-accent/30 bg-surface",
  };

  const handleClick = () => {
    if (disabled) return;
    if (href && typeof window !== "undefined") {
      window.location.href = href;
    }
    onClick?.();
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg font-mono transition-colors relative overflow-hidden group",
        sizeClasses[size],
        variantClasses[variant],
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
      whileHover={{
        scale: 1.03,
        rotate: variant === "ghost" ? 0 : -0.5,
      }}
      whileTap={{ scale: 0.96 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {variant === "primary" && (
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </span>
    </motion.button>
  );
}
