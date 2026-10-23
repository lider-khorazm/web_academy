import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Trophy,
  Target,
  Zap,
  BookOpen,
  TrendingUp,
  Star,
  Flame,
  Share2,
  X,
  Code2,
  Medal,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, TestSubmissionResult } from '../types';
import { LESSONS } from '../data/mockData';
import { AvatarBadge } from './AvatarBadge';

interface StudentAchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  testSubmissions?: TestSubmissionResult[];
}

interface BadgeItem {
  id: string;
  title: string;
  category: 'lesson' | 'test' | 'xp' | 'rank' | 'special';
  description: string;
  iconName: string;
  colorGradient: string;
  borderColor: string;
  isUnlocked: boolean;
  progressText: string;
  unlockedReward: string;
}

export const StudentAchievementsModal: React.FC<StudentAchievementsModalProps> = ({
  isOpen,
  onClose,
  student,
  testSubmissions = [],
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [copiedShare, setCopiedShare] = useState(false);

  if (!isOpen) return null;

  // Darslar tahlili
  const htmlLessons = LESSONS.filter((l) => l.stage === 'html');
  const cssLessons = LESSONS.filter((l) => l.stage === 'css');
  const jsLessons = LESSONS.filter((l) => l.stage === 'javascript');

  const completedSet = new Set(student.completedLessons || []);
  const htmlCompletedCount = htmlLessons.filter((l) => completedSet.has(l.id)).length;
  const cssCompletedCount = cssLessons.filter((l) => completedSet.has(l.id)).length;
  const jsCompletedCount = jsLessons.filter((l) => completedSet.has(l.id)).length;
  const totalCompleted = completedSet.size;

  // Talabaning topshirgan testlari va Eng yaxshi natijasi
  const studentSubmissions = testSubmissions.filter((sub) => sub.studentId === student.id);
  const bestTestScore = studentSubmissions.length > 0
    ? Math.max(...studentSubmissions.map((s) => s.percentage))
    : (totalCompleted > 0 ? 100 : 0);

  // 9 ta rasmiy mukofotlar (badges) ro'yxati
  const badges: BadgeItem[] = [
    {
      id: 'badge-first-step',
      title: "Ilk Qadam",
      category: 'lesson',
      description: "Dastlabki darsni muvaffaqiyatli o'rganib amaliy kod yozish",
      iconName: 'rocket',
      colorGradient: 'from-cyan-500 to-blue-600',
      borderColor: 'border-cyan-500/40',
      isUnlocked: totalCompleted >= 1,
      progressText: totalCompleted >= 1 ? "Bajarildi (1/1)" : `${totalCompleted}/1 dars`,
      unlockedReward: "+50 XP mukofot",
    },
    {
      id: 'badge-html-master',
      title: "HTML Asoslari Ustasi",
      category: 'lesson',
      description: "Barcha 5 ta HTML veb-tuzilma darslarini to'liq yakunlash",
      iconName: 'html',
      colorGradient: 'from-orange-500 to-amber-600',
      borderColor: 'border-orange-500/40',
      isUnlocked: htmlCompletedCount >= 5,
      progressText: `${htmlCompletedCount}/5 dars (${Math.round((htmlCompletedCount / 5) * 100)}%)`,
      unlockedReward: "HTML Sertifikati nishoni",
    },
    {
      id: 'badge-css-wizard',
      title: "CSS & Dizayn Sehrgari",
      category: 'lesson',
      description: "Barcha 5 ta CSS uslublar va Flexbox/Grid darslarini tamomlash",
      iconName: 'css',
      colorGradient: 'from-blue-500 to-indigo-600',
      borderColor: 'border-blue-500/40',
      isUnlocked: cssCompletedCount >= 5,
      progressText: `${cssCompletedCount}/5 dars (${Math.round((cssCompletedCount / 5) * 100)}%)`,
      unlockedReward: "Dizaynerlik nishoni",
    },
    {
      id: 'badge-js-ninja',
      title: "JavaScript Daho",
      category: 'lesson',
      description: "Barcha 5 ta dinamik JavaScript darslari va DOM algoritmlarini o'zlashtirish",
      iconName: 'js',
      colorGradient: 'from-yellow-400 to-amber-500',
      borderColor: 'border-yellow-500/40',
      isUnlocked: jsCompletedCount >= 5,
      progressText: `${jsCompletedCount}/5 dars (${Math.round((jsCompletedCount / 5) * 100)}%)`,
      unlockedReward: "Algoritm ustasi unvoni",
    },
    {
      id: 'badge-sniper-test',
      title: "Test Snayperi (90%+)",
      category: 'test',
      description: "Ustoz bergan bosqich testida 90% yoki undan yuqori natijaga erishish",
      iconName: 'target',
      colorGradient: 'from-emerald-500 to-teal-600',
      borderColor: 'border-emerald-500/40',
      isUnlocked: bestTestScore >= 90 && studentSubmissions.length > 0,
      progressText: studentSubmissions.length > 0 ? `Natija: ${bestTestScore}%` : "Hali test topshirilmagan",
      unlockedReward: "Test rekordchisi medali",
    },
    {
      id: 'badge-xp-collector',
      title: "XP Kollektori (300+ XP)",
      category: 'xp',
      description: "Darslar va topshiriqlardan jami 300 dan ortiq Tajriba (XP) to'plash",
      iconName: 'zap',
      colorGradient: 'from-purple-500 to-indigo-600',
      borderColor: 'border-purple-500/40',
      isUnlocked: student.xp >= 300,
      progressText: `${student.xp}/300 XP (${Math.min(100, Math.round((student.xp / 300) * 100))}%)`,
      unlockedReward: "Tajribali talaba darajasi",
    },
    {
      id: 'badge-top-rank',
      title: "Akademiya Podiumi (Top 3)",
      category: 'rank',
      description: "DevMaster umumiy talabalar reytingida yetakchi Top 3 talaba safiga kirish",
      iconName: 'trophy',
      colorGradient: 'from-amber-400 to-yellow-500',
      borderColor: 'border-amber-400/40',
      isUnlocked: student.rank <= 3,
      progressText: `Hozirgi reyting: #${student.rank}`,
      unlockedReward: "Oltin reyting nishoni",
    },
    {
      id: 'badge-coin-tycoon',
      title: "DevCoins Boyi (50+ Coins)",
      category: 'special',
      description: "Darslardagi namunaviy kodlar va faollik uchun 50 dan ortiq DevCoin to'plash",
      iconName: 'flame',
      colorGradient: 'from-rose-500 to-orange-500',
      borderColor: 'border-rose-500/40',
      isUnlocked: student.coins >= 50,
      progressText: `${student.coins}/50 DevCoins`,
      unlockedReward: "Akademiya valyutasi unvoni",
    },
    {
      id: 'badge-graduated-master',
      title: "Diplomli Dasturchi",
      category: 'special',
      description: "Barcha 3 ta bosqich va Katta Final Imtihonni 100% topshirib rasmiy diplom olish",
      iconName: 'award',
      colorGradient: 'from-emerald-400 via-teal-500 to-cyan-500',
      borderColor: 'border-emerald-400/50',
      isUnlocked: student.stage === 'graduated',
      progressText: student.stage === 'graduated' ? "Diplom olindi" : "Yakuniy bosqichda",
      unlockedReward: "Rasmiy Akademiya Diplomi",
    },
  ];

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;
  const lockedCount = badges.length - unlockedCount;

  const filteredBadges = badges.filter((b) => {
    if (activeFilter === 'unlocked') return b.isUnlocked;
    if (activeFilter === 'locked') return !b.isUnlocked;
    return true;
  });

  const handleTriggerCelebration = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#6366f1', '#f59e0b', '#10b981'],
      });
    } catch {
      // ignore
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `🏆 Men DevMaster Akademiyasida ${unlockedCount} ta mukofotga erishdim! Bajarilgan darslar: ${totalCompleted}/15, Eng yaxshi natijam: ${bestTestScore}%!`
      );
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'rocket':
        return <Zap className="w-6 h-6" />;
      case 'html':
        return <Code2 className="w-6 h-6" />;
      case 'css':
        return <Star className="w-6 h-6" />;
      case 'js':
        return <Sparkles className="w-6 h-6" />;
      case 'target':
        return <Target className="w-6 h-6" />;
      case 'zap':
        return <Flame className="w-6 h-6" />;
      case 'trophy':
        return <Trophy className="w-6 h-6" />;
      case 'flame':
        return <Medal className="w-6 h-6" />;
      case 'award':
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full my-auto overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800/90 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-l from-indigo-500/15 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <AvatarBadge
                  name={`${student.name} ${student.surname}`}
                  role="student"
                  size="lg"
                  className="w-14 h-14 sm:w-16 sm:h-16 ring-4 ring-cyan-500/30 shadow-lg text-lg"
                />
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] shadow">
                  #{student.rank}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    {student.name} {student.surname}
                  </h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    <span>Shaxsiy Yutuqlar Oynasi</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Akademiyada qo'lga kiritilgan eng yaxshi natijalar, darslar statistikasi va faxriy mukofotlar
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
              title="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          
          {/* Top 3 Core Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            {/* 1. Eng Yaxshi Natija */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-inner flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Eng Yaxshi Natija</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Target className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 flex items-baseline gap-1">
                  {bestTestScore > 0 ? `${bestTestScore}%` : "100%"}
                  <span className="text-xs text-emerald-500/80 font-bold">rekord</span>
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {studentSubmissions.length > 0
                    ? `${studentSubmissions.length} ta topshirilgan test orasida`
                    : "Ilk darslar amaliyotida yuqori natija"}
                </p>
              </div>
            </div>

            {/* 2. Bajarilgan Darslar Soni */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-inner flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Bajarilgan Darslar Soni</span>
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-cyan-400 flex items-baseline gap-1">
                  {totalCompleted}
                  <span className="text-xs text-slate-500 font-bold">/ 15 dars</span>
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  HTML: {htmlCompletedCount}/5 • CSS: {cssCompletedCount}/5 • JS: {jsCompletedCount}/5
                </p>
              </div>
            </div>

            {/* 3. Mukofotlar (Badges) */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-inner flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Ochilgan Mukofotlar</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-black text-amber-400 flex items-baseline gap-1">
                  {unlockedCount}
                  <span className="text-xs text-slate-500 font-bold">/ {badges.length} medal</span>
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {Math.round((unlockedCount / badges.length) * 100)}% nishonlar faollashtirildi
                </p>
              </div>
            </div>

          </div>

          {/* Badges Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Medal className="w-4 h-4 text-cyan-400" />
                <span>Mukofotlar & Faxriy Medallar Galereyasi</span>
              </h3>
              <p className="text-xs text-slate-400">
                Har bir topshiriq va yutuq uchun maxsus esdalik nishonlari
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-slate-800 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Barchasi ({badges.length})
              </button>
              <button
                onClick={() => setActiveFilter('unlocked')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'unlocked'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Ochilgan ({unlockedCount})
              </button>
              <button
                onClick={() => setActiveFilter('locked')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'locked'
                    ? 'bg-slate-800 text-slate-300 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Qulflangan ({lockedCount})
              </button>
            </div>
          </div>

          {/* Badges Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredBadges.map((badge) => {
              return (
                <div
                  key={badge.id}
                  className={`rounded-2xl p-4.5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                    badge.isUnlocked
                      ? 'bg-slate-900 border-slate-700 hover:border-cyan-500/50 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-75'
                  }`}
                >
                  {badge.isUnlocked && (
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-gradient-to-bl from-cyan-500/15 to-transparent rounded-full blur-xl pointer-events-none" />
                  )}

                  <div>
                    {/* Top Row: Icon, Status */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
                          badge.isUnlocked
                            ? `bg-gradient-to-tr ${badge.colorGradient} ring-2 ring-white/20 shadow-cyan-500/20`
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {badge.isUnlocked ? (
                          renderBadgeIcon(badge.iconName)
                        ) : (
                          <Lock className="w-5 h-5 text-slate-500" />
                        )}
                      </div>

                      {badge.isUnlocked ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Ochilgan</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-medium flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Qulflangan</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {badge.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>

                  {/* Bottom: Progress info & reward */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">
                      {badge.progressText}
                    </span>
                    <span className={`font-semibold ${badge.isUnlocked ? 'text-amber-400' : 'text-slate-500'}`}>
                      {badge.unlockedReward}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Ko'proq dars yakunlang va barcha 9 ta oltin medalni jamg'aring!</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleTriggerCelebration}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-md shadow-cyan-600/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Nusxalandi! 🎉</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Yutuqni Ulashish</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-all cursor-pointer"
            >
              Yopish
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
