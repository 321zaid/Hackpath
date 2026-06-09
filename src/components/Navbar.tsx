"use client";

import Link from "next/link";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getPillRect = useCallback(() => {
    if (!hoveredHref || !containerRef.current) return null;
    const link = containerRef.current.querySelector<HTMLElement>(
      `[data-nav="${hoveredHref}"]`
    );
    if (!link) return null;
    const cr = containerRef.current.getBoundingClientRect();
    const lr = link.getBoundingClientRect();
    return {
      left: lr.left - cr.left,
      width: lr.width,
      top: lr.top - cr.top,
      height: lr.height,
    };
  }, [hoveredHref]);

  const pillRect = getPillRect();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-white">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="4"
                y="4"
                width="20"
                height="20"
                rx="5"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M10 12V20C10 20.5523 10.4477 21 11 21H17C17.5523 21 18 20.5523 18 20V12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M8 10L14 7L20 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <div
            ref={containerRef}
            className="hidden md:flex items-center relative"
            onMouseLeave={() => setHoveredHref(null)}
          >
            <AnimatePresence>
              {hoveredHref && pillRect && (
                <motion.div
                  key="nav-pill"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    left: pillRect.left,
                    width: pillRect.width,
                    top: pillRect.top,
                    height: pillRect.height,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    opacity: { duration: 0.15 },
                  }}
                  className="absolute bg-white rounded-full"
                />
              )}
            </AnimatePresence>

            {navItems.map((item) => (
              <Link
                key={item.href}
                data-nav={item.href}
                href={item.href}
                onMouseEnter={() => setHoveredHref(item.href)}
                onFocus={() => setHoveredHref(item.href)}
                className="relative px-5 py-2 text-sm font-medium outline-none z-10"
              >
                <span
                  className={`transition-colors duration-150 ${
                    hoveredHref === item.href ? "text-black" : "text-white"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          <Link
            href="/book-a-call"
            className="hidden md:inline-flex items-center px-5 py-2 text-sm font-medium text-white border border-white/30 rounded-full hover:bg-white hover:text-black transition-colors duration-200"
          >
            Book a Call
          </Link>
        </div>
      </div>
    </nav>
  );
}
