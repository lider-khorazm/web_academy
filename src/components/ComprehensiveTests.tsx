import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Sparkles,
  FileCheck2,
  Printer,
  Download,
  FileDown
} from 'lucide-react';
import { StudentAccount } from '../data/learningCurriculum';
import { generateCertificatePdf } from '../utils/pdfCertificate';

interface ExamQuestion {
  question: string;
  category: 'HTML' | 'CSS & SCSS' | 'Bootstrap' | 'JavaScript' | 'Python Web';
  options: string[];
  correctIndex: number;
  explanation: string;
}

const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    category: 'HTML',
    question: "HTML5 da asosiy sayt kontentini o'rab turuvchi semantik teg qaysi?",
    options: ['<main>', '<content>', '<section-body>', '<article-all>'],
    correctIndex: 0,
    explanation: '<main> tegi sahifaning asosiy va noyob mazmunini o\'rab turadi.',
  },
  {
    category: 'HTML',
    question: "Ro'yxat elementini belgilash uchun qaysi teg ishlatiladi?",
    options: ['<li>', '<list>', '<item>', '<ul>'],
    correctIndex: 0,
    explanation: '<li> (list item) tegi <ul> yoki <ol> ichida har bir bandni ifodalaydi.',
  },
  {
    category: 'CSS & SCSS',
    question: "CSS da elementni sahifaning mutlaq markaziga qo'yishning eng qulay usuli qaysi?",
    options: [
      'display: flex; justify-content: center; align-items: center;',
      'text-align: middle; float: center;',
      'position: center; margin: auto;',
      'padding: center; display: block;',
    ],
    correctIndex: 0,
    explanation: 'display: flex bilan justify-content: center va align-items: center elementni mukammal markazlaydi.',
  },
  {
    category: 'CSS & SCSS',
    question: "SCSS da o'zgaruvchilar (variables) qaysi belgi bilan e'lon qilinadi?",
    options: ['$ belgisi bilan (masalan: $primary-color)', '@ belgisi bilan', '# belgisi bilan', 'var: so\'zi bilan'],
    correctIndex: 0,
    explanation: 'SCSS (Sass) da o\'zgaruvchilar dollar ($) belgisi orqali e\'lon qilinadi (masalan: $primary: #e11d48).',
  },
  {
    category: 'Bootstrap',
    question: "Bootstrap 5 da 12 ustunli tizimda to'liq qatorni egallovchi klass qaysi?",
    options: ['col-12', 'col-full', 'row-100', 'grid-12'],
    correctIndex: 0,
    explanation: 'Bootstrap 5 da col-12 butun 12 ustunni (100% kenglikni) to\'liq qoplaydi.',
  },
  {
    category: 'JavaScript',
    question: "JavaScriptda massiv (array) uzunligini qaysi xususiyat orqali bilish mumkin?",
    options: ['.length', '.count()', '.size', '.elements'],
    correctIndex: 0,
    explanation: 'Array.length massivdagi elementlar umumiy sonini qaytaradi.',
  },
  {
    category: 'JavaScript',
    question: "Brauzer konsoliga xabar chiqarish buyrug'i qaysi?",
    options: ['console.log()', 'print.text()', 'window.output()', 'browser.log()'],
    correctIndex: 0,
    explanation: 'console.log() ishlab chiquvchi uchun konsolga xabar chiqarishning asosiy vositasidir.',
  },
  {
    category: 'Python Web',
    question: "Pythonda veb-sayt orqa tomoni (Backend) yaratishda eng ko'p ishlatiladigan freymvorklar qaysilar?",
    options: ['Django va Flask', 'React va Angular', 'Bootstrap va Sass', 'HTML va CSS'],
    correctIndex: 0,
    explanation: 'Django va Flask — Python tilida saytlar va API yaratishda jahondagi eng mashhur freymvorklardir.',
  },
];

interface ComprehensiveTestsProps {
  studentAccount: StudentAccount | null;
  onOpenRegister: () => void;
}

export function ComprehensiveTests({
  studentAccount,
  onOpenRegister,
}: ComprehensiveTestsProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [pdfDownloaded, setPdfDownloaded] = useState<boolean>(false);

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  let correctCount = 0;
  if (submitted) {
    EXAM_QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });
  }

  const scorePercentage = Math.round((correctCount / EXAM_QUESTIONS.length) * 100);
  const isPassed = submitted && scorePercentage >= 70;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length < EXAM_QUESTIONS.length) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setShowCertificate(false);
    setPdfDownloaded(false);
  };

  const handleDownloadPdf = () => {
    generateCertificatePdf({
      studentName: studentAccount?.name || 'Talaba Olimjon',
      courseTitle: "HTML/CSS/JS Asoslari kursi bitiruvchisi",
      completionDate: new Date().toLocaleDateString('uz-UZ'),
      scorePercentage: scorePercentage,
      certificateId: 'CERT-UZ-' + Math.floor(100000 + Math.random() * 900000),
      instructorName: 'legend_o1 (Olimjon)',
    });
    setPdfDownloaded(true);
    setTimeout(() => setPdfDownloaded(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <FileCheck2 className="w-3.5 h-3.5" />
              Keng Qamrovli Yakuniy Imtihon
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            HTML, CSS, SCSS, Bootstrap, JS & Python Testi
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Barcha savollarga to'g'ri javob bering va rasmiy **PDF formatdagi 'HTML/CSS/JS Asoslari' sertifikatini** yuklab oling!
          </p>
        </div>

        {isPassed && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>PDF Sertifikatni Yuklab Olish</span>
            </button>
            <button
              onClick={() => setShowCertificate(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>Ko'rish</span>
            </button>
          </div>
        )}
      </div>

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {EXAM_QUESTIONS.map((q, qIdx) => {
          const userChoice = answers[qIdx];

          return (
            <div
              key={qIdx}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded">
                  {q.category} · Savol {qIdx + 1}
                </span>
                {submitted && (
                  <span className="text-xs font-bold">
                    {userChoice === q.correctIndex ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> To'g'ri
                      </span>
                    ) : (
                      <span className="text-rose-600 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Xato
                      </span>
                    )}
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-stone-900 leading-snug">
                {q.question}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userChoice === optIdx;
                  let optClass = 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-700';

                  if (submitted) {
                    if (optIdx === q.correctIndex) {
                      optClass = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold';
                    } else if (isSelected) {
                      optClass = 'bg-rose-50 border-rose-300 text-rose-800 line-through';
                    }
                  } else if (isSelected) {
                    optClass = 'bg-stone-900 border-stone-900 text-white font-semibold';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`text-left p-3 rounded-xl border text-xs transition-all ${optClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <p className="text-[11px] text-stone-500 pt-2 border-t border-stone-100 italic">
                  💡 {q.explanation}
                </p>
              )}
            </div>
          );
        })}

        {/* Submit Bar */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {!submitted ? (
              <span className="text-xs text-stone-500">
                Belgilangan: {Object.keys(answers).length} / {EXAM_QUESTIONS.length} savol
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-stone-900">
                  Natijangiz: {scorePercentage}% ({correctCount}/{EXAM_QUESTIONS.length})
                </span>
                {isPassed ? (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    A'lo! Sertifikat ochildi
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                    70% to'planmadi, qayta urinib ko'ring
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!submitted ? (
              <button
                type="submit"
                disabled={Object.keys(answers).length < EXAM_QUESTIONS.length}
                className="w-full sm:w-auto px-6 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Imtihonni topshirish
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl"
                >
                  Qaytadan topshirish
                </button>
                {isPassed && (
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF Yuklab Olish</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </form>

      {/* PDF Downloaded Toast */}
      {pdfDownloaded && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Sertifikat PDF formati muvaffaqiyatli yuklab olindi!</span>
        </div>
      )}

      {/* CERTIFICATE MODAL */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-[#fbf9f5] rounded-3xl max-w-2xl w-full p-8 shadow-2xl border-4 border-amber-300 relative overflow-hidden text-center space-y-6">
            {/* Top Ornamental Ribbon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-700 font-bold block mb-1">
                Tanishuv.uz & Web Dasturlash Akademiyasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
                Bitiruvchi Sertifikati
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                'HTML/CSS/JS Asoslari' kursi muvaffaqiyatli tamomlangani to'g'risida
              </p>
            </div>

            <div className="py-4 border-y border-stone-200/80 space-y-2">
              <span className="text-xs text-stone-400 uppercase tracking-wider block">
                Taqdim etiladi:
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-rose-600">
                {studentAccount?.name || 'Talaba Olimjon'}
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Web dasturlashning barcha nazariy va amaliy bosqichlarini (HTML5, CSS3, SCSS, Bootstrap, JavaScript va Python asoslari) to'liq o'zlashtirib, {scorePercentage}% natija bilan imtihondan o'tgani munosabati bilan.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-400 px-6 font-mono">
              <div>
                <span>Sana: </span>
                <strong className="text-stone-700">{new Date().toLocaleDateString('uz-UZ')}</strong>
              </div>
              <div>
                <span>Bosh Murabbiy: </span>
                <strong className="text-stone-700">@legend_o1</strong>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>PDF Formatda Yuklab Olish</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Chop etish</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl"
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
