import React, { useState } from 'react';
import {
  Student,
  Teacher,
  Lesson,
  CourseStage
} from '../types';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Play,
  KeyRound,
  Award,
  Sparkles,
  Zap,
  TrendingUp,
  MessageSquare,
  Flame,
  ArrowRight,
  Trophy
} from 'lucide-react';
import { LESSONS } from '../data/mockData';
import { AvatarBadge } from './AvatarBadge';
import { StudentMasteryProgress } from './StudentMasteryProgress';
import { StudentAchievementsModal } from './StudentAchievementsModal';
import { WeeklySchedule } from './WeeklySchedule';
import { TestSubmissionResult } from '../types';

interface StudentViewProps {
  student: Student | null;
  teacher: Teacher | null;
  testSubmissions?: TestSubmissionResult[];
  onOpenTestIdModal: (initialId?: string) => void;
  onOpenFinalExamModal: () => void;
  onOpenGroupChat: (teacherId: string) => void;
  onCompleteLesson: (lessonId: string) => void;
  onOpenRegisterModal?: () => void;
}

export const StudentView: React.FC<StudentViewProps> = ({
  student,
  teacher,
  testSubmissions = [],
  onOpenTestIdModal,
  onOpenFinalExamModal,
  onOpenGroupChat,
  onCompleteLesson,
  onOpenRegisterModal,
}) => {
  const [selectedStage, setSelectedStage] = useState<CourseStage>('html');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [testIdInput, setTestIdInput] = useState('');
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);

  if (!student) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 sm:p-16 text-center shadow-xl space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/30 shadow-lg">
          <BookOpen className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">O'quvchi Profili Topilmadi</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Barcha test o'quvchilari olib tashlangan. Yangi o'quvchi sifatida ro'yxatdan o'ting va ustozlarimizdan birining 15 kishilik guruhiga random tarzda biriktiriling!
          </p>
        </div>
        {onOpenRegisterModal && (
          <button
            onClick={onOpenRegisterModal}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-cyan-600/30"
          >
            Birinchi Bo'lib Ro'yxatdan O'tish
          </button>
        )}
      </div>
    );
  }

  // Filtrlangan darslar
  const stageLessons = LESSONS.filter((l) => l.stage === selectedStage);

  // Bosqich qulflanganligini aniqlash
  const isStageLocked = (stage: CourseStage) => {
    if (student.stage === 'graduated') return false;
    if (student.stage === 'javascript') return false;
    if (student.stage === 'css') {
      return stage === 'javascript';
    }
    // Agar html da bo'lsa
    return stage === 'css' || stage === 'javascript';
  };

  const handleStartLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
  };

  const handleFinishLesson = (lessonId: string) => {
    onCompleteLesson(lessonId);
    setActiveLesson(null);
  };

  // FOYDALANUVCHI QOIDASI: 1 ta shart bilan hamma bosqichni tamomlasa qulufdan ochiladi!
  const isAllStagesCompleted =
    student.stage === 'graduated' ||
    (LESSONS.length > 0 && LESSONS.every((l) => student.completedLessons.includes(l.id)));

  return (
    <div className="space-y-6">
      
      {/* Student Profile Card Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <AvatarBadge
                name={`${student.name} ${student.surname}`}
                role="student"
                size="lg"
                className="w-16 h-16 sm:w-20 sm:h-20 text-lg sm:text-xl ring-4 ring-cyan-500/30 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black text-[11px] shadow">
                #{student.rank}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {student.name} {student.surname}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30">
                  {student.stage === 'graduated' ? "🎓 Bitiruvchi Dasturchi" : `${student.stage.toUpperCase()} Bosqichi`}
                </span>
              </div>

              {teacher ? (
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <span>Biriktirilgan Ustoz:</span>
                  <button
                    onClick={() => onOpenGroupChat(teacher.id)}
                    className="text-indigo-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>{teacher.name} {teacher.surname}</span>
                    <MessageSquare className="w-3 h-3 text-emerald-400" />
                  </button>
                  <span className="text-[10px] text-slate-500">(15 kishilik maxsus guruh)</span>
                </p>
              ) : (
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <span>Biriktirilgan Ustoz:</span>
                  <span className="text-amber-400 font-medium text-xs">Yaqinda tayinlanadi</span>
                  <span className="text-[10px] text-slate-500">(Admin yangi ustoz qo'shgach)</span>
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics & Achievements Trigger */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-3 sm:gap-4 bg-slate-950/70 p-3 sm:p-4 rounded-xl border border-slate-800 shadow-inner">
              <div className="text-center px-3 border-r border-slate-800">
                <span className="text-xs text-slate-400 font-medium block">Tajriba (XP)</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 flex items-center justify-center gap-1">
                  <Zap className="w-5 h-5 fill-emerald-400" />
                  {student.xp}
                </span>
              </div>
              <div className="text-center px-3 border-r border-slate-800">
                <span className="text-xs text-slate-400 font-medium block">Akademiya Reytingi</span>
                <span className="text-xl sm:text-2xl font-black text-amber-400 flex items-center justify-center gap-1">
                  <TrendingUp className="w-5 h-5" />
                  #{student.rank}
                </span>
              </div>
              <div className="text-center px-3">
                <span className="text-xs text-slate-400 font-medium block">DevCoins</span>
                <span className="text-xl sm:text-2xl font-black text-yellow-300 flex items-center justify-center gap-1">
                  <Flame className="w-5 h-5 fill-yellow-400" />
                  {student.coins}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowAchievementsModal(true)}
              className="px-4 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 group shrink-0"
              title="Shaxsiy Yutuqlar, Eng yaxshi natija va Mukofotlar (Badges)"
            >
              <Trophy className="w-4 h-4 fill-slate-950 group-hover:scale-110 transition-transform" />
              <span>Yutuqlar & Medallar</span>
            </button>
          </div>
        </div>

        {/* Pending test alert for student */}
        {student.stageCompletedPendingTest && (
          <div className="mt-5 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-amber-200">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>Tabriklaymiz!</strong> Siz {student.stageCompletedPendingTest.toUpperCase()} darslarini tugatdingiz.
                Ustozingiz guruhingizga <strong>Test ID</strong> jo'natadi. Test ID olgach, quyidagi maydonga kiritib testni boshlang!
              </span>
            </div>
            <button
              if-enabled="true"
              onClick={() => onOpenGroupChat(student.teacherId)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shrink-0 flex items-center gap-1 shadow"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chatda Test ID ni ko'rish
            </button>
          </div>
        )}
      </div>

      {/* 🚀 O'zlashtirish foizi ko'rsatkichi (Visual Progress Bar & Circular Gauge) */}
      <StudentMasteryProgress
        student={student}
        onOpenTestIdModal={() => onOpenTestIdModal(testIdInput)}
        onOpenFinalExamModal={onOpenFinalExamModal}
        onOpenAchievementsModal={() => setShowAchievementsModal(true)}
      />

      {/* Test ID kiritish paneli & Final Exam Callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Test ID bilan tezkor kirish */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Ustoz Bergan Test ID bilan Kirish</h3>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Ustozingiz sizga va guruh chatiga taqdim etgan bir martalik maxsus <strong>Test ID</strong> ni kiriting.
              (Masalan: <code className="text-cyan-400 font-mono">TEST-HTML-8942</code>). Test topshirilgach, avtomatik o'chadi.
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Test ID kiriting (masalan: TEST-HTML-1234)"
              value={testIdInput}
              onChange={(e) => setTestIdInput(e.target.value.toUpperCase())}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono uppercase text-cyan-300 placeholder-slate-600 outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={() => {
                if (!testIdInput.trim()) {
                  alert("Iltimos, avval Test ID ni kiriting!");
                  return;
                }
                onOpenTestIdModal(testIdInput.trim());
              }}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              Boshlash
            </button>
          </div>
        </div>

        {/* Final Boss Exam Tugmasi (JS tamomlangach) */}
        <div className="bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Final Katta Imtihon (HTML + CSS + JS)</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                100% Majburiy
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              <strong>Yagona shart:</strong> Kursning barcha 3 ta bosqichini (HTML, CSS va JavaScript darslarini) to'liq yakunlaganingizda qulufdan ochiladi. Undan <strong>100%</strong> olgach rasmiy sertifikat taqdim etiladi.
            </p>
          </div>

          <div className="mt-4 pt-2">
            <button
              onClick={onOpenFinalExamModal}
              disabled={!isAllStagesCompleted}
              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isAllStagesCompleted
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-95 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              {isAllStagesCompleted ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Katta Final Imtihonni Boshlash (100% maqsad)</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Hamma 3 ta bosqichni tamomlagach ochiladi ({student.completedLessons.length}/15 dars)</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* 📅 Haftalik Dars Jadvali (Lesson Names & Times Table) */}
      <WeeklySchedule
        currentStage={student.stage}
        teacher={teacher}
      />

      {/* Bosqichlar navigatsiyasi: HTML -> CSS -> JavaScript */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>3 Bosqichli O'quv Dasturi</span>
            </h2>
            <p className="text-xs text-slate-400">
              Har bir bosqich darslarini o'rganing, amaliy kod yozing va yakunida ustozingizdan test qabul qiling.
            </p>
          </div>

          {/* Stage switcher buttons */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            {(['html', 'css', 'javascript'] as CourseStage[]).map((stg) => {
              const locked = isStageLocked(stg);
              const isActive = selectedStage === stg;
              const isCurrentStudentStage = student.stage === stg;

              return (
                <button
                  key={stg}
                  onClick={() => !locked && setSelectedStage(stg)}
                  disabled={locked}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                      : locked
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {locked ? <Lock className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                  <span className="uppercase">{stg}</span>
                  {isCurrentStudentStage && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Darslar ro'yxati */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stageLessons.map((lesson, idx) => {
            const isCompleted = student.completedLessons.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-slate-900/90 border-emerald-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {lesson.duration}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      +{lesson.xpReward} XP
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-3 leading-snug">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3">
                    {lesson.summary}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  {isCompleted ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Bajarildi
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">Kutilmoqda</span>
                  )}

                  <button
                    onClick={() => handleStartLesson(lesson)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                      isCompleted
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isCompleted ? "Qayta ko'rish" : "Darsni Boshlash"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: INTERFAOL DARSLIK VA KOD MUHARRIRI */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  {activeLesson.stage} Bosqichi | Darslik
                </span>
                <h3 className="text-base font-bold text-white">{activeLesson.title}</h3>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
              {/* Summary */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white mb-1.5 text-sm">Nazariy tushuncha</h4>
                <p className="leading-relaxed text-slate-300">{activeLesson.summary}</p>
              </div>

              {/* Code Example */}
              <div>
                <h4 className="font-bold text-white mb-1.5 text-sm">Namunaviy kod</h4>
                <pre className="bg-slate-950 text-cyan-300 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto">
                  {activeLesson.codeExample}
                </pre>
              </div>

              {/* Task */}
              <div className="bg-indigo-950/20 border border-indigo-500/30 p-4 rounded-xl">
                <h4 className="font-bold text-indigo-300 mb-1 text-sm">Amaliy topshiriq</h4>
                <p className="text-slate-300">{activeLesson.practiceTask}</p>
                <div className="mt-3">
                  <textarea
                    rows={4}
                    defaultValue={activeLesson.starterCode}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-emerald-400 outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Muvaffaqiyatli yakunlash uchun +{activeLesson.xpReward} XP olasiz
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveLesson(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Yopish
                </button>
                <button
                  onClick={() => handleFinishLesson(activeLesson.id)}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Darsni Yakunlash (+{activeLesson.xpReward} XP)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🏆 Shaxsiy Yutuqlar Oynasi (Best Score, Completed Lessons, Badges) */}
      <StudentAchievementsModal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        student={student}
        testSubmissions={testSubmissions}
      />

    </div>
  );
};
