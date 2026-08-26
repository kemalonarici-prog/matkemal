import React from 'react';
import { GameMode } from '../types';
import { Volume2, VolumeX, Trophy, AlertCircle, Sparkles, BookOpen, Layers, Flame, Zap } from 'lucide-react';
import { playSound } from '../utils/audio';

interface NavbarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  totalStars: number;
  unlockedTrophiesCount: number;
  totalTrophiesCount: number;
  mistakesCount: number;
  onOpenAchievements: () => void;
  onOpenMistakes: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  soundEnabled,
  onToggleSound,
  totalStars,
  unlockedTrophiesCount,
  totalTrophiesCount,
  mistakesCount,
  onOpenAchievements,
  onOpenMistakes,
}) => {
  const handleModeClick = (mode: GameMode) => {
    playSound('click');
    onSelectMode(mode);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 sm:px-6 shadow-lg shadow-black/20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand / Title */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div 
            onClick={() => handleModeClick('levels')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center shadow-md shadow-orange-500/30 text-white font-black text-xl tracking-tight group-hover:scale-105 transition-transform">
              ×
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-white tracking-tight">Çarpım Tablosu</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Macerası
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Kolaydan Zora Matematik Oyunu</p>
            </div>
          </div>

          {/* Quick stats on mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <span>⭐</span>
              <span>{totalStars}</span>
            </div>
            <button
              onClick={onToggleSound}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 active:scale-95 transition-all"
              aria-label="Sesi Aç/Kapat"
            >
              {soundEnabled ? <Volume2 size={18} className="text-emerald-400" /> : <VolumeX size={18} className="text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800/80 overflow-x-auto max-w-full">
          <button
            id="nav-levels-tab"
            onClick={() => handleModeClick('levels')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              currentMode === 'levels'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers size={16} />
            <span>Seviyeler</span>
          </button>

          <button
            id="nav-table-tab"
            onClick={() => handleModeClick('table')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              currentMode === 'table'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen size={16} />
            <span>Tablo & Öğren</span>
          </button>

          <button
            id="nav-custom-tab"
            onClick={() => handleModeClick('custom')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              currentMode === 'custom'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles size={16} />
            <span>Özel Pratik</span>
          </button>

          <button
            id="nav-time-tab"
            onClick={() => handleModeClick('time_attack')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              currentMode === 'time_attack'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Zap size={16} />
            <span>Hız Maratonu</span>
          </button>
        </nav>

        {/* Right: Stars, Trophies, Mistakes & Sound */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Stars Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-bold shadow-sm">
            <span className="text-base animate-pulse">⭐</span>
            <span>{totalStars} / 36</span>
          </div>

          {/* Mistakes / Weak spots */}
          <button
            id="open-mistakes-btn"
            onClick={onOpenMistakes}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              mistakesCount > 0
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            title="Hata Defteri & Zayıf Noktalar"
          >
            <AlertCircle size={15} className={mistakesCount > 0 ? 'text-rose-400' : ''} />
            <span>{mistakesCount > 0 ? `${mistakesCount} Hata` : 'Hata Defteri'}</span>
          </button>

          {/* Achievements */}
          <button
            id="open-trophies-btn"
            onClick={onOpenAchievements}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all shadow-sm"
            title="Başarımlar ve Rozetler"
          >
            <Trophy size={15} className="text-amber-400" />
            <span>{unlockedTrophiesCount}/{totalTrophiesCount}</span>
          </button>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-white transition-all"
            title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
          >
            {soundEnabled ? <Volume2 size={18} className="text-emerald-400" /> : <VolumeX size={18} className="text-slate-500" />}
          </button>
        </div>
      </div>
    </header>
  );
};
