import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Question } from '../types';
import { generateChoices } from '../utils/levels';
import { playSound } from '../utils/audio';
import { Zap, Flame, Clock, Trophy, RotateCcw, ArrowLeft, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TimeAttackProps {
  highScore: number;
  onSaveHighScore: (newScore: number) => void;
  onExit: () => void;
}

export const TimeAttack: React.FC<TimeAttackProps> = ({
  highScore,
  onSaveHighScore,
  onExit,
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; key: number } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateNextQuestion = useCallback((): Question => {
    // 2 to 9 or 10
    const n1 = Math.floor(Math.random() * 9) + 2;
    const n2 = Math.floor(Math.random() * 9) + 2;
    const ans = n1 * n2;
    const choices = generateChoices(ans, n1, n2);

    return {
      id: `ta_${Date.now()}_${Math.random()}`,
      num1: n1,
      num2: n2,
      answer: ans,
      type: 'multiplication',
      promptText: `${n1} × ${n2} = ?`,
      displayNum1: String(n1),
      displayNum2: String(n2),
      displayResult: '?',
      targetValue: ans,
      choices,
    };
  }, []);

  const startGame = () => {
    playSound('click');
    setTimeLeft(60);
    setScore(0);
    setCurrentStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setWrongCount(0);
    setCurrentQuestion(generateNextQuestion());
    setGameState('playing');
  };

  // Timer loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setGameState('gameover');
          return 0;
        }
        if (prev <= 5) {
          playSound('countdown');
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Handle Game Over
  useEffect(() => {
    if (gameState === 'gameover') {
      if (score > highScore) {
        onSaveHighScore(score);
        playSound('level_complete');
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.6 },
        });
      } else {
        playSound('wrong');
      }
    }
  }, [gameState, score, highScore, onSaveHighScore]);

  // Handle User Answer
  const handleAnswer = (choice: number) => {
    if (!currentQuestion || gameState !== 'playing') return;

    const isAnsCorrect = choice === currentQuestion.targetValue;
    setFeedback({ isCorrect: isAnsCorrect, key: Date.now() });

    if (isAnsCorrect) {
      playSound('correct');
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));
      setCorrectCount((prev) => prev + 1);

      // Score formula
      const multiplier = newStreak >= 10 ? 3 : newStreak >= 5 ? 2 : 1;
      const points = 10 * multiplier;
      setScore((prev) => prev + points);

      // Time bonus
      setTimeLeft((prev) => Math.min(60, prev + (newStreak >= 5 ? 2 : 1)));

      if (newStreak % 5 === 0) {
        playSound('combo');
      }
    } else {
      playSound('wrong');
      setCurrentStreak(0);
      setWrongCount((prev) => prev + 1);
      // Slight time penalty
      setTimeLeft((prev) => Math.max(1, prev - 2));
    }

    setCurrentQuestion(generateNextQuestion());
  };

  // Keyboard shortcut listener (1-4)
  useEffect(() => {
    if (gameState !== 'playing' || !currentQuestion) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentQuestion.choices[idx] !== undefined) {
          handleAnswer(currentQuestion.choices[idx]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentQuestion, handleAnswer]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-6 animate-fadeIn select-none">
      {/* Intro Screen */}
      {gameState === 'intro' && (
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20">
            ⚡
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white">60 Saniye Hız Maratonu</h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Zamana karşı yarış! Seri doğru cevaplar vererek kombo puanları topla ve süreni uzat!
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 px-6 text-center">
              <div className="text-xs text-slate-400 font-semibold flex items-center gap-1 justify-center">
                <Trophy size={14} className="text-amber-400" /> En Yüksek Skor
              </div>
              <div className="text-2xl font-black text-amber-400 mt-1">{highScore} Puan</div>
            </div>
          </div>

          <button
            id="start-time-attack-btn"
            onClick={startGame}
            className="w-full max-w-sm mx-auto py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-orange-500/30 active:scale-95 transition-all"
          >
            <Zap size={20} className="fill-current" />
            <span>Yarışı Başlat (60s)</span>
          </button>
        </div>
      )}

      {/* Playing Screen */}
      {gameState === 'playing' && currentQuestion && (
        <div className="space-y-5">
          {/* Top Timer & Header */}
          <div className="flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <button
              onClick={() => {
                if (timerRef.current) clearInterval(timerRef.current);
                setGameState('intro');
              }}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white font-semibold"
            >
              <ArrowLeft size={14} /> Çık
            </button>

            {/* Score & Streak */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-[10px] text-slate-400 font-bold">Puan</div>
                <div className="text-xl font-black text-white">{score}</div>
              </div>

              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-xl border text-xs font-bold ${
                  currentStreak >= 5
                    ? 'bg-orange-500/20 border-orange-500/50 text-orange-300 animate-pulse'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                <Flame size={15} className="text-orange-400 fill-orange-400" />
                <span>{currentStreak} Seri</span>
              </div>
            </div>

            {/* Big Countdown Timer */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
              <Clock size={18} className={timeLeft <= 10 ? 'text-rose-400 animate-spin' : 'text-amber-400'} />
              <span
                className={`text-xl font-black ${
                  timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-amber-300'
                }`}
              >
                {timeLeft}s
              </span>
            </div>
          </div>

          {/* Time Progress Bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                timeLeft <= 10 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
              }`}
              style={{ width: `${(timeLeft / 60) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-8 sm:p-12 text-center shadow-xl">
            <div className="text-4xl sm:text-6xl font-black text-white tracking-tight">
              <span>{currentQuestion.num1}</span>
              <span className="text-indigo-400 mx-3">×</span>
              <span>{currentQuestion.num2}</span>
              <span className="text-indigo-400 mx-3">=</span>
              <span className="text-amber-400">?</span>
            </div>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {currentQuestion.choices.map((choice, idx) => (
              <button
                key={idx}
                id={`time-attack-choice-${idx}`}
                onClick={() => handleAnswer(choice)}
                className="group p-5 sm:p-6 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-amber-400 text-white font-black text-2xl sm:text-3xl flex items-center justify-between active:scale-95 transition-all shadow-lg"
              >
                <span className="text-xs text-slate-500 group-hover:text-slate-300">{idx + 1}</span>
                <span>{choice}</span>
                <span className="w-3" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'gameover' && (
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-6 shadow-2xl">
          <div className="text-5xl">⏱️</div>
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-white">Süre Doldu!</h2>
            <p className="text-sm text-slate-400">Harika bir hız turu sergiledin!</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Skor</div>
              <div className="text-2xl font-black text-amber-400 mt-0.5">{score}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Doğru</div>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">{correctCount}</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold">Max Seri</div>
              <div className="text-2xl font-black text-orange-400 mt-0.5">{maxStreak}</div>
            </div>
          </div>

          {score > highScore && (
            <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm">
              🎉 Yeni En Yüksek Skorun: {score} Puan!
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={startGame}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
            >
              <RotateCcw size={16} />
              <span>Tekrar Yarış</span>
            </button>
            <button
              onClick={onExit}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm active:scale-95 transition-all"
            >
              Ana Menüye Dön
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
