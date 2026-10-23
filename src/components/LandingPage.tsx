import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Users,
  Award,
  KeyRound,
  ShieldAlert,
  CheckCircle2,
  Code2,
  Play,
  ArrowRight,
  Flame,
  Coffee,
  BookOpen,
  Terminal,
  Zap,
  LogIn,
  UserPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OWNER_PROFILE, INITIAL_TEACHERS } from '../data/mockData';
import { Student, Teacher } from '../types';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenTestIdModal: () => void;
  students?: Student[];
  teachers?: Teacher[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onOpenTestIdModal,
  students = [],
  teachers = INITIAL_TEACHERS,
}) => {
  // Mini interactive code challenge on landing page
  const [userCode, setUserCode] = useState('<button class="btn-primary">Boshlash</button>');
  const [challengeSolved, setChallengeSolved] = useState(false);
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);

  const handleTestChallenge = () => {
    if (userCode.toLowerCase().includes('button') && (userCode.includes('btn') || userCode.includes('class') || userCode.includes('style'))) {
      setChallengeSolved(true);
      setChallengeFeedback("🎉 Ajoyib! Siz HTML tugmasini muvaffaqiyatli yaratdingiz va uslub berdingiz!");
      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#6366f1', '#ec4899', '#f59e0b', '#10b981'],
        });
      } catch (err) {
        console.log('Confetti error:', err);
      }
    } else {
      setChallengeFeedback("⚠️ Iltimos, <button> tegini va class yoki stil atributini to'g'ri kiriting.");
    }
  };

  return (
    <div className="space-y-16 py-4 animate-in fade-in duration-500">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800 p-8 sm:p-14 text-center shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-r from-cyan-500/10 via-indigo-500/20 to-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>DevMaster Academy • Zamonaviy Dasturlash Maktabi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Dasturlashni noldan o'rganing va{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              professional dasturchi
            </span>{' '}
            bo'ling!
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            HTML, CSS va JavaScript bo'yicha interaktiv darslar, har bir ustoz qo'l ostida maksimal{' '}
            <strong className="text-cyan-300 font-bold">15 talabalik</strong> kichik mentorlik guruhlari,
            bir martalik maxsus <strong className="text-indigo-300 font-bold">Test ID</strong> imtihonlari va yakuniy rasmiy sertifikat.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenRegister}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/25 flex items-center gap-2 text-sm transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Ro'yxatdan O'tish (Bepul)</span>
            </button>

            <button
              onClick={onOpenLogin}
              className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-white font-bold rounded-2xl border border-slate-700 flex items-center gap-2 text-sm transition-all"
            >
              <LogIn className="w-4 h-4 text-cyan-400" />
              <span>Tizimga Kirish</span>
            </button>

            <button
              onClick={onOpenTestIdModal}
              className="px-5 py-3.5 bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 hover:text-white font-semibold rounded-2xl border border-indigo-700/40 flex items-center gap-2 text-xs transition-all"
            >
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>Test ID bilan sinash</span>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-slate-800/80">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-2xl font-black text-cyan-400 block">15 Talaba</span>
              <span className="text-xs text-slate-400">Har bir guruhda qat'iy chegara</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-2xl font-black text-indigo-400 block">3 Bosqich</span>
              <span className="text-xs text-slate-400">HTML ➔ CSS ➔ JavaScript</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-2xl font-black text-emerald-400 block">100% Amaliyot</span>
              <span className="text-xs text-slate-400">Jonli kod tahrirlagich bilan</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-2xl font-black text-amber-400 block">Test ID</span>
              <span className="text-xs text-slate-400">Bir martalik xavfsiz sinov</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ASOSCHI HAQIDA (OWNER BIO CARD) */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-amber-500/20 shrink-0">
            👑
          </div>
          <div className="space-y-2 text-center lg:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">{OWNER_PROFILE.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {OWNER_PROFILE.roleTitle}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {OWNER_PROFILE.bio}
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2">
              {OWNER_PROFILE.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center max-w-xs w-full shrink-0">
            <Coffee className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <p className="text-xs italic text-slate-300">"{OWNER_PROFILE.quote}"</p>
            <span className="text-[10px] text-slate-500 mt-1 block">— DevMaster Shiori</span>
          </div>
        </div>
      </section>

      {/* 3. TA'LIM YO'NALISHLARI VA BOSQICHLAR (CURRICULUM) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Bosqichma-bosqich Professional Dasturlash
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Har bir bosqich darslarini tugatganingizdan so'ng ustozingiz sizga individual Test ID yaratadi.
            Faqat muvaffaqiyatli topshirganlar keyingi bosqichga o'tkaziladi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stage 1: HTML */}
          <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 relative flex flex-col justify-between hover:border-cyan-500/60 transition-all shadow-lg">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-lg border border-cyan-500/30">
                01
              </div>
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span>HTML Asoslari</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold">
                  1-Bosqich
                </span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Veb-sahifaning skeletini tuzish, semantik teglar (`header`, `main`, `section`), jadvallar, formalar, multimediya va toza HTML yozish madaniyati.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> 10 ta amaliy interaktiv dars
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Jonli kod tekshiruvi va XP
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Ustozdan bir martalik Test ID
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Mukofot: 100 XP</span>
              <span className="text-cyan-400 font-bold">Boshlang'ich</span>
            </div>
          </div>

          {/* Stage 2: CSS */}
          <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 relative flex flex-col justify-between hover:border-indigo-500/60 transition-all shadow-lg">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-lg border border-indigo-500/30">
                02
              </div>
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span>CSS & Styling</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-semibold">
                  2-Bosqich
                </span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zamonaviy uslub berish: Flexbox, Grid tizimi, responsiv (mobil) dizayn, chiroyli animatsiyalar, soyalar va zamonaviy UI yaratish sirlari.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Flexbox & Grid laboratoriyalari
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> CSS animatsiyalar va dizayn
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> CSS bosqich imtihoni
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Mukofot: 250 XP</span>
              <span className="text-indigo-400 font-bold">O'rta daraja</span>
            </div>
          </div>

          {/* Stage 3: JavaScript */}
          <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 relative flex flex-col justify-between hover:border-purple-500/60 transition-all shadow-lg">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-lg border border-purple-500/30">
                03
              </div>
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span>JavaScript & DOM</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 font-semibold">
                  3-Bosqich
                </span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Veb sahifaga jon kiritish! O'zgaruvchilar, funksiyalar, DOM manipulyatsiyasi, hodisalar (events), mantiqiy algoritmlar va real loyihalar.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Interaktiv dasturlash amaliyoti
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Katta Final Imtihon
                </li>
                <li className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> Rasmiy DevMaster Sertifikati
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Mukofot: 500 XP</span>
              <span className="text-purple-400 font-bold">Professional</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE DEMO CODE PLAYGROUND WITH CONFETTI */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Jonli Sinov: HTML Tugma Yaratish</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">demo_preview.html</span>
          </div>
          <p className="text-xs text-slate-300">
            Platformamizda darslar qanchalik qulay ekanligini hoziroq sinab ko'ring! Quyidagi kodni o'zgartiring va "Kodni Tekshirish" tugmasini bosing:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                HTML Kodingiz:
              </label>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Jonli Natija (Preview):
              </label>
              <div className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-center">
                <div
                  dangerouslySetInnerHTML={{ __html: userCode }}
                  className="[&>button]:px-4 [&>button]:py-2 [&>button]:bg-cyan-500 [&>button]:hover:bg-cyan-400 [&>button]:text-slate-950 [&>button]:font-bold [&>button]:rounded-xl [&>button]:shadow-lg [&>button]:cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={handleTestChallenge}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/20 active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Kodni Tekshirish & Yutuqni Ochish</span>
            </button>

            {challengeFeedback && (
              <p
                className={`text-xs font-semibold ${
                  challengeSolved ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {challengeFeedback}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 5. USTOZLAR JAMOYASI (TEACHERS SHOWCASE) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            DevMaster Akademiyasi Ustozlari
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Ro'yxatdan o'tganingizda tizim sizni ushbu tajribali ustozlarning biriga avtomatik va adolatli tarzda random biriktiradi.
          </p>
        </div>

        {teachers.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Yangi Mentorlar Jamoasi Shakllantirilmoqda</h3>
            <p className="text-xs text-slate-400">
              Bosh administrator (Owner) tomonidan yangi ustozlar tarkibi tasdiqlanmoqda. Har bir ustozga maksimal 15 nafar iqtidorli talaba biriktiriladi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teachers.map((t) => (
              <div
                key={t.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-slate-700 transition-all shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-black text-base flex items-center justify-center shadow-md">
                    {t.name[0]}
                    {t.surname[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {t.name} {t.surname}
                    </h4>
                    <p className="text-xs text-cyan-400">{t.specialty}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed min-h-[48px]">
                  {t.bio}
                </p>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>{t.experienceYears}+ yil tajriba</span>
                  <span className="text-emerald-400 font-semibold">
                    Maks. 15 talaba
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. CALL TO ACTION (BOTTOM BANNER) */}
      <section className="rounded-3xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Dasturlash kelajagingizni bugun boshlang!
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100">
            Hoziroq ro'yxatdan o'ting, random ustozingiz guruhiga qo'shiling va birinchi HTML darsingizni yakunlang.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenRegister}
              className="px-6 py-3 bg-white !text-slate-950 hover:bg-slate-100 font-black rounded-xl text-xs shadow-xl transition-all cursor-pointer"
            >
              Ro'yxatdan O'tish
            </button>
            <button
              onClick={onOpenLogin}
              className="px-6 py-3 bg-slate-950/70 hover:bg-slate-950 text-white border border-white/20 font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              Mavjud Hisobga Kirish
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
