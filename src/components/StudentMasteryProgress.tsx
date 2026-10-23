import React from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  TrendingUp,
  Target,
  Zap,
  BookOpen,
  ArrowRight,
  Flame,
  Code2,
  Lock,
  Trophy
} from 'lucide-react';
import { Student } from '../types';
import { LESSONS } from '../data/mockData';

interface StudentMasteryProgressProps {
  student: Student;
  onOpenTestIdModal?: () => void;
  onOpenFinalExamModal?: () => void;
  onOpenAchievementsModal?: () => void;
}

export const StudentMasteryProgress: React.FC<StudentMasteryProgressProps> = ({
  student,
  onOpenTestIdModal,
  onOpenFinalExamModal,
  onOpenAchievementsModal,
}) => {
  // Filtrlangan darslar
  const htmlLessons = LESSONS.filter((l) => l.stage === 'html');
  const cssLessons = LESSONS.filter((l) => l.stage === 'css');
  const jsLessons = LESSONS.filter((l) => l.stage === 'javascript');

  const totalLessonsCount = LESSONS.length; // 15
  const completedLessonsSet = new Set(student.completedLessons || []);

  const htmlCompletedCount = htmlLessons.filter((l) => completedLessonsSet.has(l.id)).length;
  const cssCompletedCount = cssLessons.filter((l) => completedLessonsSet.has(l.id)).length;
  const jsCompletedCount = jsLessons.filter((l) => completedLessonsSet.has(l.id)).length;
  const totalCompletedCount = completedLessonsSet.size;

  // Foizlarni hisoblash
  const htmlPercent = Math.min(100, Math.round((htmlCompletedCount / (htmlLessons.length || 1)) * 100));
  const cssPercent = Math.min(100, Math.round((cssCompletedCount / (cssLessons.length || 1)) * 100));
  const jsPercent = Math.min(100, Math.round((jsCompletedCount / (jsLessons.length || 1)) * 100));

  // Umumiy o'zlashtirish foizi
  let overallPercent = Math.min(100, Math.round((totalCompletedCount / (totalLessonsCount || 1)) * 100));
  if (student.stage === 'graduated') {
    overallPercent = 100;
  }

  // Darajani aniqlash
  const getMasteryRank = (percent: number) => {
    if (percent >= 100) return { title: 'Diplomli Dasturchi', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', color: '#10b981' };
    if (percent >= 75) return { title: 'Senior Daraja (JavaScript)', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30', color: '#f59e0b' };
    if (percent >= 45) return { title: 'Middle Daraja (CSS & Dizayn)', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', color: '#6366f1' };
    if (percent >= 20) return { title: 'Junior Daraja (HTML Asoslari)', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', color: '#06b6d4' };
    return { title: 'Boshlang\'ich Qadam', badge: 'bg-slate-700/40 text-slate-300 border-slate-600', color: '#94a3b8' };
  };

  const masteryRank = getMasteryRank(overallPercent);

  // Keyingi maqsad maslahati
  const getNextGoalAdvice = () => {
    if (student.stage === 'graduated') {
      return {
        title: 'Tabriklaymiz! Kurs to\'liq tamomlandi',
        desc: 'Siz butun dasturni 100% o\'zlashtirdingiz va bitiruvchi sertifikatiga ega bo\'ldingiz!',
        actionText: null,
      };
    }
    if (totalCompletedCount === 0) {
      return {
        title: 'Dastlabki darsni boshlang',
        desc: '1-HTML darsini oching, amaliy topshiriqni bajaring va ilk 100 XP ga ega bo\'ling.',
        actionText: 'Darslarga o\'tish',
      };
    }
    if (htmlCompletedCount < htmlLessons.length) {
      const remaining = htmlLessons.length - htmlCompletedCount;
      return {
        title: `HTML bosqichini yakunlashga ${remaining} ta dars qoldi`,
        desc: 'HTML darslarini yakunlab, ustozingizdan Test ID oling va CSS bosqichini oching.',
        actionText: 'Darsni davom ettirish',
      };
    }
    if (student.stage === 'html' && htmlCompletedCount >= htmlLessons.length) {
      return {
        title: 'HTML darslari tugatildi! Test ID kutilyapti',
        desc: 'Ustozingiz bergan bir martalik Test ID orqali HTML imtihonini topshiring.',
        actionText: 'Test ID kiritish',
      };
    }
    if (cssCompletedCount < cssLessons.length) {
      const remaining = cssLessons.length - cssCompletedCount;
      return {
        title: `CSS bosqichini yakunlashga ${remaining} ta dars qoldi`,
        desc: 'Veb sahifalarga zamonaviy dizayn va Flexbox/Grid uslublarini qo\'shishni o\'rganing.',
        actionText: 'CSS darslarini ko\'rish',
      };
    }
    if (student.stage === 'css' && cssCompletedCount >= cssLessons.length) {
      return {
        title: 'CSS yakunlandi! Ustozdan Test ID oling',
        desc: 'CSS sinov testini muvaffaqiyatli topshiring va JavaScript bosqichiga qadam qo\'ying.',
        actionText: 'Test ID kiritish',
      };
    }
    if (jsCompletedCount < jsLessons.length) {
      const remaining = jsLessons.length - jsCompletedCount;
      return {
        title: `JavaScript bosqichini yakunlashga ${remaining} ta dars qoldi`,
        desc: 'Dinamik funksiyalar, DOM manipulyatsiyasi va amaliy topshiriqlarni yakunlang.',
        actionText: 'JS darslarini ochish',
      };
    }
    return {
      title: 'Yakuniy Final Imtihon vaqti keldi!',
      desc: 'Barcha darslar tamomlandi. 100% lik Katta Final Imtihonni topshirib bitiruvchi bo\'ling.',
      actionText: 'Final Imtihonga kirish',
    };
  };

  const nextGoal = getNextGoalAdvice();

  // SVG Circular progress radius & circumference
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPercent / 100) * circumference;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden transition-colors">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>O'zlashtirish Foizi Ko'rsatkichi</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
                Jonli Statistika
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Akademiyadagi barcha 3 ta bosqich (HTML, CSS, JavaScript) darslari va amaliy bilimlar dinamikasi
          </p>
        </div>

        {/* Current status pill and Achievements button */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {onOpenAchievementsModal && (
            <button
              onClick={onOpenAchievementsModal}
              className="px-3 py-1 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Shaxsiy Yutuqlar va Mukofotlar oynasini ochish"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Mukofotlar & Natijalar</span>
            </button>
          )}

          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${masteryRank.badge} flex items-center gap-1.5 shadow-sm`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{masteryRank.title}</span>
          </span>
        </div>
      </div>

      {/* Main Visual Progress Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6 items-center relative z-10">
        
        {/* Left: Circular gauge meter */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800 shadow-inner">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="9"
                fill="transparent"
              />
              {/* Dynamic Progress circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="transition-all duration-1000 ease-out"
                stroke="url(#progressGradient)"
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-white tracking-tight flex items-baseline">
                {overallPercent}
                <span className="text-sm font-bold text-cyan-400 ml-0.5">%</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                O'zlashtirish
              </span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <p className="text-xs font-bold text-slate-300">
              {totalCompletedCount} / {totalLessonsCount} Dars Tamomlangan
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Qolgan darslar: {Math.max(0, totalLessonsCount - totalCompletedCount)} ta
            </p>
          </div>
        </div>

        {/* Right: Master Progress Bar & Technology Breakdown */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Main Visual Multi-Segment Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>Umumiy Kurs Yo'nalishi</span>
              </span>
              <span className="text-cyan-400 font-mono font-black">{overallPercent}% / 100%</span>
            </div>

            {/* Progress track */}
            <div className="relative w-full h-4 bg-slate-950 rounded-full border border-slate-800 p-0.5 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 transition-all duration-700 ease-out shadow-lg"
                style={{ width: `${Math.max(4, overallPercent)}%` }}
              />
            </div>

            {/* Stage Milestone Markers */}
            <div className="grid grid-cols-3 text-[10px] font-semibold text-slate-400 mt-1.5 px-1">
              <div className="text-left flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${htmlPercent === 100 ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
                <span>HTML (0 - 33%)</span>
              </div>
              <div className="text-center flex items-center justify-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${cssPercent === 100 ? 'bg-emerald-400' : 'bg-indigo-400'}`} />
                <span>CSS (34 - 66%)</span>
              </div>
              <div className="text-right flex items-center justify-end gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${jsPercent === 100 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span>JavaScript (67 - 100%)</span>
              </div>
            </div>
          </div>

          {/* Technology-specific Progress Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            
            {/* 1. HTML Card */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/90 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">HTML5</span>
                </div>
                <span className="text-[11px] font-bold font-mono text-orange-400">{htmlPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-orange-600 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${htmlPercent}%` }}
                />
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">{htmlCompletedCount} / {htmlLessons.length} dars</span>
                {htmlPercent === 100 ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Bitirildi
                  </span>
                ) : (
                  <span className="text-cyan-400 font-medium">Jarayonda</span>
                )}
              </div>
            </div>

            {/* 2. CSS Card */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/90 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">CSS3</span>
                </div>
                <span className="text-[11px] font-bold font-mono text-blue-400">{cssPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${cssPercent}%` }}
                />
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">{cssCompletedCount} / {cssLessons.length} dars</span>
                {cssPercent === 100 ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Bitirildi
                  </span>
                ) : student.stage === 'html' ? (
                  <span className="text-slate-500 flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" /> Qulflangan
                  </span>
                ) : (
                  <span className="text-indigo-400 font-medium">Jarayonda</span>
                )}
              </div>
            </div>

            {/* 3. JS Card */}
            <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/90 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">JavaScript</span>
                </div>
                <span className="text-[11px] font-bold font-mono text-yellow-300">{jsPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${jsPercent}%` }}
                />
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">{jsCompletedCount} / {jsLessons.length} dars</span>
                {jsPercent === 100 ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Bitirildi
                  </span>
                ) : student.stage === 'html' || student.stage === 'css' ? (
                  <span className="text-slate-500 flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" /> Qulflangan
                  </span>
                ) : (
                  <span className="text-yellow-400 font-medium">Jarayonda</span>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Next Action Milestone Recommendation Footer */}
      <div className="mt-2 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-slate-950/40 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <span className="font-bold text-white block">{nextGoal.title}</span>
            <span className="text-slate-400 text-[11px]">{nextGoal.desc}</span>
          </div>
        </div>

        {nextGoal.actionText && (
          <div className="flex items-center gap-2 shrink-0">
            {nextGoal.actionText.includes('Test ID') && onOpenTestIdModal && (
              <button
                onClick={onOpenTestIdModal}
                className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
              >
                <span>Test ID Kiritish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {nextGoal.actionText.includes('Final') && onOpenFinalExamModal && (
              <button
                onClick={onOpenFinalExamModal}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-lg text-xs shadow-md shadow-amber-500/20 flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
              >
                <span>Final Imtihonni Boshlash</span>
                <Award className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
