export type QuestionType = 'multiplication' | 'missing_factor' | 'visual_dots';
export type AnswerMode = 'choice' | 'numpad';

export interface Question {
  id: string;
  num1: number;
  num2: number;
  answer: number;
  type: QuestionType;
  promptText: string;
  displayNum1: string; // e.g. "7" or "?"
  displayNum2: string; // e.g. "8" or "?"
  displayResult: string; // e.g. "56" or "?"
  targetValue: number; // what the user is answering
  choices: number[];
}

export interface LevelConfig {
  id: number;
  worldId: number;
  worldName: string;
  worldColor: string;
  worldIcon: string;
  title: string;
  subtitle: string;
  description: string;
  allowedMultipliers: number[];
  allowedMultiplicands: number[];
  questionCount: number;
  timePerQuestion?: number; // seconds, optional
  hasTimer: boolean;
  questionType: QuestionType;
  icon: string;
  badgeName?: string;
}

export interface LevelProgress {
  levelId: number;
  stars: number; // 0, 1, 2, 3
  bestScore: number;
  bestAccuracy: number;
  unlocked: boolean;
  completed: boolean;
  playedCount: number;
}

export interface QuestionMistake {
  equation: string; // e.g. "7 × 8"
  num1: number;
  num2: number;
  wrongCount: number;
  correctCount: number;
  lastMissedAt: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'progress' | 'streak' | 'speed' | 'mastery';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface UserStats {
  totalQuestionsSolved: number;
  totalCorrect: number;
  totalWrong: number;
  highestStreak: number;
  totalStars: number;
  timeAttackHighScore: number;
  levelProgress: Record<number, LevelProgress>;
  mistakes: Record<string, QuestionMistake>;
  achievements: Record<string, boolean>;
}

export type GameMode = 'levels' | 'table' | 'custom' | 'time_attack';
