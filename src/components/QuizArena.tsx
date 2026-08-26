import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnswerMode, LevelConfig, Question } from '../types';
import { playSound } from '../utils/audio';
import { Eye, EyeOff, Flame, ArrowLeft, RotateCcw, HelpCircle, Check, X, Sparkles, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizArenaProps {
  level?: LevelConfig;
  questions: Question[];
  onFinish: (summary: {
    total: number;
    correct: number;
    wrong: number;
    timeSpentSeconds: number;
    maxStreak: number;
    score: number;
  }) => void;
  onExit: () => void;
  title?: string;
  subtitle?: string;
  hasTimerOverride?: boolean;
}

export const QuizArena: React.FC<QuizArenaProps> = ({
  level,
  questions,
  onFinish,
  onExit,
  title,
  subtitle,
  hasTimerOverride,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [numpadInput, setNumpadInput] = useState<string>('');
  const [answerMode, setAnswerMode] = useState<AnswerMode>('choice');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showVisualMatrix, setShowVisualMatrix] = useState(false);

  // Stats for the active run
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [score, setScore] = useState(0);

  // Timer states
  const isTimed = hasTimerOverride !== undefined ? hasTimerOverride : (level?.hasTimer ?? false);
  const timeLimit = level?.timePerQuestion || 15;
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  const startTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentIndex];

  // Trigger celebration particle effect
  const triggerMiniConfetti = () => {
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#F59E0B', '#6366F1', '#EC4899'],
    });
  };

  // Timer Tick
  useEffect(() => {
    const totalTimer = setInterval(() => {
      setTotalTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(totalTimer);
  }, []);

  // Per-question timer
  useEffect(() => {
    if (!isTimed || isAnswerSubmitted) return;

    setTimeLeft(timeLimit);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          handleAnswerSubmission(-9999); // Timeout counts as wrong
          return 0;
        }
        if (prev <= 4) {
          playSound('countdown');
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [currentIndex, isTimed, isAnswerSubmitted, timeLimit]);

  // Answer handler
  const handleAnswerSubmission = useCallback(
    (userAnswer: number) => {
      if (isAnswerSubmitted || !currentQuestion) return;

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      setSelectedChoice(userAnswer);
      setIsAnswerSubmitted(true);

      const target = currentQuestion.targetValue;
      const correct = userAnswer === target;
      setIsCorrect(correct);

      if (correct) {
        playSound('correct');
        const newStreak = currentStreak + 1;
        setCurrentStreak(newStreak);
        setMaxStreak((prev) => Math.max(prev, newStreak));
        setCorrectCount((prev) => prev + 1);

        // Score bonus with combo multiplier
        const multiplier = newStreak >= 10 ? 3 : newStreak >= 5 ? 2 : newStreak >= 3 ? 1.5 : 1;
        const timeBonus = isTimed ? Math.max(1, timeLeft) * 5 : 10;
        const gainedScore = Math.round(100 * multiplier + timeBonus);
        setScore((prev) => prev + gainedScore);

        if (newStreak % 5 === 0) {
          playSound('combo');
          triggerMiniConfetti();
        }
      } else {
        playSound('wrong');
        setCurrentStreak(0);
        setWrongCount((prev) => prev + 1);
      }

      // Auto advance to next question after a brief feedback pause
      const timeoutDuration = correct ? 800 : 2000;
      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedChoice(null);
          setNumpadInput('');
          setIsAnswerSubmitted(false);
          setIsCorrect(null);
        } else {
          // Finished level!
          onFinish({
            total: questions.length,
            correct: correctCount + (correct ? 1 : 0),
            wrong: wrongCount + (correct ? 0 : 1),
            timeSpentSeconds: totalTimeSpent + 1,
            maxStreak: Math.max(maxStreak, correct ? currentStreak + 1 : currentStreak),
            score: score + (correct ? 100 : 0),
          });
        }
      }, timeoutDuration);
    },
    [
      isAnswerSubmitted,
      currentQuestion,
      currentStreak,
      isTimed,
      timeLeft,
      currentIndex,
      questions.length,
      onFinish,
      correctCount,
      wrongCount,
      totalTimeSpent,
      maxStreak,
      score,
    ]
  );

  // Keyboard shortcut listener (1-4 for choices, 0-9 & Enter for numpad)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswerSubmitted) return;

      if (answerMode === 'choice') {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const index = parseInt(e.key, 10) - 1;
          if (currentQuestion?.choices[index] !== undefined) {
            handleAnswerSubmission(currentQuestion.choices[index]);
          }
        }
      } else {
        // Numpad Mode
        if (/^[0-9]$/.test(e.key)) {
          setNumpadInput((prev) => (prev.length < 4 ? prev + e.key : prev));
        } else if (e.key === 'Backspace') {
          setNumpadInput((prev) => prev.slice(0, -1));
        } else if (e.key === 'Enter') {
          if (numpadInput.trim() !== '') {
            handleAnswerSubmission(parseInt(numpadInput, 10));
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [answerMode, isAnswerSubmitted, currentQuestion, numpadInput, handleAnswerSubmission]);

  const handleNumpadPress = (digit: string) => {
    if (isAnswerSubmitted) return;
    playSound('click');
    if (digit === 'del') {
      setNumpadInput((prev) => prev.slice(0, -1));
    } else if (digit === 'enter') {
      if (numpadInput.trim() !== '') {
        handleAnswerSubmission(parseInt(numpadInput, 10));
      }
    } else {
      setNumpadInput((prev) => (prev.length < 4 ? prev + digit : prev));
    }
  };

  if (!currentQuestion) return null;

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;
  const timePercentage = isTimed ? (timeLeft / timeLimit) * 100 : 100;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-5 animate-fadeIn select-none">
      {/* Top Bar: Exit button, Level info, Mode switch, Streak */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all"
        >
          <ArrowLeft size={16} />
          <span>Çıkış</span>
        </button>

        {/* Header Title */}
        <div className="text-center">
          <div className="text-xs font-extrabold text-indigo-400">
            {title || level?.title || 'Çarpım Alıştırması'}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Soru {currentIndex + 1} / {questions.length}
          </div>
        </div>

        {/* Answer mode switch */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setAnswerMode('choice')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              answerMode === 'choice'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Şıklı
          </button>
          <button
            onClick={() => setAnswerMode('numpad')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              answerMode === 'numpad'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Yazmalı
          </button>
        </div>
      </div>

      {/* Progress & Stats Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          {/* Streak Indicator */}
          <div className="flex items-center gap-1.5">
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all ${
                currentStreak >= 5
                  ? 'bg-orange-500/20 border-orange-500/50 text-orange-300 animate-pulse'
                  : currentStreak >= 2
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
              }`}
            >
              <Flame
                size={16}
                className={currentStreak >= 5 ? 'text-orange-400 fill-orange-400' : 'text-amber-400'}
              />
              <span>{currentStreak} Seri</span>
              {currentStreak >= 5 && (
                <span className="text-[10px] font-black px-1 rounded bg-orange-500 text-slate-950">
                  {currentStreak >= 10 ? '3x' : '2x'}
                </span>
              )}
            </div>

            <div className="text-slate-400 text-xs font-semibold hidden sm:block">
              Puan: <span className="text-white font-bold">{score}</span>
            </div>
          </div>

          {/* Correct / Wrong pills */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-emerald-400">
              <Check size={14} /> {correctCount}
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <X size={14} /> {wrongCount}
            </span>
          </div>
        </div>

        {/* Linear Question Progress */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Timed countdown bar (if timed) */}
        {isTimed && (
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock size={12} /> Kalan Süre
              </span>
              <span
                className={timeLeft <= 4 ? 'text-rose-400 font-extrabold animate-ping' : 'text-amber-300'}
              >
                {timeLeft}s
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  timeLeft <= 4 ? 'bg-rose-500' : 'bg-amber-400'
                }`}
                style={{ width: `${timePercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Question Stage Card */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 text-center transition-all duration-300 shadow-xl ${
          isAnswerSubmitted
            ? isCorrect
              ? 'bg-emerald-950/40 border-emerald-500/50 shadow-emerald-500/10'
              : 'bg-rose-950/40 border-rose-500/50 shadow-rose-500/10'
            : 'bg-slate-900/90 border-slate-800 shadow-black/30'
        }`}
      >
        {/* Subtle background visual pattern */}
        <div className="absolute inset-0 bg-radial-gradient from-indigo-500/5 to-transparent pointer-events-none" />

        {/* Question Type Banner */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold mb-4">
          <Sparkles size={13} className="text-amber-400" />
          <span>
            {currentQuestion.type === 'missing_factor'
              ? 'Gizemli Çarpanı Bul'
              : 'İşlemin Sonucunu Bul'}
          </span>
        </div>

        {/* Large Equation Display */}
        <div className="my-3 flex items-center justify-center gap-3 sm:gap-4 font-black tracking-tight text-3xl sm:text-5xl lg:text-6xl text-white">
          <span
            className={`px-3 py-1.5 rounded-2xl ${
              currentQuestion.displayNum1 === '?'
                ? 'bg-amber-500/20 text-amber-300 border-2 border-dashed border-amber-500/60'
                : 'text-slate-100'
            }`}
          >
            {currentQuestion.displayNum1}
          </span>
          <span className="text-indigo-400">×</span>
          <span
            className={`px-3 py-1.5 rounded-2xl ${
              currentQuestion.displayNum2 === '?'
                ? 'bg-amber-500/20 text-amber-300 border-2 border-dashed border-amber-500/60'
                : 'text-slate-100'
            }`}
          >
            {currentQuestion.displayNum2}
          </span>
          <span className="text-indigo-400">=</span>
          <span
            className={`px-3 py-1.5 rounded-2xl ${
              currentQuestion.displayResult === '?'
                ? 'bg-indigo-500/20 text-indigo-300 border-2 border-dashed border-indigo-500/60'
                : 'text-slate-100'
            }`}
          >
            {currentQuestion.displayResult}
          </span>
        </div>

        {/* Feedback Message on submission */}
        {isAnswerSubmitted && (
          <div className="mt-4 animate-fadeIn">
            {isCorrect ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-sm sm:text-base">
                <Check size={18} />
                <span>Harika! Doğru Cevap: {currentQuestion.targetValue}</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-extrabold text-sm sm:text-base">
                  <X size={18} />
                  <span>Doğru Cevap: {currentQuestion.targetValue}</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  {currentQuestion.num1} × {currentQuestion.num2} = {currentQuestion.answer}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Visual Dot Matrix Toggle */}
        <div className="mt-4">
          <button
            onClick={() => setShowVisualMatrix(!showVisualMatrix)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 font-medium transition-colors"
          >
            {showVisualMatrix ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{showVisualMatrix ? 'Görsel Mantığı Gizle' : 'Görsel Mantığı Göster'}</span>
          </button>
        </div>

        {/* Visual Matrix Display (Rows x Cols of dots/stars to teach concept) */}
        {showVisualMatrix && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 inline-block max-w-full overflow-x-auto animate-fadeIn">
            <div className="text-xs text-indigo-300 font-semibold mb-2">
              {currentQuestion.num1} satır × {currentQuestion.num2} sütun = {currentQuestion.answer} adet
            </div>
            <div
              className="grid gap-1.5 justify-center"
              style={{
                gridTemplateColumns: `repeat(${Math.min(currentQuestion.num2, 12)}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: currentQuestion.num1 * currentQuestion.num2 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-[10px] text-slate-950 font-bold shadow-sm shadow-orange-500/30"
                >
                  •
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Answer Controls: Multiple Choice OR Numpad */}
      {answerMode === 'choice' ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {currentQuestion.choices.map((choice, idx) => {
            const isThisSelected = selectedChoice === choice;
            const isThisCorrect = choice === currentQuestion.targetValue;

            let buttonStyle =
              'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700 text-slate-100 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10';

            if (isAnswerSubmitted) {
              if (isThisCorrect) {
                buttonStyle =
                  'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/30 scale-[1.02]';
              } else if (isThisSelected && !isThisCorrect) {
                buttonStyle =
                  'bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-600/30 opacity-90';
              } else {
                buttonStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-40';
              }
            }

            return (
              <button
                key={idx}
                id={`quiz-choice-${idx}`}
                disabled={isAnswerSubmitted}
                onClick={() => handleAnswerSubmission(choice)}
                className={`relative group rounded-2xl border p-4 sm:p-5 flex items-center justify-between font-black text-2xl sm:text-3xl transition-all duration-200 active:scale-95 disabled:cursor-default ${buttonStyle}`}
              >
                <span className="w-7 h-7 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-center text-xs text-slate-400 group-hover:text-white group-hover:border-slate-500 transition-colors">
                  {idx + 1}
                </span>
                <span className="flex-1 text-center font-extrabold">{choice}</span>
                <span className="w-7" />
              </button>
            );
          })}
        </div>
      ) : (
        /* Numpad Input Mode */
        <div className="max-w-xs mx-auto space-y-3">
          {/* Typed value display */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-center min-h-[52px] flex items-center justify-center">
            <span className="text-3xl font-black tracking-widest text-indigo-300">
              {numpadInput || <span className="text-slate-600">_</span>}
            </span>
          </div>

          {/* 3x4 Numpad Grid */}
          <div className="grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'enter'].map((key) => {
              if (key === 'del') {
                return (
                  <button
                    key={key}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleNumpadPress('del')}
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-rose-400 font-bold text-sm border border-slate-700 active:scale-95 transition-all flex items-center justify-center"
                  >
                    Sil
                  </button>
                );
              }
              if (key === 'enter') {
                return (
                  <button
                    key={key}
                    disabled={isAnswerSubmitted || numpadInput === ''}
                    onClick={() => handleNumpadPress('enter')}
                    className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm border border-indigo-400 active:scale-95 transition-all flex items-center justify-center"
                  >
                    Onayla
                  </button>
                );
              }
              return (
                <button
                  key={key}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleNumpadPress(key)}
                  className="p-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-black text-xl border border-slate-700 active:scale-95 transition-all flex items-center justify-center"
                >
                  {key}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
