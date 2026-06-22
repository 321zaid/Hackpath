"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface Source {
  title: string;
  type: string;
  week: number;
}

function MarkdownContent({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        strong: ({ children }) => (
          <span className="font-bold text-foreground tracking-wide">{children}</span>
        ),
        em: ({ children }) => (
          <span className="italic text-[var(--color-gray-300)]">{children}</span>
        ),
        del: ({ children }) => (
          <span className="line-through text-[var(--color-gray-500)]">{children}</span>
        ),
        code: ({ className, children, ...props }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="px-1.5 py-0.5 bg-[var(--color-gray-800)] text-accent text-xs rounded font-mono font-bold tracking-tight">
                {children}
              </code>
            );
          }
          return (
            <div className="my-4 overflow-x-auto rounded-lg border border-border/20">
              <pre className="bg-[var(--color-gray-800)] p-3.5 overflow-x-auto text-sm leading-relaxed font-mono">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            </div>
          );
        },
        ul: ({ children }) => (
          <ul className="list-disc list-outside space-y-2 my-3 text-sm pl-5">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside space-y-2 my-3 text-sm pl-5">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed mb-1 marker:text-accent/60">{children}</li>,
        p: ({ children }) => <p className="mb-3 last:mb-0 text-sm leading-relaxed">{children}</p>,
        h1: ({ children }) => (
          <h1 className="text-base font-bold mb-3 mt-5 text-foreground tracking-tight font-sans border-b border-border/20 pb-1.5">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-sm font-bold mb-2.5 mt-4 text-accent tracking-tight font-sans">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-bold mb-2 mt-5 text-accent tracking-tight font-sans border-b border-border/10 pb-1">
            {children}
          </h3>
        ),
        hr: () => <hr className="my-5 border-border/15" />,
        blockquote: ({ children }) => (
          <blockquote className="border-l-[3px] border-accent/30 pl-4 my-4 text-sm italic leading-relaxed text-[var(--color-gray-400)] bg-accent-dim/10 py-2.5 pr-3 rounded-r-lg">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent hover:brightness-110 transition-all">
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className="my-4 overflow-x-auto rounded-lg border border-border/20">
            <table className="min-w-full text-xs font-mono divide-y divide-border/30">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-accent-dim/20">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-border/20">{children}</tbody>
        ),
        tr: ({ children }) => <tr className="hover:bg-accent-dim/5 transition-colors">{children}</tr>,
        th: ({ children }) => (
          <th className="px-3.5 py-2.5 text-left font-bold text-accent text-xs">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-3.5 py-2.5 text-[var(--color-gray-300)] text-xs">{children}</td>
        ),
        img: ({ src, alt }) => (
          <img src={src} alt={alt} className="my-3 rounded-lg max-w-full border border-border/20" loading="lazy" />
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

export default function ChatTutor() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi! I'm the **CipherNest AI Tutor**. Ask me anything about cybersecurity, ethical hacking, or the curriculum.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [showSources, setShowSources] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setLoading(true);
    setSources([]);
    setShowSources(false);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to get response");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.answer }]);
      if (data.sources && data.sources.length > 0) {
        setSources(data.sources);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: error instanceof Error ? error.message : "Sorry, I couldn't process that request.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-50 p-3.5 rounded-full shadow-lg transition-colors",
          open
            ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
            : "bg-accent-dim text-accent hover:bg-accent/30",
        )}
        aria-label={open ? "Close chat" : "Open AI tutor"}
      >
        {open ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 h-[560px] border border-border bg-surface rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-accent-dim/20 shrink-0">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-mono text-accent font-semibold">CipherNest AI Tutor</span>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i > 1 ? 0 : 0 }}
                  className={cn(
                    "max-w-[92%] px-4 py-3 rounded-lg leading-relaxed",
                    msg.role === "user"
                      ? "ml-auto bg-accent-dim/30 text-accent border border-accent/20"
                      : "bg-[var(--color-gray-800)]/50 text-[var(--color-gray-200)] border border-border/50",
                  )}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose-custom text-sm [&_*]:text-[var(--color-gray-200)]">
                      <MarkdownContent text={msg.text} />
                    </div>
                  ) : (
                    <p className="text-sm font-mono">{msg.text}</p>
                  )}
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-gray-400)] font-mono"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                  Thinking...
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {sources.length > 0 && (
              <div className="border-t border-border/50 px-4 py-2 shrink-0">
                <button
                  onClick={() => setShowSources(!showSources)}
                  className="flex items-center gap-1 text-xs text-[var(--color-gray-500)] hover:text-accent font-mono transition-colors"
                >
                  <ChevronDown className={cn("w-3 h-3 transition-transform", showSources && "rotate-180")} />
                  {sources.length} source{sources.length > 1 ? "s" : ""} referenced
                </button>
                <AnimatePresence>
                  {showSources && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 space-y-1"
                    >
                      {sources.map((s, i) => (
                        <div
                          key={i}
                          className="text-xs text-[var(--color-gray-500)] font-mono flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent/50 shrink-0" />
                          {s.title}
                          <span className="text-[var(--color-gray-600)]">(Week {s.week})</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 p-3 border-t border-border bg-[var(--color-gray-900)]/50 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about cybersecurity..."
                className="flex-1 bg-[var(--color-gray-800)] border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground font-mono outline-none focus:border-accent/50 transition-colors placeholder:text-[var(--color-gray-600)]"
                disabled={loading}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2 bg-accent-dim border border-accent/30 text-accent rounded-lg hover:bg-accent/20 transition-colors disabled:opacity-40 shrink-0"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
