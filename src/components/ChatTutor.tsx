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

async function getDisplayName(): Promise<string | null> {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (data?.user?.user_metadata?.display_name) return data.user.user_metadata.display_name;
    if (data?.user?.user_metadata?.username) return data.user.user_metadata.username;
    const { data: profile } = await supabase.from("profiles").select("username").eq("id", data?.user?.id).single();
    if (profile?.username) return profile.username;
    if (data?.user?.email) return data.user.email.split("@")[0];
    return null;
  } catch {
    return null;
  }
}

export default function ChatTutor() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi! I'm **Pooki AI**, your friendly cybersecurity tutor. Ask me anything about ethical hacking, the curriculum, or cybersecurity concepts.",
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
      getDisplayName().then((name) => {
        if (name) {
          setMessages([
            {
              role: "assistant",
              text: `Hi **${name}**! I'm **Pooki AI**, your friendly cybersecurity tutor. Ask me anything about ethical hacking, the curriculum, or cybersecurity concepts.`,
            },
          ]);
        }
      });
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);
    setSources([]);
    setShowSources(false);

    setMessages((prev) => [...prev, { role: "assistant", text: "" }]);

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, stream: true }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const raw = line.slice(6).trim();
            if (!raw) continue;
            try {
              const data = JSON.parse(raw);
              if (data.type === "delta") {
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last?.role === "assistant") {
                    updated[updated.length - 1] = { role: "assistant", text: last.text + data.text };
                  }
                  return updated;
                });
              } else if (data.type === "done") {
                if (data.sources?.length > 0) {
                  setSources(data.sources);
                }
              } else if (data.type === "error") {
                throw new Error(data.message);
              }
            } catch { /* skip */ }
          }
        }
      }
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "assistant") {
          updated[updated.length - 1] = {
            role: "assistant",
            text: error instanceof Error ? error.message : "Sorry, I couldn't process that request.",
          };
        }
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.context) {
        setOpen(true);
        setTimeout(() => sendMessage(detail.context), 500);
      }
    };
    window.addEventListener("opencode-ai-chat", handler);
    return () => window.removeEventListener("opencode-ai-chat", handler);
  }, [sendMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput("");
    await sendMessage(question);
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
            ? "bg-accent-dim text-accent hover:bg-accent/30"
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
              <span className="text-sm font-mono text-accent font-semibold">Pooki AI</span>
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
                  {messages[messages.length - 1]?.role === "assistant" && messages[messages.length - 1]?.text ? (
                    <span className="w-2 h-4 bg-accent animate-pulse" />
                  ) : (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                      Thinking...
                    </>
                  )}
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
