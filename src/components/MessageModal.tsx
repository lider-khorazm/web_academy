import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Student, Teacher } from '../types';
import { sendGroupMessage } from '../services/storage';
import { AvatarBadge } from './AvatarBadge';

interface MessageModalProps {
  teacher: Teacher;
  student: Student;
  onClose: () => void;
  onSent: () => void;
}

export const MessageModal: React.FC<MessageModalProps> = ({
  teacher,
  student,
  onClose,
  onSent,
}) => {
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Guruh chatiga shaxsiy murojaat qilib yuborish
    sendGroupMessage({
      teacherId: teacher.id,
      senderId: teacher.id,
      senderName: `${teacher.name} ${teacher.surname} (Ustoz)`,
      senderRole: 'teacher',
      avatar: teacher.avatar,
      text: `@${student.name} ${student.surname}: ${message.trim()}`,
    });

    setSentSuccess(true);
    onSent();
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
        >
          ✕
        </button>

        {!sentSuccess ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">O'quvchiga Xabar Yo'llash</h3>
                <p className="text-xs text-slate-400">
                  {student.name} {student.surname} uchun guruh chatida ko'rinuvchi shaxsiy murojaat
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
                <AvatarBadge
                  name={`${student.name} ${student.surname}`}
                  role="student"
                  size="md"
                  className="w-10 h-10"
                />
                <div>
                  <span className="font-bold text-white block">
                    {student.name} {student.surname}
                  </span>
                  <span className="text-[11px] text-cyan-400">
                    Bosqich: {student.stage.toUpperCase()} | {student.xp} XP
                  </span>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Xabar matni:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Masalan: Salom Olimjon, dars topshiriqlarini juda yaxshi bajarmoqdasiz! Tez orada test topshirasiz..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:ring-1 focus:ring-cyan-500"
                />
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
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/30 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Xabarni Yuborish</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Xabar Guruhga Yuborildi!</h4>
            <p className="text-xs text-slate-400">
              O'quvchi guruh chatida xabaringizni ko'radi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
