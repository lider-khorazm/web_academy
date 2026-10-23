import React, { useState } from 'react';
import {
  ShieldAlert,
  UserPlus,
  Users,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Award,
  Search,
  Trash2,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
  Lock,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { Teacher, Student, TestSubmissionResult, ExpelRequest } from '../types';
import { OWNER_PROFILE, OWNER_CREDENTIALS } from '../data/mockData';
import { getGroupMessages } from '../services/storage';
import { AvatarBadge } from './AvatarBadge';

interface AdminViewProps {
  teachers: Teacher[];
  students: Student[];
  testSubmissions: TestSubmissionResult[];
  expelRequests: ExpelRequest[];
  onAddTeacher: (teacherData: Omit<Teacher, 'id' | 'studentIds' | 'rating' | 'activeSince'>) => void;
  onDeleteTeacher: (teacherId: string) => void;
  onApproveUpgrade: (submissionId: string) => void;
  onResolveExpel: (requestId: string, approve: boolean) => void;
  onOpenGroupChat: (teacherId: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  teachers,
  students,
  testSubmissions,
  expelRequests,
  onAddTeacher,
  onDeleteTeacher,
  onApproveUpgrade,
  onResolveExpel,
  onOpenGroupChat,
}) => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'group_chats' | 'upgrades' | 'expel' | 'all_students'>('teachers');
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<TestSubmissionResult | null>(null);
  const [showPasswordsMap, setShowPasswordsMap] = useState<Record<string, boolean>>({});
  const [showNewTeacherPass, setShowNewTeacherPass] = useState(false);

  // Yangi ustoz formasi (login va parol bilan!)
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    surname: '',
    username: '',
    password: '',
    specialty: 'Frontend & Web Development Mentor',
    experienceYears: 4,
    phone: '+998 ',
    email: '',
    bio: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  });

  const handleAddTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.name || !teacherForm.surname || !teacherForm.username || !teacherForm.password) {
      alert("Iltimos, ism, familiya, login va parolni to'ldiring!");
      return;
    }
    onAddTeacher(teacherForm);
    setShowAddTeacherModal(false);
    setTeacherForm({
      name: '',
      surname: '',
      username: '',
      password: '',
      specialty: 'Frontend & Web Development Mentor',
      experienceYears: 4,
      phone: '+998 ',
      email: '',
      bio: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    });
  };

  const pendingUpgrades = testSubmissions.filter((sub) => !sub.adminApprovedStageUpgrade);
  const pendingExpels = expelRequests.filter((req) => req.status === 'pending');

  return (
    <div className="space-y-6">
      
      {/* Admin Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/30 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">
                  {OWNER_PROFILE.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  👑 OWNER PANEL
                </span>
                <span className="font-mono text-xs text-slate-400">
                  (@{OWNER_CREDENTIALS.username})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Ustozlarga login-parol berib tizimga qo'shish, o'quvchilarni keyingi bosqichga tasdiqlash, chetlatish arizalarini ko'rib chiqish.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddTeacherModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Yangi Ustoz Qo'shish</span>
          </button>
        </div>

        {/* Global stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Jami Ustozlar</span>
            <span className="text-xl font-black text-white">{teachers.length} nafar</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Jami O'quvchilar</span>
            <span className="text-xl font-black text-cyan-400">{students.length} nafar</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Bosqich Tasdiqlari</span>
            <span className="text-xl font-black text-amber-400">{pendingUpgrades.length} ta kutilmoqda</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Chetlatish So'rovlari</span>
            <span className="text-xl font-black text-rose-400">{pendingExpels.length} ta kutilmoqda</span>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('teachers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'teachers'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Ustozlar & Login-Parollar ({teachers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('group_chats')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'group_chats'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Guruh Chatlari ({teachers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('upgrades')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 relative ${
            activeTab === 'upgrades'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Bosqich O'tish Tasdiqlari</span>
          {pendingUpgrades.length > 0 && (
            <span className="w-5 h-5 bg-amber-500 text-slate-950 text-[11px] font-black rounded-full flex items-center justify-center">
              {pendingUpgrades.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('expel')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 relative ${
            activeTab === 'expel'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Chetlatish So'rovlari</span>
          {pendingExpels.length > 0 && (
            <span className="w-5 h-5 bg-rose-500 text-white text-[11px] font-black rounded-full flex items-center justify-center">
              {pendingExpels.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('all_students')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'all_students'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Barcha O'quvchilar ({students.length})</span>
        </button>
      </div>

      {/* TAB 1: USTOZLAR BOSHQARUVI */}
      {activeTab === 'teachers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Tizimdagi Rasmiy Ustozlar va Kirish Ma'lumotlari
              </h3>
              <p className="text-xs text-slate-400">
                Foydalanuvchi qoidasi: <em>"ustoz logini va parolini owner yani admin yaratadi"</em>.
              </p>
            </div>
            <button
              onClick={() => setShowAddTeacherModal(true)}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Yangi Ustoz Qo'shish
            </button>
          </div>

          {teachers.length === 0 ? (
            <div className="bg-slate-900 border border-dashed border-slate-700 rounded-3xl p-10 sm:p-14 text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/20 shadow-md">
                <UserPlus className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white">Hozircha tizimda ustozlar mavjud emas</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Siz (Boshqaruvchi) istalgancha yangi ustozlarni qo'shishingiz, ularga login va maxsus parol tayinlashingiz mumkin.
                </p>
              </div>
              <button
                onClick={() => setShowAddTeacherModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-600/30 inline-flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Birinchi Ustozni Qo'shish</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map((teacher) => {
              const teacherStudents = students.filter((s) => s.teacherId === teacher.id);
              return (
                <div
                  key={teacher.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <AvatarBadge
                          name={`${teacher.name} ${teacher.surname}`}
                          role="teacher"
                          size="lg"
                          className="w-14 h-14 ring-2 ring-indigo-500/40"
                        />
                        <div>
                          <h4 className="text-base font-bold text-white">
                            {teacher.name} {teacher.surname}
                          </h4>
                          <p className="text-xs text-cyan-400 font-medium">{teacher.specialty}</p>
                          <span className="text-[11px] text-slate-400 block mt-0.5">{teacher.phone}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Rostdan ham ${teacher.name} ${teacher.surname}ni tizimdan o'chirmoqchimisiz?`)) {
                            onDeleteTeacher(teacher.id);
                          }
                        }}
                        className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-colors"
                        title="Ustozni o'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* OWNER CREATED CREDENTIALS CARD */}
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1 font-semibold">
                          <KeyRound className="w-3.5 h-3.5 text-cyan-400" /> Ustoz Logini:
                        </span>
                        <code className="text-cyan-300 font-bold font-mono bg-slate-900 px-2 py-0.5 rounded">
                          {teacher.username}
                        </code>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1 font-semibold">
                          <Lock className="w-3.5 h-3.5 text-amber-400" /> Ustoz Paroli:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <code className="text-amber-300 font-bold font-mono bg-slate-900 px-2 py-0.5 rounded">
                            {showPasswordsMap[teacher.id]
                              ? (teacher.password || '••••••••')
                              : '••••••••'}
                          </code>
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswordsMap((prev) => ({
                                ...prev,
                                [teacher.id]: !prev[teacher.id],
                              }))
                            }
                            className="p-1 text-slate-400 hover:text-white rounded"
                            title={showPasswordsMap[teacher.id] ? "Yashirish" : "Ko'rsatish"}
                          >
                            {showPasswordsMap[teacher.id] ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-3 line-clamp-2">{teacher.bio}</p>

                    {/* Guruh Nomi Ko'rinishi */}
                    <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-400" /> Guruh Nomi:
                      </span>
                      <span className="text-emerald-300 font-bold font-mono">
                        {teacher.groupName || `${teacher.name} Guruhi`}
                      </span>
                    </div>

                    <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Talabalar</span>
                        <span className="text-sm font-black text-indigo-400">
                          {teacherStudents.length} / 15 nafar
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Tajriba</span>
                        <span className="text-sm font-black text-white">{teacher.experienceYears} yil</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Reyting</span>
                        <span className="text-sm font-black text-amber-400">⭐️ {teacher.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Faol: {teacher.activeSince}</span>
                    <button
                      onClick={() => onOpenGroupChat(teacher.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Guruh Chatiga Kirish</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    )}

      {/* TAB: BARCHA GURUH CHATLARI (Admin markazi) */}
      {activeTab === 'group_chats' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('teachers')}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 flex items-center gap-2 cursor-pointer text-xs font-bold active:scale-95 group shadow-sm shrink-0"
                title="Asosiy panelga qaytish"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
                <span>Asosiy Panelga Qaytish</span>
              </button>

              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <span>Barcha Guruh Chatlari va Muloqot Markazi</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  O'qituvchilar o'z 15 talabalik guruhlariga maxsus nom bergan. Boshqaruvchi sifatida har bir guruh chatini kuzatishingiz va xabar yozishingiz mumkin.
                </p>
              </div>
            </div>
          </div>

          {teachers.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
              <MessageSquare className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold">Hozircha tizimda guruhlar mavjud emas</p>
              <p className="text-xs text-slate-500 mt-1">Ustoz qo'shilgach, uning 15 talabalik guruhi shu yerda paydo bo'ladi.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map((teacher) => {
                const teacherStudents = students.filter((s) => s.teacherId === teacher.id);
                const msgs = getGroupMessages(teacher.id);
                const lastMsg = msgs[msgs.length - 1];
                const groupDisplayName = teacher.groupName || `${teacher.name} ${teacher.surname} Guruhi`;

                return (
                  <div
                    key={teacher.id}
                    className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <AvatarBadge
                            name={`${teacher.name} ${teacher.surname}`}
                            role="teacher"
                            size="md"
                            className="w-12 h-12 ring-2 ring-emerald-500/40"
                          />
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
                              Guruh Nomi:
                            </span>
                            <h4 className="text-base font-black text-white">
                              {groupDisplayName}
                            </h4>
                            <p className="text-xs text-slate-400">
                              Ustoz: <strong className="text-indigo-300">{teacher.name} {teacher.surname}</strong>
                            </p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono shrink-0">
                          {teacherStudents.length}/15
                        </span>
                      </div>

                      {/* Last message preview */}
                      <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
                        <span className="text-[10px] text-slate-500 font-semibold block mb-1">
                          So'nggi xabar ({msgs.length} ta xabar):
                        </span>
                        {lastMsg ? (
                          <div className="truncate text-slate-300">
                            <span className="text-cyan-400 font-semibold">{lastMsg.senderName}: </span>
                            <span>{lastMsg.text}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">Chatda hali xabarlar yo'q</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">{teacherStudents.length} talaba + Ustoz</span>
                      <button
                        onClick={() => onOpenGroupChat(teacher.id)}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chatga Kirish</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BOSQICH O'TISH TASDIQLARI */}
      {activeTab === 'upgrades' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>O'quvchini Keyingi Bosqichga O'tkazish Tasdiqlari</span>
            </h3>
            <p className="text-xs text-slate-400">
              O'quvchi ustoz bergan testni topshirgach, uning natijasini ko'rib chiqib,
              keyingi bosqichga o'tishini <strong>faqat Admin (Owner) tasdiqlaydi</strong>.
            </p>
          </div>

          {testSubmissions.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
              <FileText className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold">Hozircha topshirilgan testlar yo'q</p>
            </div>
          ) : (
            <div className="space-y-3">
              {testSubmissions.map((sub) => {
                const pass = sub.percentage >= 70;
                let nextStageName = 'CSS';
                if (sub.stage === 'css') nextStageName = 'JavaScript';
                if (sub.stage === 'javascript') nextStageName = 'Bitiruvchi (Graduate)';

                return (
                  <div
                    key={sub.id}
                    className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                      !sub.adminApprovedStageUpgrade
                        ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-950/20'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-white">{sub.studentName}</h4>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs border border-slate-700">
                          {sub.testId}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase">
                          {sub.stage} bosqichi testi
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            pass ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          To'plagan: {sub.percentage}%
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-1">
                        Ustoz ID: <span className="text-slate-300">{sub.teacherId}</span> | 
                        Savollar: {sub.totalQuestions} ta | Topshirilgan vaqt: {new Date(sub.submittedAt).toLocaleString('uz-UZ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Tahlilni ko'rish</span>
                      </button>

                      {!sub.adminApprovedStageUpgrade ? (
                        <button
                          onClick={() => onApproveUpgrade(sub.id)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{nextStageName} ga O'tkazishni Tasdiqlash</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Bosqichga o'tkazilgan
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CHETLATISH SO'ROVLARI */}
      {activeTab === 'expel' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Ustozlardan Kelgan Chetlatish So'rovlari</span>
            </h3>
            <p className="text-xs text-slate-400">
              Ustoz o'quvchini darslarga qatnashmaslik yoki tartibbuzarlik sababli chetlatishni so'raganda shu yerda ko'rinadi.
            </p>
          </div>

          {expelRequests.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
              <p className="text-sm font-semibold">Hozircha hech qanday chetlatish so'rovi yo'q</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expelRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Talaba: {req.studentName}</span>
                      <span className="text-xs text-slate-400">
                        (Ustoz: <strong className="text-indigo-400">{req.teacherName}</strong>)
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          req.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300'
                            : req.status === 'approved'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {req.status === 'pending' ? 'Kutilmoqda' : req.status === 'approved' ? 'Chetlatildi' : 'Rad etildi'}
                      </span>
                    </div>
                    <p className="text-xs text-rose-300 mt-1 bg-rose-950/30 p-2 rounded border border-rose-900/40">
                      <strong>Sabab:</strong> {req.reason}
                    </p>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Yuborilgan vaqt: {new Date(req.createdAt).toLocaleString('uz-UZ')}
                    </span>
                  </div>

                  {req.status === 'pending' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onResolveExpel(req.id, true)}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md shadow-rose-600/20"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Chetlatishni Tasdiqlash</span>
                      </button>
                      <button
                        onClick={() => onResolveExpel(req.id, false)}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700"
                      >
                        <span>Rad Etish</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: BARCHA O'QUVCHILAR RO'YXATI */}
      {activeTab === 'all_students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-white">
              Tizimdagi Barcha Ro'yxatdan O'tgan O'quvchilar ({students.length})
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Ism bo'yicha qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-rose-500 outline-none"
              />
            </div>
          </div>

          {students.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
              <Users className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold">Hozircha hech qanday talaba yo'q</p>
              <p className="text-xs text-slate-500 mt-1">
                Yangi talabalar ro'yxatdan o'tganda shu yerda paydo bo'ladi va ustozlarga random biriktiriladi.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">O'quvchi</th>
                    <th className="px-4 py-3">Login / Telefon</th>
                    <th className="px-4 py-3">Bosqich</th>
                    <th className="px-4 py-3">O'zlashtirish</th>
                    <th className="px-4 py-3">XP & Reyting</th>
                    <th className="px-4 py-3">Biriktirilgan Ustoz</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {students
                    .filter((s) =>
                      `${s.name} ${s.surname} ${s.username}`.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((student) => {
                      const teacher = teachers.find((t) => t.id === student.teacherId);
                      const masteryPct = student.stage === 'graduated' ? 100 : Math.min(100, Math.round((student.completedLessons.length / 15) * 100));
                      return (
                        <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <AvatarBadge
                                name={`${student.name} ${student.surname}`}
                                role="student"
                                size="sm"
                                className="w-8 h-8 ring-1 ring-slate-700"
                              />
                              <div>
                                <span className="font-bold text-white block">
                                  {student.name} {student.surname}
                                </span>
                                <span className="text-[10px] font-mono text-cyan-400">@{student.username}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span>{student.phone}</span>
                            <span className="text-[10px] text-slate-500 block">{student.email || 'Email yo\'q'}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded bg-slate-800 font-bold uppercase text-cyan-300 text-[10px] border border-slate-700">
                              {student.stage}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="w-28">
                              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-300 mb-0.5">
                                <span>{student.completedLessons.length}/15</span>
                                <span className="text-cyan-400 font-bold font-mono">{masteryPct}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                <div
                                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                                  style={{ width: `${Math.max(3, masteryPct)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold">
                            <span className="text-emerald-400">{student.xp} XP</span>
                            <span className="text-amber-400 ml-2">#{student.rank}</span>
                          </td>
                          <td className="px-4 py-3">
                            {teacher ? (
                              <span className="text-indigo-300 font-semibold">
                                {teacher.name} {teacher.surname}
                              </span>
                            ) : (
                              <span className="text-slate-500 italic">Biriktirilmagan</span>
                            )}
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

      {/* MODAL: YANGI USTOZ QO'SHISH (Owner login va parol yaratadi!) */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddTeacherModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-cyan-400" />
              <span>Yangi Ustoz Qo'shish & Login-Parol Berish</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Ustoz uchun tizimga kirish logini va parolini siz (Owner) yaratasiz.
            </p>

            <form onSubmit={handleAddTeacherSubmit} className="mt-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Ism *</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.name}
                    onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="Masalan: Jamshid"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Familiya *</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.surname}
                    onChange={(e) => setTeacherForm({ ...teacherForm, surname: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="Masalan: Fayziyev"
                  />
                </div>
              </div>

              {/* USERNAME & PASSWORD GENERATED BY OWNER */}
              <div className="p-3 bg-indigo-950/30 border border-indigo-500/40 rounded-xl space-y-2.5">
                <span className="text-[11px] font-bold text-indigo-300 block">
                  🔐 Ustoz Kirishi Uchun Hisob Ma'lumotlari:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Ustoz Logini *</label>
                    <input
                      type="text"
                      required
                      value={teacherForm.username}
                      onChange={(e) => setTeacherForm({ ...teacherForm, username: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-cyan-300 font-mono outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="jamshid_dev"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Ustoz Paroli *</label>
                    <div className="relative">
                      <input
                        type={showNewTeacherPass ? 'text' : 'password'}
                        required
                        value={teacherForm.password}
                        onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-8 py-2 text-amber-300 font-mono outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewTeacherPass(!showNewTeacherPass)}
                        className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                      >
                        {showNewTeacherPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Mutaxassisligi & Yo'nalishi</label>
                <input
                  type="text"
                  value={teacherForm.specialty}
                  onChange={(e) => setTeacherForm({ ...teacherForm, specialty: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-500"
                  placeholder="Senior JavaScript & Web Mentor"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Tajribasi (yil)</label>
                  <input
                    type="number"
                    min="1"
                    max="25"
                    value={teacherForm.experienceYears}
                    onChange={(e) => setTeacherForm({ ...teacherForm, experienceYears: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Telefon raqam</label>
                  <input
                    type="text"
                    value={teacherForm.phone}
                    onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="+998 90 123 45 67"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Qisqacha Bio</label>
                <textarea
                  rows={2}
                  value={teacherForm.bio}
                  onChange={(e) => setTeacherForm({ ...teacherForm, bio: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-500"
                  placeholder="Dasturlash tajribasi va o'qitish uslubi..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-md shadow-cyan-600/30"
                >
                  Ustozni Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Test tahlilini ko'rish */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{selectedSubmission.studentName} — Test Natijasi</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-mono">
                    {selectedSubmission.testId}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Natija: <strong className="text-emerald-400">{selectedSubmission.percentage}%</strong> ({selectedSubmission.score} ball)
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {selectedSubmission.answers.map((ans, idx) => (
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
                      Talaba tanlagan variant: <strong className="text-white">{ans.userAnswerIndex !== -1 ? ans.userAnswerIndex + 1 : "Tanlanmagan"}</strong>
                    </p>
                    <p className="text-slate-400">
                      To'g'ri variant: <strong className="text-emerald-400">{ans.correctAnswerIndex + 1}</strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end gap-2">
              {!selectedSubmission.adminApprovedStageUpgrade && (
                <button
                  onClick={() => {
                    onApproveUpgrade(selectedSubmission.id);
                    setSelectedSubmission(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Keyingi bosqichga o'tkazishni tasdiqlash
                </button>
              )}
              <button
                onClick={() => setSelectedSubmission(null)}
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
