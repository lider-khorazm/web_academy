import React, { useState } from 'react';
import { X, GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';
import { StudentAccount } from '../data/learningCurriculum';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (account: StudentAccount) => void;
  currentAccount: StudentAccount | null;
}

export function StudentRegistrationModal({
  isOpen,
  onClose,
  onRegister,
  currentAccount,
}: StudentRegistrationModalProps) {
  const [name, setName] = useState(currentAccount?.name || '');
  const [email, setEmail] = useState(currentAccount?.email || '');
  const [goal, setGoal] = useState('HTML dan boshlab to\'liq sayt yaratishni o\'rganish');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const account: StudentAccount = currentAccount || {
      name: name.trim(),
      email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '')}@student.uz`,
      registeredAt: new Date().toLocaleDateString('uz-UZ'),
      currentStage: 'html',
      completedStages: [],
      quizPassed: {
        html: false,
        css: false,
        js: false,
      },
    };

    if (currentAccount) {
      account.name = name.trim();
      account.email = email.trim();
    }

    onRegister(account);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {currentAccount ? "O'quvchi Profilini Yangilash" : "HTML O'rganuvchi Ro'yxatdan O'tish"}
              </h3>
              <p className="text-xs text-stone-500">
                HTML → CSS → JS ta'lim yo'lagiga qo'shiling
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Ismingiz *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Olimjon"
              className="w-full text-xs px-3.5 py-2.5 border border-stone-200 rounded-xl outline-none focus:border-rose-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email yoki Telegram (ixtiyoriy)
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="olimjon@misol.uz"
              className="w-full text-xs px-3.5 py-2.5 border border-stone-200 rounded-xl outline-none focus:border-rose-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              O'rganish maqsadi
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full text-xs px-3 py-2.5 border border-stone-200 rounded-xl outline-none focus:border-rose-400 bg-white"
            >
              <option value="HTML dan boshlab to'liq sayt yaratishni o'rganish">
                HTML dan boshlab to'liq sayt yaratishni o'rganish
              </option>
              <option value="Tanishuv saytlarining kodini tushunish va yasash">
                Tanishuv saytlarining kodini tushunish va yasash
              </option>
              <option value="W3Schools orqali Frontend dasturchi bo'lish">
                W3Schools orqali Frontend dasturchi bo'lish
              </option>
            </select>
          </div>

          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60 text-xs text-stone-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-stone-900 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Avtomatik ta'lim zanjiri:</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              1. HTML asoslari va test → 2. CSS bezaklari → 3. JavaScript harakati va W3Schools ga avtomatik yo'naltirish.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-xl"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <span>{currentAccount ? "Saqlash" : "Ro'yxatdan o'tish va Boshlash"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
