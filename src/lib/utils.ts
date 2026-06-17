import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getLevel } from "./types";
export { getLevel };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getProgressKey(): string {
  return "opencyber_progress";
}

export function getDefaultProgress() {
  return {
    currentWeek: 1,
    totalXP: 0,
    level: 1,
    streak: 0,
    completedLessons: [],
    completedLabs: [],
    completedQuizzes: [],
    badges: [],
    lastLoginDate: new Date().toISOString().split("T")[0],
  };
}

export function loadProgress() {
  if (typeof window === "undefined") return getDefaultProgress();
  const stored = localStorage.getItem(getProgressKey());
  if (!stored) return getDefaultProgress();
  try {
    return JSON.parse(stored);
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getProgressKey(), JSON.stringify(progress));
}

export function addXP(amount: number) {
  const progress = loadProgress();
  progress.totalXP += amount;
  saveProgress(progress);
  return progress;
}

export function completeLesson(lessonId: string, xpReward: number) {
  const progress = loadProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    progress.totalXP += xpReward;
    saveProgress(progress);
  }
  return progress;
}

export function completeLab(labId: string, xpReward: number) {
  const progress = loadProgress();
  if (!progress.completedLabs.includes(labId)) {
    progress.completedLabs.push(labId);
    progress.totalXP += xpReward;
    saveProgress(progress);
  }
  return progress;
}

export function completeQuiz(quizId: string, xpReward: number) {
  const progress = loadProgress();
  if (!progress.completedQuizzes.includes(quizId)) {
    progress.completedQuizzes.push(quizId);
    progress.totalXP += xpReward;
    saveProgress(progress);
  }
  return progress;
}

export function awardBadge(badgeId: string) {
  const progress = loadProgress();
  if (!progress.badges.includes(badgeId)) {
    progress.badges.push(badgeId);
    progress.totalXP += 100;
    saveProgress(progress);
  }
  return progress;
}

export function getWeekStatus(weekId: number) {
  const progress = loadProgress();
  if (weekId < progress.currentWeek) return "completed";
  if (weekId === progress.currentWeek) return "active";
  return "locked";
}

export function getWeekProgress(weekId: number, week: {
  lessons: { id: string }[];
  labs: { id: string }[];
  quiz: { id: string };
}) {
  const progress = loadProgress();
  const totalLessons = week.lessons.length;
  const totalLabs = week.labs.length;
  const completedLessons = week.lessons.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;
  const completedLabs = week.labs.filter((l) =>
    progress.completedLabs.includes(l.id)
  ).length;
  const completedQuiz = progress.completedQuizzes.includes(week.quiz.id) ? 1 : 0;
  const total = totalLessons + totalLabs + 1;
  const completed = completedLessons + completedLabs + completedQuiz;
  return Math.round((completed / total) * 100);
}
