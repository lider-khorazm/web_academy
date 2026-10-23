import React, { useState } from 'react';
import {
  Code2,
  Layers,
  Server,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Terminal,
  Cpu
} from 'lucide-react';
import { WEB_TECHNOLOGIES, TechLanguage } from '../data/webTechnologies';

export function WebTechnologiesMap() {
  const [selectedTechId, setSelectedTechId] = useState<string>('python');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<'All' | 'Frontend' | 'CSS Freymvork / Preprotsessor' | 'Backend Server'>('All');

  const selectedTech = WEB_TECHNOLOGIES.find((t) => t.id === selectedTechId) || WEB_TECHNOLOGIES[0];

  const filteredList = WEB_TECHNOLOGIES.filter((t) => {
    if (filterCategory === 'All') return true;
    return t.category === filterCategory;
  });

  const handleCopy = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              Sayt Yaratish Tillari & Freymvorklari
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Veb-Sayt Qaysi Tillarda Yasaladi?
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            HTML, CSS, SCSS, Bootstrap, JavaScript, Python (Django/Flask), PHP va Node.js haqida to'liq tushuncha
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center gap-1 bg-stone-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
          {(['All', 'Frontend', 'CSS Freymvork / Preprotsessor', 'Backend Server'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterCategory === cat
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat === 'All' ? 'Barcha Tillari' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Special Highlights: Python Web & Bootstrap/SCSS Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Python Card */}
        <div className="p-5 bg-gradient-to-br from-sky-50 via-indigo-50/40 to-white rounded-2xl border border-sky-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded">
              Backend Server
            </span>
            <span className="text-xs font-mono text-sky-700 font-bold">Python (Flask / Django)</span>
          </div>
          <h3 className="text-base font-bold text-stone-900">
            Pythonda Sayt Yasash Qanday Bo'ladi?
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Python orqali saytning <strong>orqa tomoni (Backend)</strong> yaratiladi. Foydalanuvchi ma'lumotlarini bazada saqlash, xavfsiz autentifikatsiya, to'lovlar va sun'iy intellekt integratsiyasi aynan Python orqali juda oson amalga oshiriladi.
          </p>
          <div className="flex gap-2 pt-1">
            <a
              href="https://translate.google.com/translate?sl=en&tl=uz&u=https://www.w3schools.com/python/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              <span>W3Schools Python Darsi (O'zbekcha)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* SCSS & Bootstrap Card */}
        <div className="p-5 bg-gradient-to-br from-pink-50 via-purple-50/40 to-white rounded-2xl border border-purple-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded">
              Dizayn Freymvorklari
            </span>
            <span className="text-xs font-mono text-purple-700 font-bold">SCSS & Bootstrap 5</span>
          </div>
          <h3 className="text-base font-bold text-stone-900">
            SCSS va Bootstrap Nega Kerak?
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            <strong>Bootstrap</strong> — tayyor responsive grid va tugmalar, modallar beradi. <strong>SCSS</strong> esa CSS ga o'zgaruvchilar, nesting va funksiyalar qo'shib, sayt dizaynini professional va ixcham boshqarish imkoniyatini taqdim etadi.
          </p>
          <div className="flex gap-2 pt-1">
            <a
              href="https://translate.google.com/translate?sl=en&tl=uz&u=https://www.w3schools.com/bootstrap5/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              <span>W3Schools Bootstrap 5</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://translate.google.com/translate?sl=en&tl=uz&u=https://www.w3schools.com/sass/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              <span>W3Schools SCSS / Sass</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Interactive Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Languages List */}
        <div className="lg:col-span-5 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1">
            Veb Tillari & Texnologiyalari:
          </span>

          <div className="space-y-2">
            {filteredList.map((t) => {
              const isSelected = selectedTechId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTechId(t.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-white border-stone-900 shadow-sm ring-1 ring-stone-900'
                      : 'bg-white/80 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ background: t.color }}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{t.name}</h4>
                      <p className="text-[11px] text-stone-500">{t.badge}</p>
                    </div>
                  </div>

                  <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono">
                    {t.category.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Language Deep-Dive */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-stone-900">{selectedTech.name}</h3>
                <span
                  className="text-[10px] font-bold text-white px-2 py-0.5 rounded"
                  style={{ background: selectedTech.color }}
                >
                  {selectedTech.badge}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">{selectedTech.category}</p>
            </div>

            <a
              href={selectedTech.w3schoolsUzbekUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              <span>W3Schools da o'rganish</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              Saytdagi O'rni va Vazifasi:
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
              {selectedTech.roleInWebsite}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              Qisqacha Ta'rif:
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {selectedTech.summary}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              Asosiy Afzalliklari:
            </h4>
            <div className="space-y-1.5">
              {selectedTech.advantages.map((adv, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-stone-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{adv}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Code Snippet */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Namunaviy Kod ({selectedTech.name}):
              </span>
              <button
                onClick={() => handleCopy(selectedTech.codeSnippet, selectedTech.id)}
                className="text-[11px] font-semibold text-stone-600 hover:text-stone-900 inline-flex items-center gap-1"
              >
                {copiedId === selectedTech.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Nusxalandi</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Nusxalash</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 bg-stone-950 text-stone-100 rounded-xl text-xs font-mono overflow-x-auto border border-stone-800">
              <code>{selectedTech.codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
