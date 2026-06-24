"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Terminal,
  Lightbulb,
  Sparkles,
  BookOpen,
  Target,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/lib/types";
import { ToolRequirements, FreeSandboxes } from "./ToolRequirements";

interface InteractiveLessonProps {
  lesson: Lesson;
  onComplete: () => void;
  completed: boolean;
  onAskAITutor: (context: string) => void;
}

interface LessonSection {
  type: "heading" | "content" | "code" | "concept" | "quiz" | "command";
  title?: string;
  content?: string;
  items?: string[];
  code?: string;
  explanation?: string;
  question?: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

function InlineTerminal({ code, title }: { code: string; title?: string }) {
  const [lines, setLines] = useState<string[]>([""]);
  const [command, setCommand] = useState("");
  const [mode, setMode] = useState<"preview" | "interactive">("preview");
  const inputRef = useRef<HTMLInputElement>(null);

  const codeLines = code.trim().split("\n").filter((l) => !l.startsWith("#"));

  useEffect(() => {
    if (mode === "interactive") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [mode]);

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newLines = [...lines, `$ ${cmd}`];

    if (trimmed === "clear") {
      setLines([""]);
      setCommand("");
      return;
    }

    if (trimmed === "help") {
      newLines.push("Available commands:");
      codeLines.forEach((l) => {
        const cmdName = l.replace(/^[\s]*/, "").split(/\s+/)[0];
        if (cmdName) newLines.push(`  ${cmdName}`);
      });
      newLines.push("  clear");
    } else if (trimmed === "ls") {
      newLines.push("DESKTOP  Downloads  Documents  projects  notes.txt");
    } else if (trimmed === "pwd") {
      newLines.push("/home/cipheruser");
    } else if (trimmed === "whoami") {
      newLines.push("cipheruser");
    } else {
      newLines.push(`Command executed: ${cmd}`);
      newLines.push("(simulated environment)");
    }

    setLines(newLines);
    setCommand("");
  };

  return (
    <div className="border border-accent/20 bg-surface rounded-xl overflow-hidden mb-6">
      <div className="px-4 py-2 bg-accent-dim/20 border-b border-accent/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-accent" />
          <span className="text-xs text-accent font-mono">{title || "Terminal"}</span>
        </div>
        <button
          onClick={() => setMode(mode === "preview" ? "interactive" : "preview")}
          className="text-[10px] text-accent/60 hover:text-accent font-mono border border-accent/20 px-2 py-0.5 rounded transition-colors"
        >
          {mode === "preview" ? "Try it →" : "Read only"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "preview" ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <pre className="p-4 text-sm text-green-400 font-mono overflow-x-auto bg-[var(--color-gray-900)] leading-relaxed">
              <code>{code}</code>
            </pre>
          </motion.div>
        ) : (
          <motion.div
            key="interactive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[var(--color-gray-900)]"
          >
            <div className="p-4 pb-2 font-mono text-sm h-40 overflow-y-auto space-y-1">
              {lines.map((line, i) => (
                <div
                  key={i}
                  className={cn(
                    "whitespace-pre-wrap",
                    line.startsWith("$") && "text-accent",
                    !line.startsWith("$") && line && "text-[var(--color-gray-400)]",
                  )}
                >
                  {line}
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); if (command.trim()) runCommand(command); }}
              className="flex items-center gap-2 px-4 pb-4"
            >
              <span className="text-accent text-sm font-mono shrink-0">$</span>
              <input
                ref={inputRef}
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[var(--color-gray-200)] font-mono text-sm"
                placeholder="Type a command..."
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KnowledgeCheck({
  question,
  onCorrect,
}: {
  question: { id: string; question: string; options: string[]; correctAnswer: number; explanation: string };
  onCorrect: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    if (i === question.correctAnswer) {
      setTimeout(onCorrect, 1500);
    }
  };

  const isCorrect = selected === question.correctAnswer;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-accent/20 bg-accent-dim/10 rounded-xl p-5 mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-accent" />
        <span className="text-xs text-accent font-mono font-semibold">Knowledge Check</span>
      </div>
      <p className="text-sm text-foreground font-mono mb-3 leading-relaxed">{question.question}</p>
      <div className="space-y-2">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={revealed}
            className={cn(
              "w-full text-left px-4 py-2.5 rounded-lg border text-sm font-mono transition-all",
              !revealed && "border-border bg-surface hover:border-accent/40 hover:bg-accent-dim/20 text-[var(--color-gray-300)]",
              revealed && i === question.correctAnswer && "border-green-500/50 bg-green-500/10 text-green-400",
              revealed && selected === i && i !== question.correctAnswer && "border-red-500/50 bg-red-500/10 text-red-400",
              revealed && selected !== i && i !== question.correctAnswer && "border-border/30 text-[var(--color-gray-500)] opacity-60",
            )}
          >
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
              {revealed && i === question.correctAnswer && <CheckCircle className="w-4 h-4 ml-auto text-green-400" />}
            </span>
          </button>
        ))}
      </div>
      {revealed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className={cn(
            "mt-3 p-3 rounded-lg text-xs font-mono leading-relaxed border",
            isCorrect
              ? "border-green-500/20 bg-green-500/10 text-green-400"
              : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
          )}
        >
          <div className="flex items-start gap-2">
            <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>{question.explanation}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function parseLessonContent(content: string): LessonSection[] {
  const sections: LessonSection[] = [];
  const lines = content.split("\n");
  let currentSection: LessonSection | null = null;

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)/);
    if (headingMatch) {
      if (currentSection) sections.push(currentSection);
      currentSection = { type: "heading", title: headingMatch[1].trim() };
      continue;
    }

    const codeMatch = line.match(/^```(\w*)/);
    if (codeMatch) {
      if (currentSection) sections.push(currentSection);
      const codeLines: string[] = [];
      while (lines.length > 0) {
        const next = lines.shift();
        if (next?.startsWith("```")) break;
        if (next !== undefined) codeLines.push(next);
      }
      sections.push({ type: "code", code: codeLines.join("\n") });
      currentSection = null;
      continue;
    }

    if (!currentSection || currentSection.type !== "content") {
      if (currentSection) sections.push(currentSection);
      currentSection = { type: "content", content: "" };
    }

    if (line.trim()) {
      currentSection.content += (currentSection.content ? "\n" : "") + line;
    }
  }

  if (currentSection) sections.push(currentSection);
  return sections.filter((s) => s.type !== "content" || s.content?.trim());
}

export default function InteractiveLesson({
  lesson,
  onComplete,
  completed,
  onAskAITutor,
}: InteractiveLessonProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [expandedConcepts, setExpandedConcepts] = useState<Set<number>>(new Set());
  const [passedChecks, setPassedChecks] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const sections = useMemo(() => parseLessonContent(lesson.content), [lesson.content]);

  const hasTools = !!(lesson.toolRequirements?.length || lesson.riskWarning);
  const totalSteps = sections.length + (lesson.commandBlocks?.length ?? 0) + (lesson.keyConcepts.length > 0 ? 1 : 0) + (hasTools ? 1 : 0);
  const currentStep = currentSection;

  const handleContinue = () => {
    if (currentSection < totalSteps - 1) {
      setCurrentSection((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleConcept = (i: number) => {
    setExpandedConcepts((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const renderSection = (index: number) => {
    let offset = 0;

    if (hasTools && offset === index) {
      offset++;
      return (
        <div key="tools" className="mb-4">
          <ToolRequirements tools={lesson.toolRequirements} riskWarning={lesson.riskWarning} />
        </div>
      );
    }

    for (const section of sections) {
      if (offset === index) {
        return (
          <div key={`sect-${offset}`} className="mb-4">
            {section.type === "heading" && (
              <h2 className="text-lg font-bold text-foreground font-mono mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent shrink-0" />
                {section.title}
              </h2>
            )}
            {section.type === "content" && section.content && (
              <div className="text-sm text-[var(--color-gray-300)] font-mono leading-relaxed prose-custom">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    strong: ({ children }) => <strong className="text-foreground font-bold">{children}</strong>,
                    code: ({ className, children, ...props }) => {
                      const isInline = !className;
                      if (isInline) {
                        return <code className="px-1.5 py-0.5 bg-[var(--color-gray-800)] text-accent text-xs rounded font-mono">{children}</code>;
                      }
                      return (
                        <div className="my-4 overflow-x-auto rounded-lg border border-border/20">
                          <pre className="bg-[var(--color-gray-800)] p-3.5 overflow-x-auto text-sm leading-relaxed font-mono text-green-400">
                            <code className={className} {...props}>{children}</code>
                          </pre>
                        </div>
                      );
                    },
                    ul: ({ children }) => <ul className="list-disc list-outside space-y-1.5 my-3 pl-5">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-outside space-y-1.5 my-3 pl-5">{children}</ol>,
                    li: ({ children }) => <li className="leading-relaxed mb-1 marker:text-accent/60">{children}</li>,
                    p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                  }}
                >
                  {section.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        );
      }
      offset++;
    }

    if (lesson.commandBlocks) {
    for (let i = 0; i < lesson.commandBlocks.length; i++) {
        if (offset === index) {
          const block = lesson.commandBlocks[i];
          return (
            <div key={`cmd-${i}`} className="mb-4">
              <InlineTerminal code={block.code} title={block.title} />
              <div className="text-xs text-[var(--color-gray-500)] font-mono leading-relaxed bg-surface border border-border rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Lightbulb className="w-3 h-3 text-yellow-500" />
                  <span className="text-yellow-500 font-semibold">Explanation</span>
                </div>
                {block.explanation}
              </div>
            </div>
          );
        }
        offset++;
      }
    }

    if (lesson.keyConcepts.length > 0 && offset === index) {
      return (
        <div key="concepts" className="mb-4">
          <h3 className="text-sm font-bold text-accent font-mono mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Key Concepts
          </h3>
          <div className="space-y-2">
            {lesson.keyConcepts.map((concept, i) => (
              <div key={i} className="border border-border bg-surface rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleConcept(i)}
                  className="w-full flex items-center justify-between p-3 text-left text-sm text-[var(--color-gray-300)] font-mono hover:bg-accent-dim/10 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-accent shrink-0" />
                    {concept}
                  </span>
                  <ChevronDown className={cn("w-4 h-4 text-accent/60 transition-transform", expandedConcepts.has(i) && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {expandedConcepts.has(i) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border"
                    >
                      <div className="p-3 text-xs text-[var(--color-gray-500)] font-mono leading-relaxed bg-[var(--color-gray-900)]/50">
                        Click the AI Tutor button below if you want to dive deeper into this concept, or continue to the next section.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  if (showAll) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowAll(false)}
            className="text-xs text-accent font-mono hover:underline flex items-center gap-1"
          >
            <ChevronRight className="w-3 h-3 rotate-180" />
            Back to step-by-step
          </button>
          {!completed && (
            <button
              onClick={onComplete}
              className="text-xs text-accent font-mono border border-accent/30 px-3 py-1 rounded-lg hover:bg-accent-dim transition-colors"
            >
              Mark Complete
            </button>
          )}
        </div>
        <div className="border border-border bg-surface rounded-xl p-6 mb-8 prose-custom text-sm leading-relaxed">
          {sections.map((section, i) => (
            <div key={i} className="mb-4">
              {section.type === "heading" && (
                <h2 className="text-lg font-bold text-foreground font-mono mb-3 mt-6 first:mt-0">{section.title}</h2>
              )}
              {section.type === "content" && section.content && (
                <div className="text-sm text-[var(--color-gray-300)] font-mono leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      strong: ({ children }) => <strong className="text-foreground font-bold">{children}</strong>,
                      code: ({ className, children, ...props }) => {
                        const isInline = !className;
                        if (isInline) {
                          return <code className="px-1.5 py-0.5 bg-[var(--color-gray-800)] text-accent text-xs rounded font-mono">{children}</code>;
                        }
                        return (
                          <div className="my-4 overflow-x-auto rounded-lg border border-border/20">
                            <pre className="bg-[var(--color-gray-800)] p-3.5 overflow-x-auto text-sm leading-relaxed font-mono text-green-400">
                              <code className={className} {...props}>{children}</code>
                            </pre>
                          </div>
                        );
                      },
                      ul: ({ children }) => <ul className="list-disc list-outside space-y-1.5 my-3 pl-5">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-outside space-y-1.5 my-3 pl-5">{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed mb-1 marker:text-accent/60">{children}</li>,
                      p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                    }}
                  >
                    {section.content}
                  </ReactMarkdown>
                </div>
              )}
              {section.type === "code" && section.code && (
                <pre className="p-4 my-3 text-sm text-green-400 font-mono overflow-x-auto bg-[var(--color-gray-900)] rounded-lg border border-border">
                  <code>{section.code}</code>
                </pre>
              )}
            </div>
          ))}
          {lesson.commandBlocks?.map((block, i) => (
            <InlineTerminal key={i} code={block.code} title={block.title} />
          ))}
        </div>
        <div className="flex items-center gap-3">
          {completed && <FreeSandboxes />}
          {!completed && (
            <button
              onClick={onComplete}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent-dim border border-accent/30 text-accent rounded-xl hover:bg-accent/20 transition-colors font-mono text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Mark as Complete
            </button>
          )}
          <button
            onClick={() => onAskAITutor(`I'm reviewing "${lesson.title}" - can you help me understand the concepts better?`)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-accent/20 text-accent/70 rounded-xl hover:bg-accent-dim transition-colors font-mono text-sm"
          >
            Ask AI Tutor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[var(--color-gray-500)] font-mono">
            Step {Math.min(currentStep + 1, totalSteps)} of {totalSteps}
          </span>
          <button
            onClick={() => setShowAll(true)}
            className="text-xs text-accent/60 hover:text-accent font-mono transition-colors"
          >
            Show all content
          </button>
        </div>
        <div className="h-1.5 bg-[var(--color-gray-800)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {renderSection(currentStep)}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-3 mt-6 flex-wrap">
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentSection((s) => Math.max(0, s - 1))}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-[var(--color-gray-400)] rounded-xl hover:text-accent hover:border-accent/30 transition-colors font-mono text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {currentStep < totalSteps - 1 && (
          <button
            onClick={handleContinue}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-dim border border-accent/30 text-accent rounded-xl hover:bg-accent/20 transition-colors font-mono text-sm"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {currentStep === totalSteps - 1 && !completed && (
          <button
            onClick={onComplete}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-dim border border-accent/30 text-accent rounded-xl hover:bg-accent/20 transition-colors font-mono text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Mark as Complete
          </button>
        )}

        {currentStep === totalSteps - 1 && completed && (
          <div className="flex items-center gap-2 px-4 py-2 border border-accent/20 bg-accent-dim rounded-xl">
            <CheckCircle className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-mono">Completed</span>
          </div>
        )}

        {currentStep === totalSteps - 1 && completed && <div className="mt-4"><FreeSandboxes /></div>}

        <button
          onClick={() => onAskAITutor(`I'm learning "${lesson.title}" in the CipherNest curriculum. Can you help me understand this better?`)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-accent/20 text-accent/70 rounded-xl hover:bg-accent-dim transition-colors font-mono text-sm"
        >
          Ask AI Tutor
        </button>
      </div>
    </div>
  );
}
