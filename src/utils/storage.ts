import { Achievement, LevelProgress, QuestionMistake, UserStats } from '../types';

const STATS_STORAGE_KEY = 'carpim_tablosu_stats_v1';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'İlk Adım',
    description: 'İlk seviyeyi başarıyla tamamla.',
    icon: '🌱',
    category: 'progress',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
  },
  {
    id: 'five_stars',
    title: 'Yıldız Avcısı',
    description: 'Toplam 15 yıldız topla.',
    icon: '⭐',
    category: 'progress',
    progress: 0,
    maxProgress: 15,
    unlocked: false,
  },
  {
    id: 'streak_10',
    title: 'Ateş Topu',
    description: 'Arka arkaya 10 doğru cevap ver.',
    icon: '🔥',
    category: 'streak',
    progress: 0,
    maxProgress: 10,
    unlocked: false,
  },
  {
    id: 'streak_25',
    title: 'Durdurulamaz!',
    description: 'Arka arkaya 25 doğru cevap ver.',
    icon: '⚡',
    category: 'streak',
    progress: 0,
    maxProgress: 25,
    unlocked: false,
  },
  {
    id: 'solve_50',
    title: 'Matematik Çırağı',
    description: 'Toplam 50 soru çöz.',
    icon: '📘',
    category: 'mastery',
    progress: 0,
    maxProgress: 50,
    unlocked: false,
  },
  {
    id: 'solve_200',
    title: 'Sayı Ustası',
    description: 'Toplam 200 soru çöz.',
    icon: '🎓',
    category: 'mastery',
    progress: 0,
    maxProgress: 200,
    unlocked: false,
  },
  {
    id: 'seven_master',
    title: '7’ler Fatihi',
    description: '7’ler Fırtınası seviyesini 3 yıldızla bitir.',
    icon: '🌪️',
    category: 'mastery',
    progress: 0,
    maxProgress: 3,
    unlocked: false,
  },
  {
    id: 'time_attack_20',
    title: 'Hız Şimşeği',
    description: 'Hız Maratonu modunda 20 veya üzeri puan yap.',
    icon: '⚡',
    category: 'speed',
    progress: 0,
    maxProgress: 20,
    unlocked: false,
  },
  {
    id: 'all_levels',
    title: 'Çarpım Şampiyonu',
    description: '12 seviyenin tamamını tamamla.',
    icon: '👑',
    category: 'progress',
    progress: 0,
    maxProgress: 12,
    unlocked: false,
  },
];

export function getInitialStats(): UserStats {
  const defaultProgress: Record<number, LevelProgress> = {};
  for (let i = 1; i <= 12; i++) {
    defaultProgress[i] = {
      levelId: i,
      stars: 0,
      bestScore: 0,
      bestAccuracy: 0,
      unlocked: i === 1, // First level unlocked by default
      completed: false,
      playedCount: 0,
    };
  }

  const defaultAchievements: Record<string, boolean> = {};
  INITIAL_ACHIEVEMENTS.forEach((a) => {
    defaultAchievements[a.id] = false;
  });

  return {
    totalQuestionsSolved: 0,
    totalCorrect: 0,
    totalWrong: 0,
    highestStreak: 0,
    totalStars: 0,
    timeAttackHighScore: 0,
    levelProgress: defaultProgress,
    mistakes: {},
    achievements: defaultAchievements,
  };
}

export function loadUserStats(): UserStats {
  if (typeof window === 'undefined') return getInitialStats();
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return getInitialStats();
    const parsed = JSON.parse(raw);
    
    // Merge with defaults to prevent missing keys on updates
    const initial = getInitialStats();
    return {
      ...initial,
      ...parsed,
      levelProgress: {
        ...initial.levelProgress,
        ...(parsed.levelProgress || {}),
      },
      mistakes: parsed.mistakes || {},
      achievements: {
        ...initial.achievements,
        ...(parsed.achievements || {}),
      },
    };
  } catch (err) {
    console.error('Failed to load stats from localStorage:', err);
    return getInitialStats();
  }
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  try {
    // Recalculate total stars
    let totalStars = 0;
    Object.values(stats.levelProgress).forEach((lp) => {
      totalStars += lp.stars || 0;
    });
    stats.totalStars = totalStars;

    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save stats to localStorage:', err);
  }
}

// Record result of a question for mistakes tracking
export function recordQuestionAttempt(
  stats: UserStats,
  num1: number,
  num2: number,
  isCorrect: boolean
): UserStats {
  const updated = { ...stats };
  updated.totalQuestionsSolved += 1;
  if (isCorrect) {
    updated.totalCorrect += 1;
  } else {
    updated.totalWrong += 1;
    const key = `${Math.min(num1, num2)} × ${Math.max(num1, num2)}`;
    const existing = updated.mistakes[key] || {
      equation: key,
      num1: Math.min(num1, num2),
      num2: Math.max(num1, num2),
      wrongCount: 0,
      correctCount: 0,
      lastMissedAt: Date.now(),
    };
    existing.wrongCount += 1;
    existing.lastMissedAt = Date.now();
    updated.mistakes[key] = existing;
  }
  return updated;
}

// Check and unlock new achievements
export function evaluateAchievements(stats: UserStats): { stats: UserStats; newlyUnlocked: Achievement[] } {
  const updated = { ...stats, achievements: { ...stats.achievements } };
  const newlyUnlocked: Achievement[] = [];

  const completedCount = Object.values(updated.levelProgress).filter((l) => l.completed).length;

  INITIAL_ACHIEVEMENTS.forEach((ach) => {
    if (updated.achievements[ach.id]) return; // already unlocked

    let shouldUnlock = false;

    switch (ach.id) {
      case 'first_step':
        if (completedCount >= 1) shouldUnlock = true;
        break;
      case 'five_stars':
        if (updated.totalStars >= 15) shouldUnlock = true;
        break;
      case 'streak_10':
        if (updated.highestStreak >= 10) shouldUnlock = true;
        break;
      case 'streak_25':
        if (updated.highestStreak >= 25) shouldUnlock = true;
        break;
      case 'solve_50':
        if (updated.totalQuestionsSolved >= 50) shouldUnlock = true;
        break;
      case 'solve_200':
        if (updated.totalQuestionsSolved >= 200) shouldUnlock = true;
        break;
      case 'seven_master':
        if ((updated.levelProgress[8]?.stars || 0) >= 3) shouldUnlock = true;
        break;
      case 'time_attack_20':
        if (updated.timeAttackHighScore >= 20) shouldUnlock = true;
        break;
      case 'all_levels':
        if (completedCount >= 12) shouldUnlock = true;
        break;
    }

    if (shouldUnlock) {
      updated.achievements[ach.id] = true;
      newlyUnlocked.push(ach);
    }
  });

  return { stats: updated, newlyUnlocked };
}
