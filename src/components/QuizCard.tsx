"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ChevronRight, Sparkles } from "lucide-react";
import { QuizQuestion } from "@/lib/types";
import CyberButton from "@/components/CyberButton";

interface QuizCardProps {
  title: string;
  questions: QuizQuestion[];
  passScore: number;
  xpReward: number;
  onComplete: (passed: boolean, score: number) => void;
}

export default function QuizCard({ title, questions, passScore, xpReward, onComplete }: QuizCardProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const q = questions[current];

  const handleAnswer = (optionIndex: number) => {
    if (submitted[q.id]) return;
    setAnswers((prev) => ({ ...prev, [q.id]: optionIndex }));
  };

  const handleSubmit = () => {
    if (answers[q.id] === undefined) return;
    setSubmitted((prev) => ({ ...prev, [q.id]: true }));

    if (current < questions.length - 1) {
      setTimeout(() => setCurrent((prev) => prev + 1), 800);
    } else {
      const correct = questions.filter(
        (question) => answers[question.id] === question.correctAnswer
      ).length;
      const finalScore = Math.round((correct / questions.length) * 100);
      setScore(finalScore);
      setFinished(true);
      const passed = finalScore >= passScore;
      setTimeout(() => onComplete(passed, finalScore), 500);
    }
  };

  if (finished) {
    const passed = score >= passScore;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border border-border bg-surface rounded-xl p-8 text-center font-mono relative overflow-hidden"
      >
        {passed && (
          <div className="absolute inset-0 bg-gradient-to-br from-accent-dim via-transparent to-transparent opacity-50" />
        )}
        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            {passed ? (
              <div className="w-16 h-16 rounded-full bg-accent-dim border border-accent/30 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
            ) : (
              <div className="text-5xl">💪</div>
            )}
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${passed ? "text-accent" : "text-yellow-400"}`}>
            {passed ? "Quiz Passed!" : "Keep Trying!"}
          </h3>
          <p className="text-[var(--color-gray-400)] mb-2">
            Score: {score}% (Pass: {passScore}%)
          </p>
          {passed && (
            <p className="text-accent/80">+{xpReward} XP earned</p>
          )}
          {!passed && (
            <p className="text-[var(--color-gray-500)] text-sm mt-2">Review the material and try again.</p>
          )}
        </div>
      </motion.div>
    );
  }

  const isCorrect = submitted[q.id] && answers[q.id] === q.correctAnswer;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between font-mono">
        <h3 className="text-accent font-semibold">{title}</h3>
        <span className="text-sm text-[var(--color-gray-500)]">
          {current + 1} / {questions.length}
        </span>
      </div>

      <div className="h-1.5 bg-[var(--color-overlay)] border border-accent/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="border border-border bg-surface rounded-xl p-6"
        >
          <p className="text-foreground font-mono mb-4">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((option, i) => {
              const selected = answers[q.id] === i;
              const showCorrect = submitted[q.id] && q.correctAnswer === i;
              const showWrong = submitted[q.id] && selected && q.correctAnswer !== i;

              return (
                <motion.button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  whileTap={!submitted[q.id] ? { scale: 0.99 } : undefined}
                  className={`w-full text-left p-3 rounded-xl border font-mono text-sm transition-all ${
                    showCorrect
                      ? "border-accent bg-accent-dim text-accent"
                      : showWrong
                      ? "border-red-500 bg-red-500/10 text-red-400"
                      : selected
                      ? "border-accent/40 bg-accent/5 text-foreground"
                      : "border-border bg-[var(--color-overlay-light)] text-[var(--color-gray-400)] hover:border-accent/30"
                  }`}
                  disabled={submitted[q.id]}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showCorrect && <CheckCircle className="w-4 h-4 shrink-0" />}
                    {showWrong && <XCircle className="w-4 h-4 shrink-0" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {submitted[q.id] && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-xl text-sm font-mono ${
                isCorrect
                  ? "bg-accent-dim border border-accent/20 text-accent"
                  : "bg-red-500/5 border border-red-500/20 text-red-400"
              }`}
            >
              {q.explanation}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {!submitted[q.id] ? (
        <CyberButton
          variant="primary"
          onClick={handleSubmit}
          disabled={answers[q.id] === undefined}
          icon={<ChevronRight className="w-4 h-4" />}
        >
          {current < questions.length - 1 ? "Next Question" : "Finish Quiz"}
        </CyberButton>
      ) : current < questions.length - 1 ? (
        <CyberButton variant="secondary" onClick={() => setCurrent((prev) => prev + 1)} icon={<ChevronRight className="w-4 h-4" />}>
          Next Question
        </CyberButton>
      ) : null}
    </div>
  );
}
