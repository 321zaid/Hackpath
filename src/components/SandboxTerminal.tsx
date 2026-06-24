"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Send, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { execCommand, destroySandbox, writeFile, listFiles, type ExecResult } from "@/lib/sandbox";

interface SandboxTerminalProps {
  challenge?: string;
  instructions?: string[];
  onFlagFound?: (flag: string) => void;
}

export default function SandboxTerminal({ challenge, instructions, onFlagFound }: SandboxTerminalProps) {
  const [lines, setLines] = useState<string[]>([
    "",
    "╔══════════════════════════════════════════╗",
    "║  CipherNest Live Sandbox v1.0             ║",
    "║  Real Linux environment — type freely     ║",
    "╚══════════════════════════════════════════╝",
    "",
  ]);
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const addOutput = (line: string) => setLines((prev) => [...prev, line]);

  const processCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setRunning(true);
    addOutput(`student@ciphernest:~$ ${trimmed}`);

    if (trimmed === "clear") {
      setLines([""]);
      setRunning(false);
      return;
    }

    if (trimmed === "exit" || trimmed === "destroy") {
      addOutput("[*] Destroying sandbox...");
      await destroySandbox();
      addOutput("[+] Sandbox destroyed. Refresh to start a new one.");
      setRunning(false);
      return;
    }

    try {
      const result: ExecResult = await execCommand(trimmed);
      if (result.stdout) {
        result.stdout.split("\n").filter(Boolean).forEach((l) => addOutput(l));
      }
      if (result.stderr) {
        result.stderr.split("\n").filter(Boolean).forEach((l) => addOutput(`[stderr] ${l}`));
      }
      if (result.exitCode !== 0 && !result.stdout) {
        addOutput(`[exit code: ${result.exitCode}]`);
      }
    } catch (e) {
      addOutput(`[-] Error: ${e instanceof Error ? e.message : "Command failed"}`);
    }

    setRunning(false);
    setInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || running) return;
    await processCommand(input);
  };

  return (
    <div className="space-y-4">
      {challenge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          className="border border-accent/20 bg-surface rounded-xl p-4"
        >
          <h3 className="text-accent font-mono font-semibold text-sm flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            {challenge}
          </h3>
          {instructions && (
            <ol className="list-decimal list-inside mt-2 space-y-1">
              {instructions.map((inst, i) => (
                <li key={i} className="text-xs text-[var(--color-gray-400)] font-mono">{inst}</li>
              ))}
            </ol>
          )}
        </motion.div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 border border-yellow-500/20 bg-yellow-500/5 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
          <span className="text-xs text-yellow-400 font-mono">{error}</span>
        </div>
      )}

      <div
        ref={terminalRef}
        className="border border-border bg-[var(--color-gray-900)] rounded-xl font-mono text-sm h-96 overflow-y-auto"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 border-b border-border bg-[var(--color-gray-900)]/90 backdrop-blur-sm">
          <Terminal className="w-4 h-4 text-accent" />
          <span className="text-accent/80 text-xs">student@ciphernest:~$</span>
          <div className="flex-1" />
          {running && <Loader2 className="w-3 h-3 animate-spin text-accent" />}
          <span className={cn("w-2 h-2 rounded-full", running ? "bg-yellow-400 animate-pulse" : "bg-accent/40")} />
        </div>
        <div className="p-4 pb-6">
          {lines.map((line, i) => (
            <div
              key={i}
              className={cn(
                "whitespace-pre-wrap leading-relaxed",
                line.startsWith("[+]") && "text-green-400",
                line.startsWith("[-]") && "text-red-400",
                line.startsWith("[stderr]") && "text-yellow-400",
                line.startsWith("student@") && "text-accent",
                !line.startsWith("[") && !line.startsWith("student@") && !line.startsWith("╔") && !line.startsWith("║") && !line.startsWith("╚") && "text-[var(--color-gray-300)]"
              )}
            >
              {line}
            </div>
          ))}
          {!running && (
            <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
              <span className="text-accent shrink-0">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[var(--color-gray-200)] font-mono text-sm"
                placeholder="Type a command..."
                autoFocus
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
