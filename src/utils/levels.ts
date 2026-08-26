import { LevelConfig, Question, QuestionType } from '../types';

export const WORLDS = [
  {
    id: 1,
    name: '1. Başlangıç Vadisi',
    subtitle: 'Temeller ve Kolay Sayılar',
    color: 'from-emerald-600 to-teal-700',
    borderColor: 'border-emerald-500/30',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: '🌱',
  },
  {
    id: 2,
    name: '2. Keşif Ormanı',
    subtitle: 'Ritmik Katlar & Hızlanma',
    color: 'from-blue-600 to-cyan-700',
    borderColor: 'border-blue-500/30',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    icon: '🌲',
  },
  {
    id: 3,
    name: '3. Zirve Dağları',
    subtitle: 'Zorlu Çarpanlar',
    color: 'from-violet-600 to-indigo-700',
    borderColor: 'border-violet-500/30',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    icon: '⚡',
  },
  {
    id: 4,
    name: '4. Efsaneler Arenası',
    subtitle: 'Ters Çarpma & Şampiyonluk',
    color: 'from-amber-600 to-orange-700',
    borderColor: 'border-amber-500/30',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: '👑',
  },
];

export const LEVELS: LevelConfig[] = [
  // DÜNYA 1: BAŞLANGIÇ VADİSİ
  {
    id: 1,
    worldId: 1,
    worldName: 'Başlangıç Vadisi',
    worldColor: 'emerald',
    worldIcon: '🌱',
    title: "1'ler ve 2'lerin Dünyası",
    subtitle: 'Isınma Turu',
    description: "1 ve 2 ile çarpmanın mantığını öğren. Her sayının 1 katı kendisidir, 2 katı ise 2 katı kadardır!",
    allowedMultipliers: [1, 2],
    allowedMultiplicands: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    questionCount: 8,
    hasTimer: false,
    questionType: 'multiplication',
    icon: '🌟',
    badgeName: 'Başlangıç Çırağı',
  },
  {
    id: 2,
    worldId: 1,
    worldName: 'Başlangıç Vadisi',
    worldColor: 'emerald',
    worldIcon: '🌱',
    title: "10'lar ve 5'ler",
    subtitle: 'Ritmik ve Kolay Çarpımlar',
    description: "5'er 5'er ve 10'ar 10'ar sayarak pratik yap. Sonu hep 0 veya 5 ile biter!",
    allowedMultipliers: [5, 10],
    allowedMultiplicands: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    questionCount: 10,
    hasTimer: false,
    questionType: 'multiplication',
    icon: '✋',
    badgeName: 'Beşler & Onlar Ustası',
  },
  {
    id: 3,
    worldId: 1,
    worldName: 'Başlangıç Vadisi',
    worldColor: 'emerald',
    worldIcon: '🌱',
    title: "1, 2, 5, 10 Hız Koşusu",
    subtitle: 'İlk Aşama Testi',
    description: "Öğrendiğin ilk 4 tabloyu karma olarak test et. Bakalım ne kadar serisin!",
    allowedMultipliers: [1, 2, 5, 10],
    allowedMultiplicands: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    questionCount: 12,
    timePerQuestion: 15,
    hasTimer: true,
    questionType: 'multiplication',
    icon: '🏃',
    badgeName: 'Hızlı Başlangıç',
  },

  // DÜNYA 2: KEŞİF ORMANI
  {
    id: 4,
    worldId: 2,
    worldName: 'Keşif Ormanı',
    worldColor: 'blue',
    worldIcon: '🌲',
    title: "3'ler Vadisi",
    subtitle: '3 Ritmik Katları',
    description: "3'er 3'er sayma: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30!",
    allowedMultipliers: [3],
    allowedMultiplicands: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    questionCount: 10,
    hasTimer: false,
    questionType: 'multiplication',
    icon: '🎯',
    badgeName: 'Üçler Nişancısı',
  },
  {
    id: 5,
    worldId: 2,
    worldName: 'Keşif Ormanı',
    worldColor: 'blue',
    worldIcon: '🌲',
    title: "4'ler Geçidi",
    subtitle: '2 Katının 2 Katı!',
    description: "İpucu: Bir sayıyı 4 ile çarpmak, 2 ile çarpıp tekrar 2 ile çarpmak gibidir.",
    allowedMultipliers: [4],
    allowedMultiplicands: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    questionCount: 10,
    hasTimer: false,
    questionType: 'multiplication',
    icon: '🍀',
    badgeName: 'Dört Yapraklı Yonca',
  },
  {
    id: 6,
    worldId: 2,
    worldName: 'Keşif Ormanı',
    worldColor: 'blue',
    worldIcon: '🌲',
    title: "1'den 5'e Karışık Maraton",
    subtitle: 'Küçük Sayılar Şampiyonası',
    description: "1, 2, 3, 4 ve 5 çarpım tablolarının tamamından karışık sorular.",
    allowedMultipliers: [1, 2, 3, 4, 5],
    allowedMultiplicands: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    questionCount: 12,
    timePerQuestion: 12,
    hasTimer: true,
    questionType: 'multiplication',
    icon: '🏹',
    badgeName: 'Orman Şampiyonu',
  },

  // DÜNYA 3: ZİRVE DAĞLARI
  {
    id: 7,
    worldId: 3,
    worldName: 'Zirve Dağları',
    worldColor: 'violet',
    worldIcon: '⚡',
    title: "6'lar Köprüsü",
    subtitle: 'Çift Sayıların Gücü',
    description: "6 ile çarpma: 6, 12, 18, 24, 30, 36, 42, 48, 54, 60!",
    allowedMultipliers: [6],
    allowedMultiplicands: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    questionCount: 10,
    hasTimer: false,
    questionType: 'multiplication',
    icon: '🎲',
    badgeName: 'Altılar Zarı',
  },
  {
    id: 8,
    worldId: 3,
    worldName: 'Zirve Dağları',
    worldColor: 'violet',
    worldIcon: '⚡',
    title: "7'ler Fırtınası",
    subtitle: 'En Kritik Basamak',
    description: "Çoğu kişinin en çok düşündüğü tablo! 7×6=42, 7×7=49, 7×8=56 ezberle ve fırtınayı geç!",
    allowedMultipliers: [7],
    allowedMultiplicands: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    questionCount: 10,
    hasTimer: false,
    questionType: 'multiplication',
    icon: '🌪️',
    badgeName: 'Yediler Fatihi',
  },
  {
    id: 9,
    worldId: 3,
    worldName: 'Zirve Dağları',
    worldColor: 'violet',
    worldIcon: '⚡',
    title: "8'ler ve 9'lar Zirvesi",
    subtitle: 'Zirve Tırmanışı',
    description: "9'lar taktiği: Rakamlar toplamı hep 9 eder (örn: 9×4=36, 3+6=9). 8 ve 9'ları fethedebilir misin?",
    allowedMultipliers: [8, 9],
    allowedMultiplicands: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    questionCount: 12,
    hasTimer: false,
    questionType: 'multiplication',
    icon: '🏔️',
    badgeName: 'Zirve Dağcısı',
  },

  // DÜNYA 4: EFSANELER ARENASI
  {
    id: 10,
    worldId: 4,
    worldName: 'Efsaneler Arenası',
    worldColor: 'amber',
    worldIcon: '👑',
    title: "1-10 Klasik Tam Ustalık",
    subtitle: 'Tüm Tablo Karışık',
    description: "1'den 10'a kadar tüm çarpım tablosu soruları! 15 soruyu tamamlayıp ustalığını göster.",
    allowedMultipliers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    allowedMultiplicands: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    questionCount: 15,
    timePerQuestion: 10,
    hasTimer: true,
    questionType: 'multiplication',
    icon: '🏆',
    badgeName: 'Büyük Usta',
  },
  {
    id: 11,
    worldId: 4,
    worldName: 'Efsaneler Arenası',
    worldColor: 'amber',
    worldIcon: '👑',
    title: "Gizemli Sayı (Ters Çarpma)",
    subtitle: 'Eksik Çarpanı Bul',
    description: "Örnek: 7 × ? = 56 veya ? × 6 = 48. Çarpma ve bölme arasındaki bağı kavra!",
    allowedMultipliers: [2, 3, 4, 5, 6, 7, 8, 9],
    allowedMultiplicands: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    questionCount: 12,
    hasTimer: false,
    questionType: 'missing_factor',
    icon: '🔮',
    badgeName: 'Matematik Dedektifi',
  },
  {
    id: 12,
    worldId: 4,
    worldName: 'Efsaneler Arenası',
    worldColor: 'amber',
    worldIcon: '👑',
    title: "11 ve 12 Efsanevi Seviye",
    subtitle: 'Süper Beyin Mücadelesi',
    description: "11 ve 12'li çarpımlar dahil nihai şampiyonluk aşaması! Bitir ve Efsanevi Tahtı Kap!",
    allowedMultipliers: [11, 12, 6, 7, 8, 9],
    allowedMultiplicands: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    questionCount: 15,
    timePerQuestion: 10,
    hasTimer: true,
    questionType: 'multiplication',
    icon: '👑',
    badgeName: 'Çarpım Efsanesi',
  },
];

// Helper to generate a smart set of 4 choices (1 correct, 3 plausible distractors)
export function generateChoices(correctAnswer: number, num1: number, num2: number): number[] {
  const choices = new Set<number>([correctAnswer]);

  // Common plausible mistakes:
  // 1. Off by num1 or num2 (adjacent multiplication)
  if (correctAnswer + num1 > 0) choices.add(correctAnswer + num1);
  if (correctAnswer - num1 > 0) choices.add(correctAnswer - num1);
  if (correctAnswer + num2 > 0) choices.add(correctAnswer + num2);
  if (correctAnswer - num2 > 0) choices.add(correctAnswer - num2);

  // 2. Off by 1 or 2 (close arithmetic)
  if (correctAnswer + 1 > 0) choices.add(correctAnswer + 1);
  if (correctAnswer - 1 > 0) choices.add(correctAnswer - 1);
  if (correctAnswer + 2 > 0) choices.add(correctAnswer + 2);
  if (correctAnswer - 2 > 0) choices.add(correctAnswer - 2);

  // 3. Addition instead of multiplication (e.g., 4 x 3 = 7 instead of 12)
  const sum = num1 + num2;
  if (sum !== correctAnswer && sum > 0) {
    choices.add(sum);
  }

  // 4. Reversed digits (e.g. 54 -> 45) if different
  if (correctAnswer >= 10 && correctAnswer <= 99) {
    const tens = Math.floor(correctAnswer / 10);
    const units = correctAnswer % 10;
    const reversed = units * 10 + tens;
    if (reversed !== correctAnswer && reversed > 0) {
      choices.add(reversed);
    }
  }

  // Fill up to 4 if we don't have enough
  let offset = 3;
  while (choices.size < 4) {
    const candidate = correctAnswer + (Math.random() > 0.5 ? offset : -offset);
    if (candidate > 0 && candidate !== correctAnswer) {
      choices.add(candidate);
    }
    offset += 2;
  }

  // Pick exactly 4 choices and shuffle
  const choiceArray = Array.from(choices).slice(0, 4);
  // Ensure correct answer is always included
  if (!choiceArray.includes(correctAnswer)) {
    choiceArray[0] = correctAnswer;
  }

  // Fisher-Yates shuffle
  for (let i = choiceArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choiceArray[i], choiceArray[j]] = [choiceArray[j], choiceArray[i]];
  }

  return choiceArray;
}

// Generate questions for a level config
export function generateQuestionsForLevel(level: LevelConfig): Question[] {
  const questions: Question[] = [];
  const generatedPairs = new Set<string>();

  for (let i = 0; i < level.questionCount; i++) {
    // Pick multiplier & multiplicand
    let n1: number;
    let n2: number;
    let attempts = 0;

    do {
      const idx1 = Math.floor(Math.random() * level.allowedMultipliers.length);
      n1 = level.allowedMultipliers[idx1];

      const idx2 = Math.floor(Math.random() * level.allowedMultiplicands.length);
      n2 = level.allowedMultiplicands[idx2];

      // Sometimes swap for variety if both are in ranges
      if (Math.random() > 0.5) {
        [n1, n2] = [n2, n1];
      }

      attempts++;
    } while (generatedPairs.has(`${n1}x${n2}`) && attempts < 30);

    generatedPairs.add(`${n1}x${n2}`);

    const product = n1 * n2;
    const type = level.questionType;

    let promptText = `${n1} × ${n2} = ?`;
    let displayNum1 = String(n1);
    let displayNum2 = String(n2);
    let displayResult = '?';
    let targetValue = product;
    let choices: number[] = [];

    if (type === 'missing_factor') {
      const hideFirst = Math.random() > 0.5;
      if (hideFirst) {
        promptText = `? × ${n2} = ${product}`;
        displayNum1 = '?';
        displayNum2 = String(n2);
        displayResult = String(product);
        targetValue = n1;
        choices = generateChoices(n1, 2, 3);
      } else {
        promptText = `${n1} × ? = ${product}`;
        displayNum1 = String(n1);
        displayNum2 = '?';
        displayResult = String(product);
        targetValue = n2;
        choices = generateChoices(n2, 2, 3);
      }
    } else {
      // standard multiplication
      choices = generateChoices(product, n1, n2);
    }

    questions.push({
      id: `q_${level.id}_${i}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      num1: n1,
      num2: n2,
      answer: product,
      type,
      promptText,
      displayNum1,
      displayNum2,
      displayResult,
      targetValue,
      choices,
    });
  }

  return questions;
}

// Generate questions for custom practice
export function generateCustomQuestions(
  selectedNumbers: number[],
  count: number,
  type: QuestionType = 'multiplication'
): Question[] {
  if (selectedNumbers.length === 0) selectedNumbers = [2, 3, 5];

  const mockLevel: LevelConfig = {
    id: 999,
    worldId: 1,
    worldName: 'Özel Çalışma',
    worldColor: 'emerald',
    worldIcon: '✨',
    title: 'Özel Pratik',
    subtitle: 'Kişiselleştirilmiş',
    description: 'Seçili tablolardan özel sorular',
    allowedMultipliers: selectedNumbers,
    allowedMultiplicands: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    questionCount: count,
    hasTimer: false,
    questionType: type,
    icon: '⚡',
  };

  return generateQuestionsForLevel(mockLevel);
}
