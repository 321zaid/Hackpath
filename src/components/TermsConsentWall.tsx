"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import CyberButton from "@/components/CyberButton";

interface TermsConsentWallProps {
  userId: string;
  onAccepted: () => void;
}

export default function TermsConsentWall({ userId, onAccepted }: TermsConsentWallProps) {
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAccept = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      await supabase.from("profiles").upsert({
        id: userId,
        terms_accepted: true,
        terms_accepted_at: new Date().toISOString(),
        terms_version: "June 2026",
      });
      onAccepted();
    } catch {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border border-border bg-surface rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        <h2 className="text-lg font-bold text-foreground font-mono mb-3">
          Terms &amp; Privacy Update
        </h2>
        <p className="text-sm text-[var(--color-gray-300)] font-mono leading-relaxed mb-6">
          We&apos;ve updated our{" "}
          <Link href="/terms" className="text-accent hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
          Please review and accept to continue.
        </p>

        <label className="flex items-start gap-3 cursor-pointer mb-6">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-border bg-surface text-accent focus:ring-accent/50 shrink-0"
          />
          <span className="text-xs text-[var(--color-gray-500)] font-mono leading-relaxed">
            I agree to the{" "}
            <Link href="/terms" className="text-accent hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
            {" "}and confirm I am at least 13 years old.
          </span>
        </label>

        <CyberButton
          variant="primary"
          disabled={!checked || saving}
          onClick={handleAccept}
          className="w-full justify-center"
        >
          {saving ? "Saving..." : "Continue"}
        </CyberButton>
      </motion.div>
    </div>
  );
}
