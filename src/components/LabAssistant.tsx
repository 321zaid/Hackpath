"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Loader2, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface LabAssistantProps {
  labId: string;
  labTitle: string;
}

export default function LabAssistant({ labId, labTitle }: LabAssistantProps) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userStuck, setUserStuck] = useState(false);

  const getHint = async (stuck: boolean) => {
    setLoading(true);
    setUserStuck(stuck);
    setAnswer(null);

    try {
      const res = await fetch("/api/ai/lab-hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          labId,
          userInput: question,
          userStuck: stuck,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to get hint");
      }

      const data = await res.json();
      setAnswer(data.hint);
    } catch (error) {
      setAnswer(error instanceof Error ? error.message : "Failed to get hint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-colors font-mono",
          open
            ? "border-red-500/30 text-red-500 hover:bg-red-500/10"
            : "border-purple-500/30 text-purple-500 hover:bg-purple-500/10",
        )}
      >
        <Bot className="w-3.5 h-3.5" />
        {open ? "Close Assistant" : "AI Assistant"}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-purple-500/20 bg-purple-500/5 rounded-lg overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-mono text-purple-400 font-semibold">
                  Lab Assistant: {labTitle}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => getHint(false)}
                  disabled={loading}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors font-mono disabled:opacity-40"
                >
                  <Lightbulb className="w-3 h-3" />
                  Give me a hint
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => getHint(true)}
                  disabled={loading}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-colors font-mono disabled:opacity-40"
                >
                  <Bot className="w-3 h-3" />
                  I&apos;m stuck
                </motion.button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What have you tried? (optional)"
                  className="flex-1 bg-[var(--color-gray-800)] border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground font-mono outline-none focus:border-purple-500/50 transition-colors placeholder:text-[var(--color-gray-600)]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && question.trim()) {
                      getHint(userStuck);
                    }
                  }}
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => getHint(userStuck)}
                  disabled={loading || !question.trim()}
                  className="p-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>

              {loading && (
                <div className="flex items-center gap-2 text-sm text-[var(--color-gray-400)] font-mono">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  Thinking...
                </div>
              )}

              {answer && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 border border-purple-500/20 bg-purple-500/5 rounded-lg"
                >
                  <p className="text-sm text-purple-300 font-mono whitespace-pre-wrap leading-relaxed">
                    {answer}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
