import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, LevelConfig, Question, QuestionMistake, UserStats } from './types';
import { Navbar } from './components/Navbar';
import { LevelSelect } from './components/LevelSelect';
import { QuizArena } from './components/QuizArena';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { MultiplicationTable } from './components/MultiplicationTable';
import { CustomPractice } from './components/CustomPractice';
import { TimeAttack } from './components/TimeAttack';
import { WeakSpotsModal } from './components/WeakSpotsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { LEVELS, generateQuestionsForLevel, generateCustomQuestions, generateChoices } from './utils/levels';
import {
  loadUserStats,
  saveUserStats,
  recordQuestionAttempt,
  evaluateAchievements,
  INITIAL_ACHIEVEMENTS,
} from './utils/storage';
import { setSoundEnabled, playSound } from './utils/audio';

export default function App() {
  // Persistence state
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [soundOn, setSoundOn] = useState(true);

  // Active View State
  const [currentMode, setCurrentMode] = useState<GameMode>('levels');
  const [activeQuiz, setActiveQuiz] = useState<{
    level?: LevelConfig;
    questions: Question[];
    title?: string;
    subtitle?: string;
    hasTimer?: boolean;
  } | null>(null);

  // Completed Level Modal State
  const [completedSummary, setCompletedSummary] = useState<{
    level?: LevelConfig;
    total: number;
    correct: number;
    wrong: number;
    timeSpentSeconds: number;
    maxStreak: number;
    score: number;
  } | null>(null);

  // Modals
  const [showAchievements, setShowAchievements] = useState(false);
  const [showWeakSpots, setShowWeakSpots] = useState(false);

  // Save stats on changes & check achievements
  useEffect(() => {
    saveUserStats(stats);
    const { stats: updatedStats, newlyUnlocked } = evaluateAchievements(stats);
    if (newlyUnlocked.length > 0) {
      setStats(updatedStats);
      saveUserStats(updatedStats);
      playSound('combo');
    }
  }, [stats]);

  // Sound toggle handler
  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    playSound('click');
  };

  // Start a specific level from the map
  const handleSelectLevel = (level: LevelConfig) => {
    const questions = generateQuestionsForLevel(level);
    setActiveQuiz({
      level,
      questions,
      title: level.title,
      subtitle: level.subtitle,
      hasTimer: level.hasTimer,
    });
  };

  // Finish quiz handler
  const handleQuizFinish = (summary: {
    total: number;
    correct: number;
    wrong: number;
    timeSpentSeconds: number;
    maxStreak: number;
    score: number;
  }) => {
    const accuracy = Math.round((summary.correct / summary.total) * 100) || 0;
    let earnedStars = 0;
    if (accuracy === 100) earnedStars = 3;
    else if (accuracy >= 80) earnedStars = 2;
    else if (accuracy >= 60) earnedStars = 1;

    // Update level progression if it was a standard level
    if (activeQuiz?.level) {
      const lvlId = activeQuiz.level.id;
      const prevProgress = stats.levelProgress[lvlId] || {
        levelId: lvlId,
        stars: 0,
        bestScore: 0,
        bestAccuracy: 0,
        unlocked: true,
        completed: false,
        playedCount: 0,
      };

      const updatedProgress = { ...stats.levelProgress };
      const newStars = Math.max(prevProgress.stars, earnedStars);

      updatedProgress[lvlId] = {
        ...prevProgress,
        stars: newStars,
        bestScore: Math.max(prevProgress.bestScore, summary.score),
        bestAccuracy: Math.max(prevProgress.bestAccuracy, accuracy),
        completed: prevProgress.completed || earnedStars > 0,
        playedCount: prevProgress.playedCount + 1,
      };

      // Unlock next level if completed
      if (earnedStars > 0 && lvlId < 12) {
        const nextLvlId = lvlId + 1;
        if (updatedProgress[nextLvlId]) {
          updatedProgress[nextLvlId].unlocked = true;
        }
      }

      // Update global stats
      const nextStats: UserStats = {
        ...stats,
        totalQuestionsSolved: stats.totalQuestionsSolved + summary.total,
        totalCorrect: stats.totalCorrect + summary.correct,
        totalWrong: stats.totalWrong + summary.wrong,
        highestStreak: Math.max(stats.highestStreak, summary.maxStreak),
        levelProgress: updatedProgress,
      };

      setStats(nextStats);
    } else {
      // Custom practice session completed
      const nextStats: UserStats = {
        ...stats,
        totalQuestionsSolved: stats.totalQuestionsSolved + summary.total,
        totalCorrect: stats.totalCorrect + summary.correct,
        totalWrong: stats.totalWrong + summary.wrong,
        highestStreak: Math.max(stats.highestStreak, summary.maxStreak),
      };
      setStats(nextStats);
    }

    // Show summary modal
    setCompletedSummary({
      level: activeQuiz?.level,
      ...summary,
    });
    setActiveQuiz(null);
  };

  // Next level navigation from completion modal
  const handleNextLevel = () => {
    if (!completedSummary?.level) return;
    const currentId = completedSummary.level.id;
    if (currentId < 12) {
      const nextLevel = LEVELS.find((l) => l.id === currentId + 1);
      if (nextLevel) {
        setCompletedSummary(null);
        handleSelectLevel(nextLevel);
        return;
      }
    }
    setCompletedSummary(null);
    setCurrentMode('levels');
  };

  // Retry the current level
  const handleRetry = () => {
    if (completedSummary?.level) {
      const lvl = completedSummary.level;
      setCompletedSummary(null);
      handleSelectLevel(lvl);
    } else {
      setCompletedSummary(null);
      setCurrentMode('levels');
    }
  };

  // Start Custom Practice from settings
  const handleStartCustomPractice = (
    selectedNumbers: number[],
    count = 10,
    type: 'multiplication' | 'missing_factor' = 'multiplication'
  ) => {
    const questions = generateCustomQuestions(selectedNumbers, count, type);
    setActiveQuiz({
      questions,
      title: `${selectedNumbers.join(', ')}'ler Tablosu Özel Pratik`,
      subtitle: `${count} Soru`,
      hasTimer: false,
    });
  };

  // Practice Weak Spots / Mistakes
  const handlePracticeMistakes = (mistakesList: QuestionMistake[]) => {
    if (mistakesList.length === 0) return;
    const questions: Question[] = mistakesList.slice(0, 10).map((m, idx) => {
      const ans = m.num1 * m.num2;
      return {
        id: `mistake_${idx}_${Date.now()}`,
        num1: m.num1,
        num2: m.num2,
        answer: ans,
        type: 'multiplication',
        promptText: `${m.num1} × ${m.num2} = ?`,
        displayNum1: String(m.num1),
        displayNum2: String(m.num2),
        displayResult: '?',
        targetValue: ans,
        choices: generateChoices(ans, m.num1, m.num2),
      };
    });

    setActiveQuiz({
      questions,
      title: 'Hata Defteri Özel Alıştırması',
      subtitle: 'Yanıldığın Soruları Güçlendir',
      hasTimer: false,
    });
  };

  // Time Attack High Score save
  const handleSaveTimeAttackHighScore = (newScore: number) => {
    setStats((prev) => ({
      ...prev,
      timeAttackHighScore: Math.max(prev.timeAttackHighScore, newScore),
    }));
  };

  const unlockedTrophiesCount = Object.values(stats.achievements).filter(Boolean).length;
  const mistakesCount = Object.keys(stats.mistakes).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setActiveQuiz(null);
          setCompletedSummary(null);
          setCurrentMode(mode);
        }}
        soundEnabled={soundOn}
        onToggleSound={handleToggleSound}
        totalStars={stats.totalStars}
        unlockedTrophiesCount={unlockedTrophiesCount}
        totalTrophiesCount={INITIAL_ACHIEVEMENTS.length}
        mistakesCount={mistakesCount}
        onOpenAchievements={() => setShowAchievements(true)}
        onOpenMistakes={() => setShowWeakSpots(true)}
      />

      {/* Main Container */}
      <main className="flex-1 pb-12">
        {/* Active Quiz takes priority if in game */}
        {activeQuiz ? (
          <QuizArena
            level={activeQuiz.level}
            questions={activeQuiz.questions}
            title={activeQuiz.title}
            subtitle={activeQuiz.subtitle}
            hasTimerOverride={activeQuiz.hasTimer}
            onFinish={handleQuizFinish}
            onExit={() => setActiveQuiz(null)}
          />
        ) : (
          <>
            {currentMode === 'levels' && (
              <LevelSelect
                levelProgress={stats.levelProgress}
                onSelectLevel={handleSelectLevel}
                totalStars={stats.totalStars}
              />
            )}

            {currentMode === 'table' && (
              <MultiplicationTable
                onStartCustomPractice={(nums) => handleStartCustomPractice(nums, 10, 'multiplication')}
              />
            )}

            {currentMode === 'custom' && (
              <CustomPractice
                onStart={(nums, count, type) => handleStartCustomPractice(nums, count, type)}
              />
            )}

            {currentMode === 'time_attack' && (
              <TimeAttack
                highScore={stats.timeAttackHighScore}
                onSaveHighScore={handleSaveTimeAttackHighScore}
                onExit={() => setCurrentMode('levels')}
              />
            )}
          </>
        )}
      </main>

      {/* Level Completion / Results Modal */}
      {completedSummary && (
        <LevelCompleteModal
          level={completedSummary.level}
          summary={completedSummary}
          onNextLevel={completedSummary.level?.id && completedSummary.level.id < 12 ? handleNextLevel : undefined}
          onRetry={handleRetry}
          onHome={() => {
            setCompletedSummary(null);
            setCurrentMode('levels');
          }}
        />
      )}

      {/* Achievements Modal */}
      {showAchievements && (
        <AchievementsModal
          unlockedMap={stats.achievements}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {/* Weak Spots / Mistakes Modal */}
      {showWeakSpots && (
        <WeakSpotsModal
          mistakes={stats.mistakes}
          onClose={() => setShowWeakSpots(false)}
          onPracticeMistakes={handlePracticeMistakes}
        />
      )}
    </div>
  );
}
