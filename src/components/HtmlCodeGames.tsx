import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  Trophy,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Zap,
  Bug,
  Code2,
  Award,
  Crown,
  Flame,
  TrendingUp,
  User,
  Medal,
  Target,
  ChevronRight,
  Star,
  Users,
  Layers,
  ArrowRight,
  ShieldCheck,
  Lock,
  Unlock,
  Download,
  Share2,
  Check,
  Palette,
  ExternalLink,
  BookOpen,
  Info,
  Gift,
  HelpCircle,
  Clock,
  Heart
} from 'lucide-react';
import { StudentAccount } from '../data/learningCurriculum';

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type BadgeCategory = 'all' | 'xp' | 'stages' | 'games' | 'mastery';

export interface AchievementBadgeDef {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  category: 'xp' | 'stages' | 'games' | 'mastery';
  tier: BadgeTier;
  iconType: 'target' | 'code' | 'flame' | 'bug' | 'palette' | 'zap' | 'layers' | 'award' | 'crown' | 'shield' | 'star' | 'trophy';
  xpBonus: number;
  conditionDescription: string;
  lore: string;
  checkUnlocked: (stats: {
    xp: number;
    gamesCompleted: number;
    completedStages: ('html' | 'css' | 'js')[];
    quizPassed: Record<'html' | 'css' | 'js', boolean>;
    tagStreak: number;
    cardCompleted: boolean;
    rank: number;
  }) => {
    isUnlocked: boolean;
    currentProgress: number;
    targetProgress: number;
    progressPercent: number;
    progressLabel: string;
    remainingLabel?: string;
  };
}

export const TIER_CONFIG: Record<
  BadgeTier,
  {
    nameUz: string;
    emoji: string;
    borderClass: string;
    glowClass: string;
    bgGradient: string;
    badgePill: string;
    iconBg: string;
    textAccent: string;
  }
> = {
  bronze: {
    nameUz: 'Bronza Medali',
    emoji: '🥉',
    borderClass: 'border-amber-700/40 hover:border-amber-700/70',
    glowClass: 'shadow-amber-900/15',
    bgGradient: 'from-amber-950/5 via-amber-900/10 to-orange-950/15',
    badgePill: 'bg-amber-100 text-amber-900 border-amber-300',
    iconBg: 'bg-gradient-to-br from-amber-600 to-amber-800 text-amber-50',
    textAccent: 'text-amber-800',
  },
  silver: {
    nameUz: 'Kumush Medali',
    emoji: '🥈',
    borderClass: 'border-slate-300 hover:border-slate-400',
    glowClass: 'shadow-slate-400/20',
    bgGradient: 'from-slate-100/90 via-stone-50 to-slate-200/50',
    badgePill: 'bg-slate-100 text-slate-800 border-slate-300',
    iconBg: 'bg-gradient-to-br from-slate-400 to-stone-600 text-white',
    textAccent: 'text-slate-800',
  },
  gold: {
    nameUz: 'Oltin Medali',
    emoji: '🥇',
    borderClass: 'border-amber-400/90 hover:border-amber-500',
    glowClass: 'shadow-amber-500/25 ring-1 ring-amber-400/30',
    bgGradient: 'from-amber-50 via-yellow-100/60 to-amber-100/70',
    badgePill: 'bg-amber-100 text-amber-950 border-amber-400 font-extrabold',
    iconBg: 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-stone-900 shadow-md',
    textAccent: 'text-amber-900',
  },
  platinum: {
    nameUz: 'Platina Medali',
    emoji: '💠',
    borderClass: 'border-cyan-400 hover:border-cyan-500',
    glowClass: 'shadow-cyan-500/30 ring-2 ring-cyan-400/40',
    bgGradient: 'from-cyan-50 via-indigo-50/50 to-teal-50/70',
    badgePill: 'bg-cyan-100 text-cyan-950 border-cyan-400 font-extrabold',
    iconBg: 'bg-gradient-to-br from-cyan-400 via-teal-500 to-indigo-600 text-white shadow-md',
    textAccent: 'text-cyan-950',
  },
  diamond: {
    nameUz: 'Olmos Medali',
    emoji: '💎',
    borderClass: 'border-fuchsia-400 hover:border-fuchsia-500',
    glowClass: 'shadow-fuchsia-500/35 ring-2 ring-fuchsia-400/50',
    bgGradient: 'from-fuchsia-50 via-rose-50/70 to-purple-100/80',
    badgePill: 'bg-fuchsia-100 text-fuchsia-950 border-fuchsia-400 font-black',
    iconBg: 'bg-gradient-to-br from-fuchsia-500 via-rose-500 to-indigo-600 text-white shadow-lg animate-pulse',
    textAccent: 'text-fuchsia-950',
  },
};

/**
 * Har bir medal yoki yutuq ochilganda ekranda bayramona konfeti (confetti) effektini ko'rsatuvchi animatsiya
 */
export const fireMedalCelebrationConfetti = (tier?: BadgeTier) => {
  try {
    let colors = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];
    if (tier === 'diamond') {
      colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#ffffff', '#38bdf8'];
    } else if (tier === 'platinum') {
      colors = ['#e2e8f0', '#94a3b8', '#38bdf8', '#818cf8', '#ffffff', '#c084fc'];
    } else if (tier === 'gold') {
      colors = ['#f59e0b', '#fbbf24', '#fde68a', '#ea580c', '#fef08a', '#d97706'];
    } else if (tier === 'silver') {
      colors = ['#cbd5e1', '#94a3b8', '#64748b', '#e2e8f0', '#38bdf8', '#ffffff'];
    } else if (tier === 'bronze') {
      colors = ['#d97706', '#b45309', '#f59e0b', '#f97316', '#fed7aa'];
    }

    // 1-to'lqin: Chap burchakdan markazga qarata otilish
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 75,
      origin: { x: 0.05, y: 0.7 },
      colors,
      ticks: 250,
      gravity: 0.85,
      scalar: 1.15,
      shapes: ['square', 'circle'],
    });

    // 2-to'lqin: O'ng burchakdan markazga qarata otilish
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 75,
      origin: { x: 0.95, y: 0.7 },
      colors,
      ticks: 250,
      gravity: 0.85,
      scalar: 1.15,
      shapes: ['square', 'circle'],
    });

    // 3-to'lqin: Yuqori markazdan yulduzsimon va doirasimon tushish
    setTimeout(() => {
      confetti({
        particleCount: 110,
        spread: 120,
        origin: { x: 0.5, y: 0.4 },
        colors,
        shapes: ['star', 'circle'],
        ticks: 300,
        gravity: 0.75,
        scalar: 1.3,
      });
    }, 220);

    // 4-to'lqin: Oltin va olmos darajasida maxsus yaltiroq zarralar
    if (tier === 'gold' || tier === 'diamond' || tier === 'platinum') {
      setTimeout(() => {
        confetti({
          particleCount: 65,
          spread: 85,
          origin: { x: 0.5, y: 0.2 },
          colors: ['#ffd700', '#ffffff', '#38bdf8', '#fbbf24'],
          ticks: 220,
          gravity: 0.6,
          scalar: 0.95,
        });
      }, 440);
    }
  } catch (err) {
    console.error('Confetti animation error:', err);
  }
};

export const ACHIEVEMENT_BADGES: AchievementBadgeDef[] = [
  {
    id: 'badge_first_step',
    title: 'Birinchi Qadam',
    shortTitle: 'Boshlovchi',
    description: "O'yinlar maydonida ilk dasturlash topshirig'ini muvaffaqiyatli topshirish.",
    category: 'games',
    tier: 'bronze',
    iconType: 'target',
    xpBonus: 20,
    conditionDescription: "Kamida 1 ta bosqichni yechish",
    lore: "Har qanday buyuk dasturchining yo'li bitta muvaffaqiyatli yechilgan koddan boshlanadi.",
    checkUnlocked: (stats) => {
      const cur = Math.min(stats.gamesCompleted, 1);
      return {
        isUnlocked: cur >= 1,
        currentProgress: cur,
        targetProgress: 1,
        progressPercent: Math.round((cur / 1) * 100),
        progressLabel: `${cur} / 1 ta bosqich`,
        remainingLabel: cur >= 1 ? undefined : '1 ta bosqichni yeching',
      };
    },
  },
  {
    id: 'badge_html_explorer',
    title: 'HTML Kashfiyotchisi',
    shortTitle: 'HTML Ustasi',
    description: "HTML o'quv bosqichini yakunlash yoki testidan muvaffaqiyatli o'tish.",
    category: 'stages',
    tier: 'bronze',
    iconType: 'code',
    xpBonus: 40,
    conditionDescription: "HTML bosqichini yakunlash",
    lore: "Veb olamining eng mustahkam poydevori bo'lmish semantik HTML arxitekturasini o'zlashtirganlik belgisi.",
    checkUnlocked: (stats) => {
      const ok = stats.completedStages.includes('html') || stats.quizPassed.html;
      return {
        isUnlocked: ok,
        currentProgress: ok ? 1 : 0,
        targetProgress: 1,
        progressPercent: ok ? 100 : 0,
        progressLabel: ok ? "Tugallangan" : "Boshlanmagan",
        remainingLabel: ok ? undefined : "HTML darsini yoki testini topshiring",
      };
    },
  },
  {
    id: 'badge_tag_streaker',
    title: 'Teglar Bilimdoni',
    shortTitle: 'Teg Streaker',
    description: "Teg Moslashtiruvchida kamida 3 ta ketma-ket to'g'ri javoblar zanjirini (Streak) to'plash.",
    category: 'games',
    tier: 'silver',
    iconType: 'flame',
    xpBonus: 35,
    conditionDescription: "3 ta ketma-ket to'g'ri teg topish",
    lore: "HTML teglarining vazifasini bir qarashda aniqlash qobiliyati va yuksak e'tibor mukofoti.",
    checkUnlocked: (stats) => {
      const cur = Math.min(stats.tagStreak, 3);
      return {
        isUnlocked: cur >= 3,
        currentProgress: cur,
        targetProgress: 3,
        progressPercent: Math.round((cur / 3) * 100),
        progressLabel: `${cur} / 3 ketma-ket javob`,
        remainingLabel: cur >= 3 ? undefined : `Yana ${3 - cur} ta to'g'ri javob kerak`,
      };
    },
  },
  {
    id: 'badge_bug_hunter',
    title: 'Bug Hunter (Xato Qotili)',
    shortTitle: 'Bug Buster',
    description: "Dasturdagi sintaktik va semantik xatolarni fosh qilib, kamida 3 ta bosqichni to'g'ri bartaraf etish.",
    category: 'games',
    tier: 'silver',
    iconType: 'bug',
    xpBonus: 45,
    conditionDescription: "Kamida 3 ta xatolikni bartaraf etish",
    lore: "Koddagi eng yashirin kamchiliklarni o'tkir nigoh bilan fosh etuvchi debug ustasi.",
    checkUnlocked: (stats) => {
      const cur = Math.min(stats.gamesCompleted, 3);
      return {
        isUnlocked: cur >= 3,
        currentProgress: cur,
        targetProgress: 3,
        progressPercent: Math.round((cur / 3) * 100),
        progressLabel: `${cur} / 3 ta xato tuzatildi`,
        remainingLabel: cur >= 3 ? undefined : `Yana ${3 - cur} ta xatoni toping`,
      };
    },
  },
  {
    id: 'badge_css_wizard',
    title: 'CSS & Dizayn Sehrgari',
    shortTitle: 'CSS Wizard',
    description: "CSS o'quv bosqichini tamomlash yoki selektorlar arenasi sinovidan a'lo baho bilan o'tish.",
    category: 'stages',
    tier: 'silver',
    iconType: 'palette',
    xpBonus: 50,
    conditionDescription: "CSS bosqichini tamomlash",
    lore: "Ranglar, tipografiya va zamonaviy Flexbox/Grid texnologiyalari bilan sahifaga ruh bag'ishlovchi sehrgar.",
    checkUnlocked: (stats) => {
      const ok = stats.completedStages.includes('css') || stats.quizPassed.css;
      return {
        isUnlocked: ok,
        currentProgress: ok ? 1 : 0,
        targetProgress: 1,
        progressPercent: ok ? 100 : 0,
        progressLabel: ok ? "Tugallangan" : "Boshlanmagan",
        remainingLabel: ok ? undefined : "CSS bosqichini yakunlang",
      };
    },
  },
  {
    id: 'badge_xp_500',
    title: '500 XP Chempioni',
    shortTitle: '500 XP',
    description: "Akademiyada kamida 500 Tajriba Ochkosi (XP) to'plab, nufuzli reyting sari yo'l olish.",
    category: 'xp',
    tier: 'gold',
    iconType: 'zap',
    xpBonus: 60,
    conditionDescription: "500 XP to'plash",
    lore: "Mehnatsevarlik va tizimli o'rganish natijasida 500 XP marrasini zabt etgan koder.",
    checkUnlocked: (stats) => {
      const cur = Math.min(stats.xp, 500);
      return {
        isUnlocked: stats.xp >= 500,
        currentProgress: cur,
        targetProgress: 500,
        progressPercent: Math.round((cur / 500) * 100),
        progressLabel: `${cur} / 500 XP`,
        remainingLabel: stats.xp >= 500 ? undefined : `Yana ${500 - stats.xp} XP kerak`,
      };
    },
  },
  {
    id: 'badge_card_architect',
    title: 'Vizual Arxitektor',
    shortTitle: 'Konstruktor',
    description: "Interaktiv kartochka konstruktorida shaxsiy dizayn va tugmalarni to'liq yig'ish.",
    category: 'mastery',
    tier: 'gold',
    iconType: 'layers',
    xpBonus: 65,
    conditionDescription: "Kartochka konstruktori sinovini bajarish",
    lore: "Oddiy HTML teglari va CSS stillaridan foydalanib go'zal shaxsiy kartochka yarata oluvchi me'mor.",
    checkUnlocked: (stats) => {
      return {
        isUnlocked: stats.cardCompleted,
        currentProgress: stats.cardCompleted ? 1 : 0,
        targetProgress: 1,
        progressPercent: stats.cardCompleted ? 100 : 0,
        progressLabel: stats.cardCompleted ? "Tayyor" : "Kutilmoqda",
        remainingLabel: stats.cardCompleted ? undefined : "Konstruktor o'yinida 'Sinovni Yakunlash' tugmasini bosing",
      };
    },
  },
  {
    id: 'badge_js_hacker',
    title: 'JavaScript Hakker',
    shortTitle: 'JS Hakker',
    description: "JavaScript mantiqiy bosqichini tamomlash va interaktiv skriptlar sinovidan o'tish.",
    category: 'stages',
    tier: 'gold',
    iconType: 'code',
    xpBonus: 70,
    conditionDescription: "JS bosqichini tamomlash",
    lore: "Veb-sahifani dinamik jonlantiruvchi va murakkab funksiyalarni erkin boshqaruvchi kod ustasi.",
    checkUnlocked: (stats) => {
      const ok = stats.completedStages.includes('js') || stats.quizPassed.js;
      return {
        isUnlocked: ok,
        currentProgress: ok ? 1 : 0,
        targetProgress: 1,
        progressPercent: ok ? 100 : 0,
        progressLabel: ok ? "Tugallangan" : "Boshlanmagan",
        remainingLabel: ok ? undefined : "JavaScript darsini yoki testini topshiring",
      };
    },
  },
  {
    id: 'badge_xp_1000',
    title: '1,000 XP Afsonasi',
    shortTitle: '1,000 XP',
    description: "1,000 Tajriba Ochkosiga yetib, akademiyaning elita o'quvchilari qatoriga qo'shilish.",
    category: 'xp',
    tier: 'platinum',
    iconType: 'award',
    xpBonus: 100,
    conditionDescription: "1,000 XP to'plash",
    lore: "Minglab ochkolarni yig'ib, o'z bilimini o'nlab topshiriqlarda isbotlagan haqiqiy afsona.",
    checkUnlocked: (stats) => {
      const cur = Math.min(stats.xp, 1000);
      return {
        isUnlocked: stats.xp >= 1000,
        currentProgress: cur,
        targetProgress: 1000,
        progressPercent: Math.round((cur / 1000) * 100),
        progressLabel: `${cur} / 1,000 XP`,
        remainingLabel: stats.xp >= 1000 ? undefined : `Yana ${1000 - stats.xp} XP kerak`,
      };
    },
  },
  {
    id: 'badge_podium_master',
    title: 'Peshqadamlar Podiumi',
    shortTitle: 'Top 3 Reyting',
    description: "Umumiy akademiyaning peshqadamlar jadvalida Top 3 o'ringa kirish.",
    category: 'mastery',
    tier: 'platinum',
    iconType: 'crown',
    xpBonus: 120,
    conditionDescription: "Reytingda 1, 2 yoki 3-o'rinni egallash",
    lore: "Akademiya o'quvchilari orasida eng yuqori natijalar ko'rsatib, shohona shohsupaga ko'tarilgan g'olib.",
    checkUnlocked: (stats) => {
      const ok = stats.rank <= 3;
      return {
        isUnlocked: ok,
        currentProgress: ok ? 1 : 0,
        targetProgress: 1,
        progressPercent: ok ? 100 : 0,
        progressLabel: ok ? `#${stats.rank} - o'rinda!` : `Hozir: #${stats.rank} - o'rin`,
        remainingLabel: ok ? undefined : "Reytingda ko'proq XP to'plab Top 3 ga kiring",
      };
    },
  },
  {
    id: 'badge_full_stack_trio',
    title: "To'liq Web Trio",
    shortTitle: 'Trio Master',
    description: "HTML, CSS va JavaScript bo'yicha barcha 3 ta asosiy bosqichni to'liq tugatish.",
    category: 'stages',
    tier: 'diamond',
    iconType: 'shield',
    xpBonus: 150,
    conditionDescription: "HTML, CSS va JS bosqichlarini yakunlash",
    lore: "Web dasturlashning barcha uch ustunini (tuzilish, uslub va mantiq) to'liq egallagan universal muhandis.",
    checkUnlocked: (stats) => {
      const count = (['html', 'css', 'js'] as const).filter(
        (s) => stats.completedStages.includes(s) || stats.quizPassed[s]
      ).length;
      return {
        isUnlocked: count === 3,
        currentProgress: count,
        targetProgress: 3,
        progressPercent: Math.round((count / 3) * 100),
        progressLabel: `${count} / 3 bosqich topshirildi`,
        remainingLabel: count === 3 ? undefined : `Yana ${3 - count} ta bosqichni tugating`,
      };
    },
  },
  {
    id: 'badge_grandmaster',
    title: 'Grossmeyster Web Arxitektor',
    shortTitle: 'Grossmeyster',
    description: "1,500+ XP to'plash va 5-daraja (Senior Web Arxitektor) oliy maqomiga erishish.",
    category: 'xp',
    tier: 'diamond',
    iconType: 'star',
    xpBonus: 200,
    conditionDescription: "1,500 XP to'plash va 5-darajaga yetish",
    lore: "Akademiyaning eng yuqori cho'qqisi. Bu unvon faqat o'z sohasining haqiqiy me'morlariga beriladi.",
    checkUnlocked: (stats) => {
      const cur = Math.min(stats.xp, 1500);
      return {
        isUnlocked: stats.xp >= 1500,
        currentProgress: cur,
        targetProgress: 1500,
        progressPercent: Math.round((cur / 1500) * 100),
        progressLabel: `${cur} / 1,500 XP`,
        remainingLabel: stats.xp >= 1500 ? undefined : `Yana ${1500 - stats.xp} XP kerak`,
      };
    },
  },
];

interface HtmlCodeGamesProps {
  studentAccount?: StudentAccount | null;
  onUpdateAccount?: (updated: StudentAccount) => void;
  onOpenRegister?: () => void;
}

// Experience Level Definitions
interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  badgeColor: string;
}

const LEVELS: LevelInfo[] = [
  { level: 1, title: 'Boshlovchi Koder', minXp: 0, maxXp: 150, badgeColor: 'bg-stone-100 text-stone-800 border-stone-200' },
  { level: 2, title: 'Izlanuvchi Dasturchi', minXp: 150, maxXp: 400, badgeColor: 'bg-sky-100 text-sky-800 border-sky-200' },
  { level: 3, title: 'CSS & Dizayn Ustasi', minXp: 400, maxXp: 800, badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { level: 4, title: 'JavaScript Hakker', minXp: 800, maxXp: 1400, badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { level: 5, title: 'Senior Web Arxitektor', minXp: 1400, maxXp: 99999, badgeColor: 'bg-amber-100 text-amber-900 border-amber-300' },
];

function getLevelInfo(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

// Leaderboard Player Entry
interface LeaderboardPlayer {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  xp: number;
  level: number;
  levelTitle: string;
  gamesCompleted: number;
  accuracy: number;
  streak: number;
  isCurrentUser?: boolean;
}

const INITIAL_LEADERBOARD: LeaderboardPlayer[] = [
  {
    id: 'p1',
    name: 'Olimjon Alijonov',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    xp: 1650,
    level: 5,
    levelTitle: 'Senior Web Arxitektor',
    gamesCompleted: 52,
    accuracy: 98,
    streak: 14,
  },
  {
    id: 'p2',
    name: 'Bobur Mirzayev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    xp: 1420,
    level: 5,
    levelTitle: 'Senior Web Arxitektor',
    gamesCompleted: 45,
    accuracy: 96,
    streak: 11,
  },
  {
    id: 'p3',
    name: 'Madina Yo\'ldosheva',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    xp: 1240,
    level: 4,
    levelTitle: 'JavaScript Hakker',
    gamesCompleted: 39,
    accuracy: 94,
    streak: 9,
  },
  {
    id: 'p4',
    name: 'Umirbek Xo\'jayev',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    xp: 1120,
    level: 4,
    levelTitle: 'JavaScript Hakker',
    gamesCompleted: 36,
    accuracy: 92,
    streak: 8,
  },
  {
    id: 'p5',
    name: 'Sardorbek Rahimov',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    xp: 880,
    level: 3,
    levelTitle: 'CSS & Dizayn Ustasi',
    gamesCompleted: 28,
    accuracy: 90,
    streak: 6,
  },
  {
    id: 'p6',
    name: 'Muhriddin Abdullayev',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    xp: 750,
    level: 3,
    levelTitle: 'CSS & Dizayn Ustasi',
    gamesCompleted: 24,
    accuracy: 88,
    streak: 5,
  },
];

// 1. Tag Matcher Data
interface TagQuestion {
  concept: string;
  correctTag: string;
  options: string[];
  explanation: string;
  level: number;
}

const TAG_QUESTIONS: TagQuestion[] = [
  {
    concept: "Veb-sahifada eng yuqori darajadagi asosiy sarlavha yaratish",
    correctTag: "<h1>",
    options: ["<p>", "<h1>", "<title>", "<header>"],
    explanation: "<h1> tegi sahifaning eng katta va asosiy sarlavhasini belgilaydi.",
    level: 1,
  },
  {
    concept: "Boshqa sayt yoki sahifaga o'tuvchi faol havola (link) qo'yish",
    correctTag: "<a>",
    options: ["<link>", "<href>", "<a>", "<url>"],
    explanation: "<a> (anchor) tegi href atributi bilan birga havolalarni hosil qiladi.",
    level: 1,
  },
  {
    concept: "Sahifaga rasm yoki tasvir joylashtirish",
    correctTag: "<img>",
    options: ["<picture>", "<photo>", "<img>", "<src>"],
    explanation: "<img> tegi src atributi orqali rasm faylini ekranga chiqaradi.",
    level: 1,
  },
  {
    concept: "Foydalanuvchi bosishi mumkin bo'lgan interaktiv tugma",
    correctTag: "<button>",
    options: ["<click>", "<btn>", "<press>", "<button>"],
    explanation: "<button> tegi bosiluvchi tugmalarni yaratish uchun standart tegdir.",
    level: 2,
  },
  {
    concept: "Elementlarni guruhlovchi blok konteyner (quti)",
    correctTag: "<div>",
    options: ["<span>", "<div>", "<box>", "<section>"],
    explanation: "<div> — blok darajasidagi universal konteyner hisoblanadi.",
    level: 2,
  },
  {
    concept: "Foydalanuvchidan matn kiritish maydonchasi (input field)",
    correctTag: "<input>",
    options: ["<textarea>", "<text>", "<input>", "<enter>"],
    explanation: "<input> maydoni yordamida har xil turdagi ma'lumotlar kiritiladi.",
    level: 2,
  },
  {
    concept: "Asosiy navigatsiya havolalarini o'z ichiga oluvchi semantik teg",
    correctTag: "<nav>",
    options: ["<menu>", "<nav>", "<links>", "<sidebar>"],
    explanation: "<nav> tegi veb-saytning asosiy navigatsiya menyusi uchun mo'ljallangan.",
    level: 3,
  },
  {
    concept: "Saytning pastki qismi (mualliflik huquqi, aloqa) tegi",
    correctTag: "<footer>",
    options: ["<bottom>", "<end>", "<footer>", "<base>"],
    explanation: "<footer> tegi sahifa yoki bo'limning quyi qismini ifodalaydi.",
    level: 3,
  },
];

// 2. Bug Hunter Data
interface BugQuestion {
  code: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  level: number;
}

const BUG_QUESTIONS: BugQuestion[] = [
  {
    code: "<h1>Xush kelibsiz!</h2>",
    question: "Ushbu HTML kodida qanday xatolik bor?",
    options: [
      "Ochilgan teg <h1>, lekin yopilgan teg </h2>",
      "Matn qo'shtirnoq ichiga olinmagan",
      "Harflar katta-kichikligi noto'g'ri",
      "Hech qanday xato yo'q",
    ],
    correctIndex: 0,
    explanation: "HTML da ochilgan teg bilan yopiluvchi teg bir xil bo'lishi shart: <h1>...</h1>.",
    level: 1,
  },
  {
    code: "<img href='avatar.jpg' alt='Profil rasmi'>",
    question: "Rasm tegida qaysi atribut noto'g'ri ishlatilgan?",
    options: [
      "alt atributi o'rniga text bo'lishi kerak",
      "href o'rniga src atributi ishlatilishi kerak",
      "Rasmlarga qo'shtirnoq qo'yilmaydi",
      "Rasm tegi yopilmagan",
    ],
    correctIndex: 1,
    explanation: "<img> tegida rasm manzili 'src' atributi orqali beriladi, 'href' esa <a> tegiga tegishli.",
    level: 1,
  },
  {
    code: "<a url='https://t.me/jasur'>Telegram</a>",
    question: "Havola yaratishda qaysi atribut noto'g'ri?",
    options: [
      "url emas, href bo'lishi kerak",
      "<a> tegi o'rniga <link> bo'lishi kerak",
      "Telegram so'zi xato",
      "Probel qolib ketgan",
    ],
    correctIndex: 0,
    explanation: "<a> tegi uchun havola manzili 'href' atributi orqali ko'rsatiladi.",
    level: 2,
  },
  {
    code: "<button disabled='no'>Tasdiqlash</button>",
    question: "Tugmani nofaol holatdan chiqarishda xatolik nima?",
    options: [
      "disabled atributi qiymatsiz (yoki olib tashlanishi) kerak",
      "Tugma matni xato",
      "type atributi majburiy",
      "Qo'shtirnoq ishlatilmasligi kerak",
    ],
    correctIndex: 0,
    explanation: "HTML da bolean atributlar (disabled) mavjud bo'lishi bilan elementni nofaol qiladi. Uni faol qilish uchun atribut butunlay o'chirilishi kerak.",
    level: 2,
  },
  {
    code: "<p class=\"matn\" id=\"matn\" class=\"asosiy\">Salom</p>",
    question: "Tegda qaysi sintaktik xato sodir bo'lgan?",
    options: [
      "Bir elementda ikkita 'class' atributi qaytarilgan",
      "id va class birga ishlatilmaydi",
      "Salom so'zi tegsiz bo'lishi kerak",
      "Qo'shtirnoq noto'g'ri",
    ],
    correctIndex: 0,
    explanation: "Bir elementda bitta class atributi ichida probel bilan bir nechta sinf yoziladi: class=\"matn asosiy\".",
    level: 3,
  },
];

// 3. CSS Selector Arena Data
interface SelectorQuestion {
  target: string;
  htmlContext: string;
  options: string[];
  correctSelector: string;
  explanation: string;
  level: number;
}

const SELECTOR_QUESTIONS: SelectorQuestion[] = [
  {
    target: "faqat 'btn-primary' sinfiga ega tugmani tanlash",
    htmlContext: "<button class='btn-primary'>Boshlash</button>",
    options: [".btn-primary", "#btn-primary", "btn-primary", "*btn-primary"],
    correctSelector: ".btn-primary",
    explanation: "CSS da sinflar (class) oldiga nuqta '.' belgisi qo'yiladi: .btn-primary",
    level: 1,
  },
  {
    target: "yagona 'header' identifikatoriga (ID) ega bo'limni tanlash",
    htmlContext: "<div id='header'>Sayt bosh qismi</div>",
    options: ["#header", ".header", "@header", "div#id"],
    correctSelector: "#header",
    explanation: "ID identifikatorlari oldiga panjara '#' belgisi qo'yiladi: #header",
    level: 1,
  },
  {
    target: "faqat 'card' ichidagi bevosita 'p' abzaslarini tanlash",
    htmlContext: "<div class='card'><p>Matn</p></div>",
    options: [".card > p", ".card + p", ".card ~ p", ".card p"],
    correctSelector: ".card > p",
    explanation: "'>' belgisi elementning bevosita birinchi avlod bolalarini (direct child) tanlaydi.",
    level: 2,
  },
  {
    target: "sichqoncha kursor borganda (hover) holatini tanlash",
    htmlContext: "<button>Meni bosing</button>",
    options: ["button:hover", "button::hover", "button.hover", "button->hover"],
    correctSelector: "button:hover",
    explanation: ":hover — psevdo-klass bo'lib, kursor element ustiga kelgandagi holatni boshqaradi.",
    level: 2,
  },
];

export function HtmlCodeGames({
  studentAccount,
  onUpdateAccount,
  onOpenRegister,
}: HtmlCodeGamesProps) {
  // Main view: 'games' | 'leaderboard' | 'badges'
  const [mainTab, setMainTab] = useState<'games' | 'leaderboard' | 'badges'>('games');
  const [activeGame, setActiveGame] = useState<'tag' | 'bug' | 'selector' | 'builder'>('tag');

  // Badges & Achievements state
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'locked' | 'xp' | 'stages' | 'games' | 'mastery'>('all');
  const [selectedBadgeModal, setSelectedBadgeModal] = useState<(AchievementBadgeDef & { status: any }) | null>(null);
  const [unlockedCelebrationModal, setUnlockedCelebrationModal] = useState<(AchievementBadgeDef & { status: any }) | null>(null);
  const [badgeToast, setBadgeToast] = useState<string | null>(null);
  const prevUnlockedBadgesRef = useRef<Set<string> | null>(null);

  // Experience Points (XP) Engine
  const [playerXp, setPlayerXp] = useState<number>(() => {
    try {
      const savedXp = localStorage.getItem('tanishuv_games_xp');
      if (savedXp) return parseInt(savedXp, 10);
      if (studentAccount?.xp) return studentAccount.xp;
    } catch {}
    return 120; // default starting XP for guests
  });

  const [gamesCompletedCount, setGamesCompletedCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tanishuv_games_completed');
      if (saved) return parseInt(saved, 10);
      if (studentAccount?.gamesCompleted) return studentAccount.gamesCompleted;
    } catch {}
    return 5;
  });

  // Recent XP gain notification
  const [xpNotification, setXpNotification] = useState<{ amount: number; message: string } | null>(null);

  // Award XP function with persistence
  const awardXp = (amount: number, reason: string) => {
    setPlayerXp((prev) => {
      const updated = prev + amount;
      try {
        localStorage.setItem('tanishuv_games_xp', updated.toString());
      } catch {}

      // If user has studentAccount, update it
      if (studentAccount && onUpdateAccount) {
        onUpdateAccount({
          ...studentAccount,
          xp: updated,
          gamesCompleted: (studentAccount.gamesCompleted || 0) + 1,
        });
      }
      return updated;
    });

    setGamesCompletedCount((prev) => {
      const n = prev + 1;
      try {
        localStorage.setItem('tanishuv_games_completed', n.toString());
      } catch {}
      return n;
    });

    setXpNotification({ amount, message: reason });
    setTimeout(() => {
      setXpNotification(null);
    }, 2800);
  };

  // Current Level Calculations
  const currentLevelInfo = getLevelInfo(playerXp);
  const nextLevel = LEVELS.find((l) => l.level === currentLevelInfo.level + 1);
  const xpInCurrentLevel = playerXp - currentLevelInfo.minXp;
  const xpNeededForNext = nextLevel ? nextLevel.minXp - currentLevelInfo.minXp : 100;
  const progressPercent = nextLevel
    ? Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100))
    : 100;

  // Game 1: Tag Matcher State
  const [tagIdx, setTagIdx] = useState(0);
  const [tagScore, setTagScore] = useState(0);
  const [tagStreak, setTagStreak] = useState(0);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagFeedback, setTagFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Game 2: Bug Hunter State
  const [bugIdx, setBugIdx] = useState(0);
  const [bugScore, setBugScore] = useState(0);
  const [selectedBugOpt, setSelectedBugOpt] = useState<number | null>(null);
  const [bugFeedback, setBugFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Game 3: Selector Arena State
  const [selectorIdx, setSelectorIdx] = useState(0);
  const [selectorScore, setSelectorScore] = useState(0);
  const [selectedSelector, setSelectedSelector] = useState<string | null>(null);
  const [selectorFeedback, setSelectorFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Game 4: Interactive Card Builder State
  const [builderTitle, setBuilderTitle] = useState('Salom, Men Dasturchiman!');
  const [builderColor, setBuilderColor] = useState('#e11d48');
  const [builderBg, setBuilderBg] = useState('#fff1f2');
  const [builderRadius, setBuilderRadius] = useState('16px');
  const [builderHasBtn, setBuilderHasBtn] = useState(true);
  const [cardChallengeCompleted, setCardChallengeCompleted] = useState(false);

  // Leaderboard State
  const [leaderboardFilter, setLeaderboardFilter] = useState<'all' | 'weekly'>('all');

  // Dynamic Leaderboard list combining cohort with current player
  const fullLeaderboard: LeaderboardPlayer[] = React.useMemo(() => {
    const currentPlayerName = studentAccount?.name || 'Siz (Mehmon Koder)';
    const currentPlayerAvatar =
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

    const currentPlayerEntry: LeaderboardPlayer = {
      id: 'current_user',
      name: currentPlayerName,
      email: studentAccount?.email,
      avatar: currentPlayerAvatar,
      xp: playerXp,
      level: currentLevelInfo.level,
      levelTitle: currentLevelInfo.title,
      gamesCompleted: gamesCompletedCount,
      accuracy: 93,
      streak: tagStreak > 0 ? tagStreak : 4,
      isCurrentUser: true,
    };

    // Filter out if duplicate
    const filteredCohort = INITIAL_LEADERBOARD.filter(
      (p) => p.email !== studentAccount?.email && p.name !== studentAccount?.name
    );

    const merged = [...filteredCohort, currentPlayerEntry];
    merged.sort((a, b) => b.xp - a.xp);
    return merged;
  }, [playerXp, currentLevelInfo, gamesCompletedCount, tagStreak, studentAccount]);

  const currentUserRank = fullLeaderboard.findIndex((p) => p.isCurrentUser) + 1;

  // Evaluate All 12 Badges against live student stats
  const evaluatedBadges = React.useMemo(() => {
    const completedStages = studentAccount?.completedStages || (playerXp >= 800 ? ['html', 'css', 'js'] : playerXp >= 400 ? ['html', 'css'] : playerXp >= 150 ? ['html'] : []);
    const quizPassed = studentAccount?.quizPassed || {
      html: completedStages.includes('html') || playerXp >= 150,
      css: completedStages.includes('css') || playerXp >= 400,
      js: completedStages.includes('js') || playerXp >= 800,
    };
    const stats = {
      xp: playerXp,
      gamesCompleted: gamesCompletedCount,
      completedStages,
      quizPassed,
      tagStreak: tagStreak > 0 ? tagStreak : 3,
      cardCompleted: cardChallengeCompleted || playerXp >= 350,
      rank: currentUserRank > 0 ? currentUserRank : 4,
    };

    return ACHIEVEMENT_BADGES.map((badgeDef) => {
      const status = badgeDef.checkUnlocked(stats);
      return {
        ...badgeDef,
        status,
      };
    });
  }, [studentAccount, playerXp, gamesCompletedCount, tagStreak, cardChallengeCompleted, currentUserRank]);

  const unlockedBadgesCount = evaluatedBadges.filter((b) => b.status.isUnlocked).length;
  const totalBadgesCount = evaluatedBadges.length;
  const badgesCompletionPercent = Math.round((unlockedBadgesCount / totalBadgesCount) * 100);
  const totalBonusXpUnlocked = evaluatedBadges
    .filter((b) => b.status.isUnlocked)
    .reduce((sum, b) => sum + b.xpBonus, 0);

  const nextUpcomingBadge = evaluatedBadges.find((b) => !b.status.isUnlocked);

  // Ekranda har bir medal yoki yutuq ochilganda avtomatik ravishda konfeti effektini ko'rsatuvchi animatsiya
  useEffect(() => {
    const currentlyUnlocked = evaluatedBadges.filter((b) => b.status.isUnlocked);
    const currentUnlockedIds = new Set(currentlyUnlocked.map((b) => b.id));

    // Birinchi yuklanganda avvalgi nishonlarni saqlaydi, konfeti otmaydi
    if (prevUnlockedBadgesRef.current === null) {
      prevUnlockedBadgesRef.current = currentUnlockedIds;
      return;
    }

    // Yangi ochilgan nishonlarni aniqlash
    const newlyUnlocked = currentlyUnlocked.filter(
      (b) => !prevUnlockedBadgesRef.current?.has(b.id)
    );

    if (newlyUnlocked.length > 0) {
      const topBadge = newlyUnlocked[0];
      // 🎊 Rang-barang konfeti portlashi animatsiyasini ishga tushirish!
      fireMedalCelebrationConfetti(topBadge.tier);

      // Ekranda tabriknoma va maxsus modalni ochish
      setBadgeToast(`🎉 TABRIKLAYMIZ! Yangi medal qo'lga kiritildi: "${topBadge.title}" (+${topBadge.xpBonus} XP)!`);
      setUnlockedCelebrationModal(topBadge);

      setTimeout(() => {
        setBadgeToast(null);
      }, 5000);
    }

    prevUnlockedBadgesRef.current = currentUnlockedIds;
  }, [evaluatedBadges]);

  // Handlers for Tag Game
  const handleAnswerTag = (tag: string) => {
    if (tagFeedback) return;
    setSelectedTag(tag);
    const currentQ = TAG_QUESTIONS[tagIdx];

    if (tag === currentQ.correctTag) {
      setTagFeedback('correct');
      const earnedXp = 15 + tagStreak * 2;
      setTagScore((s) => s + earnedXp);
      setTagStreak((st) => st + 1);
      awardXp(earnedXp, `Teg to'g'ri topildi: ${tag}`);
    } else {
      setTagFeedback('wrong');
      setTagStreak(0);
    }

    setTimeout(() => {
      setSelectedTag(null);
      setTagFeedback(null);
      setTagIdx((prev) => (prev + 1) % TAG_QUESTIONS.length);
    }, 1600);
  };

  // Handlers for Bug Game
  const handleAnswerBug = (optIdx: number) => {
    if (bugFeedback) return;
    setSelectedBugOpt(optIdx);
    const currentQ = BUG_QUESTIONS[bugIdx];

    if (optIdx === currentQ.correctIndex) {
      setBugFeedback('correct');
      const earnedXp = 25;
      setBugScore((s) => s + earnedXp);
      awardXp(earnedXp, `Xato kod bartaraf etildi (+25 XP)!`);
    } else {
      setBugFeedback('wrong');
    }

    setTimeout(() => {
      setSelectedBugOpt(null);
      setBugFeedback(null);
      setBugIdx((prev) => (prev + 1) % BUG_QUESTIONS.length);
    }, 1800);
  };

  // Handlers for Selector Arena
  const handleAnswerSelector = (sel: string) => {
    if (selectorFeedback) return;
    setSelectedSelector(sel);
    const currentQ = SELECTOR_QUESTIONS[selectorIdx];

    if (sel === currentQ.correctSelector) {
      setSelectorFeedback('correct');
      const earnedXp = 20;
      setSelectorScore((s) => s + earnedXp);
      awardXp(earnedXp, `CSS Selektor to'g'ri tanlandi: ${sel}`);
    } else {
      setSelectorFeedback('wrong');
    }

    setTimeout(() => {
      setSelectedSelector(null);
      setSelectorFeedback(null);
      setSelectorIdx((prev) => (prev + 1) % SELECTOR_QUESTIONS.length);
    }, 1700);
  };

  // Handler for Card Builder challenge
  const handleCompleteCardChallenge = () => {
    if (cardChallengeCompleted) return;
    setCardChallengeCompleted(true);
    awardXp(50, `Shaxsiy kartochka konstruktori yig'ildi (+50 XP)!`);
  };

  const currentTagQ = TAG_QUESTIONS[tagIdx];
  const currentBugQ = BUG_QUESTIONS[bugIdx];
  const currentSelectorQ = SELECTOR_QUESTIONS[selectorIdx];

  const generatedCardHtml = `<div style="padding:20px; background:${builderBg}; border-radius:${builderRadius}; border:1px solid rgba(0,0,0,0.06); font-family:sans-serif;">
  <h2 style="color:${builderColor}; margin:0 0 8px;">${builderTitle}</h2>
  <p style="font-size:13px; color:#57534e; margin:0 0 14px;">HTML va CSS o'yini orqali yig'ilgan shaxsiy kartochka.</p>
  ${builderHasBtn ? `<button style="background:${builderColor}; color:#fff; padding:8px 16px; border:none; border-radius:8px; font-weight:600; cursor:pointer;">Menga yozish</button>` : ''}
</div>`;

  const renderBadgeIcon = (iconType: AchievementBadgeDef['iconType'], className = 'w-6 h-6') => {
    switch (iconType) {
      case 'target':
        return <Target className={className} />;
      case 'code':
        return <Code2 className={className} />;
      case 'flame':
        return <Flame className={className} />;
      case 'bug':
        return <Bug className={className} />;
      case 'palette':
        return <Palette className={className} />;
      case 'zap':
        return <Zap className={`${className} fill-amber-400 text-amber-400`} />;
      case 'layers':
        return <Layers className={className} />;
      case 'award':
        return <Award className={className} />;
      case 'crown':
        return <Crown className={className} />;
      case 'shield':
        return <ShieldCheck className={className} />;
      case 'star':
        return <Star className={`${className} fill-amber-300 text-amber-300`} />;
      case 'trophy':
      default:
        return <Trophy className={className} />;
    }
  };

  const copyBadgeCelebration = (badge: AchievementBadgeDef) => {
    const text = `🏆 Men Frontend Akademiyasida "${badge.title}" (${TIER_CONFIG[badge.tier].emoji} ${TIER_CONFIG[badge.tier].nameUz}) sohibi bo'ldim! Jami XP: ${playerXp} | https://akademiya.uz`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setBadgeToast(`"${badge.title}" yutuq matni nusxalandi!`);
    setTimeout(() => {
      setBadgeToast(null);
    }, 3000);
  };

  const filteredBadges = evaluatedBadges.filter((b) => {
    if (badgeFilter === 'all') return true;
    if (badgeFilter === 'unlocked') return b.status.isUnlocked;
    if (badgeFilter === 'locked') return !b.status.isUnlocked;
    if (badgeFilter === 'xp') return b.category === 'xp';
    if (badgeFilter === 'stages') return b.category === 'stages';
    if (badgeFilter === 'games') return b.category === 'games' || b.category === 'mastery';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Floating XP Gain Celebration Toast */}
      {xpNotification && (
        <div className="fixed top-20 right-6 z-50 animate-bounce bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-amber-200">
            <Zap className="w-5 h-5 fill-amber-300" />
          </div>
          <div>
            <div className="text-xs font-extrabold tracking-wide uppercase">
              +{xpNotification.amount} XP Tajriba Ochkosi!
            </div>
            <div className="text-[11px] text-white/90">{xpNotification.message}</div>
          </div>
        </div>
      )}

      {/* Floating Badge Toast */}
      {badgeToast && (
        <div className="fixed top-20 right-6 z-50 animate-bounce bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-white">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-extrabold tracking-wide uppercase">
              Yutuq Saqlandi!
            </div>
            <div className="text-[11px] text-white/90">{badgeToast}</div>
          </div>
        </div>
      )}

      {/* Top Banner with XP Status and Level Progression */}
      <div className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-850 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-stone-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-amber-300 border border-white/10">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Interaktiv Dasturlash O'yinlari & XP Tizimi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              HTML Code Games & Peshqadamlar Jadvali
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Har bir yechilgan daraja uchun <strong>Tajriba ochkolari (XP)</strong> to'plang,
              darajangizni ko'taring va akademiyaning umumiy reytingida yetakchilik qiling!
            </p>
          </div>

          {/* Player XP & Level Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl sm:min-w-[280px] space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 text-stone-900 flex items-center justify-center font-extrabold shadow-md">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{studentAccount?.name || 'Mehmon Koder'}</span>
                    <span className="text-[10px] bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded-full font-black">
                      Lvl {currentLevelInfo.level}
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-200 font-medium">
                    {currentLevelInfo.title}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-black text-amber-300 flex items-center gap-1 justify-end">
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>{playerXp}</span>
                </div>
                <div className="text-[10px] text-stone-300 font-semibold">Jami XP</div>
              </div>
            </div>

            {/* Level Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-stone-300">
                <span>Keyingi darajaga:</span>
                <span className="font-bold text-white">
                  {nextLevel ? `${xpInCurrentLevel} / ${xpNeededForNext} XP (${progressPercent}%)` : 'Maksimal Daraja'}
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-rose-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Rank Indicator and Badges Count */}
            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px]">
              <span className="text-stone-300 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Reytingdagi o'rningiz:
              </span>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-amber-300">
                  #{currentUserRank} - o'rin
                </span>
                <button
                  onClick={() => setMainTab('badges')}
                  className="text-[10px] font-extrabold text-amber-200 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md transition-all border border-white/10"
                  title="Yutuqlar va medallar ro'yxatini ochish"
                >
                  <Medal className="w-3 h-3 text-amber-300" />
                  <span>{unlockedBadgesCount}/{totalBadgesCount} Medallar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Tab Navigation: Games vs Leaderboard vs Badges */}
      <div className="bg-white rounded-2xl p-2.5 border border-stone-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setMainTab('games')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              mainTab === 'games'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-rose-500" />
            <span>O'yinlar Maydoni</span>
          </button>
          <button
            onClick={() => setMainTab('leaderboard')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              mainTab === 'leaderboard'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Peshqadamlar Jadvali</span>
            <span className="text-[10px] bg-rose-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">
              Jonli
            </span>
          </button>
          <button
            onClick={() => setMainTab('badges')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              mainTab === 'badges'
                ? 'bg-white text-stone-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Medal className="w-4 h-4 text-purple-600" />
            <span>Nishonlar & Medallar (Badges)</span>
            <span className="text-[10px] bg-gradient-to-r from-amber-500 to-rose-600 text-white font-black px-2 py-0.5 rounded-full shadow-2xs">
              {unlockedBadgesCount} / {totalBadgesCount}
            </span>
          </button>
        </div>

        {/* Action Bar Right: ZIP Download Button */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <a
            href="/api/download-zip"
            download="frontend_akademiya_loyihasi.zip"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-stone-900 via-stone-850 to-indigo-950 text-white hover:from-stone-800 hover:to-indigo-900 shadow-sm transition-all border border-stone-700/60 group"
            title="Barcha kod va fayllarni ZIP arxiv shaklida yuklab olish"
          >
            <Download className="w-3.5 h-3.5 text-amber-400 group-hover:translate-y-0.5 transition-transform" />
            <span>Loyihani ZIP yuklab olish</span>
          </a>
        </div>

        {/* Sub Game Mode Selector when on games tab */}
        {mainTab === 'games' && (
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <button
              onClick={() => setActiveGame('tag')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeGame === 'tag'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              Teg Moslashtiruvchi (+15 XP)
            </button>
            <button
              onClick={() => setActiveGame('bug')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeGame === 'bug'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              Xatoni Top (+25 XP)
            </button>
            <button
              onClick={() => setActiveGame('selector')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeGame === 'selector'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              CSS Selektor (+20 XP)
            </button>
            <button
              onClick={() => setActiveGame('builder')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeGame === 'builder'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              Konstruktor (+50 XP)
            </button>
          </div>
        )}
      </div>

      {/* ========================================================
          TAB 1: GAMES VIEW
      ======================================================== */}
      {mainTab === 'games' && (
        <div className="space-y-6">
          {/* GAME 1: TAG MATCHER */}
          {activeGame === 'tag' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                      O'yin 1: Teg Moslashtiruvchi
                    </span>
                    <span className="text-xs font-bold text-stone-500">
                      Bosqich: {currentTagQ.level}-daraja
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 mt-1">
                    Ta'rifga mos keluvchi to'g'ri HTML tegni toping va +15 XP ishlang!
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="text-amber-600 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    {tagScore} ochko
                  </span>
                  <span className="text-rose-600 flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    {tagStreak} streak (bonus)
                  </span>
                </div>
              </div>

              {/* Question Stage */}
              <div className="p-6 bg-gradient-to-r from-stone-50 via-rose-50/30 to-amber-50/30 rounded-2xl border border-stone-200 text-center space-y-3">
                <span className="text-xs font-mono text-stone-400 uppercase tracking-widest block">
                  Savol {tagIdx + 1} / {TAG_QUESTIONS.length}
                </span>
                <p className="text-base sm:text-xl font-bold text-stone-900 max-w-lg mx-auto leading-relaxed">
                  "{currentTagQ.concept}"
                </p>
                <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block border border-emerald-100">
                  To'g'ri javob uchun: +15 XP {tagStreak > 0 && `(+${tagStreak * 2} XP bonus)`}
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentTagQ.options.map((opt) => {
                  const isChosen = selectedTag === opt;
                  let btnClass = 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800';

                  if (tagFeedback) {
                    if (opt === currentTagQ.correctTag) {
                      btnClass = 'bg-emerald-500 border-emerald-600 text-white shadow-md scale-105';
                    } else if (isChosen) {
                      btnClass = 'bg-rose-500 border-rose-600 text-white';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswerTag(opt)}
                      disabled={tagFeedback !== null}
                      className={`py-4 px-3 rounded-2xl border text-sm font-mono font-bold transition-all shadow-xs cursor-pointer ${btnClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {tagFeedback && (
                <div
                  className={`p-4 rounded-2xl text-xs flex items-center gap-3 animate-in fade-in duration-200 ${
                    tagFeedback === 'correct'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border border-rose-200 text-rose-900'
                  }`}
                >
                  {tagFeedback === 'correct' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold block">
                      {tagFeedback === 'correct' ? "Ajoyib! To'g'ri javob." : "Xato! Qaytadan urinib ko'ring."}
                    </span>
                    <span className="text-[11px] text-stone-600">{currentTagQ.explanation}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* GAME 2: BUG HUNTER */}
          {activeGame === 'bug' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100 flex items-center gap-1">
                      <Bug className="w-3.5 h-3.5" />
                      O'yin 2: Koddagi Xatoni Top (Bug Hunter)
                    </span>
                    <span className="text-xs font-bold text-stone-500">
                      Bosqich: {currentBugQ.level}-daraja
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 mt-1">
                    Koddagi xatolikni aniqlang va +25 XP ga ega bo'ling!
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
                  {bugScore} ball to'plandi
                </span>
              </div>

              {/* Snippet Card */}
              <div className="p-5 bg-stone-950 text-rose-300 rounded-2xl font-mono text-xs overflow-x-auto border border-stone-800 shadow-inner">
                <span className="text-[10px] text-stone-500 block mb-1 font-sans">Sintaksis tekshiruvi:</span>
                <code>{currentBugQ.code}</code>
              </div>

              <p className="text-sm font-bold text-stone-900">
                {currentBugQ.question}
              </p>

              <div className="space-y-2.5">
                {currentBugQ.options.map((opt, idx) => {
                  const isSelected = selectedBugOpt === idx;
                  let optClass = 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-800';

                  if (bugFeedback) {
                    if (idx === currentBugQ.correctIndex) {
                      optClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                    } else if (isSelected) {
                      optClass = 'bg-rose-50 border-rose-400 text-rose-900 line-through';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerBug(idx)}
                      disabled={bugFeedback !== null}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all cursor-pointer flex items-center justify-between ${optClass}`}
                    >
                      <span>{opt}</span>
                      {bugFeedback && idx === currentBugQ.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {bugFeedback && (
                <div className="p-4 bg-stone-100 rounded-2xl text-xs text-stone-700">
                  <strong className="text-stone-900 block mb-0.5">Xato izohi:</strong>
                  {currentBugQ.explanation}
                </div>
              )}
            </div>
          )}

          {/* GAME 3: CSS SELECTOR ARENA */}
          {activeGame === 'selector' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" />
                      O'yin 3: CSS Selektorlar Arenasi
                    </span>
                    <span className="text-xs font-bold text-stone-500">
                      Bosqich: {currentSelectorQ.level}-daraja
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 mt-1">
                    Ko'rsatilgan maqsadga mos CSS selektorini tanlang (+20 XP)!
                  </h3>
                </div>
                <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-3.5 py-1.5 rounded-xl border border-indigo-200 self-start sm:self-auto">
                  {selectorScore} ochko
                </span>
              </div>

              {/* Target & HTML block */}
              <div className="p-5 bg-gradient-to-r from-indigo-50/50 to-sky-50/50 rounded-2xl border border-indigo-100 space-y-2">
                <div className="text-xs text-stone-600">
                  Vazifa: <strong className="text-stone-950 text-sm">{currentSelectorQ.target}</strong>
                </div>
                <div className="p-3 bg-stone-950 text-sky-300 rounded-xl font-mono text-xs overflow-x-auto">
                  <code>{currentSelectorQ.htmlContext}</code>
                </div>
              </div>

              {/* Selector Options */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentSelectorQ.options.map((sel) => {
                  const isChosen = selectedSelector === sel;
                  let selClass = 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800';

                  if (selectorFeedback) {
                    if (sel === currentSelectorQ.correctSelector) {
                      selClass = 'bg-emerald-500 border-emerald-600 text-white shadow-md scale-105';
                    } else if (isChosen) {
                      selClass = 'bg-rose-500 border-rose-600 text-white';
                    }
                  }

                  return (
                    <button
                      key={sel}
                      onClick={() => handleAnswerSelector(sel)}
                      disabled={selectorFeedback !== null}
                      className={`py-4 px-3 rounded-2xl border text-sm font-mono font-bold transition-all shadow-xs cursor-pointer ${selClass}`}
                    >
                      {sel}
                    </button>
                  );
                })}
              </div>

              {selectorFeedback && (
                <div className="p-4 bg-stone-100 rounded-2xl text-xs text-stone-700">
                  <strong className="text-stone-900 block mb-0.5">Selektor qoidasi:</strong>
                  {currentSelectorQ.explanation}
                </div>
              )}
            </div>
          )}

          {/* GAME 4: INTERACTIVE CARD BUILDER */}
          {activeGame === 'builder' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5" />
                    O'yin 4: Interaktiv HTML & CSS Konstruktori
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 mt-0.5">
                    Tugmalarni bosib o'z tanishuv kartochkangizni yarating va +50 XP ishlang!
                  </h3>
                </div>

                <button
                  onClick={handleCompleteCardChallenge}
                  disabled={cardChallengeCompleted}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    cardChallengeCompleted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default'
                      : 'bg-gradient-to-r from-rose-600 to-indigo-600 hover:opacity-90 text-white shadow-md cursor-pointer'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>{cardChallengeCompleted ? "✓ 50 XP Qabul Qilindi!" : "Topshiriqni Yakunlash (+50 XP)"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Controls */}
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Sarlavha matni (HTML: &lt;h2&gt;)
                    </label>
                    <input
                      type="text"
                      value={builderTitle}
                      onChange={(e) => setBuilderTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-xl outline-none focus:border-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Asosiy rang (CSS: color & background)
                    </label>
                    <div className="flex gap-2">
                      {['#e11d48', '#0284c7', '#059669', '#d97706', '#7c3aed'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setBuilderColor(c)}
                          className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                            builderColor === c ? 'scale-110 border-stone-900 shadow-sm' : 'border-transparent'
                          }`}
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Fon rangi (CSS: background-color)
                    </label>
                    <div className="flex gap-2">
                      {['#fff1f2', '#f0f9ff', '#f0fdf4', '#fffbeb', '#faf5ff'].map((bg) => (
                        <button
                          key={bg}
                          onClick={() => setBuilderBg(bg)}
                          className={`w-7 h-7 rounded-md border transition-transform cursor-pointer ${
                            builderBg === bg ? 'scale-110 border-stone-900 shadow-sm' : 'border-stone-200'
                          }`}
                          style={{ background: bg }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Burchak yumaloqligi (CSS: border-radius)
                    </label>
                    <div className="flex gap-2 text-xs">
                      {['0px', '8px', '16px', '24px'].map((r) => (
                        <button
                          key={r}
                          onClick={() => setBuilderRadius(r)}
                          className={`px-3 py-1.5 rounded-xl border font-mono cursor-pointer transition-colors ${
                            builderRadius === r ? 'bg-stone-900 text-white' : 'bg-stone-50 border-stone-200'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={builderHasBtn}
                        onChange={(e) => setBuilderHasBtn(e.target.checked)}
                        className="rounded text-rose-600 focus:ring-0"
                      />
                      <span>Tugma qo'shish (&lt;button&gt;)</span>
                    </label>
                  </div>
                </div>

                {/* Live Preview & Generated HTML */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                      Jonli Natija:
                    </span>
                    <div
                      className="p-5 border border-stone-200 rounded-2xl bg-white shadow-xs"
                      dangerouslySetInnerHTML={{ __html: generatedCardHtml }}
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                      Avtomatik Hosil Bo'lgan HTML Kod:
                    </span>
                    <pre className="p-3.5 bg-stone-900 text-stone-100 rounded-2xl text-xs font-mono overflow-x-auto">
                      <code>{generatedCardHtml}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 2: LEADERBOARD VIEW (PESHQADAMLAR JADVALI)
      ======================================================== */}
      {mainTab === 'leaderboard' && (
        <div className="space-y-6">
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {/* 2nd Place */}
            {fullLeaderboard[1] && (
              <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col items-center text-center relative order-2 sm:order-1 mt-0 sm:mt-6">
                <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-slate-200 text-slate-800 text-xs font-black shadow-xs flex items-center gap-1 border border-slate-300">
                  <Medal className="w-3.5 h-3.5 text-slate-500" />
                  <span>2-O'RIN</span>
                </div>
                <img
                  src={fullLeaderboard[1].avatar}
                  alt={fullLeaderboard[1].name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-300 shadow-md mb-2"
                />
                <h4 className="text-sm font-bold text-stone-900">{fullLeaderboard[1].name}</h4>
                <span className="text-[11px] text-stone-500">{fullLeaderboard[1].levelTitle}</span>
                <div className="mt-3 text-lg font-black text-slate-700 flex items-center gap-1">
                  <Zap className="w-4 h-4 fill-slate-500 text-slate-500" />
                  <span>{fullLeaderboard[1].xp} XP</span>
                </div>
                <span className="text-[10px] text-stone-400 mt-1">
                  {fullLeaderboard[1].gamesCompleted} ta o'yin bosqichi
                </span>
              </div>
            )}

            {/* 1st Place (Winner) */}
            {fullLeaderboard[0] && (
              <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-6 border-2 border-amber-300 shadow-lg flex flex-col items-center text-center relative order-1 sm:order-2">
                <div className="absolute -top-4 px-4 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-black shadow-md flex items-center gap-1.5 border border-amber-500">
                  <Crown className="w-4 h-4 text-amber-950 fill-amber-950" />
                  <span>1-O'RIN · CHEMPION</span>
                </div>
                <div className="relative mb-2">
                  <img
                    src={fullLeaderboard[0].avatar}
                    alt={fullLeaderboard[0].name}
                    className="w-20 h-20 rounded-2xl object-cover border-3 border-amber-400 shadow-lg"
                  />
                  <span className="absolute -bottom-2 -right-1 text-2xl">🥇</span>
                </div>
                <h4 className="text-base font-extrabold text-stone-950">{fullLeaderboard[0].name}</h4>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full mt-0.5">
                  {fullLeaderboard[0].levelTitle}
                </span>
                <div className="mt-3 text-2xl font-black text-amber-600 flex items-center gap-1.5">
                  <Zap className="w-5 h-5 fill-amber-500 text-amber-500" />
                  <span>{fullLeaderboard[0].xp} XP</span>
                </div>
                <span className="text-[11px] text-stone-500 mt-1 font-semibold">
                  {fullLeaderboard[0].gamesCompleted} ta bosqich · {fullLeaderboard[0].accuracy}% aniqlik
                </span>
              </div>
            )}

            {/* 3rd Place */}
            {fullLeaderboard[2] && (
              <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col items-center text-center relative order-3 mt-0 sm:mt-8">
                <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black shadow-xs flex items-center gap-1 border border-amber-300">
                  <Medal className="w-3.5 h-3.5 text-amber-700" />
                  <span>3-O'RIN</span>
                </div>
                <img
                  src={fullLeaderboard[2].avatar}
                  alt={fullLeaderboard[2].name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-300 shadow-md mb-2"
                />
                <h4 className="text-sm font-bold text-stone-900">{fullLeaderboard[2].name}</h4>
                <span className="text-[11px] text-stone-500">{fullLeaderboard[2].levelTitle}</span>
                <div className="mt-3 text-lg font-black text-amber-800 flex items-center gap-1">
                  <Zap className="w-4 h-4 fill-amber-700 text-amber-700" />
                  <span>{fullLeaderboard[2].xp} XP</span>
                </div>
                <span className="text-[10px] text-stone-400 mt-1">
                  {fullLeaderboard[2].gamesCompleted} ta o'yin bosqichi
                </span>
              </div>
            )}
          </div>

          {/* Current User Highlight Card */}
          <div className="bg-gradient-to-r from-stone-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 font-black flex items-center justify-center text-sm shadow-sm">
                #{currentUserRank}
              </div>
              <div>
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Sizning Joriy Natijangiz
                </div>
                <div className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                  <span>{studentAccount?.name || 'Mehmon Koder'}</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-stone-200 font-normal">
                    Lvl {currentLevelInfo.level} · {currentLevelInfo.title}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center sm:text-right">
                <div className="text-xl font-black text-amber-300 flex items-center gap-1 justify-center sm:justify-end">
                  <Zap className="w-4 h-4 fill-amber-300" />
                  <span>{playerXp} XP</span>
                </div>
                <div className="text-[11px] text-stone-300">
                  {gamesCompletedCount} ta bosqich yechildi
                </div>
              </div>

              {!studentAccount && onOpenRegister && (
                <button
                  onClick={onOpenRegister}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  O'rningizni Saqlang
                </button>
              )}
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Barcha Dasturchilar Reytingi</span>
                </h3>
                <p className="text-xs text-stone-500">
                  O'yinlar va kod sinovlari orqali to'plangan tajriba ochkolari (XP)
                </p>
              </div>

              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setLeaderboardFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    leaderboardFilter === 'all' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
                  }`}
                >
                  Barcha vaqt
                </button>
                <button
                  onClick={() => setLeaderboardFilter('weekly')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    leaderboardFilter === 'weekly' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
                  }`}
                >
                  Bu hafta
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">O'rin</th>
                    <th className="py-3 px-4">Dasturchi</th>
                    <th className="py-3 px-4">Daraja</th>
                    <th className="py-3 px-4 text-center">Yechilgan Bosqichlar</th>
                    <th className="py-3 px-4 text-center">Aniqlik</th>
                    <th className="py-3 px-4 text-right">Tajriba (XP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {fullLeaderboard.map((player, index) => {
                    const rank = index + 1;
                    const isSelf = player.isCurrentUser;

                    return (
                      <tr
                        key={player.id}
                        className={`transition-colors ${
                          isSelf
                            ? 'bg-rose-50/70 font-semibold text-rose-950'
                            : 'hover:bg-stone-50/80 text-stone-800'
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center font-bold">
                          {rank === 1 ? (
                            <span className="text-base">🥇</span>
                          ) : rank === 2 ? (
                            <span className="text-base">🥈</span>
                          ) : rank === 3 ? (
                            <span className="text-base">🥉</span>
                          ) : (
                            <span className="text-stone-500 font-mono">#{rank}</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={player.avatar}
                              alt={player.name}
                              className="w-8 h-8 rounded-full object-cover border border-stone-200 shadow-2xs"
                            />
                            <div>
                              <div className="font-bold flex items-center gap-1.5">
                                <span>{player.name}</span>
                                {isSelf && (
                                  <span className="text-[9px] bg-rose-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                                    Siz
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-stone-400">
                                {player.streak > 0 && `🔥 ${player.streak} streak`}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-800 border border-stone-200/70">
                            Lvl {player.level} · {player.levelTitle}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center font-medium">
                          {player.gamesCompleted} ta
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="font-bold text-emerald-600">{player.accuracy}%</span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 font-black text-amber-600 text-sm">
                            <Zap className="w-3.5 h-3.5 fill-amber-500" />
                            {player.xp} XP
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BADGES & ACHIEVEMENTS (NISHONLAR VA YUTUQLAR) */}
      {mainTab === 'badges' && (
        <div className="space-y-6">
          {/* Confetti & Celebration Action Bar */}
          <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-300/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 text-white flex items-center justify-center font-black shadow-md text-xl">
                🎉
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-stone-900 flex items-center gap-2">
                  <span>Nishonlar, Medallar & Bayramona Konfeti Effekti</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">Jonli Konfeti Faol</span>
                </div>
                <p className="text-[11px] sm:text-xs text-stone-600 mt-0.5">
                  Har bir nishon va daraja ochilganda ekranda to'liq rang-barang konfeti effekti portlaydi.
                </p>
              </div>
            </div>
            <button
              onClick={() => fireMedalCelebrationConfetti('gold')}
              className="whitespace-nowrap px-4 py-2 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-amber-200 text-amber-200" />
              <span>Bayramona Konfeti Otish 🎉</span>
            </button>
          </div>

          {/* Overview Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Badges Progress */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Jami Medallar
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Medal className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-stone-900 flex items-baseline gap-1.5">
                  <span>{unlockedBadgesCount}</span>
                  <span className="text-sm font-semibold text-stone-400">/ {totalBadgesCount} ta</span>
                </div>
                <div className="text-xs text-stone-500 mt-1">
                  Umumiy yutuq darajasi: <strong className="text-purple-600 font-extrabold">{badgesCompletionPercent}%</strong>
                </div>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${badgesCompletionPercent}%` }}
                />
              </div>
            </div>

            {/* Card 2: Bonus XP Earned */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Yutuq Bonusi (XP)
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4 fill-amber-500" />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600 flex items-baseline gap-1">
                  <span>+{totalBonusXpUnlocked}</span>
                  <span className="text-sm font-semibold text-stone-400">XP</span>
                </div>
                <div className="text-xs text-stone-500 mt-1">
                  Medallar orqali taqdim etilgan qo'shimcha tajriba
                </div>
              </div>
              <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 rounded-lg px-2.5 py-1 border border-amber-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Har bir nishon yangi XP beradi</span>
              </div>
            </div>

            {/* Card 3: Highest Achieved Tier */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Oliy Medalingiz
                </span>
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <Crown className="w-4 h-4" />
                </div>
              </div>
              <div>
                {(() => {
                  const unlockedTiers = evaluatedBadges
                    .filter((b) => b.status.isUnlocked)
                    .map((b) => b.tier);
                  let highestTier: BadgeTier = 'bronze';
                  if (unlockedTiers.includes('diamond')) highestTier = 'diamond';
                  else if (unlockedTiers.includes('platinum')) highestTier = 'platinum';
                  else if (unlockedTiers.includes('gold')) highestTier = 'gold';
                  else if (unlockedTiers.includes('silver')) highestTier = 'silver';

                  const cfg = TIER_CONFIG[highestTier];
                  return (
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-1.5">
                        <span>{cfg.emoji}</span>
                        <span>{cfg.nameUz}</span>
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        Hozirgi erishilgan eng yuqori toifa
                      </div>
                    </div>
                  );
                })()}
              </div>
              <div className="text-[11px] font-semibold text-stone-600 bg-stone-50 rounded-lg px-2.5 py-1 border border-stone-200 flex items-center justify-between">
                <span>Daraja:</span>
                <strong className="text-stone-900">{currentLevelInfo.title}</strong>
              </div>
            </div>

            {/* Card 4: Upcoming Nearest Badge */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-stone-900 text-white rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3 border border-indigo-800/50">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  Keyingi Yaqin Medal
                </span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-extrabold text-amber-300">
                  Kutilmoqda
                </span>
              </div>
              {nextUpcomingBadge ? (
                <div>
                  <div className="text-base font-extrabold text-white flex items-center gap-1.5">
                    <span>{TIER_CONFIG[nextUpcomingBadge.tier].emoji}</span>
                    <span className="truncate">{nextUpcomingBadge.title}</span>
                  </div>
                  <div className="text-[11px] text-indigo-200 mt-1 line-clamp-2">
                    {nextUpcomingBadge.status.remainingLabel || nextUpcomingBadge.conditionDescription}
                  </div>
                  <div className="mt-2 text-[11px] font-bold text-amber-300 flex items-center justify-between">
                    <span>Mukofot: +{nextUpcomingBadge.xpBonus} XP</span>
                    <button
                      onClick={() => setSelectedBadgeModal(nextUpcomingBadge)}
                      className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-md transition-all font-bold"
                    >
                      Batafsil
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Barcha medallar ochilgan!
                  </div>
                  <p className="text-[11px] text-indigo-200 mt-1">
                    Siz akademiyaning mutlaq rekordchisiz!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Filter Bar & Category Selector */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setBadgeFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  badgeFilter === 'all'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Barchasi ({totalBadgesCount})
              </button>
              <button
                onClick={() => setBadgeFilter('unlocked')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  badgeFilter === 'unlocked'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Qulfi Ochilgan ({unlockedBadgesCount})</span>
              </button>
              <button
                onClick={() => setBadgeFilter('locked')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  badgeFilter === 'locked'
                    ? 'bg-stone-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Qulflangan ({totalBadgesCount - unlockedBadgesCount})</span>
              </button>
              <button
                onClick={() => setBadgeFilter('xp')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  badgeFilter === 'xp'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Tajriba XP</span>
              </button>
              <button
                onClick={() => setBadgeFilter('stages')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  badgeFilter === 'stages'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Bosqichlar</span>
              </button>
              <button
                onClick={() => setBadgeFilter('games')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  badgeFilter === 'games'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>O'yinlar</span>
              </button>
            </div>

            {/* Quick Helper Info */}
            <div className="text-[11px] text-stone-500 flex items-center gap-1 self-end sm:self-auto">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Medalni bosib batafsil sertifikat va shartlarini ko'ring</span>
            </div>
          </div>

          {/* Badges Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBadges.map((badge) => {
              const tier = TIER_CONFIG[badge.tier];
              const isUnlocked = badge.status.isUnlocked;

              return (
                <div
                  key={badge.id}
                  onClick={() => setSelectedBadgeModal(badge)}
                  className={`group relative rounded-3xl p-5 transition-all duration-300 cursor-pointer border flex flex-col justify-between ${
                    isUnlocked
                      ? `bg-gradient-to-br ${tier.bgGradient} ${tier.borderClass} ${tier.glowClass} hover:-translate-y-1 shadow-md`
                      : 'bg-stone-50/90 border-stone-200 hover:border-stone-300 hover:bg-stone-100/70 opacity-85 hover:opacity-100'
                  }`}
                >
                  {/* Top Bar inside card: Tier and Unlock Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${tier.badgePill}`}>
                      <span>{tier.emoji}</span>
                      <span>{tier.nameUz}</span>
                    </span>

                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Qulf Ochiq
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-500 px-2 py-0.5 rounded-full bg-stone-200/80 border border-stone-300">
                        <Lock className="w-3 h-3 text-stone-500" />
                        Qulflangan
                      </span>
                    )}
                  </div>

                  {/* Medallion Display Center */}
                  <div className="my-5 flex flex-col items-center text-center">
                    <div className="relative mb-3.5">
                      {/* Outer Ring */}
                      <div
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 duration-300 ${
                          isUnlocked
                            ? `${tier.iconBg} ring-4 ring-white shadow-xl`
                            : 'bg-stone-200 text-stone-400 ring-4 ring-stone-100'
                        }`}
                      >
                        {isUnlocked ? (
                          renderBadgeIcon(badge.iconType, 'w-9 h-9')
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <Lock className="w-7 h-7 text-stone-400" />
                          </div>
                        )}
                      </div>

                      {/* Sparkle badge for unlocked diamond/gold */}
                      {isUnlocked && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-md animate-bounce">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-stone-900 group-hover:text-stone-950">
                      {badge.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2 max-w-xs">
                      {badge.description}
                    </p>
                  </div>

                  {/* Bottom: Progress Bar & Bonus XP Reward */}
                  <div className="space-y-3 pt-3 border-t border-stone-200/60">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-stone-500 font-medium">Holat:</span>
                        <span className={`font-bold ${isUnlocked ? 'text-emerald-700' : 'text-stone-700'}`}>
                          {badge.status.progressLabel}
                        </span>
                      </div>
                      <div className="w-full bg-stone-200/70 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-700 ${
                            isUnlocked
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                              : 'bg-gradient-to-r from-amber-400 to-rose-500'
                          }`}
                          style={{ width: `${badge.status.progressPercent}%` }}
                        />
                      </div>
                      {!isUnlocked && badge.status.remainingLabel && (
                        <div className="text-[10px] text-stone-500 italic text-right">
                          {badge.status.remainingLabel}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="inline-flex items-center gap-1 font-black text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-300/80">
                        <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                        +{badge.xpBonus} XP Mukofot
                      </span>
                      <button
                        type="button"
                        className="text-[11px] font-bold text-stone-600 group-hover:text-stone-900 flex items-center gap-1 hover:underline"
                      >
                        <span>Batafsil</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAIL MODAL FOR SELECTED BADGE */}
      {selectedBadgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5 animate-scale-up">
            {/* Close Button */}
            <button
              onClick={() => setSelectedBadgeModal(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors font-black text-sm"
            >
              ✕
            </button>

            {/* Modal Header with Medallion */}
            <div className="text-center pt-2">
              <div className="inline-block relative mb-3">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center ring-8 ring-white shadow-2xl mx-auto ${
                    selectedBadgeModal.status.isUnlocked
                      ? `${TIER_CONFIG[selectedBadgeModal.tier].iconBg}`
                      : 'bg-stone-200 text-stone-400'
                  }`}
                >
                  {selectedBadgeModal.status.isUnlocked ? (
                    renderBadgeIcon(selectedBadgeModal.iconType, 'w-12 h-12')
                  ) : (
                    <Lock className="w-10 h-10 text-stone-400" />
                  )}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className={`px-3 py-0.5 rounded-full text-xs font-black border shadow-xs ${TIER_CONFIG[selectedBadgeModal.tier].badgePill}`}>
                    {TIER_CONFIG[selectedBadgeModal.tier].emoji} {TIER_CONFIG[selectedBadgeModal.tier].nameUz}
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-black text-stone-900 mt-4">
                {selectedBadgeModal.title}
              </h2>
              <div className="text-xs font-semibold text-stone-500 mt-1">
                Kategoriya: <strong className="text-stone-800 capitalize">{selectedBadgeModal.category}</strong>
              </div>
            </div>

            {/* Lore and Story */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 text-center space-y-2">
              <p className="text-xs text-stone-700 leading-relaxed font-medium italic">
                "{selectedBadgeModal.lore}"
              </p>
              <p className="text-xs text-stone-600 font-normal">
                {selectedBadgeModal.description}
              </p>
            </div>

            {/* Requirements and Progress Breakdown */}
            <div className="space-y-3 bg-stone-100/60 rounded-2xl p-4 border border-stone-200/70">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-600">Talab qilinadigan shart:</span>
                <span className="font-bold text-stone-900">{selectedBadgeModal.conditionDescription}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-600">Sizning ko'rsatkichingiz:</span>
                <span className="font-bold text-indigo-700">{selectedBadgeModal.status.progressLabel}</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-700 ${
                    selectedBadgeModal.status.isUnlocked
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      : 'bg-gradient-to-r from-amber-400 to-rose-500'
                  }`}
                  style={{ width: `${selectedBadgeModal.status.progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-stone-600">Nishon maqomi:</span>
                {selectedBadgeModal.status.isUnlocked ? (
                  <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Qo'lga kiritilgan (+{selectedBadgeModal.xpBonus} XP)
                  </span>
                ) : (
                  <span className="font-bold text-amber-700 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    {selectedBadgeModal.status.remainingLabel || 'Bajarilmoqda'}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              {selectedBadgeModal.status.isUnlocked && (
                <>
                  <button
                    onClick={() => fireMedalCelebrationConfetti(selectedBadgeModal.tier)}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-95 text-white flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 fill-amber-200 text-amber-200" />
                    <span>Konfeti Otish 🎉</span>
                  </button>
                  <button
                    onClick={() => copyBadgeCelebration(selectedBadgeModal)}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Yutuqni Ulashish</span>
                  </button>
                </>
              )}
              <a
                href="/api/download-zip"
                download="frontend_akademiya_loyihasi.zip"
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-stone-900 hover:bg-stone-800 text-white flex items-center justify-center gap-2 shadow-sm transition-all border border-stone-700"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>ZIP yuklab olish</span>
              </a>
              <button
                onClick={() => setSelectedBadgeModal(null)}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl font-bold text-xs bg-stone-200 hover:bg-stone-300 text-stone-800 transition-all cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SPECIAL UNLOCKED MEDAL CELEBRATION MODAL WITH SCREEN-WIDE CONFETTI */}
      {unlockedCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-gradient-to-b from-stone-900 via-stone-850 to-stone-900 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-7 shadow-2xl text-center space-y-4 animate-scale-up text-white">
            <button
              onClick={() => setUnlockedCelebrationModal(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 flex items-center justify-center transition-colors font-black text-sm cursor-pointer"
            >
              ✕
            </button>

            {/* Glowing animated medal badge */}
            <div className="relative inline-block my-2">
              <div className="absolute inset-0 rounded-full blur-xl bg-amber-400/40 animate-pulse" />
              <div
                className={`relative w-28 h-28 rounded-full flex items-center justify-center ring-8 ring-amber-300/30 shadow-2xl mx-auto ${TIER_CONFIG[unlockedCelebrationModal.tier].iconBg}`}
              >
                {renderBadgeIcon(unlockedCelebrationModal.iconType, 'w-14 h-14')}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className={`px-4 py-1 rounded-full text-xs font-black border shadow-lg ${TIER_CONFIG[unlockedCelebrationModal.tier].badgePill}`}>
                  {TIER_CONFIG[unlockedCelebrationModal.tier].emoji} {TIER_CONFIG[unlockedCelebrationModal.tier].nameUz} Medali
                </span>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-extrabold uppercase tracking-widest border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
                <span>Yangi Yutuq Qo'lga Kiritildi!</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                {unlockedCelebrationModal.title}
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
                {unlockedCelebrationModal.description}
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-3 border border-white/10 flex items-center justify-around text-xs">
              <div>
                <div className="text-stone-400 text-[10px] uppercase font-bold">Mukofot XP</div>
                <div className="text-amber-400 font-black text-lg">+{unlockedCelebrationModal.xpBonus} XP</div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <div className="text-stone-400 text-[10px] uppercase font-bold">Toifa</div>
                <div className="text-stone-200 font-extrabold capitalize">{unlockedCelebrationModal.category}</div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <div className="text-stone-400 text-[10px] uppercase font-bold">Status</div>
                <div className="text-emerald-400 font-black">Ochildi ✨</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                onClick={() => fireMedalCelebrationConfetti(unlockedCelebrationModal.tier)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl font-extrabold text-xs bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-95 text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-amber-200" />
                <span>Yana Konfeti Otish 🎉</span>
              </button>
              <button
                onClick={() => setUnlockedCelebrationModal(null)}
                className="w-full sm:w-auto py-3 px-6 rounded-xl font-bold text-xs bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
              >
                Ajoyib, davom etish!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
