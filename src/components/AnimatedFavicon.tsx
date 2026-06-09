"use client";

import { useEffect, useRef } from "react";
import { generateFaviconFrames } from "@/lib/favicon";

export default function AnimatedFavicon() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameRef = useRef(0);
  const framesRef = useRef<string[] | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    framesRef.current = generateFaviconFrames();
    const FRAME_INTERVAL = 250;
    const linkEl =
      (document.querySelector("link[rel='icon']") as HTMLLinkElement) ||
      document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement;

    if (!linkEl || !framesRef.current.length) return;

    const originalHref = linkEl.href;

    const tick = () => {
      if (!framesRef.current) return;
      frameRef.current = (frameRef.current + 1) % framesRef.current.length;
      linkEl.href = framesRef.current[frameRef.current];
    };

    const startInterval = () => {
      stopInterval();
      intervalRef.current = setInterval(tick, FRAME_INTERVAL);
    };

    const stopInterval = () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stopInterval();
      } else {
        startInterval();
      }
    };

    startInterval();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stopInterval();
      document.removeEventListener("visibilitychange", handleVisibility);
      linkEl.href = originalHref;
    };
  }, []);

  return null;
}
