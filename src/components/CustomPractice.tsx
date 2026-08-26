import React, { useState } from 'react';
import { QuestionType } from '../types';
import { playSound } from '../utils/audio';
import { Sparkles, Play, CheckSquare, Square, Zap, HelpCircle, Shuffle } from 'lucide-react';

interface CustomPracticeProps {
  initialSelectedNumbers?: number[];
  onStart: (selectedNumbers: number[], count: number, type: QuestionType) => void;
}

export const CustomPractice: React.FC<CustomPracticeProps> = ({
  initialSelectedNumbers = [2, 3, 4, 5],
  onStart,
}) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>(initialSelectedNumbers);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [questionType, setQuestionType] = useState<QuestionType>('multiplication');

  const toggleNumber = (num: number) => {
    playSound('click');
    if (selectedNumbers.includes(num)) {
      if (selectedNumbers.length > 1) {
        setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
      }
    } else {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    }
  };

  const selectAll = () => {
    playSound('click');
    setSelectedNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  };

  const selectHard = () => {
    playSound('click');
    setSelectedNumbers([6, 7, 8, 9]);
  };

  const selectEasy = () => {
    playSound('click');
    setSelectedNumbers([1, 2, 5, 10]);
  };

  const handleStart = () => {
    playSound('click');
    onStart(selectedNumbers, questionCount, questionType);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-6 animate-fadeIn select-none">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
          <Sparkles size={14} />
          <span>Kişiselleştirilmiş Alıştırma</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Özel Pratik Oluştur</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Çalışmak istediğin çarpım tablolarını, soru sayısını ve soru tipini kendin seç!
        </p>
      </div>

      {/* Number Selectors */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-sm font-extrabold text-white">
            1. Hangi Sayıları Çalışmak İstiyorsun?
          </label>
          {/* Quick presets */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={selectEasy}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Kolaylar
            </button>
            <button
              onClick={selectHard}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold transition-colors"
            >
              Zorlar (6-9)
            </button>
            <button
              onClick={selectAll}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold transition-colors"
            >
              Tümü (1-10)
            </button>
          </div>
        </div>

        {/* Number Pills Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
            const isSelected = selectedNumbers.includes(num);
            return (
              <button
                key={num}
                id={`custom-num-${num}`}
                onClick={() => toggleNumber(num)}
                className={`py-3 sm:py-4 rounded-2xl border font-black text-lg sm:text-xl transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-gradient-to-tr from-purple-600 to-pink-600 border-pink-400 text-white shadow-lg shadow-purple-600/30 scale-105'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{num}’ler</span>
                <span className="text-[10px] font-semibold opacity-80">
                  {isSelected ? 'Seçildi' : 'Seç'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Type & Count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Soru Sayısı */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
          <label className="text-sm font-extrabold text-white">2. Soru Sayısı</label>
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 15, 20].map((cnt) => (
              <button
                key={cnt}
                onClick={() => {
                  playSound('click');
                  setQuestionCount(cnt);
                }}
                className={`py-2.5 rounded-xl border font-bold text-sm transition-all active:scale-95 ${
                  questionCount === cnt
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cnt}
              </button>
            ))}
          </div>
        </div>

        {/* Soru Formatı */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
          <label className="text-sm font-extrabold text-white">3. Soru Tipi</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                playSound('click');
                setQuestionType('multiplication');
              }}
              className={`py-2.5 px-3 rounded-xl border font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                questionType === 'multiplication'
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>Klasik (a × b = ?)</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                setQuestionType('missing_factor');
              }}
              className={`py-2.5 px-3 rounded-xl border font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                questionType === 'missing_factor'
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>Gizemli Sayı (? × b = c)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        id="start-custom-practice-btn"
        onClick={handleStart}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 active:scale-95 transition-all"
      >
        <Play size={20} className="fill-current" />
        <span>Alıştırmayı Başlat ({questionCount} Soru)</span>
      </button>
    </div>
  );
};
