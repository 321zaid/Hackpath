"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Download, ExternalLink, Shield } from "lucide-react";

const FREE_SANDBOXES = [
  {
    name: "TryHackMe",
    url: "https://tryhackme.com",
    desc: "Browser-based Kali VM — free tier includes guided rooms with real tools",
  },
  {
    name: "Hack The Box Academy",
    url: "https://academy.hackthebox.com",
    desc: " Browser-based labs with free tier covering fundamental modules",
  },
  {
    name: "Killercoda",
    url: "https://killercoda.com",
    desc: "Browser-based Linux environments — no setup needed",
  },
  {
    name: "Kali Linux Live USB",
    url: "https://www.kali.org/get-kali/#kali-live",
    desc: "Boot Kali from a USB stick — no installation required",
  },
  {
    name: "Kali Linux on WSL2",
    url: "https://www.kali.org/docs/wsl/",
    desc: "Run Kali inside Windows via WSL2 — free, no VM overhead",
  },
  {
    name: "VirtualBox + Kali ISO",
    url: "https://www.virtualbox.org/",
    desc: "Free VM hypervisor — run any Linux distro in an isolated VM",
  },
];

interface ToolRequirementsProps {
  tools?: { name: string; url?: string }[];
  riskWarning?: string;
}

export function ToolRequirements({ tools, riskWarning }: ToolRequirementsProps) {
  if (!tools?.length && !riskWarning) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-yellow-500/30 bg-yellow-500/5 rounded-xl p-4 mb-6 space-y-3"
    >
      {tools && tools.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-yellow-500 font-mono font-semibold">Tools Needed</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool, i) => (
              <a
                key={i}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-300 hover:bg-yellow-500/20 transition-colors font-mono"
              >
                {tool.name}
                {tool.url && <ExternalLink className="w-3 h-3" />}
              </a>
            ))}
          </div>
        </div>
      )}
      {riskWarning && (
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-yellow-500 font-mono font-semibold">Important</span>
          </div>
          <p className="text-xs text-yellow-400/80 font-mono leading-relaxed">{riskWarning}</p>
        </div>
      )}
    </motion.div>
  );
}

export function FreeSandboxes() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-accent/20 bg-accent-dim/10 rounded-xl p-4 mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-accent" />
        <span className="text-xs text-accent font-mono font-semibold">Free Online Sandboxes</span>
      </div>
      <p className="text-xs text-[var(--color-gray-500)] font-mono mb-3 leading-relaxed">
        Don&apos;t want to install anything locally? These platforms provide browser-based environments
        where you can practice safely:
      </p>
      <div className="grid gap-2">
        {FREE_SANDBOXES.map((s, i) => (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2.5 p-2.5 rounded-lg border border-accent/10 bg-surface hover:border-accent/30 transition-colors group"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs text-accent font-mono font-semibold group-hover:underline">{s.name}</span>
                <ExternalLink className="w-3 h-3 text-accent/40 shrink-0" />
              </div>
              <p className="text-[11px] text-[var(--color-gray-500)] font-mono leading-relaxed">{s.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  );
}

export default ToolRequirements;
