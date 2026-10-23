import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  BookOpen,
  Code2,
  Clock,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Users,
  Target,
  FileCheck2,
  Activity,
  Layers,
  ChevronRight,
  Download,
} from 'lucide-react';
import { StudentAccount } from '../data/learningCurriculum';

interface StudentAnalyticsProps {
  currentStudent: StudentAccount | null;
  allStudents: StudentAccount[];
  onOpenRegister: () => void;
  onNavigateToLearning: () => void;
  onNavigateToTests: () => void;
  onNavigateToGames: () => void;
}

// Student cohort mock stats for realistic visualization
interface StudentStats {
  id: string;
  name: string;
  email: string;
  avatar: string;
  htmlProgress: number; // 0 - 100
  cssProgress: number;
  jsProgress: number;
  overallProgress: number;
  quizzesCompleted: number; // out of 15
  quizzesTotal: number;
  quizAccuracy: number; // percentage
  studyHours: number;
  puzzlesSolved: number;
  certificateEarned: boolean;
  activityHistory: { day: string; studyMins: number; quizzes: number; codeRuns: number }[];
  radarSkills: { subject: string; score: number; fullMark: number }[];
}

const DEFAULT_COHORT_STATS: StudentStats[] = [
  {
    id: 'sardorbek',
    name: 'Sardorbek Rahimov',
    email: 'sardorbek@student.uz',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    htmlProgress: 100,
    cssProgress: 75,
    jsProgress: 35,
    overallProgress: 70,
    quizzesCompleted: 11,
    quizzesTotal: 15,
    quizAccuracy: 88,
    studyHours: 42,
    puzzlesSolved: 19,
    certificateEarned: false,
    activityHistory: [
      { day: 'Dush', studyMins: 45, quizzes: 2, codeRuns: 14 },
      { day: 'Sesh', studyMins: 60, quizzes: 3, codeRuns: 22 },
      { day: 'Chor', studyMins: 30, quizzes: 1, codeRuns: 10 },
      { day: 'Pay', studyMins: 90, quizzes: 4, codeRuns: 35 },
      { day: 'Jum', studyMins: 50, quizzes: 2, codeRuns: 18 },
      { day: 'Shan', studyMins: 110, quizzes: 5, codeRuns: 45 },
      { day: 'Yak', studyMins: 75, quizzes: 3, codeRuns: 28 },
    ],
    radarSkills: [
      { subject: 'HTML Semantika', score: 95, fullMark: 100 },
      { subject: 'CSS Flexbox/Grid', score: 80, fullMark: 100 },
      { subject: 'Responsive Dizayn', score: 75, fullMark: 100 },
      { subject: 'JS DOM Boshqaruvi', score: 45, fullMark: 100 },
      { subject: 'JS Hodisalar (Events)', score: 40, fullMark: 100 },
      { subject: 'Mantiq & Algoritm', score: 60, fullMark: 100 },
    ],
  },
  {
    id: 'madina',
    name: 'Madina Yo\'ldosheva',
    email: 'madina@student.uz',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    htmlProgress: 100,
    cssProgress: 100,
    jsProgress: 65,
    overallProgress: 88,
    quizzesCompleted: 13,
    quizzesTotal: 15,
    quizAccuracy: 94,
    studyHours: 58,
    puzzlesSolved: 23,
    certificateEarned: false,
    activityHistory: [
      { day: 'Dush', studyMins: 60, quizzes: 2, codeRuns: 20 },
      { day: 'Sesh', studyMins: 80, quizzes: 4, codeRuns: 30 },
      { day: 'Chor', studyMins: 70, quizzes: 3, codeRuns: 25 },
      { day: 'Pay', studyMins: 95, quizzes: 4, codeRuns: 40 },
      { day: 'Jum', studyMins: 85, quizzes: 3, codeRuns: 32 },
      { day: 'Shan', studyMins: 120, quizzes: 5, codeRuns: 50 },
      { day: 'Yak', studyMins: 60, quizzes: 2, codeRuns: 22 },
    ],
    radarSkills: [
      { subject: 'HTML Semantika', score: 98, fullMark: 100 },
      { subject: 'CSS Flexbox/Grid', score: 95, fullMark: 100 },
      { subject: 'Responsive Dizayn', score: 92, fullMark: 100 },
      { subject: 'JS DOM Boshqaruvi', score: 70, fullMark: 100 },
      { subject: 'JS Hodisalar (Events)', score: 68, fullMark: 100 },
      { subject: 'Mantiq & Algoritm', score: 75, fullMark: 100 },
    ],
  },
  {
    id: 'bobur',
    name: 'Bobur Mirzayev',
    email: 'bobur@student.uz',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    htmlProgress: 100,
    cssProgress: 100,
    jsProgress: 100,
    overallProgress: 100,
    quizzesCompleted: 15,
    quizzesTotal: 15,
    quizAccuracy: 98,
    studyHours: 72,
    puzzlesSolved: 25,
    certificateEarned: true,
    activityHistory: [
      { day: 'Dush', studyMins: 90, quizzes: 4, codeRuns: 35 },
      { day: 'Sesh', studyMins: 110, quizzes: 5, codeRuns: 45 },
      { day: 'Chor', studyMins: 80, quizzes: 3, codeRuns: 30 },
      { day: 'Pay', studyMins: 120, quizzes: 5, codeRuns: 55 },
      { day: 'Jum', studyMins: 90, quizzes: 4, codeRuns: 38 },
      { day: 'Shan', studyMins: 140, quizzes: 6, codeRuns: 60 },
      { day: 'Yak', studyMins: 85, quizzes: 3, codeRuns: 35 },
    ],
    radarSkills: [
      { subject: 'HTML Semantika', score: 100, fullMark: 100 },
      { subject: 'CSS Flexbox/Grid', score: 98, fullMark: 100 },
      { subject: 'Responsive Dizayn', score: 96, fullMark: 100 },
      { subject: 'JS DOM Boshqaruvi', score: 95, fullMark: 100 },
      { subject: 'JS Hodisalar (Events)', score: 92, fullMark: 100 },
      { subject: 'Mantiq & Algoritm', score: 94, fullMark: 100 },
    ],
  },
  {
    id: 'umirbek',
    name: 'Umirbek Xo\'jayev',
    email: 'umirbek@akademiya.uz',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    htmlProgress: 100,
    cssProgress: 95,
    jsProgress: 90,
    overallProgress: 95,
    quizzesCompleted: 14,
    quizzesTotal: 15,
    quizAccuracy: 96,
    studyHours: 68,
    puzzlesSolved: 24,
    certificateEarned: true,
    activityHistory: [
      { day: 'Dush', studyMins: 75, quizzes: 3, codeRuns: 28 },
      { day: 'Sesh', studyMins: 95, quizzes: 4, codeRuns: 38 },
      { day: 'Chor', studyMins: 85, quizzes: 3, codeRuns: 32 },
      { day: 'Pay', studyMins: 100, quizzes: 5, codeRuns: 42 },
      { day: 'Jum', studyMins: 80, quizzes: 3, codeRuns: 30 },
      { day: 'Shan', studyMins: 130, quizzes: 5, codeRuns: 52 },
      { day: 'Yak', studyMins: 90, quizzes: 4, codeRuns: 36 },
    ],
    radarSkills: [
      { subject: 'HTML Semantika', score: 100, fullMark: 100 },
      { subject: 'CSS Flexbox/Grid', score: 92, fullMark: 100 },
      { subject: 'Responsive Dizayn', score: 90, fullMark: 100 },
      { subject: 'JS DOM Boshqaruvi', score: 90, fullMark: 100 },
      { subject: 'JS Hodisalar (Events)', score: 88, fullMark: 100 },
      { subject: 'Mantiq & Algoritm', score: 92, fullMark: 100 },
    ],
  },
];

export function StudentAnalytics({
  currentStudent,
  allStudents: _allStudents,
  onOpenRegister,
  onNavigateToLearning,
  onNavigateToTests,
  onNavigateToGames,
}: StudentAnalyticsProps) {
  // If the logged in student exists, build dynamic stats for them
  const currentStudentStats: StudentStats = currentStudent
    ? {
        id: 'me',
        name: currentStudent.name,
        email: currentStudent.email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        htmlProgress: currentStudent.quizPassed.html ? 100 : currentStudent.completedStages.includes('html') ? 70 : 40,
        cssProgress: currentStudent.quizPassed.css ? 100 : currentStudent.completedStages.includes('css') ? 60 : 15,
        jsProgress: currentStudent.quizPassed.js ? 100 : currentStudent.completedStages.includes('js') ? 50 : 5,
        overallProgress: Math.round(
          ((currentStudent.quizPassed.html ? 100 : currentStudent.completedStages.includes('html') ? 70 : 40) +
            (currentStudent.quizPassed.css ? 100 : currentStudent.completedStages.includes('css') ? 60 : 15) +
            (currentStudent.quizPassed.js ? 100 : currentStudent.completedStages.includes('js') ? 50 : 5)) /
            3
        ),
        quizzesCompleted:
          (currentStudent.quizPassed.html ? 5 : 2) +
          (currentStudent.quizPassed.css ? 5 : 1) +
          (currentStudent.quizPassed.js ? 5 : 0),
        quizzesTotal: 15,
        quizAccuracy: currentStudent.quizPassed.js ? 95 : currentStudent.quizPassed.css ? 90 : 85,
        studyHours: currentStudent.quizPassed.js ? 64 : currentStudent.quizPassed.css ? 38 : 16,
        puzzlesSolved: currentStudent.quizPassed.js ? 22 : currentStudent.quizPassed.css ? 14 : 6,
        certificateEarned: currentStudent.quizPassed.html && currentStudent.quizPassed.css && currentStudent.quizPassed.js,
        activityHistory: [
          { day: 'Dush', studyMins: 35, quizzes: 1, codeRuns: 10 },
          { day: 'Sesh', studyMins: 55, quizzes: 2, codeRuns: 18 },
          { day: 'Chor', studyMins: 40, quizzes: 1, codeRuns: 14 },
          { day: 'Pay', studyMins: 75, quizzes: 3, codeRuns: 28 },
          { day: 'Jum', studyMins: 60, quizzes: 2, codeRuns: 20 },
          { day: 'Shan', studyMins: 90, quizzes: 4, codeRuns: 35 },
          { day: 'Yak', studyMins: 50, quizzes: 2, codeRuns: 16 },
        ],
        radarSkills: [
          { subject: 'HTML Semantika', score: currentStudent.quizPassed.html ? 95 : 65, fullMark: 100 },
          { subject: 'CSS Flexbox/Grid', score: currentStudent.quizPassed.css ? 90 : 50, fullMark: 100 },
          { subject: 'Responsive Dizayn', score: currentStudent.quizPassed.css ? 85 : 45, fullMark: 100 },
          { subject: 'JS DOM Boshqaruvi', score: currentStudent.quizPassed.js ? 90 : 35, fullMark: 100 },
          { subject: 'JS Hodisalar', score: currentStudent.quizPassed.js ? 88 : 30, fullMark: 100 },
          { subject: 'Mantiq & Algoritm', score: currentStudent.quizPassed.js ? 92 : 40, fullMark: 100 },
        ],
      }
    : DEFAULT_COHORT_STATS[0];

  const studentList = currentStudent
    ? [currentStudentStats, ...DEFAULT_COHORT_STATS.filter((s) => s.email !== currentStudent.email)]
    : DEFAULT_COHORT_STATS;

  const [selectedStudentId, setSelectedStudentId] = useState<string>(studentList[0].id);

  const activeStudent = studentList.find((s) => s.id === selectedStudentId) || studentList[0];

  // Language comparison data for BarChart
  const languageData = [
    {
      name: 'HTML Asoslari',
      short: 'HTML',
      student: activeStudent.htmlProgress,
      cohortAvg: 95,
      passRatio: activeStudent.htmlProgress === 100 ? 100 : Math.round((activeStudent.htmlProgress / 100) * 90),
      color: '#f97316',
    },
    {
      name: 'CSS Bezatish',
      short: 'CSS',
      student: activeStudent.cssProgress,
      cohortAvg: 82,
      passRatio: activeStudent.cssProgress === 100 ? 100 : Math.round((activeStudent.cssProgress / 100) * 85),
      color: '#0284c7',
    },
    {
      name: 'JavaScript Mantiq',
      short: 'JS',
      student: activeStudent.jsProgress,
      cohortAvg: 68,
      passRatio: activeStudent.jsProgress === 100 ? 100 : Math.round((activeStudent.jsProgress / 100) * 75),
      color: '#eab308',
    },
  ];

  // Quiz completion ratio data for PieChart
  const quizRatioData = [
    {
      name: 'Muvaffaqiyatli Topshirilgan',
      value: activeStudent.quizzesCompleted,
      color: '#10b981',
    },
    {
      name: 'Qolgan Testlar',
      value: Math.max(0, activeStudent.quizzesTotal - activeStudent.quizzesCompleted),
      color: '#e2e8f0',
    },
  ];

  // Subject breakdown for Quizzes
  const subjectQuizBreakdown = [
    {
      subject: 'HTML Testlari',
      completed: activeStudent.htmlProgress === 100 ? 5 : activeStudent.htmlProgress >= 70 ? 4 : 2,
      total: 5,
      percentage: activeStudent.htmlProgress === 100 ? 100 : activeStudent.htmlProgress >= 70 ? 80 : 40,
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
      barColor: 'bg-orange-500',
    },
    {
      subject: 'CSS Testlari',
      completed: activeStudent.cssProgress === 100 ? 5 : activeStudent.cssProgress >= 60 ? 3 : 1,
      total: 5,
      percentage: activeStudent.cssProgress === 100 ? 100 : activeStudent.cssProgress >= 60 ? 60 : 20,
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      barColor: 'bg-sky-500',
    },
    {
      subject: 'JavaScript Testlari',
      completed: activeStudent.jsProgress === 100 ? 5 : activeStudent.jsProgress >= 50 ? 3 : 1,
      total: 5,
      percentage: activeStudent.jsProgress === 100 ? 100 : activeStudent.jsProgress >= 50 ? 60 : 20,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      barColor: 'bg-amber-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-850 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-rose-300 border border-white/10">
              <Activity className="w-3.5 h-3.5" />
              <span>O'quvchilar Statistikasi & Analitika Markazi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Talabalar Tahlili & Progress Vizualizatsiyasi
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              HTML, CSS va JavaScript bo'yicha bosqichma-bosqich o'zlashtirish darajalari,
              test natijalari, haftalik o'rganish faolligi va sertifikatga tayyorgarlik ko'rsatkichlari.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!currentStudent && (
              <button
                onClick={onOpenRegister}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>O'z Profilingizni Ro'yxatdan O'tkazing</span>
              </button>
            )}
            <button
              onClick={onNavigateToLearning}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl backdrop-blur-md border border-white/15 transition-all inline-flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Darslarga o'tish</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Student Selector Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
          <Users className="w-4 h-4 text-indigo-600" />
          <span>O'quvchini tanlang:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {studentList.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStudentId(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                selectedStudentId === st.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <img
                src={st.avatar}
                alt={st.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>{st.name}</span>
              {st.certificateEarned && (
                <span className="text-[10px] bg-amber-400 text-amber-950 font-bold px-1.5 py-0.2 rounded-full">
                  ★ Sertifikat
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500">Umumiy O'zlashtirish</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {activeStudent.overallProgress}%
          </div>
          <div className="mt-2 text-[11px] text-stone-500 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">+12%</span> bu haftadagi o'sish
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-rose-500 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${activeStudent.overallProgress}%` }}
            />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500">Testlar Ko'rsatkichi</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {activeStudent.quizzesCompleted} / {activeStudent.quizzesTotal}
          </div>
          <div className="mt-2 text-[11px] text-stone-500 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">{activeStudent.quizAccuracy}%</span> aniqlik darajasi
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-700"
              style={{
                width: `${Math.round(
                  (activeStudent.quizzesCompleted / activeStudent.quizzesTotal) * 100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500">O'rganish Vaqti</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {activeStudent.studyHours} <span className="text-sm font-semibold text-stone-400">soat</span>
          </div>
          <div className="mt-2 text-[11px] text-stone-500 flex items-center gap-1">
            <span className="font-semibold text-indigo-600">{activeStudent.puzzlesSolved} ta</span> kod masalalari
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (activeStudent.studyHours / 80) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500">Sertifikat Holati</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900 flex items-center gap-1.5">
            {activeStudent.certificateEarned ? (
              <span className="text-emerald-600 flex items-center gap-1 text-base sm:text-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Mavjud (PDF)
              </span>
            ) : (
              <span className="text-amber-600 text-base sm:text-lg">
                {Math.round((activeStudent.quizzesCompleted / activeStudent.quizzesTotal) * 100)}% Tayyor
              </span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between">
            <span>HTML/CSS/JS Asoslari</span>
            <button
              onClick={onNavigateToTests}
              className="text-rose-600 font-bold hover:underline inline-flex items-center gap-0.5"
            >
              Topshirish <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-700"
              style={{
                width: `${Math.round(
                  (activeStudent.quizzesCompleted / activeStudent.quizzesTotal) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* CORE VISUALIZATION SECTION: Progress Bars Across HTML, CSS, JS */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-rose-500" />
              <span>HTML, CSS va JavaScript bo'yicha Progress Chiziqlari</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Har bir texnologiya bo'yicha talabaning individual o'zlashtirish darajasi va guruh o'rtachasi
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-stone-900 inline-block" />
              <span className="text-stone-600 font-medium">O'quvchi natijasi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-stone-300 inline-block" />
              <span className="text-stone-600 font-medium">Guruh o'rtachasi</span>
            </div>
          </div>
        </div>

        {/* 3 Detailed Progress Bars with Submodules */}
        <div className="space-y-6">
          {/* 1. HTML Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 font-extrabold text-[11px] border border-orange-200">
                  HTML5
                </span>
                <span className="font-bold text-stone-800">HTML Asoslari va Gipermatn Tuzilmasi</span>
              </div>
              <div className="flex items-center gap-3 font-semibold">
                <span className="text-stone-400 text-[11px]">Guruh: 95%</span>
                <span className="text-orange-600 font-extrabold text-sm">{activeStudent.htmlProgress}%</span>
              </div>
            </div>

            {/* Custom Multi-layered Progress Bar */}
            <div className="relative w-full h-4 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-1000 shadow-xs relative"
                style={{ width: `${activeStudent.htmlProgress}%` }}
              >
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-white">
                  {activeStudent.htmlProgress}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <span>Mavzular: Teglar, Formalar, Semantika, Jadvallar</span>
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {activeStudent.htmlProgress === 100 ? "To'liq yakunlangan" : "Davom etmoqda"}
              </span>
            </div>
          </div>

          {/* 2. CSS Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 font-extrabold text-[11px] border border-sky-200">
                  CSS3
                </span>
                <span className="font-bold text-stone-800">CSS Dizayn, Flexbox, Grid va Animatsiyalar</span>
              </div>
              <div className="flex items-center gap-3 font-semibold">
                <span className="text-stone-400 text-[11px]">Guruh: 82%</span>
                <span className="text-sky-600 font-extrabold text-sm">{activeStudent.cssProgress}%</span>
              </div>
            </div>

            {/* Custom Multi-layered Progress Bar */}
            <div className="relative w-full h-4 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-1000 shadow-xs relative"
                style={{ width: `${activeStudent.cssProgress}%` }}
              >
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-white">
                  {activeStudent.cssProgress}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <span>Mavzular: Selektorlar, Box Model, Flexbox, CSS Grid, Responsive</span>
              <span className="text-sky-600 font-medium">
                {activeStudent.cssProgress === 100 ? "To'liq yakunlangan" : "Amaliyot jarayonida"}
              </span>
            </div>
          </div>

          {/* 3. JavaScript Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-extrabold text-[11px] border border-amber-200">
                  JS ES6+
                </span>
                <span className="font-bold text-stone-800">JavaScript Interaktivlik, DOM va Mantiq</span>
              </div>
              <div className="flex items-center gap-3 font-semibold">
                <span className="text-stone-400 text-[11px]">Guruh: 68%</span>
                <span className="text-amber-600 font-extrabold text-sm">{activeStudent.jsProgress}%</span>
              </div>
            </div>

            {/* Custom Multi-layered Progress Bar */}
            <div className="relative w-full h-4 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-1000 shadow-xs relative"
                style={{ width: `${activeStudent.jsProgress}%` }}
              >
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-stone-900">
                  {activeStudent.jsProgress}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <span>Mavzular: O'zgaruvchilar, Funksiyalar, Hodisalar, DOM manipulyatsiyasi</span>
              <span className="text-amber-600 font-medium">
                {activeStudent.jsProgress === 100 ? "Mukammal egallangan" : "Darslar & Testlar o'tilmoqda"}
              </span>
            </div>
          </div>
        </div>

        {/* Recharts BarChart: Progress Comparison with Cohort */}
        <div className="pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Taqqoslama Grafigi: Talaba vs Guruh O'rtachasi
            </h3>
            <span className="text-[11px] text-stone-400">Recharts D3 Bar Chart</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={languageData}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="short" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis unit="%" tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, '']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar
                  name={`${activeStudent.name}`}
                  dataKey="student"
                  fill="#0f172a"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  name="Guruh O'rtachasi"
                  dataKey="cohortAvg"
                  fill="#cbd5e1"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: Quiz Completion Ratios (Donut) & Radar Competency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz Completion Ratio Chart (Recharts PieChart) */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                <span>Test Topshirish Nisbati (Quiz Completion Ratio)</span>
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                {Math.round((activeStudent.quizzesCompleted / activeStudent.quizzesTotal) * 100)}% Topshirildi
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Barcha 15 ta standartlashtirilgan test sinovlarining o'zlashtirilish darajasi
            </p>

            {/* Donut Chart */}
            <div className="h-56 w-full my-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={quizRatioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {quizRatioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val} ta test`, '']}
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown by subject */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
            {subjectQuizBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.barColor}`} />
                  <span className="font-semibold text-stone-700">{item.subject}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${item.barColor}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="font-bold text-stone-900 w-10 text-right">
                    {item.completed}/{item.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Radar Chart: Skill Competencies */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-600" />
                <span>Texnik Ko'nikmalar Radari</span>
              </h3>
              <span className="text-xs text-indigo-700 bg-indigo-50 font-bold px-2.5 py-0.5 rounded-full border border-indigo-100">
                Amaliy Ko'nikma
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Web dasturlashning asosiy komponentlari bo'yicha to'plangan bilimlar balansi
            </p>

            <div className="h-60 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={activeStudent.radarSkills}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar
                    name="Ko'nikma balli"
                    dataKey="score"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.4}
                  />
                  <Tooltip
                    formatter={(val: any) => [`${val} ball`, '']}
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 flex items-center justify-between text-xs">
            <span className="text-stone-600">
              Eng kuchli tomoni: <strong className="text-stone-900">HTML Semantika & Struktura</strong>
            </span>
            <button
              onClick={onNavigateToGames}
              className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1"
            >
              Mashq qilish <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Activity Area Chart */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-rose-500" />
              <span>Haftalik O'rganish Faolligi & Kod Yechish Vaqti</span>
            </h3>
            <p className="text-xs text-stone-500">
              Kunlik o'rganish daqiqalari va yechilgan kod mashqlari dinamikasi
            </p>
          </div>
          <div className="text-xs text-stone-500 font-medium">
            Jami: <strong className="text-stone-900">{activeStudent.studyHours} soat</strong> umumiy vaqt
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activeStudent.activityHistory}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorStudy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis unit=" d" tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                formatter={(val: any, name: any) => [
                  name === 'studyMins' ? `${val} daqiqa` : `${val} marta`,
                  name === 'studyMins' ? "O'rganish vaqti" : 'Kod sinovi',
                ]}
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px',
                }}
              />
              <Legend
                formatter={(val) => (val === 'studyMins' ? "O'rganish Vaqti (daqiqa)" : 'Kod Ishga Tushirish')}
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              />
              <Area
                type="monotone"
                dataKey="studyMins"
                stroke="#f43f5e"
                fillOpacity={1}
                fill="url(#colorStudy)"
              />
              <Area
                type="monotone"
                dataKey="codeRuns"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorRuns)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Footer Callout */}
      <div className="bg-gradient-to-r from-stone-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-amber-300">
            <GraduationCap className="w-4 h-4" />
            <span>Rasmiy Sertifikatga 1 Qadam</span>
          </div>
          <h3 className="text-xl font-bold">
            Barcha testlarni 100% ga topshirib, PDF Sertifikatni yuklab oling!
          </h3>
          <p className="text-xs text-stone-300 max-w-xl">
            HTML, CSS va JS bo'yicha barcha imtihonlarni muvaffaqiyatli topshirganingizdan so'ng,
            shaxsiy QR-kodli va ID raqamli rasmiy sertifikatingiz avtomatik generatsiya bo'ladi.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onNavigateToTests}
            className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Testlarni Topshirish</span>
          </button>
          <button
            onClick={onNavigateToLearning}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all inline-flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Darslarni O'qish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
