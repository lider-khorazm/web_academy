import React, { useState } from 'react';
import { UserX, AlertTriangle, Send } from 'lucide-react';
import { Student, Teacher } from '../types';
import { createExpelRequest } from '../services/storage';
import { AvatarBadge } from './AvatarBadge';

interface ExpelModalProps {
  teacher: Teacher;
  student: Student;
  onClose: () => void;
  onSubmitted: () => void;
}

export const ExpelModal: React.FC<ExpelModalProps> = ({
  teacher,
  student,
  onClose,
  onSubmitted,
}) => {
  const [reason, setReason] = useState('Darslarga doimiy qatnashmaslik va topshiriqlarni bajarmaslik');
  const [customNotes, setCustomNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullReason = customNotes ? `${reason} — ${customNotes}` : reason;

    createExpelRequest({
      teacherId: teacher.id,
      teacherName: `${teacher.name} ${teacher.surname}`,
      studentId: student.id,
      studentName: `${student.name} ${student.surname}`,
      reason: fullReason,
    });

    setIsSubmitting(false);
    alert(`O'quvchi ${student.name} ${student.surname}ni chetlatish so'rovi Bosh Adminga yuborildi! Admin tez orada ko'rib chiqadi.`);
    onSubmitted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-rose-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">O'quvchini Chetlatishni Adminga Aytish</h3>
            <p className="text-xs text-slate-400">
              Talabani guruhdan chetlatish yoki intizomiy chora ko'rish bo'yicha adminga ariza
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
            <AvatarBadge
              name={`${student.name} ${student.surname}`}
              role="student"
              size="md"
              className="w-10 h-10 ring-1 ring-slate-700"
            />
            <div>
              <span className="font-bold text-white block text-sm">
                {student.name} {student.surname}
              </span>
              <span className="text-[11px] text-slate-400">
                Bosqich: {student.stage.toUpperCase()} | XP: {student.xp}
              </span>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">
              Chetlatish sababini tanlang:
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:ring-1 focus:ring-rose-500"
            >
              <option value="Darslarga doimiy qatnashmaslik va topshiriqlarni bajarmaslik">
                Darslarga doimiy qatnashmaslik va topshiriqlarni bajarmaslik
              </option>
              <option value="Berilgan Test ID larni o'z vaqtida topshirmaslik">
                Berilgan Test ID larni o'z vaqtida topshirmaslik
              </option>
              <option value="Guruh chatida nojo'ya xatti-harakatlar yoki spam">
                Guruh chatida nojo'ya xatti-harakatlar yoki spam
              </option>
              <option value="Boshqa jiddiy sabab">Boshqa jiddiy sabab</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">
              Qo'shimcha izoh yoki tafsilotlar:
            </label>
            <textarea
              rows={3}
              placeholder="Admin uchun qo'shimcha tafsilotlar..."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl text-rose-300 text-[11px] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>
              Ushbu so'rov darhol Bosh Admin panelida ko'rinadi va tasdiqlangach talaba guruhingizdan chiqariladi.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Adminga So'rov Yuborish</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
