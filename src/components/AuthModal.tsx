import React, { useState } from 'react';
import {
  LogIn,
  UserPlus,
  KeyRound,
  ShieldAlert,
  Users,
  GraduationCap,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { loginUser, registerStudent, getTeachers } from '../services/storage';
import { AuthUser, Student, Teacher } from '../types';
import { OWNER_CREDENTIALS } from '../data/mockData';

interface AuthModalProps {
  initialTab?: 'login' | 'register';
  onClose: () => void;
  onAuthSuccess: (user: AuthUser) => void;
  onStudentRegistered: (student: Student, teacher: Teacher | null) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialTab = 'login',
  onClose,
  onAuthSuccess,
  onStudentRegistered,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Register form state
  const [regRole, setRegRole] = useState<'student' | 'admin'>('student');
  const [regName, setRegName] = useState('');
  const [regSurname, setRegSurname] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [adminSecretKey, setAdminSecretKey] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [regPhone, setRegPhone] = useState('+998 ');
  const [regEmail, setRegEmail] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const res = loginUser(loginUsername, loginPassword);
    if (res.success && res.user) {
      onAuthSuccess(res.user);
      onClose();
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleQuickLogin = (user: string, pass: string) => {
    setLoginUsername(user);
    setLoginPassword(pass);
    const res = loginUser(user, pass);
    if (res.success && res.user) {
      onAuthSuccess(res.user);
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim() || !regSurname.trim() || !regUsername.trim() || !regPassword) {
      setErrorMessage("Iltimos, barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Parollar mos kelmadi! Iltimos, qaytadan tekshirib ko'ring.");
      return;
    }

    if (regRole === 'admin') {
      // Require owner secret key
      if (adminSecretKey.trim() !== 'lord_2012' && adminSecretKey.trim() !== 'devmaster_secret') {
        setErrorMessage("Maxfiy Admin Kaliti noto'g'ri! Faqat akademiya asoschisi kirish huquqiga ega.");
        return;
      }

      // Log in as Owner
      const res = loginUser(OWNER_CREDENTIALS.username, OWNER_CREDENTIALS.password);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
        onClose();
      }
      return;
    }

    // Student registration
    const res = registerStudent({
      name: regName.trim(),
      surname: regSurname.trim(),
      username: regUsername.trim().toLowerCase(),
      password: regPassword,
      phone: regPhone.trim(),
      email: regEmail.trim(),
    });

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#6366f1', '#10b981'],
      });
    } catch (err) {
      console.log(err);
    }

    onStudentRegistered(res.student, res.teacher);
    onAuthSuccess({
      id: res.student.id,
      name: `${res.student.name} ${res.student.surname}`,
      username: res.student.username,
      role: 'student',
      avatar: res.student.avatar,
    });
    onClose();
  };

  const teachers = getTeachers();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Kirish (Login)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Ro'yxatdan O'tish</span>
          </button>
        </div>

        {/* LOGIN TAB */}
        {activeTab === 'login' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-black text-white">Tizimga Kirish</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Owner, Ustoz yoki Ro'yxatdan o'tgan O'quvchi hisobingizga kiring.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Login (Username) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Loginingizni kiriting"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Maxfiy Parol *
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 text-xs transition-all active:scale-95"
              >
                Tizimga Kirish
              </button>
            </form>
          </div>
        )}

        {/* REGISTER TAB */}
        {activeTab === 'register' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-black text-white">Yangi Hisob Ochish</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                O'quvchi hisobini oching yoki Admin kaliti bilan kiring.
              </p>
            </div>

            {/* Role selection inside Register */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  setRegRole('student');
                  setErrorMessage('');
                }}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  regRole === 'student'
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                O'quvchi
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegRole('admin');
                  setErrorMessage('');
                }}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  regRole === 'admin'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin (Maxfiy Kalit)
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              {regRole === 'student' ? (
                <>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Ismingiz *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ali"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Familiyangiz *</label>
                      <input
                        type="text"
                        required
                        placeholder="Valiyev"
                        value={regSurname}
                        onChange={(e) => setRegSurname(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Login (Username) *</label>
                    <input
                      type="text"
                      required
                      placeholder="ali_dev"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Maxfiy Parol *</label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-8 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2 top-2 text-slate-400 hover:text-white"
                        >
                          {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Tasdiqlash *</label>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Telefon raqam</label>
                    <input
                      type="text"
                      placeholder="+998 90 123 45 67"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="p-2.5 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-[11px] text-cyan-300">
                    <span className="font-bold flex items-center gap-1 mb-0.5">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      Random Ustozga Taqsimot:
                    </span>
                    Ro'yxatdan o'tganingizdan so'ng 15 kishilik guruhlardan biriga biriktirilasiz.
                  </div>
                </>
              ) : (
                /* Admin Registration with Secret Key */
                <div className="space-y-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs">
                    <ShieldAlert className="w-4 h-4 inline mr-1 text-amber-400" />
                    <strong>Admin (Owner) Tasdiqlash:</strong> Admin paneliga kirish uchun faqat platforma egasining maxfiy kaliti talab qilinadi.
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      DevMaster Maxfiy Admin Kaliti *
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminKey ? 'text' : 'password'}
                        required
                        placeholder="Maxfiy kalitni kiriting"
                        value={adminSecretKey}
                        onChange={(e) => setAdminSecretKey(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-white outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminKey(!showAdminKey)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showAdminKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-3 text-white font-bold rounded-xl shadow-lg text-xs transition-all active:scale-95 ${
                  regRole === 'student'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-600/30'
                    : 'bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 shadow-amber-600/30'
                }`}
              >
                {regRole === 'student' ? "Ro'yxatdan O'tish va Boshlash" : "Admin Huquqini Tasdiqlash"}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
