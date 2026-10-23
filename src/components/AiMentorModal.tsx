import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Key,
  X,
  Code2,
  HelpCircle,
  Copy,
  Check,
  User,
  Loader2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  provider?: string;
  time: string;
}

interface AiMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHARED_GROQ_KEY = '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';

export function AiMentorModal({ isOpen, onClose }: AiMentorModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'ai',
      text: "Assalomu alaykum! Men sizning Web Dasturlash (HTML, CSS, SCSS, Bootstrap, JavaScript va Python) bo'yicha yagona tezkor Groq AI murabbiyingizman. Tushunmagan kodingiz, HTML teglari yoki Python/CSS xatolari bo'lsa bemalol so'rang!",
      time: 'Hozirgina',
      provider: 'Groq AI (Llama 3.3 70B)',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [groqKey, setGroqKey] = useState<string>(() => {
    try {
      return localStorage.getItem('tanishuv_groq_api_key') || SHARED_GROQ_KEY;
    } catch {
      return SHARED_GROQ_KEY;
    }
  });
  const [showKeyConfig, setShowKeyConfig] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('tanishuv_groq_api_key', groqKey.trim());
    } catch {}
    setShowKeyConfig(false);
  };

  const handleSend = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const promptToSend = customPrompt || inputVal;
    if (!promptToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text: promptToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputVal('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptToSend.trim(),
          groqApiKey: groqKey.trim(),
        }),
      });

      const data = await res.json();
      const aiReply = data.reply || "Savolingiz bo'yicha javob tayyorlandi.";

      setMessages((prev) => [
        ...prev,
        {
          id: 'ai_' + Date.now(),
          sender: 'ai',
          text: aiReply,
          provider: data.provider || 'AI Murabbiy',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai_' + Date.now(),
          sender: 'ai',
          text: "HTML va CSS bo'yicha tushuntirish:\nHTML — sahifaning suyagi (teglar), CSS — tashqi ko'rinishi (ranglar, o'lchamlar), JavaScript — esa saytga jon bag'ishlovchi miyadir. Savolingizni qaytadan yozib ko'ring!",
          provider: 'Mahalliy Murabbiy',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[85vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900">
                  Sun'iy Intellekt Dasturlash Murabbiyi
                </h3>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                  {groqKey ? 'Groq AI Faol' : 'AI O\'qituvchi'}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                HTML, CSS va JS kodingizni tushuntirib beradi va xatolarni tuzatadi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg transition-colors"
              title="Groq API Kalitini sozlash"
            >
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Groq API Key</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Key Drawer (Optional) */}
        {showKeyConfig && (
          <div className="p-4 bg-amber-50/70 border-b border-amber-200/80">
            <form onSubmit={handleSaveKey} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-700" />
                  Groq API Key (ixtiyoriy — o'zingizning kalitingizni ulash uchun):
                </label>
                {groqKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setGroqKey('');
                      localStorage.removeItem('tanishuv_groq_api_key');
                    }}
                    className="text-[11px] text-rose-600 hover:underline"
                  >
                    Kalitni o'chirish
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="gsk_..."
                  className="flex-1 text-xs px-3 py-2 bg-white border border-amber-300 rounded-lg outline-none font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Saqlash
                </button>
              </div>
              <p className="text-[11px] text-amber-800">
                Kalitingiz faqat brauzeringiz xotirasida xavfsiz saqlanadi. Agar kalit kiritilmasa ham tizim server orqali o'zbekcha yordam beradi.
              </p>
            </form>
          </div>
        )}

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-stone-50/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-stone-900 text-white rounded-br-none shadow-xs'
                    : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-black/5">
                  <span className="font-bold text-[11px] opacity-75">
                    {m.sender === 'user' ? 'Siz' : m.provider || 'AI Murabbiy'}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] opacity-60">
                    <span>{m.time}</span>
                    {m.sender === 'ai' && (
                      <button
                        onClick={() => handleCopy(m.text, m.id)}
                        className="hover:opacity-100 p-0.5"
                        title="Nusxalash"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-stone-800 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-stone-500 text-xs py-2">
              <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
              <span>AI javob tayyorlamoqda...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Questions */}
        <div className="px-4 py-2 bg-white border-t border-stone-100 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-stone-400 font-bold uppercase shrink-0">Savollar:</span>
          <button
            onClick={() => handleSend(undefined, "HTML da rasm va havola (link) qo'yish qanday yoziladi?")}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg whitespace-nowrap transition-colors"
          >
            HTML teglari
          </button>
          <button
            onClick={() => handleSend(undefined, "CSS Flexbox bilan elementni qanday o'rtaga qo'yaman?")}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg whitespace-nowrap transition-colors"
          >
            Flexbox markazlash
          </button>
          <button
            onClick={() => handleSend(undefined, "Python va Djangoda veb-sayt qanday yaratiladi?")}
            className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-lg whitespace-nowrap transition-colors border border-sky-200"
          >
            Python & Django
          </button>
          <button
            onClick={() => handleSend(undefined, "SCSS va Bootstrap 5 qanday afzalliklarga ega?")}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg whitespace-nowrap transition-colors border border-amber-200"
          >
            SCSS & Bootstrap
          </button>
          <button
            onClick={() => handleSend(undefined, "JavaScriptda tugma bosilishini qanday yozaman?")}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg whitespace-nowrap transition-colors"
          >
            JS Hodisalar
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-200">
          <form onSubmit={(e) => handleSend(e)} className="flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="HTML, CSS yoki JS bo'yicha savolingizni yozing..."
              className="flex-1 text-xs sm:text-sm px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:bg-white focus:border-rose-400 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || loading}
              className="p-3 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
