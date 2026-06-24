export interface Lesson {
  id: string;
  title: string;
  content: string;
  keyConcepts: string[];
  commandBlocks?: { title: string; code: string; explanation: string }[];
  xpReward: number;
  day?: number;
  quiz?: {
    questions: QuizQuestion[];
    passScore: number;
    xpReward: number;
  };
}

export interface Lab {
  id: string;
  title: string;
  challenge: string;
  instructions: string[];
  hint: string;
  expectedFlag: string;
  fakeCommands: string[];
  fakeOutputs: Record<string, string>;
  xpReward: number;
  day?: number;
}

export interface WeekDay {
  day: number;
  title: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  passScore: number;
  xpReward: number;
}

export interface Week {
  id: number;
  title: string;
  tagline: string;
  objective: string;
  topics: string[];
  lessons: Lesson[];
  labs: Lab[];
  days?: WeekDay[];
  quiz: Quiz;
  outcomes: string[];
  xpReward: number;
  badgeReward: string | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
}

export interface UserProgress {
  currentWeek: number;
  totalXP: number;
  level: number;
  streak: number;
  completedLessons: string[];
  completedLabs: string[];
  completedQuizzes: string[];
  badges: string[];
  lastLoginDate: string;
}

export const LEVELS = [
  { name: "Newbie", minXP: 0 },
  { name: "Script Kiddie", minXP: 500 },
  { name: "Hacker", minXP: 2000 },
  { name: "Elite", minXP: 5000 },
  { name: "Red Team Operator", minXP: 10000 },
];

export function getLevel(xp: number): { name: string; level: number } {
  let level = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      level = i;
      break;
    }
  }
  return { name: LEVELS[level].name, level: level + 1 };
}
