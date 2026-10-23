import {
  GraduationCap,
  Users,
  ShieldAlert,
  UserPlus,
  KeyRound,
  MessageSquare,
  Award,
  LogIn,
  LogOut,
  Coffee,
  Sparkles,
  Download,
  Home,
  LayoutDashboard,
  Sun,
  Moon
} from 'lucide-react';
import { Student, Teacher, AuthUser } from '../types';
import { OWNER_PROFILE } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  currentUser: AuthUser | null;
  selectedStudent: Student | null;
  selectedTeacher: Teacher | null;
  teachers: Teacher[];
  students: Student[];
  onOpenLoginModal: () => void;
  onOpenRegisterModal: () => void;
  onOpenTestIdModal: () => void;
  onOpenGroupChatModal: () => void;
  onOpenFinalExamModal: () => void;
  onLogout: () => void;
  unreadNotesCount: number;
  showLandingPage?: boolean;
  onToggleLandingPage?: (show: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  selectedStudent,
  selectedTeacher,
  teachers,
  students,
  onOpenLoginModal,
  onOpenRegisterModal,
  onOpenTestIdModal,
  onOpenGroupChatModal,
  onOpenFinalExamModal,
  onLogout,
  unreadNotesCount,
  showLandingPage = false,
  onToggleLandingPage,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Platform Name */}
          <div
            onClick={() => onToggleLandingPage && onToggleLandingPage(true)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-400/30 group-hover:scale-105 transition-all">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 dark:from-white dark:via-slate-100 dark:to-cyan-400 bg-clip-text text-transparent">
                  DevMaster
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 uppercase tracking-widest hidden sm:inline-block">
                  Academy
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-1">
                <span>By {OWNER_PROFILE.name}</span>
                <Coffee className="w-3 h-3 text-amber-500 dark:text-amber-400 inline" />
              </p>
            </div>
          </div>

          {/* Center/Right Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Actions (Test ID, Group chat, Final exam, ZIP) */}
            <div className="hidden md:flex items-center gap-2">
              
              {/* FOYDALANUVCHI TALABI: "tepadagi test idni faqat ro'yxatdan o'tgan o'quvchilar uchun ko'rinadigan qil" */}
              {currentUser && currentUser.role === 'student' && (
                <button
                  onClick={onOpenTestIdModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white shadow transition-all border border-indigo-400/30 cursor-pointer"
                  title="Ustoz bergan Test ID orqali kirish"
                >
                  <KeyRound className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Test ID</span>
                </button>
              )}

              {currentUser && (
                <>
                  <button
                    onClick={onOpenGroupChatModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                    title="15 talaba + Ustoz + Admin guruh chati"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Guruh Chati</span>
                  </button>

                </>
              )}

              {/* FOYDALANUVCHI TALABI: "zip yuklaab olishni esa admin bo'lgan kishiga ko'rinadigan qil" */}
              {currentUser && currentUser.role === 'owner' && (
                <a
                  href="/devmaster-project.zip"
                  download="devmaster-project.zip"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white shadow transition-all border border-emerald-400/40"
                  title="Butun loyihani ZIP arxiv sifatida yuklab olish (Faqat Admin / Owner uchun)"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-200" />
                  <span>ZIP Yuklab Olish</span>
                </a>
              )}
            </div>

            {/* Navigation toggle if user is logged in */}
            {currentUser && onToggleLandingPage && (
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => onToggleLandingPage(false)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    !showLandingPage
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Shaxsiy boshqaruv panelingiz"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mening Panelim</span>
                </button>
                <button
                  onClick={() => onToggleLandingPage(true)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    showLandingPage
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Platforma bosh sahifasi"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Bosh Sahifa</span>
                </button>
              </div>
            )}

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm active:scale-95 cursor-pointer"
              title={theme === 'dark' ? "Yorug' rejimga o'tish (Light Mode)" : "Tungi rejimga o'tish (Dark Mode)"}
              aria-label="Toggle dark/light theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline text-amber-300 font-bold">Yorug'</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span className="hidden sm:inline text-indigo-600 font-bold">Tungi</span>
                </>
              )}
            </button>

            {/* Current Logged In User or Guest Auth Buttons */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                {/* Role badge */}
                <div className="hidden sm:flex flex-col text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {currentUser.role === 'owner' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        👑 Owner
                      </span>
                    )}
                    {currentUser.role === 'teacher' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        👨‍🏫 Ustoz
                      </span>
                    )}
                    {currentUser.role === 'student' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        🎓 O'quvchi
                      </span>
                    )}
                    <span className="text-xs font-bold text-white block leading-tight truncate max-w-[120px]">
                      {currentUser.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400">
                    @{currentUser.username}
                  </span>
                </div>

                {unreadNotesCount > 0 && currentUser.role === 'teacher' && (
                  <span className="w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse" title="Yangi o'qilmagan xabarlar">
                    {unreadNotesCount}
                  </span>
                )}

                <button
                  onClick={onLogout}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  title="Tizimdan chiqish"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span className="hidden sm:inline">Chiqish</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <button
                  onClick={onOpenLoginModal}
                  className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Kirish</span>
                </button>
                <button
                  onClick={onOpenRegisterModal}
                  className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/20 active:scale-95 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ro'yxatdan O'tish</span>
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Sub-bar: ONLY when user is logged in, show their context status */}
        {currentUser && (
          <div className="py-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Faol hisob:</span>
              {currentUser.role === 'owner' && (
                <div className="flex items-center gap-1.5 text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold">Boshqaruvchi: {currentUser.name} (@{currentUser.username})</span>
                </div>
              )}

              {currentUser.role === 'teacher' && selectedTeacher && (
                <div className="flex items-center gap-2">
                  <span className="text-indigo-300 font-semibold">
                    Ustoz: {selectedTeacher.name} {selectedTeacher.surname} (@{selectedTeacher.username})
                  </span>
                  <span className="text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-medium">
                    {selectedTeacher.studentIds?.length || 0} / 15 Talaba
                  </span>
                </div>
              )}

              {currentUser.role === 'student' && selectedStudent && (
                <div className="flex items-center gap-2">
                  <span className="text-cyan-300 font-semibold">
                    Talaba: {selectedStudent.name} {selectedStudent.surname} (@{selectedStudent.username})
                  </span>
                  <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                    {selectedStudent.stage}
                  </span>
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                    ⚡ {selectedStudent.xp} XP
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                <span>DevMaster Xavfsiz Tizimi</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
