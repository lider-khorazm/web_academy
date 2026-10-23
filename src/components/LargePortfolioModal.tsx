import React, { useState } from 'react';
import {
  Globe,
  X,
  Mail,
  Send,
  ExternalLink,
  Code2,
  Award,
  CheckCircle2,
  Download,
  Copy,
  Check,
  Sparkles,
  Layers,
  Heart,
  Calendar,
  MapPin,
  Briefcase,
  Share2
} from 'lucide-react';
import { ProfileData, generateStandaloneHtml } from '../utils/htmlGenerator';

interface LargePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  onOpenWebmail: (emailTo: string) => void;
}

export function LargePortfolioModal({
  isOpen,
  onClose,
  profile,
  onOpenWebmail,
}: LargePortfolioModalProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'projects' | 'tech' | 'contact'>('about');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const officialEmail = `${profile.id}@akademiya.uz`;
  const standaloneHtml = generateStandaloneHtml(profile);

  const handleDownload = () => {
    const blob = new Blob([standaloneHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name.toLowerCase().replace(/\s+/g, '_')}_portfolio.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(standaloneHtml);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Skill percentages based on profile
  const skillsMap: Record<string, { name: string; level: number; color: string }[]> = {
    umirbek: [
      { name: 'Python & OOP', level: 95, color: 'bg-sky-500' },
      { name: 'Django & REST Framework', level: 90, color: 'bg-emerald-500' },
      { name: 'PostgreSQL & DB Architecture', level: 88, color: 'bg-indigo-500' },
      { name: 'HTML5 & CSS3 shablonlar', level: 85, color: 'bg-amber-500' },
      { name: 'Git & Linux serverlar', level: 82, color: 'bg-rose-500' },
    ],
    sardor: [
      { name: 'HTML5 Semantik tuzilma', level: 98, color: 'bg-rose-500' },
      { name: 'CSS3 & Flexbox / Grid', level: 95, color: 'bg-sky-500' },
      { name: 'SCSS / SASS Preprosessorlar', level: 92, color: 'bg-pink-500' },
      { name: 'Bootstrap 5 kutubxonasi', level: 94, color: 'bg-purple-500' },
      { name: 'JavaScript ES6+ & DOM', level: 86, color: 'bg-amber-500' },
    ],
    muhriddin: [
      { name: 'JavaScript & Mantiqiy algoritmlar', level: 92, color: 'bg-amber-500' },
      { name: 'UI/UX Dizayn va prototiplash', level: 88, color: 'bg-indigo-500' },
      { name: 'HTML5/CSS3 Responsive dizayn', level: 90, color: 'bg-emerald-500' },
      { name: 'Mobil ilovalar arxitekturasi', level: 84, color: 'bg-sky-500' },
      { name: 'Interaktiv kod o\'yinlari', level: 95, color: 'bg-rose-500' },
    ],
    olimjon: [
      { name: 'To\'liq Full-stack arxitektura', level: 96, color: 'bg-emerald-600' },
      { name: 'Frontend (React & Vite)', level: 94, color: 'bg-sky-500' },
      { name: 'Backend (Node.js & Python)', level: 92, color: 'bg-indigo-500' },
      { name: 'Metodika va ta\'lim dasturi', level: 95, color: 'bg-rose-500' },
      { name: 'Web xavfsizlik va optimizatsiya', level: 90, color: 'bg-amber-500' },
    ],
  };

  const currentSkills = skillsMap[profile.id] || skillsMap.umirbek;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden my-auto">
        {/* Banner with controls */}
        <div className="h-44 bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-600 relative shrink-0">
          <div className="absolute inset-0 bg-black/10" />

          {/* Top buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-stone-900 rounded-xl text-xs font-bold backdrop-blur-md shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-rose-600" />
              <span>HTML yuklab olish</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-stone-900/60 hover:bg-stone-900 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-4 left-6 sm:left-8 text-white">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
              Rasmiy Shaxsiy Portfolio Sayti
            </span>
          </div>
        </div>

        {/* Profile Header Bar */}
        <div className="px-6 sm:px-8 pb-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 relative z-10">
          <div className="flex items-end gap-4">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-xl bg-stone-100"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profile.name
                )}&background=fecdd3&color=be123c&size=160`;
              }}
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  {profile.name}
                </h2>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Tasdiqlangan
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-rose-600">
                {profile.occupation}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {profile.city}
                </span>
                <span>·</span>
                <span className="font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                  {officialEmail}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => {
                onClose();
                onOpenWebmail(officialEmail);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Xat yozish</span>
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Nusxalandi' : 'HTML Kod'}</span>
            </button>
          </div>
        </div>

        {/* Portfolio Tabs */}
        <div className="flex border-b border-stone-200 px-6 sm:px-8 bg-stone-50/60 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            O'zi haqida ma'lumot
          </button>
          <button
            onClick={() => setActiveTab('tech')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'tech'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Texnologiyalar & Ko'nikmalar
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'projects'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            VS Code Loyihalari
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'contact'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Aloqa & Pochta
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* TAB 1: ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">
                  Biografiya & Qarashlar
                </h3>
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed bg-[#faf9f6] p-5 rounded-2xl border border-stone-200/80">
                  {profile.bio}
                </p>
                <div className="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl text-xs sm:text-sm text-rose-900 italic font-medium">
                  "{profile.quote}"
                </div>
              </div>

              {/* Personal Interests */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Qiziqishlar va Yo'nalishlar
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-stone-100 text-stone-800 rounded-xl text-xs font-semibold border border-stone-200/60"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Academy track record */}
              <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-amber-950">
                    Akademiya Mukofoti va Natijasi
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Web Dasturlash Asoslari kursini a'lo baholarga tamomlagan
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECH STACK */}
          {activeTab === 'tech' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-4">
                  Texnik Ko'nikmalar va Tajriba
                </h3>
                <div className="space-y-4">
                  {currentSkills.map((s, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                        <span>{s.name}</span>
                        <span className="font-mono text-stone-500">{s.level}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${s.color}`}
                          style={{ width: `${s.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-600 space-y-1 leading-relaxed">
                <span className="font-bold text-stone-900 block">Qo'shimcha vositalar:</span>
                <p>Visual Studio Code, Git & GitHub, Terminal bash, Responsive Web Design, Chrome DevTools.</p>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-3">
                  VS Code da Yaratilgan Jonli Ishlar
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  Ushbu sahifa mustaqil HTML va CSS orqali tayyorlangan va brauzerda to'liq mustaqil ishlaydi.
                </p>

                {/* Live rendered HTML Preview */}
                <div className="rounded-2xl border border-stone-200 overflow-hidden shadow-xs bg-stone-50">
                  <div className="px-4 py-2 bg-stone-100 border-b border-stone-200 text-xs font-mono text-stone-600 flex items-center justify-between">
                    <span>{profile.name.toLowerCase().replace(/\s+/g, '_')}_tanishuv.html</span>
                    <span className="text-emerald-700 font-bold">200 OK</span>
                  </div>
                  <iframe
                    title={profile.name}
                    srcDoc={standaloneHtml}
                    className="w-full h-72 border-0 bg-white"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Faylni yuklab olish</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">
                Bog'lanish va Xat Almashish
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2">
                  <span className="text-[11px] font-bold uppercase text-sky-800">
                    Rasmiy Akademiya Pochtasi
                  </span>
                  <p className="text-sm font-mono font-bold text-sky-950">
                    {officialEmail}
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenWebmail(officialEmail);
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Xat yozish</span>
                  </button>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <span className="text-[11px] font-bold uppercase text-stone-500">
                    Ijtimoiy Tarmoqlar
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {profile.telegram && (
                      <a
                        href={`https://t.me/${profile.telegram.replace('@', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-600 hover:underline flex items-center gap-1"
                      >
                        Telegram: @{profile.telegram.replace('@', '')}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {profile.instagram && (
                      <a
                        href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-rose-600 hover:underline flex items-center gap-1"
                      >
                        Instagram: @{profile.instagram.replace('@', '')}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
