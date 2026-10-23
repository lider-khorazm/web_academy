import React, { useState } from 'react';
import {
  Award,
  Users,
  Eye,
  Heart,
  Send,
  PlusCircle,
  ExternalLink,
  Code2,
  CheckCircle2,
  X
} from 'lucide-react';
import { Contributor, StudentProject } from '../data/showcaseData';

interface ShowcaseGalleryProps {
  contributors: Contributor[];
  projects: StudentProject[];
  onSubmitProject: (project: StudentProject) => void;
  onLikeProject: (id: string) => void;
}

export function ShowcaseGallery({
  contributors,
  projects,
  onSubmitProject,
  onLikeProject,
}: ShowcaseGalleryProps) {
  const [selectedPreview, setSelectedPreview] = useState<StudentProject | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Submit form state
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentCity, setStudentCity] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'HTML & CSS' | 'Portfolio Vizitka' | 'Tanishuv Kartasi' | 'Interaktiv JS'>('Portfolio Vizitka');
  const [snippet, setSnippet] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const approvedProjects = projects.filter((p) => p.status === 'approved');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setSnippet(content);
        // Try extracting title from <title> tag if user hasn't typed one
        const titleMatch = content.match(/<title>(.*?)<\/title>/i);
        if (titleMatch && titleMatch[1] && !title.trim()) {
          setTitle(titleMatch[1].trim());
        }
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !title.trim()) return;

    const newProject: StudentProject = {
      id: 'sub_' + Date.now(),
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim() || `${studentName.toLowerCase().replace(/\s+/g, '')}@student.uz`,
      studentCity: studentCity.trim() || 'Toshkent',
      title: title.trim(),
      description: description.trim() || 'VS Code da yaratilgan birinchi HTML portfolio ishi.',
      category: category,
      htmlPreviewSnippet: snippet.trim() || `<div style="padding:16px; background:#fafaf9; border:1px solid #e7e5e4; border-radius:12px; font-family:sans-serif;"><h3>${title}</h3><p>Muallif: ${studentName}</p></div>`,
      status: 'pending', // Sent to Admin for review!
      submittedAt: 'Bugun',
      likes: 0,
      featured: false,
    };

    onSubmitProject(newProject);
    setSubmittedFeedback(true);
    setTimeout(() => {
      setSubmittedFeedback(false);
      setShowSubmitModal(false);
      setStudentName('');
      setTitle('');
      setDescription('');
      setSnippet('');
      setUploadedFileName(null);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              Loyiha Ishtirokchilari & Eng Yaxshi Ishlar
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Akademiya Portfoliolar Galereyasi
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Ushbu saytni yaratishda qatnashgan mutaxassislar va o'quvchilarning tasdiqlangan eng yaxshi loyihalari
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>1-ishingizni (portfolio) topshiring</span>
        </button>
      </div>

      {/* SECTION 1: PLATFORM CONTRIBUTORS (Saytni yasashda qatnashganlar) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-500" />
            Saytni Yasashda Qatnashganlar
          </h3>
          <span className="text-xs text-stone-500">3 nafar asosiy muallif</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contributors.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={c.avatarUrl}
                  alt={c.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-stone-100 shadow-xs"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      c.name
                    )}&background=fecdd3&color=be123c&size=128`;
                  }}
                />
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{c.name}</h4>
                  <p className="text-xs font-semibold text-rose-600">{c.role}</p>
                  <p className="text-[11px] text-stone-400">{c.city}</p>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                {c.contribution}
              </p>

              <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-1.5">
                {c.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: APPROVED BEST STUDENT PORTFOLIOS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Eng Yaxshi O'quvchilar Loyihalari
            </h3>
            <p className="text-xs text-stone-500">
              Admin tomonidan ko'rib chiqilgan va yuqori baholangan 1-portfolio ishlari
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            {approvedProjects.length} ta tasdiqlangan ish
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {approvedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      {project.category}
                    </span>
                    <h4 className="font-bold text-stone-900 text-base mt-1.5">
                      {project.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => onLikeProject(project.id)}
                    className="inline-flex items-center gap-1 text-xs text-rose-600 bg-rose-50/60 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span className="tabular-nums font-semibold">{project.likes}</span>
                  </button>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {project.description}
                </p>

                {/* HTML Preview Box */}
                <div className="rounded-xl border border-stone-200 overflow-hidden bg-stone-50 p-3 max-h-32 overflow-y-auto">
                  <div dangerouslySetInnerHTML={{ __html: project.htmlPreviewSnippet }} />
                </div>
              </div>

              <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-stone-900">{project.studentName}</span>
                  <span className="text-stone-400"> · {project.studentCity}</span>
                </div>

                <button
                  onClick={() => setSelectedPreview(project)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 hover:text-rose-600 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Katta ko'rish</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUBMIT 1ST WORK MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  O'z 1-Ishingizni (Portfolio) Topshirish
                </h3>
                <p className="text-xs text-stone-500">
                  Loyiha admin tomonidan ko'rib chiqiladi va saralangan holda umumiy galereyaga joylanadi.
                </p>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedFeedback ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-stone-900">
                  Rahmat! Ishingiz muvaffaqiyatli topshirildi.
                </h4>
                <p className="text-xs text-stone-600">
                  Admin tomonidan ko'rib chiqilgach, eng yaxshi saralangan ishlar qatorida saytga joylanadi.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Ismingiz va familiyangiz *
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Masalan: Sardorbek"
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Shahringiz
                    </label>
                    <input
                      type="text"
                      value={studentCity}
                      onChange={(e) => setStudentCity(e.target.value)}
                      placeholder="Samarqand, Toshkent..."
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-rose-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Loyiha sarlavhasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masalan: Shaxsiy Tanishuv Kartasi"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Kategoriya
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg outline-none bg-white"
                  >
                    <option value="Portfolio Vizitka">Portfolio Vizitka</option>
                    <option value="Tanishuv Kartasi">Tanishuv Kartasi</option>
                    <option value="HTML & CSS">HTML & CSS</option>
                    <option value="Interaktiv JS">Interaktiv JS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Loyiha haqida qisqacha tavsif
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Qanday teglardan foydalandingiz, g'oyangiz nimada..."
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-rose-400"
                  />
                </div>

                {/* VS Code HTML File Upload Area */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-amber-700" />
                      VS Code da tayyorlangan .html faylni yuklash:
                    </span>
                    {uploadedFileName && (
                      <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        ✓ {uploadedFileName}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-amber-800">
                    VS Code da yaratgan kodingizni to'liq .html fayl sifatida yuklashingiz mumkin.
                  </p>
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100/50 rounded-lg text-xs font-semibold text-amber-900 cursor-pointer shadow-xs transition-colors">
                    <span>📁 Kompyuterdan .html fayl tanlash</span>
                    <input
                      type="file"
                      accept=".html,.htm"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    HTML kodingiz (yoki yuqoridagi tugma orqali yuklang) *
                  </label>
                  <textarea
                    rows={4}
                    value={snippet}
                    onChange={(e) => setSnippet(e.target.value)}
                    placeholder="<!DOCTYPE html><html>...</html> yoki <div style='...'>...</div>"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg outline-none font-mono text-xs focus:border-rose-400"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 text-xs font-medium text-stone-600 rounded-lg"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Adminga topshirish</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FULL PREVIEW MODAL */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-bold text-rose-600 uppercase bg-rose-50 px-2 py-0.5 rounded">
                  {selectedPreview.category}
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">
                  {selectedPreview.title}
                </h3>
                <p className="text-xs text-stone-500">
                  Muallif: {selectedPreview.studentName} ({selectedPreview.studentCity})
                </p>
              </div>
              <button
                onClick={() => setSelectedPreview(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live rendered HTML preview inside sandbox iframe */}
            <div className="rounded-xl border border-stone-200 bg-stone-50 shadow-inner overflow-hidden">
              <div className="bg-stone-100 px-3 py-1.5 border-b border-stone-200 text-[11px] font-mono text-stone-500 flex items-center justify-between">
                <span>Jonli Interaktiv Natija (VS Code HTML Renderer)</span>
              </div>
              <iframe
                title={selectedPreview.title}
                srcDoc={selectedPreview.htmlPreviewSnippet}
                className="w-full h-56 border-0 bg-white"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>

            {/* Code */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Yozilgan HTML Kod:
              </span>
              <pre className="p-3 bg-stone-900 text-stone-100 rounded-xl text-xs font-mono max-h-36 overflow-y-auto">
                <code>{selectedPreview.htmlPreviewSnippet}</code>
              </pre>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  const blob = new Blob([selectedPreview.htmlPreviewSnippet], { type: 'text/html;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${selectedPreview.title.toLowerCase().replace(/\s+/g, '_')}.html`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Ushbu .html faylni yuklab olish
              </button>
              <button
                onClick={() => setSelectedPreview(null)}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
