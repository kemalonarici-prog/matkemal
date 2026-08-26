import React from 'react';
import { Achievement } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../utils/storage';
import { Trophy, X, CheckCircle, Lock } from 'lucide-react';

interface AchievementsModalProps {
  unlockedMap: Record<string, boolean>;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  unlockedMap,
  onClose,
}) => {
  const unlockedCount = Object.values(unlockedMap).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Trophy size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">Başarımlar ve Rozetler</h2>
              <p className="text-xs text-slate-400">
                {unlockedCount} / {INITIAL_ACHIEVEMENTS.length} Rozet Kazanıldı
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="my-4 overflow-y-auto pr-1 space-y-3 flex-1">
          {INITIAL_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedMap[ach.id];

            return (
              <div
                key={ach.id}
                className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-amber-500/10 border-amber-500/40 text-slate-100 shadow-md shadow-amber-500/5'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-60'
                }`}
              >
                <div
                  className={`text-2xl p-2 rounded-xl border flex items-center justify-center ${
                    isUnlocked
                      ? 'bg-amber-500/20 border-amber-500/40 shadow-sm'
                      : 'bg-slate-800/80 border-slate-700 grayscale'
                  }`}
                >
                  {ach.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-extrabold text-sm text-white">{ach.title}</h3>
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                        <CheckCircle size={13} /> Kazanıldı
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                        <Lock size={13} /> Kilitli
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{ach.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
