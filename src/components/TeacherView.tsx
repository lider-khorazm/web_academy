import React, { useState } from 'react';
import {
  Users,
  Bell,
  Sparkles,
  MessageSquare,
  UserX,
  FileText,
  KeyRound,
  CheckCircle2,
  TrendingUp,
  HelpCircle,
  Eye,
  AlertTriangle,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { Teacher, Student, TeacherNotification, TestSubmissionResult, CourseStage } from '../types';
import { updateTeacherGroupName } from '../services/storage';
import { AvatarBadge } from './AvatarBadge';

interface TeacherViewProps {
  teacher: Teacher;
  students: Student[];
  notifications: TeacherNotification[];
  testSubmissions: TestSubmissionResult[];
  onOpenCreateTestModal: (student: Student, stage: CourseStage) => void;
  onOpenMessageModal: (student: Student) => void;
  onOpenExpelModal: (student: Student) => void;
  onOpenGroupChat: (teacherId: string) => void;
  onMarkNotificationRead: (id: string) => void;
  onUpdateGroupName?: (teacherId: string, groupName: string) => void;
}

export const TeacherView: React.FC<TeacherViewProps> = ({
  teacher,
  students,
  notifications,
  testSubmissions,
  onOpenCreateTestModal,
  onOpenMessageModal,
  onOpenExpelModal,
  onOpenGroupChat,
  onMarkNotificationRead,
  onUpdateGroupName,
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'notifications' | 'submissions'>('students');
  const [selectedSubmissionForReview, setSelectedSubmissionForReview] = useState<TestSubmissionResult | null>(null);
  const [isEditingGroupName, setIsEditingGroupName] = useState(false);
  const [groupNameInput, setGroupNameInput] = useState(teacher.groupName || `${teacher.name} Guruhi`);

  const handleSaveGroupName = () => {
    if (!groupNameInput.trim()) return;
    const trimmed = groupNameInput.trim();
    updateTeacherGroupName(teacher.id, trimmed);
    if (onUpdateGroupName) {
      onUpdateGroupName(teacher.id, trimmed);
    }
    setIsEditingGroupName(false);
  };

  // Bu ustozga biriktirilgan o'quvchilar
  const myStudents = students.filter((s) => s.teacherId === teacher.id);
  // O'quvchilarni XP bo'yicha saralash
  const sortedStudents = [...myStudents].sort((a, b) => b.xp - a.xp);

  // Bu ustoz o'quvchilarining topshirgan testlari
  const mySubmissions = testSubmissions.filter((sub) => sub.teacherId === teacher.id);

  // O'qilmagan xabarlar soni
  const unreadNotifs = notifications.filter((n) => !n.read);

  // Test berish kerak bo'lgan o'quvchilar
  const studentsNeedingTest = myStudents.filter((s) => s.stageCompletedPendingTest);

  return (
    <div className="space-y-6">
      
      {/* Teacher Profile Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <AvatarBadge
              name={`${teacher.name} ${teacher.surname}`}
              role="teacher"
              size="xl"
              className="w-18 h-18 sm:w-20 sm:h-20 text-xl ring-4 ring-indigo-500/40 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black text-white">
                  {teacher.name} {teacher.surname}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Rasmiy Ustoz
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ⭐️ {teacher.rating} Reyting
                </span>
              </div>
              <p className="text-sm text-cyan-300 font-medium mt-1">{teacher.specialty}</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">{teacher.bio}</p>
            </div>
          </div>

          {/* Teacher Quick Stats */}
          <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-inner">
            <div className="text-center px-3 border-r border-slate-800">
              <span className="text-2xl font-black text-white">{myStudents.length}</span>
              <span className="text-xs text-indigo-400 font-semibold block">/ 15 O'quvchi</span>
              <span className="text-[10px] text-slate-500">Maksimal limit</span>
            </div>
            <div className="text-center px-3 border-r border-slate-800">
              <span className="text-2xl font-black text-amber-400">{studentsNeedingTest.length}</span>
              <span className="text-xs text-amber-300 font-semibold block">Test kutmoqda</span>
              <span className="text-[10px] text-slate-500">Darslarni tugatgan</span>
            </div>
            <div className="text-center px-3">
              <button
                onClick={() => onOpenGroupChat(teacher.id)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                Guruh Chati
              </button>
              <span className="text-[10px] text-slate-400 block mt-1">15 talaba + Admin</span>
            </div>
          </div>
        </div>

        {/* Guruh Nomi Sozlamasi (Ustoz guruhga nom beradi) */}
        <div className="mt-4 pt-4 border-t border-indigo-500/20 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-indigo-500/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 border border-emerald-500/30">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Guruh Nomi (15 Talaba guruhi):</span>
              {isEditingGroupName ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={groupNameInput}
                    onChange={(e) => setGroupNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveGroupName();
                      }
                    }}
                    placeholder="Masalan: Frontend Yulduzlari"
                    className="px-3 py-1 text-xs bg-slate-900 border border-emerald-500 rounded-lg text-white font-bold outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveGroupName}
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm"
                    title="Saqlash"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setGroupNameInput(teacher.groupName || `${teacher.name} Guruhi`);
                      setIsEditingGroupName(false);
                    }}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                    title="Bekor qilish"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <span className="text-sm font-black text-emerald-300 flex items-center gap-2">
                  {teacher.groupName || `${teacher.name} Guruhi`}
                </span>
              )}
            </div>
          </div>

          {!isEditingGroupName && (
            <button
              onClick={() => setIsEditingGroupName(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Guruh nomini o'zgartirish</span>
            </button>
          )}
        </div>
      </div>

      {/* Alert banner if any student completed stage and needs test */}
      {studentsNeedingTest.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-500/50 rounded-xl p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-200">
                Diqqat! {studentsNeedingTest.length} nafar o'quvchingiz bosqichni yakunladi va test kutmoqda!
              </h4>
              <p className="text-xs text-slate-300">
                Ular uchun darhol Test ID generatsiya qiling va guruh chatida e'lon qiling.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {studentsNeedingTest.map((st) => (
              <button
                key={st.id}
                onClick={() => onOpenCreateTestModal(st, st.stageCompletedPendingTest || st.stage)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all flex items-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                {st.name}ga test berish
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'students'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Menga Tayinlangan 15 O'quvchi ({myStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all relative ${
            activeTab === 'notifications'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Bildirishnomalar & Xabarlar</span>
          {unreadNotifs.length > 0 && (
            <span className="w-5 h-5 bg-rose-500 text-white text-[11px] font-black rounded-full flex items-center justify-center">
              {unreadNotifs.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'submissions'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Topshirilgan Testlar Natijasi ({mySubmissions.length})</span>
        </button>
      </div>

      {/* TAB 1: 15 O'QUVCHI RO'YXATI */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Guruh O'quvchilari Ro'yxati</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-400 border border-slate-700">
                  {myStudents.length} / 15 nafar
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                O'quvchilar ro'yxatdan o'tganda sizga random tarzda biriktiriladi. Reyting, XP va bosqichlar monitoringi.
              </p>
            </div>
            <button
              onClick={() => onOpenGroupChat(teacher.id)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Guruhga Xabar Yozish
            </button>
          </div>

          {myStudents.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white">Hozircha biriktirilgan talabalar yo'q</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Yangi talabalar ro'yxatdan o'tganda tizim ularni random tarzda sizning guruhingizga qo'shadi (maksimal 15 tagacha).
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedStudents.map((student, index) => {
                const stageColor =
                  student.stage === 'html'
                    ? 'from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30'
                    : student.stage === 'css'
                    ? 'from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30'
                    : student.stage === 'javascript'
                    ? 'from-amber-500/20 to-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    : 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30';

                const needsTest = Boolean(student.stageCompletedPendingTest);

                return (
                  <div
                    key={student.id}
                    className={`rounded-2xl bg-slate-900 border transition-all p-5 shadow-lg flex flex-col justify-between ${
                      needsTest
                        ? 'border-amber-500/60 ring-2 ring-amber-500/20'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Top row: Avatar, Info, Rank */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <AvatarBadge
                              name={`${student.name} ${student.surname}`}
                              role="student"
                              size="md"
                              className="w-12 h-12 text-sm ring-2 ring-slate-700"
                            />
                            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-950 border border-slate-700 text-[10px] font-black text-slate-300 flex items-center justify-center">
                              #{index + 1}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white leading-tight">
                              {student.name} {student.surname}
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">{student.phone}</p>
                            <span className="text-[10px] text-slate-500 block">
                              Faol: {student.lastActive}
                            </span>
                          </div>
                        </div>

                        {/* Stage Badge */}
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider border bg-gradient-to-r ${stageColor}`}
                        >
                          {student.stage}
                        </span>
                      </div>

                      {/* XP & Progress Info */}
                      <div className="mt-4 grid grid-cols-3 gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 text-center text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-medium">XP Balli</span>
                          <span className="text-sm font-black text-emerald-400 flex items-center justify-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {student.xp}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-medium">Reyting</span>
                          <span className="text-sm font-black text-amber-400">
                            #{student.rank}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-medium">Darslar</span>
                          <span className="text-sm font-black text-cyan-400">
                            {student.completedLessons.length} ta
                          </span>
                        </div>
                      </div>

                      {/* O'zlashtirish foizi progress bari */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1">
                          <span className="text-slate-400">O'zlashtirish foizi:</span>
                          <span className="text-cyan-400 font-bold font-mono">
                            {student.stage === 'graduated' ? 100 : Math.min(100, Math.round((student.completedLessons.length / 15) * 100))}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.max(
                                3,
                                student.stage === 'graduated'
                                  ? 100
                                  : Math.min(100, Math.round((student.completedLessons.length / 15) * 100))
                              )}%`
                            }}
                          />
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="mt-3">
                        {needsTest ? (
                          <div className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span className="font-semibold">
                              {student.stageCompletedPendingTest?.toUpperCase()} bosqichini tugatdi! Test berish shart!
                            </span>
                          </div>
                        ) : (
                          <div className="px-3 py-1.5 rounded-lg bg-slate-800/60 text-slate-400 text-xs flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                            <span>Darslarni o'rganmoqda ({student.stage.toUpperCase()})</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons requested by user:
                        1) Test berish
                        2) O'quvchiga xabar
                        3) O'quvchini chetlatishni adminga aytish
                    */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => onOpenCreateTestModal(student, student.stageCompletedPendingTest || student.stage)}
                        className={`px-2 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                          needsTest
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'bg-indigo-600/80 hover:bg-indigo-600 text-white'
                        }`}
                        title="Talabaga test berish va ID generatsiya qilish"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Test berish</span>
                      </button>

                      <button
                        onClick={() => onOpenMessageModal(student)}
                        className="px-2 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1 transition-all"
                        title="O'quvchiga shaxsiy xabar yuborish"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Xabar</span>
                      </button>

                      <button
                        onClick={() => onOpenExpelModal(student)}
                        className="px-2 py-2 rounded-lg text-xs font-semibold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 flex items-center justify-center gap-1 transition-all"
                        title="O'quvchini chetlatishni adminga aytish"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>Chetlatish</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BILDIRISHNOMALAR VA XABARLAR */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Ustoz Bildirishnomalari va Xabarlari</span>
                {unreadNotifs.length > 0 && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {unreadNotifs.length} ta yangi
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Talabalar bosqichni tamomlaganda "sizning palonkas studentingizga test berish kerek" degan xabarlar shu yerda paydo bo'ladi.
              </p>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
              <Bell className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold">Hozircha hech qanday bildirishnoma yo'q</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => {
                const targetStudent = students.find((s) => s.id === notif.studentId);
                return (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      !notif.read
                        ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md shadow-indigo-950/50'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 mt-0.5">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                            {notif.stage} Bosqichi yakunlandi
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(notif.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-white mt-1">{notif.message}</p>
                        <p className="text-xs text-slate-400">
                          Talaba: <span className="text-cyan-300 font-semibold">{notif.studentName}</span>
                        </p>
                      </div>
                    </div>

                    {/* Action buttons on notification */}
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                      {targetStudent && (
                        <>
                          <button
                            onClick={() => {
                              onMarkNotificationRead(notif.id);
                              onOpenCreateTestModal(targetStudent, notif.stage);
                            }}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Test berish</span>
                          </button>

                          <button
                            onClick={() => onOpenMessageModal(targetStudent)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Xabar</span>
                          </button>

                          <button
                            onClick={() => onOpenExpelModal(targetStudent)}
                            className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900 text-rose-300 border border-rose-800/40 rounded-lg text-xs font-semibold"
                            title="O'quvchini chetlatishni adminga aytish"
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TOPSHIRILGAN TESTLAR NATIJASI (FAQAT USTOZ VA ADMIN KO'RADI) */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>O'quvchilar Topshirgan Test Natijalari</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Faqat Ustoz va Admin ko'radi
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Test topshirilgach uning bir martalik ID si bazadan o'chirilgan, natijalar esa ko'rib chiqish uchun saqlangan.
              Keyingi bosqichga o'tishni <strong>Admin tasdiqlaydi</strong>.
            </p>
          </div>

          {mySubmissions.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
              <HelpCircle className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold">Hozircha hech kim test topshirmagan</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Talaba</th>
                    <th className="px-4 py-3">Test ID & Bosqich</th>
                    <th className="px-4 py-3">Natija (Foiz)</th>
                    <th className="px-4 py-3">Savollar</th>
                    <th className="px-4 py-3">Admin Tasdig'i</th>
                    <th className="px-4 py-3">Vaqti</th>
                    <th className="px-4 py-3 text-right">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {mySubmissions.map((sub) => {
                    const pass = sub.percentage >= 70;
                    return (
                      <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 font-semibold text-white">
                          {sub.studentName}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-cyan-300 border border-slate-700">
                            {sub.testId}
                          </span>
                          <span className="ml-2 uppercase text-[10px] text-slate-400 font-bold">
                            ({sub.stage})
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                              pass
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {sub.percentage}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {sub.answers.filter((a) => a.isCorrect).length} / {sub.totalQuestions} to'g'ri
                        </td>
                        <td className="px-4 py-3">
                          {sub.adminApprovedStageUpgrade ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-[10px] flex items-center gap-1 w-max">
                              <CheckCircle2 className="w-3 h-3" /> Tasdiqlangan
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30 text-[10px] w-max block">
                              Admin kutilmoqda
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {new Date(sub.submittedAt).toLocaleDateString('uz-UZ')}{' '}
                          {new Date(sub.submittedAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedSubmissionForReview(sub)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Javoblarni ko'rish</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL: Savollar va javoblar tahlilini ko'rish */}
      {selectedSubmissionForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{selectedSubmissionForReview.studentName} — Test Tahlili</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono">
                    {selectedSubmissionForReview.testId}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  To'plangan natija: {selectedSubmissionForReview.percentage}% ({selectedSubmissionForReview.score} ball)
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmissionForReview(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {selectedSubmissionForReview.answers.map((ans, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border ${
                    ans.isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-300">
                      {idx + 1}-savol: {ans.questionText}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ans.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {ans.isCorrect ? "To'g'ri" : "Noto'g'ri"}
                    </span>
                  </div>
                  <div className="mt-2 text-xs space-y-1">
                    <p className="text-slate-400">
                      Talaba tanlagan variant indexi: <strong className="text-white">{ans.userAnswerIndex !== -1 ? ans.userAnswerIndex + 1 : "Javob berilmagan"}</strong>
                    </p>
                    <p className="text-slate-400">
                      To'g'ri variant indexi: <strong className="text-emerald-400">{ans.correctAnswerIndex + 1}</strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => setSelectedSubmissionForReview(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
