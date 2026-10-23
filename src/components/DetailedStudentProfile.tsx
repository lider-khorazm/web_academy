import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  FileCheck2,
  GraduationCap,
  Download,
  ExternalLink,
  ShieldCheck,
  User,
  Zap,
  Tag,
  RefreshCw,
  Eye,
  Check
} from 'lucide-react';
import { StudentAccount } from '../data/learningCurriculum';

interface DetailedStudentProfileProps {
  isOpen: boolean;
  onClose: () => void;
  studentAccount: StudentAccount | null;
  onUpdateAccount: (updated: StudentAccount) => void;
  onNavigateToTests?: () => void;
  onOpenRegister?: () => void;
}

const PRESET_SUGGESTED_SKILLS = [
  'HTML5',
  'CSS3',
  'JavaScript (ES6+)',
  'Flexbox & Grid',
  'Responsive Dizayn',
  'DOM Manipulyatsiyasi',
  'Tailwind CSS',
  'Bootstrap 5',
  'SCSS',
  'Python Asoslari',
  'Git & GitHub',
  'Asinxron JS',
  'Veb Xavfsizlik',
  'SQL / Ma\'lumotlar Bazasi'
];

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
];

export function DetailedStudentProfile({
  isOpen,
  onClose,
  studentAccount,
  onUpdateAccount,
  onNavigateToTests,
  onOpenRegister,
}: DetailedStudentProfileProps) {
  // If not registered yet, display a guest fallback state with option to register
  const currentName = studentAccount?.name || 'Mehmon O\'quvchi';
  const currentEmail = studentAccount?.email || 'mehmon@student.uz';

  // Form states
  const [name, setName] = useState(currentName);
  const [city, setCity] = useState(studentAccount?.city || 'Toshkent');
  const [bio, setBio] = useState(
    studentAccount?.bio ||
      'HTML, CSS va JavaScript bo\'yicha amaliy veb dasturlashni chuqur o\'rganmoqdaman.'
  );
  const [avatar, setAvatar] = useState<string>(
    studentAccount?.avatar ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  );

  // Skill tags state
  const [skills, setSkills] = useState<string[]>(
    studentAccount?.skills && studentAccount.skills.length > 0
      ? studentAccount.skills
      : ['HTML5', 'CSS3', 'JavaScript', 'Responsive Dizayn']
  );
  const [newSkillInput, setNewSkillInput] = useState('');

  // Camera states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Notification feedback
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Stop camera when modal closes or unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Start live webcam
  const handleStartCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kamera qurilmangizda qo\'llab-quvvatlanmadi.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 480 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;
      setIsCameraActive(true);

      // Short delay to attach to video ref
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        'Kameraga ruxsat berilmadi yoki kamera band. Iltimos brauzer ruxsatini tekshiring yoki fayl yuklashdan foydalaning.'
      );
      stopCamera();
    }
  };

  // Capture frame from camera
  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = 320;
    canvas.height = 320;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw square crop from center
      const minDim = Math.min(video.videoWidth, video.videoHeight);
      const startX = (video.videoWidth - minDim) / 2;
      const startY = (video.videoHeight - minDim) / 2;

      ctx.drawImage(video, startX, startY, minDim, minDim, 0, 0, 320, 320);
      const capturedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setAvatar(capturedDataUrl);
    }

    stopCamera();
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setAvatar(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Add skill tag
  const handleAddSkill = (skillToAdd?: string) => {
    const targetSkill = (skillToAdd || newSkillInput).trim();
    if (!targetSkill) return;

    if (!skills.some((s) => s.toLowerCase() === targetSkill.toLowerCase())) {
      setSkills([...skills, targetSkill]);
    }
    if (!skillToAdd) {
      setNewSkillInput('');
    }
  };

  // Remove skill tag
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Save profile changes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const baseAccount: StudentAccount = studentAccount || {
      name,
      email: currentEmail,
      registeredAt: new Date().toLocaleDateString('uz-UZ'),
      currentStage: 'html',
      completedStages: ['html'],
      quizPassed: { html: true, css: false, js: false },
      xp: 150,
      gamesCompleted: 5,
    };

    const updated: StudentAccount = {
      ...baseAccount,
      name,
      city,
      bio,
      avatar,
      skills,
    };

    onUpdateAccount(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  // Certificate progress calculations
  const quizPassed = studentAccount?.quizPassed || { html: true, css: false, js: false };
  const passedCount = (quizPassed.html ? 1 : 0) + (quizPassed.css ? 1 : 0) + (quizPassed.js ? 1 : 0);
  const certPercentage = Math.round((passedCount / 3) * 100);
  const isCertified = certPercentage === 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 to-indigo-950 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>O'quvchi Kengaytirilgan Profili</span>
                <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                  Boshqaruv
                </span>
              </h3>
              <p className="text-xs text-stone-300">
                Kamera orqali rasm yuklash, ko'nikmalar (skill tags) va sertifikat progressi
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Guest Registration Banner if not logged in */}
          {!studentAccount && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Siz mehmon rejimidasiz. Profilingizni rasmiy ro'yxatdan o'tkazib barcha yutuqlaringizni saqlang.
                </span>
              </div>
              {onOpenRegister && (
                <button
                  onClick={onOpenRegister}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl whitespace-nowrap shadow-xs cursor-pointer"
                >
                  Ro'yxatdan o'tish
                </button>
              )}
            </div>
          )}

          {/* SECTION 1: PROFILE PICTURE WITH LIVE CAMERA & UPLOAD */}
          <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-rose-500" />
                <span>1. Profil Rasmi (Kamera & Fayl)</span>
              </h4>
              <span className="text-[11px] text-stone-500">Jonli veb-kamera qo'llab-quvvatlanadi</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Avatar Preview or Live Video Frame */}
              <div className="relative shrink-0">
                {isCameraActive ? (
                  <div className="relative w-36 h-36 rounded-2xl overflow-hidden border-3 border-rose-500 shadow-lg bg-black">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover mirror"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    <div className="absolute inset-0 border border-white/30 rounded-2xl pointer-events-none" />
                  </div>
                ) : (
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-stone-200 shadow-md bg-white">
                    <img
                      src={avatar}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 p-1 bg-stone-900/80 rounded-lg text-white">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}

                {/* Hidden canvas for taking snapshot */}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Action Buttons & Presets */}
              <div className="flex-1 space-y-3 text-center sm:text-left">
                {isCameraActive ? (
                  <div className="space-y-2">
                    <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 justify-center sm:justify-start">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                      Kamera faol. Yuzingizni to'g'rilab suratga oling.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={handleCapturePhoto}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Suratga Tushirish</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold rounded-xl cursor-pointer"
                      >
                        Bekor qilish
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      {/* Live Camera Button */}
                      <button
                        type="button"
                        onClick={handleStartCamera}
                        className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-rose-400" />
                        <span>Kamerani Yoqish</span>
                      </button>

                      {/* File Upload Button */}
                      <label className="px-3.5 py-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Fayl Yuklash</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Quick Avatar Presets */}
                    <div className="pt-1">
                      <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block mb-1">
                        Yoki tayyor avatarlardan birini tanlang:
                      </span>
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        {DEFAULT_AVATARS.map((avUrl, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setAvatar(avUrl)}
                            className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform cursor-pointer ${
                              avatar === avUrl ? 'scale-115 border-rose-500 shadow-xs' : 'border-stone-200'
                            }`}
                          >
                            <img src={avUrl} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {cameraError && (
                  <p className="text-[11px] text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200">
                    {cameraError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: SKILL TAGS MANAGEMENT */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-indigo-500" />
                  <span>2. Dasturlash Ko'nikmalari (Skill Tags)</span>
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Profilingiz va portfoliongizda ko'rinadigan texnologiyalar
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                {skills.length} ta ko'nikma
              </span>
            </div>

            {/* Current Skills Tags List */}
            <div className="flex flex-wrap gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-200/80 min-h-[50px] items-center">
              {skills.length === 0 ? (
                <span className="text-xs text-stone-400 italic">Hali ko'nikmalar qo'shilmagan</span>
              ) : (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-stone-200 text-stone-800 rounded-xl text-xs font-semibold shadow-2xs group hover:border-rose-300 transition-colors"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="O'chirish"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Add Custom Skill Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Yangi ko'nikma yozing (masalan: TypeScript, React)..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 text-xs px-3.5 py-2.5 border border-stone-200 rounded-xl outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleAddSkill()}
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Qo'shish</span>
              </button>
            </div>

            {/* Suggested Popular Skills */}
            <div className="pt-2">
              <span className="text-[11px] text-stone-400 font-semibold block mb-1.5">
                Tezkor tavsiya etiladigan ko'nikmalar (bir marta bosing):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAddSkill(preset)}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-indigo-50 hover:text-indigo-700 text-stone-600 rounded-lg text-[11px] font-medium border border-transparent hover:border-indigo-200 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    <span>{preset}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3: CERTIFICATION PROGRESS CLEAR DISPLAY */}
          <div className="bg-gradient-to-br from-stone-900 to-indigo-950 text-white rounded-2xl p-5 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>3. Rasmiy Sertifikat Holati & Bosqichlar</span>
                </h4>
                <p className="text-[11px] text-stone-300 mt-0.5">
                  HTML/CSS/JS Asoslari sertifikatiga erishish progressi
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  {certPercentage}% Bajarildi
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 via-rose-500 to-emerald-400 h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${certPercentage}%` }}
              />
            </div>

            {/* 3 Curriculum Stages Visual Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Stage 1: HTML */}
              <div
                className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                  quizPassed.html
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-white/5 border-white/10 text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>1. HTML Asoslari</span>
                  {quizPassed.html ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-stone-400" />
                  )}
                </div>
                <div className="text-[11px] text-stone-400">
                  Imtihon: {quizPassed.html ? '✓ 100% Topshirildi' : 'Kutilmoqda'}
                </div>
              </div>

              {/* Stage 2: CSS */}
              <div
                className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                  quizPassed.css
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-white/5 border-white/10 text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>2. CSS Bezatish</span>
                  {quizPassed.css ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-stone-400" />
                  )}
                </div>
                <div className="text-[11px] text-stone-400">
                  Imtihon: {quizPassed.css ? '✓ 100% Topshirildi' : 'Kutilmoqda'}
                </div>
              </div>

              {/* Stage 3: JS */}
              <div
                className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                  quizPassed.js
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-white/5 border-white/10 text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>3. JavaScript Mantiq</span>
                  {quizPassed.js ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-stone-400" />
                  )}
                </div>
                <div className="text-[11px] text-stone-400">
                  Imtihon: {quizPassed.js ? '✓ 100% Topshirildi' : 'Kutilmoqda'}
                </div>
              </div>
            </div>

            {/* Certification Status Callout */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
              <div className="text-xs">
                {isCertified ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Tabriklaymiz! Barcha testlar topshirilgan — Sertifikat yuklab olishga tayyor.
                  </span>
                ) : (
                  <span className="text-stone-300">
                    Sertifikat olish uchun qolgan {3 - passedCount} ta imtihonni yakunlang.
                  </span>
                )}
              </div>

              {onNavigateToTests && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToTests();
                  }}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>{isCertified ? 'Sertifikatni Ko\'rish (PDF)' : 'Testlarni Topshirish'}</span>
                </button>
              )}
            </div>
          </div>

          {/* SECTION 4: BASIC PROFILE INFO FIELDS */}
          <form onSubmit={handleSave} className="space-y-4">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-stone-700" />
              <span>4. Asosiy Ma'lumotlar</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ism va Familiya
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-stone-200 rounded-xl outline-none focus:border-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Yashash shahri / Viloyat
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-stone-200 rounded-xl outline-none focus:border-stone-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Dasturchi haqida (Bio)
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-xs px-3.5 py-2 border border-stone-200 rounded-xl outline-none focus:border-stone-900"
                required
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
              <div>
                {saveSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    Muvaffaqiyatli saqlandi!
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl"
                >
                  Yopish
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>O'zgarishlarni Saqlash</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
