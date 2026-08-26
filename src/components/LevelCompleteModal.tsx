import React, { useEffect } from 'react';
import { LevelConfig } from '../types';
import { playSound } from '../utils/audio';
import { Star, Trophy, RotateCcw, ArrowRight, Home, CheckCircle, Flame, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LevelCompleteModalProps {
  level?: LevelConfig;
  summary: {
    total: number;
    correct: number;
    wrong: number;
    timeSpentSeconds: number;
    maxStreak: number;
    score: number;
  };
  onNextLevel?: () => void;
  onRetry: () => void;
  onHome: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  level,
  summary,
  onNextLevel,
  onRetry,
  onHome,
}) => {
  const accuracy = Math.round((summary.correct / summary.total) * 100) || 0;

  // Star logic: 100% = 3 stars, >=80% = 2 stars, >=60% = 1 star, <60% = 0 stars
  let stars = 0;
  if (accuracy === 100) stars = 3;
  else if (accuracy >= 80) stars = 2;
  else if (accuracy >= 60) stars = 1;

  const isSuccess = stars > 0;

  useEffect(() => {
    if (isSuccess) {
      playSound('level_complete');
      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#3B82F6'],
      });
    } else {
      playSound('wrong');
    }
  }, [isSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-black relative overflow-hidden">
        {/* Glow backdrop */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 -mt-16 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isSuccess ? 'bg-amber-500/20' : 'bg-rose-500/20'
          }`}
        />

        {/* Title / Trophy Icon */}
        <div className="relative z-10 space-y-2 mb-6">
          <div className="text-4xl sm:text-5xl animate-bounce">
            {stars === 3 ? '🏆' : stars === 2 ? '⭐' : stars === 1 ? '🎉' : '💪'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {stars === 3
              ? 'Kusursuz Zafer!'
              : stars === 2
              ? 'Harika İş!'
              : stars === 1
              ? 'Tebrikler!'
              : 'Biraz Daha Pratik!'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {level?.title || 'Alıştırma Tamamlandı'}
          </p>
        </div>

        {/* Stars row */}
        <div className="flex items-center justify-center gap-3 my-5">
          {[1, 2, 3].map((starNum) => {
            const hasStar = starNum <= stars;
            return (
              <div
                key={starNum}
                className={`p-2 sm:p-3 rounded-2xl border transition-all duration-500 ${
                  hasStar
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 scale-110 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-600'
                }`}
              >
                <Star
                  size={32}
                  className={hasStar ? 'fill-amber-400 text-amber-400 drop-shadow' : ''}
                />
              </div>
            );
          })}
        </div>

        {/* Stat badges */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 my-6 text-left">
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <CheckCircle size={12} className="text-emerald-400" /> Doğruluk
            </div>
            <div className="text-lg font-black text-white mt-0.5">%{accuracy}</div>
            <div className="text-[10px] text-slate-400">{summary.correct}/{summary.total} Doğru</div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <Flame size={12} className="text-orange-400" /> Seri
            </div>
            <div className="text-lg font-black text-orange-400 mt-0.5">{summary.maxStreak}</div>
            <div className="text-[10px] text-slate-400">En Uzun Seri</div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <Clock size={12} className="text-indigo-400" /> Süre
            </div>
            <div className="text-lg font-black text-indigo-300 mt-0.5">{summary.timeSpentSeconds}s</div>
            <div className="text-[10px] text-slate-400">Puan: {summary.score}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {onNextLevel && isSuccess && (
            <button
              onClick={onNextLevel}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
            >
              <span>Sonraki Seviyeye Geç</span>
              <ArrowRight size={18} />
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onRetry}
              className="py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <RotateCcw size={15} />
              <span>Tekrar Oyna</span>
            </button>

            <button
              onClick={onHome}
              className="py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Home size={15} />
              <span>Seviyeler</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
