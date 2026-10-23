import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  User,
  Users,
  Sparkles,
  CheckCircle2,
  Smile
} from 'lucide-react';
import { StudentAccount } from '../data/learningCurriculum';

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: 'admin' | 'student' | 'member';
  senderEmail: string;
  text: string;
  timestamp: string;
  avatarUrl?: string;
}

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    senderName: 'Olimjon',
    senderRole: 'admin',
    senderEmail: 'legend_o1@akademiya.uz',
    text: "Assalomu alaykum bo'lajak dasturchilar! Hamjamiyat chatimizga xush kelibsiz. VS Code da yaratgan HTML portfoliolaringizni bemalol yuborishingiz mumkin, saralanganlarini bosh sahifaga joylaymiz!",
    timestamp: 'Bugun, 09:30',
    avatarUrl: '/src/assets/images/profile_avatar_jasur_1792214060594.jpg',
  },
  {
    id: 'msg_2',
    senderName: 'Umirbek',
    senderRole: 'student',
    senderEmail: 'umirbek@akademiya.uz',
    text: "Assalomu alaykum ustoz! Men Python va Django orqali ilk backend loyihamni tugatdim, HTML shablonlarini ulab portfolio qildim.",
    timestamp: 'Bugun, 10:15',
    avatarUrl: '/src/assets/images/profile_avatar_umirbek_1792220404248.jpg',
  },
  {
    id: 'msg_3',
    senderName: 'Sardor',
    senderRole: 'student',
    senderEmail: 'sardor@akademiya.uz',
    text: "Zo'r Umirbek! Men esa SCSS va Bootstrap yordamida responsive kartochka dizaynini qildim, VS Code da tayyorlab .html fayl qilib yukladim.",
    timestamp: 'Bugun, 11:02',
    avatarUrl: '/src/assets/images/profile_avatar_sardor_1792220406197.jpg',
  },
  {
    id: 'msg_4',
    senderName: 'Muhriddin',
    senderRole: 'student',
    senderEmail: 'muhriddin@akademiya.uz',
    text: "Hammaga salom! Men ham HTML testini 100% ga topshirib, PDF sertifikatni yuklab oldim. Savollar bo'lsa AI murabbiy ham juda zo'r tushuntirib beryapti!",
    timestamp: 'Bugun, 11:45',
    avatarUrl: '/src/assets/images/profile_avatar_muhriddin_1792220405551.jpg',
  },
];

interface CommunityChatProps {
  currentStudent: StudentAccount | null;
  isAdmin: boolean;
}

export function CommunityChat({ currentStudent, isAdmin }: CommunityChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('tanishuv_community_chat');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CHAT_MESSAGES;
  });

  const [inputText, setInputText] = useState('');
  const [authorName, setAuthorName] = useState(
    isAdmin ? 'Olimjon (Admin)' : currentStudent?.name || 'Talaba'
  );

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const role: 'admin' | 'student' | 'member' = isAdmin ? 'admin' : 'student';
    const email = isAdmin
      ? 'legend_o1@akademiya.uz'
      : currentStudent?.email || `${authorName.toLowerCase().replace(/\s+/g, '')}@akademiya.uz`;

    const newMsg: ChatMessage = {
      id: 'chat_' + Date.now(),
      senderName: authorName.trim(),
      senderRole: role,
      senderEmail: email,
      text: inputText.trim(),
      timestamp: 'Hozirgina',
      avatarUrl: isAdmin
        ? '/src/assets/images/profile_avatar_jasur_1792214060594.jpg'
        : undefined,
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    try {
      localStorage.setItem('tanishuv_community_chat', JSON.stringify(updated));
    } catch {}
    setInputText('');
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[75vh]">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-xs">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-stone-900">
                Akademiya & Hamjamiyat Chati
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Jonli Muloqot
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Barcha o'quvchilar, mutaxassislar va admin uchun umumiy ochiq muhokama maydoni
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Users className="w-4 h-4 text-stone-400" />
          <span className="font-semibold">{messages.length} ta xabar</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#faf9f6]/60">
        {messages.map((m) => {
          const isMsgAdmin = m.senderRole === 'admin';
          return (
            <div key={m.id} className="flex items-start gap-3">
              <div className="shrink-0">
                {m.avatarUrl ? (
                  <img
                    src={m.avatarUrl}
                    alt={m.senderName}
                    className="w-9 h-9 rounded-full object-cover border border-stone-200 shadow-xs"
                  />
                ) : (
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                      isMsgAdmin
                        ? 'bg-stone-900 text-white'
                        : 'bg-rose-100 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {m.senderName.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">
                      {m.senderName}
                    </span>
                    {isMsgAdmin ? (
                      <span className="text-[10px] font-bold text-white bg-stone-900 px-2 py-0.2 rounded inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-rose-400" />
                        Admin @legend_o1
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400 font-mono">
                        {m.senderEmail}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-400">{m.timestamp}</span>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {m.text}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 bg-white border-t border-stone-200 space-y-2">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Ismingiz..."
            className="w-32 sm:w-40 text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:bg-white focus:border-rose-400"
          />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Xabaringizni yozing (HTML, loyihalar va savollar)..."
            className="flex-1 text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:bg-white focus:border-rose-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Yuborish</span>
          </button>
        </form>
      </div>
    </div>
  );
}
