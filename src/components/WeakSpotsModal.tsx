import React from 'react';
import { QuestionMistake } from '../types';
import { playSound } from '../utils/audio';
import { AlertCircle, X, Sparkles, Play, CheckCircle2, BookOpen } from 'lucide-react';

interface WeakSpotsModalProps {
  mistakes: Record<string, QuestionMistake>;
  onClose: () => void;
  onPracticeMistakes: (equations: QuestionMistake[]) => void;
}

export const WeakSpotsModal: React.FC<WeakSpotsModalProps> = ({
  mistakes,
  onClose,
  onPracticeMistakes,
}) => {
  const mistakeList = (Object.values(mistakes) as QuestionMistake[]).sort(
    (a, b) => b.wrongCount - a.wrongCount || b.lastMissedAt - a.lastMissedAt
  );

  const handlePractice = () => {
    playSound('click');
    onPracticeMistakes(mistakeList);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertCircle size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">Hata Defteri & Zayıf Noktalar</h2>
              <p className="text-xs text-slate-400">Yanıldığın soruları gör ve üzerlerine çalış</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content List */}
        <div className="my-4 overflow-y-auto pr-1 space-y-2.5 flex-1">
          {mistakeList.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <div className="text-4xl">🌟</div>
              <div className="text-base font-bold text-slate-200">Henüz Kayıtlı Hatan Yok!</div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Tüm soruları doğru çözüyorsun veya henüz test çözmedin. Seviyeleri oynamaya başla!
              </p>
            </div>
          ) : (
            mistakeList.map((m, idx) => {
              const product = m.num1 * m.num2;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-xs font-bold text-slate-500">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-base font-black text-white">
                        {m.num1} × {m.num2} = <span className="text-amber-400">{product}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {m.num1} tane {m.num2}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-extrabold">
                      {m.wrongCount} Yanlış
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Action */}
        {mistakeList.length > 0 && (
          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={handlePractice}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 active:scale-95 transition-all"
            >
              <Play size={16} className="fill-current" />
              <span>Bu Hatalara Özel Alıştırma Başlat</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
