import React, { useState } from 'react';
import { playSound } from '../utils/audio';
import { Sparkles, Play, Eye, BookOpen, Check } from 'lucide-react';

interface MultiplicationTableProps {
  onStartCustomPractice: (numbers: number[]) => void;
}

export const MultiplicationTable: React.FC<MultiplicationTableProps> = ({
  onStartCustomPractice,
}) => {
  const [maxDimension, setMaxDimension] = useState<10 | 12>(10);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>({
    row: 6,
    col: 7,
  });
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const activeRow = hoveredCell?.row || selectedCell?.row || 0;
  const activeCol = hoveredCell?.col || selectedCell?.col || 0;

  const currentProduct = activeRow && activeCol ? activeRow * activeCol : 42;

  const handleCellClick = (r: number, c: number) => {
    playSound('click');
    setSelectedCell({ row: r, col: c });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-8 animate-fadeIn select-none">
      {/* Top Banner & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
            <BookOpen size={15} />
            <span>İnteraktif Çarpım Tablosu & Görsel Öğrenme</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Tabloyu İncele ve Mantığını Kavra
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Bir kutucuğa tıklayarak çarpmanın görsel matrisini ve ritmik sayma adımlarını gör.
          </p>
        </div>

        {/* 10x10 vs 12x12 toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold self-end sm:self-auto">
          <button
            onClick={() => {
              playSound('click');
              setMaxDimension(10);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              maxDimension === 10
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            10 × 10 (Klasik)
          </button>
          <button
            onClick={() => {
              playSound('click');
              setMaxDimension(12);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              maxDimension === 12
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            12 × 12 (Genişletilmiş)
          </button>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: The Interactive Multiplication Grid */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 overflow-x-auto shadow-xl">
          <div className="min-w-[400px]">
            {/* Header row indicator */}
            <div
              className="grid gap-1 text-center font-bold text-xs mb-1"
              style={{ gridTemplateColumns: `40px repeat(${maxDimension}, minmax(0, 1fr))` }}
            >
              <div className="text-indigo-400 font-black flex items-center justify-center">×</div>
              {Array.from({ length: maxDimension }, (_, i) => i + 1).map((colNum) => (
                <div
                  key={`col-head-${colNum}`}
                  className={`py-1.5 rounded-lg transition-colors text-xs font-extrabold ${
                    activeCol === colNum
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'bg-slate-800/80 text-slate-300'
                  }`}
                >
                  {colNum}
                </div>
              ))}
            </div>

            {/* Grid rows */}
            {Array.from({ length: maxDimension }, (_, rIdx) => {
              const rowNum = rIdx + 1;
              const isRowActive = activeRow === rowNum;

              return (
                <div
                  key={`row-${rowNum}`}
                  className="grid gap-1 text-center font-semibold text-xs sm:text-sm my-1"
                  style={{ gridTemplateColumns: `40px repeat(${maxDimension}, minmax(0, 1fr))` }}
                >
                  {/* Row Header */}
                  <div
                    className={`py-2 rounded-lg flex items-center justify-center font-extrabold transition-colors ${
                      isRowActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                        : 'bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    {rowNum}
                  </div>

                  {/* Cells */}
                  {Array.from({ length: maxDimension }, (_, cIdx) => {
                    const colNum = cIdx + 1;
                    const val = rowNum * colNum;
                    const isSelected = selectedCell?.row === rowNum && selectedCell?.col === colNum;
                    const isHighlighted = isRowActive || activeCol === colNum;
                    const isDiagonalSquare = rowNum === colNum; // square numbers e.g. 7x7=49

                    return (
                      <button
                        key={`cell-${rowNum}-${colNum}`}
                        id={`grid-cell-${rowNum}-${colNum}`}
                        onClick={() => handleCellClick(rowNum, colNum)}
                        onMouseEnter={() => setHoveredCell({ row: rowNum, col: colNum })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`h-9 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-150 active:scale-90 font-bold ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/40 ring-2 ring-emerald-300 scale-105 z-10'
                            : isHighlighted
                            ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-500/40'
                            : isDiagonalSquare
                            ? 'bg-slate-800 text-amber-300 border border-amber-500/30 font-extrabold'
                            : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800/80'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Deep Dive on Selected Equation */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-400">Seçilen İşlem</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Detaylı İnceleme
            </span>
          </div>

          {/* Big Equation */}
          <div className="text-center py-2 bg-slate-950/80 border border-slate-800 rounded-2xl">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              <span className="text-indigo-300">{selectedCell?.row || 6}</span>
              <span className="text-slate-500 mx-2">×</span>
              <span className="text-emerald-300">{selectedCell?.col || 7}</span>
              <span className="text-slate-500 mx-2">=</span>
              <span className="text-amber-400">{currentProduct}</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {selectedCell?.row} tane {selectedCell?.col}’nin toplamı
            </div>
          </div>

          {/* Rhythmic Counting Sequence */}
          <div className="space-y-2">
            <div className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              <span>{selectedCell?.row}’şer Ritmik Sayma:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-bold">
              {Array.from({ length: selectedCell?.col || 7 }, (_, i) => {
                const stepVal = (selectedCell?.row || 6) * (i + 1);
                const isLast = i + 1 === (selectedCell?.col || 7);
                return (
                  <span
                    key={i}
                    className={`px-2 py-1 rounded-lg ${
                      isLast
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {stepVal}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Visual Matrix representation */}
          <div className="space-y-2">
            <div className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
              <Eye size={14} className="text-indigo-400" />
              <span>Görsel Matris (Nokta Modeli):</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 overflow-x-auto max-h-48">
              <div
                className="grid gap-1.5 justify-center"
                style={{
                  gridTemplateColumns: `repeat(${selectedCell?.col || 7}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({
                  length: (selectedCell?.row || 6) * (selectedCell?.col || 7),
                }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-400 shadow-sm"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Practice Button */}
          <button
            onClick={() => {
              playSound('click');
              onStartCustomPractice([selectedCell?.row || 6]);
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <Play size={15} className="fill-current" />
            <span>Sadece {selectedCell?.row}'ler Tablosunu Pratik Yap</span>
          </button>
        </div>
      </div>
    </div>
  );
};
