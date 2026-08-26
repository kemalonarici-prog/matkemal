import React from 'react';
import { LevelConfig, LevelProgress } from '../types';
import { LEVELS, WORLDS } from '../utils/levels';
import { Lock, Play, Star, CheckCircle2, Award, Zap, HelpCircle } from 'lucide-react';
import { playSound } from '../utils/audio';

interface LevelSelectProps {
  levelProgress: Record<number, LevelProgress>;
  onSelectLevel: (level: LevelConfig) => void;
  totalStars: number;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  levelProgress,
  onSelectLevel,
  totalStars,
}) => {
  const completedCount = (Object.values(levelProgress) as LevelProgress[]).filter((l) => l.completed).length;

  const handleLevelClick = (level: LevelConfig, isUnlocked: boolean) => {
    if (!isUnlocked) {
      playSound('wrong');
      return;
    }
    playSound('click');
    onSelectLevel(level);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-8 animate-fadeIn">
      {/* Hero / Progress Status Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/20 p-6 shadow-xl shadow-indigo-950/40">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-2">
              <Zap size={14} />
              <span>Kolaydan Zora Macera Haritası</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Çarpım Tablosunu Fethet!
            </h1>
            <p className="text-sm text-slate-300 max-w-xl mt-1">
              1'ler ve 2'lerle başla, ritmik katları keşfet, zorlu 7 ve 8'leri yen ve Efsanevi Seviyeye ulaş!
            </p>
          </div>

          {/* Stat summary pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-center min-w-[90px]">
              <div className="text-xs text-slate-400 font-semibold">İlerleme</div>
              <div className="text-lg font-black text-emerald-400">{completedCount} / 12</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-center min-w-[90px]">
              <div className="text-xs text-slate-400 font-semibold">Yıldızlar</div>
              <div className="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
                <span>⭐</span>
                <span>{totalStars} / 36</span>
              </div>
            </div>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
            <span>Genel Tamamlanma Oranı</span>
            <span>{Math.round((completedCount / 12) * 100)}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-indigo-500 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / 12) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Worlds and Level Cards */}
      <div className="space-y-10">
        {WORLDS.map((world) => {
          const worldLevels = LEVELS.filter((lvl) => lvl.worldId === world.id);
          const worldCompleted = worldLevels.filter((lvl) => levelProgress[lvl.id]?.completed).length;

          return (
            <section key={world.id} className="space-y-4">
              {/* World Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="text-2xl p-2 rounded-xl bg-slate-800/80 border border-slate-700 shadow-inner">
                    {world.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                      {world.name}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">{world.subtitle}</p>
                  </div>
                </div>
                <div className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 self-start sm:self-auto">
                  {worldCompleted} / {worldLevels.length} Tamamlandı
                </div>
              </div>

              {/* Grid of Levels in this World */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {worldLevels.map((lvl) => {
                  const progress = levelProgress[lvl.id] || {
                    levelId: lvl.id,
                    stars: 0,
                    bestScore: 0,
                    bestAccuracy: 0,
                    unlocked: lvl.id === 1,
                    completed: false,
                    playedCount: 0,
                  };

                  const isUnlocked = progress.unlocked;
                  const isCompleted = progress.completed;
                  const stars = progress.stars || 0;

                  return (
                    <div
                      key={lvl.id}
                      id={`level-card-${lvl.id}`}
                      onClick={() => handleLevelClick(lvl, isUnlocked)}
                      className={`group relative rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between overflow-hidden ${
                        isUnlocked
                          ? 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer active:scale-[0.98]'
                          : 'bg-slate-950/60 border-slate-900/80 opacity-65 cursor-not-allowed'
                      }`}
                    >
                      {/* Accent glow corner */}
                      {isUnlocked && (
                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
                      )}

                      {/* Card Top */}
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-black text-white group-hover:border-indigo-400 transition-colors">
                              {lvl.id}
                            </span>
                            <span className="text-xl">{lvl.icon}</span>
                          </div>

                          {/* Star badges or Lock status */}
                          {isUnlocked ? (
                            <div className="flex items-center gap-0.5 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800">
                              {[1, 2, 3].map((starNum) => (
                                <Star
                                  key={starNum}
                                  size={15}
                                  className={
                                    starNum <= stars
                                      ? 'text-amber-400 fill-amber-400 filter drop-shadow'
                                      : 'text-slate-600'
                                  }
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 text-xs font-bold">
                              <Lock size={12} />
                              <span>Kilitli</span>
                            </div>
                          )}
                        </div>

                        <h3 className="font-extrabold text-base text-white group-hover:text-indigo-300 transition-colors">
                          {lvl.title}
                        </h3>
                        <p className="text-xs text-indigo-400/90 font-semibold mb-2">{lvl.subtitle}</p>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                          {lvl.description}
                        </p>
                      </div>

                      {/* Card Bottom / Badges & Action */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                            {lvl.questionCount} Soru
                          </span>
                          {lvl.hasTimer && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                              ⏱️ Süreli
                            </span>
                          )}
                        </div>

                        {isUnlocked ? (
                          <div className="flex items-center gap-1 font-bold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all">
                            <span>{isCompleted ? 'Tekrar Oyna' : 'Başla'}</span>
                            <Play size={12} className="fill-current" />
                          </div>
                        ) : (
                          <span className="text-slate-600 font-medium">Seviye {lvl.id - 1}'i bitir</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
