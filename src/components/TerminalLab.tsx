"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Send, Lightbulb, Flag, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalLabProps {
  challenge: string;
  instructions: string[];
  hint: string;
  fakeCommands: string[];
  fakeOutputs: Record<string, string>;
  expectedFlag: string;
  xpReward: number;
  onComplete: (flag: string) => boolean | Promise<boolean>;
}

export default function TerminalLab({
  challenge,
  instructions,
  hint,
  fakeCommands,
  fakeOutputs,
  xpReward,
  onComplete,
}: TerminalLabProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([
    "",
    "╔══════════════════════════════════════════╗",
    "║  HackPath Terminal v1.0                  ║",
    "║  Type 'help' for available commands       ║",
    "╚══════════════════════════════════════════╝",
    "",
  ]);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showFlagInput, setShowFlagInput] = useState(false);
  const [flagInput, setFlagInput] = useState("");
  const [flagResult, setFlagResult] = useState<"success" | "error" | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const addOutput = (line: string) => {
    setOutput((prev) => [...prev, line]);
  };

  const processCommand = async (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    if (trimmed === "help") {
      addOutput(`hackpath@kali:~$ ${cmd}`);
      addOutput(`  Available commands:`);
      addOutput(`  ${fakeCommands.join(", ")}`);
      addOutput("  flag       - Submit your captured flag");
      addOutput("  hint       - Get a hint (costs XP)");
      addOutput("  clear      - Clear terminal");
    } else if (trimmed === "hint") {
      setShowHint(true);
      addOutput(`hackpath@kali:~$ ${cmd}`);
      addOutput(`[+] Hint: ${hint}`);
    } else if (trimmed === "flag") {
      setShowFlagInput(true);
      addOutput(`hackpath@kali:~$ ${cmd}`);
      addOutput(`[*] Enter your flag below:`);
    } else if (trimmed === "clear") {
      setOutput([""]);
    } else if (fakeOutputs[cmd]) {
      addOutput(`hackpath@kali:~$ ${cmd}`);
      const result = fakeOutputs[cmd];
      const lines = result.split("\n");
      for (let i = 0; i < lines.length; i++) {
        addOutput(lines[i]);
        await new Promise((r) => setTimeout(r, 100));
      }
    } else if (fakeCommands.some((fc) => trimmed.startsWith(fc))) {
      addOutput(`hackpath@kali:~$ ${cmd}`);
      addOutput("[+] Command executed successfully.");
    } else {
      addOutput(`hackpath@kali:~$ ${cmd}`);
      addOutput(`bash: ${trimmed}: command not found`);
    }
    setInput("");
  };

  const handleSubmitFlag = async () => {
    const isCorrect = await onComplete(flagInput.trim());
    if (isCorrect) {
      setFlagResult("success");
      setCompleted(true);
      setShowSuccess(true);
      addOutput(`[+] SUCCESS! Flag accepted! You earned +${xpReward} XP!`);
    } else {
      setFlagResult("error");
      addOutput("[-] Incorrect flag. Try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || completed) return;
    await processCommand(input);
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative border border-border bg-surface rounded-xl p-5 space-y-3 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-dim via-transparent to-transparent opacity-40" />
        <div className="relative z-10">
          <h3 className="text-accent font-mono font-semibold text-lg flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            {challenge}
          </h3>
          <div className="space-y-2 mt-3">
            <p className="text-sm text-[var(--color-gray-500)] font-mono">Instructions:</p>
            <ol className="list-decimal list-inside space-y-1">
              {instructions.map((inst, i) => (
                <li key={i} className="text-sm text-[var(--color-gray-400)] font-mono">{inst}</li>
              ))}
            </ol>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-yellow-500/30 text-yellow-500 rounded-lg hover:bg-yellow-500/10 transition-colors font-mono"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showHint ? "Hide Hint" : "Hint"}
            </motion.button>
            <span className="text-xs text-accent/60 font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              +{xpReward} XP on completion
            </span>
          </div>
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 border border-yellow-500/20 bg-yellow-500/5 rounded-lg"
              >
                <p className="text-sm text-yellow-400 font-mono">{hint}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div
        ref={terminalRef}
        className="relative border border-border bg-[#0a0a0a] rounded-xl font-mono text-sm h-80 overflow-y-auto overflow-x-hidden"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 border-b border-border bg-[#0a0a0a]/90 backdrop-blur-sm">
          <Terminal className="w-4 h-4 text-accent" />
          <span className="text-accent/80 text-xs">hackpath@kali:~$</span>
          <div className="flex-1" />
          <span className="w-2 h-2 rounded-full bg-accent/40 animate-pulse" />
        </div>
        <div className="p-4 pb-6">
          {output.map((line, i) => (
            <div
              key={i}
              className={cn(
                "whitespace-pre-wrap leading-relaxed",
                line.startsWith("[+]") && "text-green-400",
                line.startsWith("[-]") && "text-red-400",
                line.startsWith("bash:") && "text-red-400",
                !line.startsWith("[") && !line.startsWith("bash:") && !line.startsWith("╔") && !line.startsWith("║") && !line.startsWith("╚") && !line.startsWith("hackpath") && "text-[var(--color-gray-300)]"
              )}
            >
              {line}
            </div>
          ))}
          {!completed && !showFlagInput && (
            <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-1">
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

      <AnimatePresence>
        {showFlagInput && !completed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border border-accent/20 bg-surface rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Flag className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-mono">Submit your flag:</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
                placeholder="HP{...}"
                className="flex-1 bg-[#0a0a0a] border border-accent/30 rounded-lg px-3 py-2 text-accent font-mono text-sm outline-none focus:border-accent transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSubmitFlag()}
                className="flex items-center gap-1.5 px-4 py-2 bg-accent-dim border border-accent/30 text-accent rounded-lg hover:bg-accent/20 transition-colors font-mono text-sm"
              >
                <Send className="w-4 h-4" />
                Submit
              </motion.button>
              <button
                onClick={() => setShowFlagInput(false)}
                className="p-2 text-[var(--color-gray-500)] hover:text-[var(--color-gray-300)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {flagResult === "error" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-red-400 font-mono"
              >
                Incorrect flag. Try again.
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative border border-accent/40 bg-accent/10 rounded-xl p-8 text-center overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent/20 via-transparent to-accent/20"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="text-5xl mb-3"
              >
                🎉
              </motion.div>
              <h3 className="text-xl font-bold text-accent font-mono mb-1">Lab Complete!</h3>
              <p className="text-accent/80 font-mono text-sm">+{xpReward} XP earned</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
