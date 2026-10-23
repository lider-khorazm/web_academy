import React, { useState } from 'react';
import {
  Mail,
  Inbox,
  Send,
  X,
  CheckCircle2,
  User,
  ShieldCheck,
  Star,
  Clock,
  Sparkles
} from 'lucide-react';
import { StudentAccount } from '../data/learningCurriculum';

interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  isOfficial?: boolean;
}

interface StudentWebmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentAccount: StudentAccount | null;
  onOpenRegister: () => void;
}

export function StudentWebmailModal({
  isOpen,
  onClose,
  studentAccount,
  onOpenRegister,
}: StudentWebmailModalProps) {
  const studentEmail = studentAccount?.email || 'talaba@akademiya.uz';
  const studentName = studentAccount?.name || 'Hurmatli O\'quvchi';

  const [emails, setEmails] = useState<EmailMessage[]>([
    {
      id: 'em_1',
      from: 'Bosh Admin (legend_o1@akademiya.uz)',
      subject: 'Rasmiy Akademiya elektron pochta manzilingiz faollashtirildi! 🎓',
      preview: 'Hurmatli talaba! Sizga rasmiy @akademiya.uz domeni ostida yangi shaxsiy pochta berildi...',
      body: `Assalomu alaykum, ${studentName}!\n\nSizni Tanishuv.uz & Web Dasturlash Akademiyasida qutlaymiz!\nSiz uchun rasmiy ${studentEmail} pochta manzili muvaffaqiyatli ochildi.\n\nUshbu pochta orqali siz:\n1. Topshirgan portfolio ishlaringizning admin tomonidan tasdiqlanish xabarlarini olasiz.\n2. W3Schools va Python/HTML darslari bo'yicha yangilanishlardan xabardor bo'lasiz.\n3. Kursni bitirganingizda PDF sertifikatingiz nusxasi shu manzilga yo'llanadi.\n\nMuvaffaqiyatlar tilaymiz!\nAdmin @legend_o1`,
      date: 'Bugun, 09:00',
      isOfficial: true,
    },
    {
      id: 'em_2',
      from: 'Akademiya Ta\'lim Bo\'limi (courses@akademiya.uz)',
      subject: 'Yangi darsliklar: Python, SCSS va Bootstrap qo\'llanmalari',
      preview: 'Saytda yangi texnologiyalar xaritasi ochildi. HTML dan so\'ng SCSS va Python orqali...',
      body: `Salom, ${studentName}!\n\nKursingiz dasturiga SCSS, Bootstrap 5 va Pythonda (Django/Flask) sayt yasash bo'yicha yangi modullar qo'shildi. Testlarni topshirib, o'z bilimingizni mustahkamlashingiz mumkin!`,
      date: 'Kecha, 18:30',
      isOfficial: true,
    },
  ]);

  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(emails[0]);
  const [isComposing, setIsComposing] = useState(false);
  const [recipient, setRecipient] = useState('legend_o1@akademiya.uz');
  const [subject, setSubject] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !bodyText.trim()) return;

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setIsComposing(false);
      setSubject('');
      setBodyText('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full h-[85vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900">
                  Talaba Pochta Qutisi
                </h3>
                <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                  {studentEmail}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                O'quvchi va Admin o'rtasidagi rasmiy xabarlar almashinuvi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsComposing(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Xat yozish</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content split */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Inbox list (Left) */}
          <div className="md:col-span-5 border-r border-stone-200 overflow-y-auto bg-stone-50/50">
            <div className="p-3 border-b border-stone-200 text-xs font-bold text-stone-500 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Inbox className="w-3.5 h-3.5 text-stone-400" />
                Kiruvchi xatlar ({emails.length})
              </span>
            </div>

            <div className="divide-y divide-stone-100">
              {emails.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedEmail(m);
                    setIsComposing(false);
                  }}
                  className={`w-full text-left p-3.5 transition-colors block ${
                    selectedEmail?.id === m.id && !isComposing
                      ? 'bg-white shadow-xs border-l-3 border-rose-500'
                      : 'hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-stone-900 truncate max-w-[170px]">
                      {m.from.split('(')[0]}
                    </span>
                    <span className="text-stone-400 font-mono text-[10px]">{m.date}</span>
                  </div>
                  <h5 className="text-xs font-semibold text-stone-800 truncate mb-1">
                    {m.subject}
                  </h5>
                  <p className="text-[11px] text-stone-500 line-clamp-1">
                    {m.preview}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Email View or Compose (Right) */}
          <div className="md:col-span-7 flex flex-col overflow-y-auto p-5 bg-white">
            {isComposing ? (
              /* Compose view */
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Yangi xat jo'natish
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsComposing(false)}
                    className="text-xs text-stone-400 hover:text-stone-700"
                  >
                    Bekor qilish
                  </button>
                </div>

                {sentSuccess ? (
                  <div className="p-8 text-center space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h5 className="text-sm font-bold text-stone-900">
                      Xat muvaffaqiyatli adminga yuborildi!
                    </h5>
                    <p className="text-xs text-stone-500">
                      Tez orada javob xatini pochtangizda qabul qilasiz.
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Kimga (Admin pochta):
                      </label>
                      <input
                        type="email"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Mavzu:
                      </label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Masalan: VS Code dagi portfolio ishim haqida savol"
                        className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-rose-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Xabar matni:
                      </label>
                      <textarea
                        rows={6}
                        required
                        value={bodyText}
                        onChange={(e) => setBodyText(e.target.value)}
                        placeholder="Hurmatli admin..."
                        className="w-full text-xs p-3 border border-stone-200 rounded-lg outline-none focus:border-rose-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Xatni yuborish</span>
                    </button>
                  </>
                )}
              </form>
            ) : selectedEmail ? (
              /* Reading view */
              <div className="space-y-4">
                <div className="pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2 mb-1">
                    {selectedEmail.isOfficial && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Rasmiy Xabarnoma
                      </span>
                    )}
                    <span className="text-[10px] text-stone-400">{selectedEmail.date}</span>
                  </div>
                  <h4 className="text-base font-bold text-stone-900">
                    {selectedEmail.subject}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    Kimdan: <strong className="text-stone-700">{selectedEmail.from}</strong>
                  </p>
                </div>

                <div className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
                  {selectedEmail.body}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
