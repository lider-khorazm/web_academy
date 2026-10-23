import React, { useState } from 'react';
import {
  UserPlus,
  Sparkles,
  CheckCircle2,
  Users,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Teacher, Student } from '../types';
import { registerStudent } from '../services/storage';
import { AvatarBadge } from './AvatarBadge';

interface RegistrationModalProps {
  onClose: () => void;
  onRegistered: (newStudent: Student, assignedTeacher: Teacher | null) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  onClose,
  onRegistered,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '+998 ',
    email: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [assignedResult, setAssignedResult] = useState<{
    student: Student;
    teacher: Teacher | null;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.surname.trim()) {
      setErrorMessage("Iltimos, ism va familiyangizni to'liq kiriting!");
      return;
    }

    if (!formData.username.trim()) {
      setErrorMessage("Iltimos, login (username) tanlang!");
      return;
    }

    if (!formData.password || formData.password.length < 4) {
      setErrorMessage("Parol kamida 4 ta belgidan iborat bo'lishi shart!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Parollar bir-biriga mos kelmadi! Iltimos, qayta tekshiring.");
      return;
    }

    const username = formData.username.trim().toLowerCase();
    const res = registerStudent({
      name: formData.name.trim(),
      surname: formData.surname.trim(),
      username: username,
      password: formData.password,
      phone: formData.phone.trim(),
      email: formData.email.trim(),
    });

    setAssignedResult(res);
    onRegistered(res.student, res.teacher);

    // Trigger celebratory confetti on registration success
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#6366f1', '#10b981', '#f59e0b'],
      });
    } catch (err) {
      console.log('Confetti err:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        {!assignedResult ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Yangi O'quvchi Ro'yxatdan O'tishi</h3>
                <p className="text-xs text-slate-400">
                  Parolingiz xavfsiz shifrlanadi va random ustozga yo'naltirilasiz.
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 mb-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Ismingiz *</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Jasur"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Familiyangiz *</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Aliyev"
                    value={formData.surname}
                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Login (Username) *</label>
                <input
                  type="text"
                  required
                  placeholder="masalan: talaba_2025"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                />
              </div>

              {/* Maxfiylashtirilgan parollar */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Maxfiy Parol *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-8 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                      title={showPassword ? 'Yashirish' : "Ko'rsatish"}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Tasdiqlash *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-8 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                      title={showConfirmPassword ? 'Yashirish' : "Ko'rsatish"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Telefon raqam *</label>
                  <input
                    type="text"
                    required
                    placeholder="+998 90 123 45 67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Email manzili</label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Security & Random Assignment Banner */}
              <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-[11px] text-cyan-300 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Xavfsiz Ro'yxatdan O'tish va Random Taqsimot:
                </span>
                <p className="text-slate-400 leading-tight">
                  Parolingiz maxfiy saqlanadi. Tizim sizni avtomatik ravishda 15 kishilik guruhlardan biriga biriktiradi.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/30 active:scale-95 transition-all"
                >
                  Ro'yxatdan O'tish
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* RESULT AFTER RANDOM ASSIGNMENT */
          <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Ro'yxatdan O'tish Muvaffaqiyatli!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Siz DevMaster Academy talabalari safiga qo'shildingiz. Parolingiz bilan tizimga kirishingiz mumkin.
              </p>
            </div>

            {assignedResult.teacher ? (
              <div className="p-4 bg-slate-950 border border-indigo-500/40 rounded-2xl text-left space-y-3">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
                  🎲 Random Biriktirilgan Ustozingiz:
                </span>
                <div className="flex items-center gap-3">
                  <AvatarBadge
                    name={`${assignedResult.teacher.name} ${assignedResult.teacher.surname}`}
                    role="teacher"
                    size="md"
                    className="w-12 h-12 ring-2 ring-indigo-500"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {assignedResult.teacher.name} {assignedResult.teacher.surname}
                    </h4>
                    <p className="text-xs text-cyan-300">{assignedResult.teacher.specialty}</p>
                    <span className="text-[10px] text-slate-400">
                      Guruhdagi o'quvchilar: {assignedResult.teacher.studentIds.length} / 15
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-left space-y-1.5">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  📋 Guruh Biriktiruvi:
                </span>
                <p className="text-xs text-slate-300">
                  Hisobingiz muvaffaqiyatli ochildi! Boshqaruvchi yangi ustozlar tarkibini kiritgach, maxsus 15 kishilik guruhga avtomatik biriktirilasiz. Darslarni hoziroq o'rganishni boshlashingiz mumkin.
                </p>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Ta'limni Boshlash (Darslarga O'tish)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
