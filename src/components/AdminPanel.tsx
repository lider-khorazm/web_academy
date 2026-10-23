import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Plus,
  Users,
  FolderGit2,
  Award,
  Sparkles,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { StudentProject, Contributor } from '../data/showcaseData';
import { StudentAccount } from '../data/learningCurriculum';

interface AdminPanelProps {
  projects: StudentProject[];
  onApproveProject: (id: string) => void;
  onRejectProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onAddProject: (newProject: StudentProject) => void;
  students: StudentAccount[];
  contributors: Contributor[];
  onClose: () => void;
}

export function AdminPanel({
  projects,
  onApproveProject,
  onRejectProject,
  onDeleteProject,
  onAddProject,
  students,
  contributors,
  onClose,
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'moderation' | 'students' | 'contributors'>('moderation');
  const [previewSnippet, setPreviewSnippet] = useState<string | null>(null);

  // New project modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newCategory, setNewCategory] = useState<'HTML & CSS' | 'Portfolio Vizitka' | 'Tanishuv Kartasi' | 'Interaktiv JS'>('Portfolio Vizitka');
  const [newDesc, setNewDesc] = useState('');
  const [newSnippet, setNewSnippet] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'legend_o1' && password.trim() === 'lord_o1') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Login yoki parol noto\'g\'ri! Qaytadan urinib ko\'ring.');
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newStudentName.trim()) return;

    const project: StudentProject = {
      id: 'proj_' + Date.now(),
      studentName: newStudentName.trim(),
      studentEmail: `${newStudentName.toLowerCase().replace(/\s+/g, '')}@student.uz`,
      studentCity: newCity.trim() || 'Toshkent',
      title: newTitle.trim(),
      description: newDesc.trim() || 'Akademiyada yaratilgan portfolio ishi.',
      category: newCategory,
      htmlPreviewSnippet: newSnippet.trim() || `<div style="padding:16px; background:#f5f5f4; border-radius:12px;"><h3>${newTitle}</h3><p>Muallif: ${newStudentName}</p></div>`,
      status: 'approved',
      submittedAt: 'Bugun',
      likes: 1,
      featured: true,
    };

    onAddProject(project);
    setShowAddModal(false);
    setNewTitle('');
    setNewStudentName('');
    setNewCity('');
    setNewDesc('');
    setNewSnippet('');
  };

  const pendingProjects = projects.filter((p) => p.status === 'pending');
  const approvedProjects = projects.filter((p) => p.status === 'approved');

  // If not logged in, show login card
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200">
          <div className="text-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              Admin Boshqaruv Paneli
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Akademiya ma'muriyati uchun yopiq tizim
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Foydalanuvchi logini
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Loginni kiriting..."
                  className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400 focus:bg-white"
                />
                <User className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Maxfiy parol
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parolni kiriting..."
                  className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-rose-400 focus:bg-white"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
              </div>
            </div>

            {errorMsg && (
              <p className="text-[11px] text-rose-600 bg-rose-50 p-2 rounded-lg flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-xl"
              >
                Yopish
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Kirish
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900">
                  Akademiya Boshqaruv Markazi
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Bosh administrator
                </span>
              </div>
              <p className="text-xs text-stone-500">
                O'quvchilar ishlari, moderatsiya va platforma faoliyati
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yangi loyiha joylash</span>
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors"
              title="Chiqish"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-stone-200 text-stone-700 hover:bg-stone-300 text-xs font-semibold rounded-lg"
            >
              Yopish
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex border-b border-stone-200 px-5 bg-white gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`py-3 border-b-2 transition-colors relative flex items-center gap-1.5 ${
              activeTab === 'moderation'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Loyihalar Moderatsiyasi</span>
            {pendingProjects.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold">
                {pendingProjects.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'students'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Akademiya O'quvchilari ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contributors')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'contributors'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Sayt Yaratuvchilari ({contributors.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: MODERATION */}
          {activeTab === 'moderation' && (
            <div className="space-y-6">
              {/* Pending projects review */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-3 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  Kutilayotgan Portfoliolar ({pendingProjects.length})
                </h4>

                {pendingProjects.length === 0 ? (
                  <p className="text-xs text-stone-500 italic bg-stone-50 p-4 rounded-xl border border-stone-100">
                    Hozirda tasdiqlashni kutayotgan yangi ishlar yo'q. Barcha portfoliolar ko'rib chiqilgan.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pendingProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className="bg-rose-50/50 border border-rose-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-stone-900">
                              {proj.title}
                            </span>
                            <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-medium">
                              {proj.category}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600">{proj.description}</p>
                          <div className="text-[11px] text-stone-500">
                            Muallif: <strong className="text-stone-800">{proj.studentName}</strong> ({proj.studentCity}) · {proj.submittedAt}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setPreviewSnippet(proj.htmlPreviewSnippet)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-lg"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ko'rish</span>
                          </button>
                          <button
                            onClick={() => onApproveProject(proj.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Joylash (Tasdiqlash)</span>
                          </button>
                          <button
                            onClick={() => onRejectProject(proj.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100"
                            title="Rad etish"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Published projects list */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Tasdiqlangan va Ko'rsatilayotgan Portfoliolar ({approvedProjects.length})
                </h4>

                <div className="space-y-2.5">
                  {approvedProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="bg-stone-50 border border-stone-200 p-3.5 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-stone-900 mr-2">{proj.title}</span>
                        <span className="text-stone-500">by {proj.studentName} ({proj.studentCity})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPreviewSnippet(proj.htmlPreviewSnippet)}
                          className="text-stone-600 hover:text-stone-900 font-medium px-2 py-1"
                        >
                          Kod / Demo
                        </button>
                        <button
                          onClick={() => onDeleteProject(proj.id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDENTS DIRECTORY */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Akademiya O'quvchilari Ro'yxati
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {students.map((student, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-sm">
                        {student.name}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {student.currentStage} bosqich
                      </span>
                    </div>
                    <p className="text-stone-500">{student.email}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-600 pt-1 border-t border-stone-200/60">
                      <span>Yakunlangan: {student.completedStages.join(', ') || 'Hali yo\'q'}</span>
                      <span className="text-stone-300">·</span>
                      <span>{student.registeredAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CONTRIBUTORS */}
          {activeTab === 'contributors' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Saytni Yasashda Qatnashganlar
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {contributors.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 bg-white rounded-xl border border-stone-200 text-center space-y-2"
                  >
                    <img
                      src={c.avatarUrl}
                      alt={c.name}
                      className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-stone-100 shadow-xs"
                    />
                    <div>
                      <h5 className="font-bold text-stone-900 text-sm">{c.name}</h5>
                      <p className="text-[11px] text-rose-600 font-medium">{c.role}</p>
                      <p className="text-[11px] text-stone-500">{c.city}</p>
                    </div>
                    <p className="text-xs text-stone-600 text-left pt-2 border-t border-stone-100 leading-relaxed">
                      {c.contribution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SNIPPET PREVIEW MODAL */}
      {previewSnippet && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-stone-900">
                Loyiha Interaktiv Ko'rinishi (HTML Snippet)
              </h4>
              <button
                onClick={() => setPreviewSnippet(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div
              className="p-4 border border-stone-200 rounded-xl bg-stone-50"
              dangerouslySetInnerHTML={{ __html: previewSnippet }}
            />

            <pre className="p-3 bg-stone-900 text-stone-100 rounded-xl text-xs font-mono max-h-36 overflow-auto">
              {previewSnippet}
            </pre>

            <button
              onClick={() => setPreviewSnippet(null)}
              className="w-full py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold"
            >
              Yopish
            </button>
          </div>
        </div>
      )}

      {/* CREATE NEW PROJECT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h4 className="text-sm font-bold text-stone-900">
                Yangi O'quvchi Portfoliosini Joylash
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Loyiha sarlavhasi
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Masalan: Kitobxon Shaxsiy Portfoliosi"
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    O'quvchi ismi
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="Olimjon"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Shahar
                  </label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Toshkent"
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Kategoriya
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
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
                  Tavsif
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Loyiha haqida qisqacha ma'lumot..."
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  HTML kod (Snippet)
                </label>
                <textarea
                  rows={3}
                  value={newSnippet}
                  onChange={(e) => setNewSnippet(e.target.value)}
                  placeholder="<div>...</div>"
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg outline-none font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 rounded-lg"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg"
                >
                  Tasdiqlab joylash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
