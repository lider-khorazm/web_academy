import React, { useState } from 'react';
import {
  GraduationCap,
  ExternalLink,
  CheckCircle2,
  Lock,
  ArrowRight,
  Code2,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Award,
  ChevronRight,
  RotateCcw,
  UserCheck
} from 'lucide-react';
import {
  LEARNING_STAGES,
  LearningStage,
  StudentAccount
} from '../data/learningCurriculum';

interface LearningHubProps {
  studentAccount: StudentAccount | null;
  onOpenRegister: () => void;
  onUpdateAccount: (updated: StudentAccount) => void;
  onBackToProfile: () => void;
}

export function LearningHub({
  studentAccount,
  onOpenRegister,
  onUpdateAccount,
  onBackToProfile,
}: LearningHubProps) {
  const [activeStageId, setActiveStageId] = useState<'html' | 'css' | 'js'>(
    studentAccount?.currentStage || 'html'
  );

  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const currentStage: LearningStage = LEARNING_STAGES[activeStageId];

  // Check stage statuses
  const isHtmlDone = studentAccount?.completedStages.includes('html') || false;
  const isCssDone = studentAccount?.completedStages.includes('css') || false;
  const isJsDone = studentAccount?.completedStages.includes('js') || false;

  const isCurrentQuizPassed = studentAccount?.quizPassed[activeStageId] || false;

  // Handle stage selection
  const handleSelectStage = (stageId: 'html' | 'css' | 'js') => {
    // Only allow if student unlocked it or is at this stage
    if (stageId === 'css' && !isHtmlDone && studentAccount?.currentStage !== 'css' && studentAccount?.currentStage !== 'js') {
      return;
    }
    if (stageId === 'js' && !isCssDone && studentAccount?.currentStage !== 'js') {
      return;
    }
    setActiveStageId(stageId);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  // Handle quiz answer
  const handleAnswer = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  // Check quiz results
  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAccount) {
      onOpenRegister();
      return;
    }

    setQuizSubmitted(true);

    let allCorrect = true;
    currentStage.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] !== q.correctIndex) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      const updated: StudentAccount = {
        ...studentAccount,
        completedStages: Array.from(new Set([...studentAccount.completedStages, activeStageId])),
        quizPassed: {
          ...studentAccount.quizPassed,
          [activeStageId]: true,
        },
      };
      onUpdateAccount(updated);
    }
  };

  // Advance to next stage (HTML -> CSS or CSS -> JS)
  const handleAdvanceToNextStage = () => {
    if (!studentAccount) return;
    if (activeStageId === 'html') {
      const updated: StudentAccount = {
        ...studentAccount,
        currentStage: 'css',
        completedStages: Array.from(new Set([...studentAccount.completedStages, 'html'])),
      };
      onUpdateAccount(updated);
      setActiveStageId('css');
      setQuizAnswers({});
      setQuizSubmitted(false);
    } else if (activeStageId === 'css') {
      const updated: StudentAccount = {
        ...studentAccount,
        currentStage: 'js',
        completedStages: Array.from(new Set([...studentAccount.completedStages, 'css'])),
      };
      onUpdateAccount(updated);
      setActiveStageId('js');
      setQuizAnswers({});
      setQuizSubmitted(false);
    }
  };

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // Count score
  let correctCount = 0;
  if (quizSubmitted) {
    currentStage.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) correctCount += 1;
    });
  }

  return (
    <div className="space-y-6">
      {/* Top Banner: Student Account Status */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              {studentAccount ? (
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-stone-900">
                      {studentAccount.name}
                    </h2>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      Faol O'quvchi
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Bosqich: <span className="font-semibold text-stone-700 uppercase">{studentAccount.currentStage}</span> · Ro'yxatdan o'tgan: {studentAccount.registeredAt}
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-bold text-stone-900">
                    HTML, CSS va JS Akademiyasi
                  </h2>
                  <p className="text-xs text-stone-500">
                    W3Schools integratsiyasi va o'zbekcha qo'llanmalar
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!studentAccount ? (
              <button
                onClick={onOpenRegister}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <span>O'quvchi hisobini ochish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onOpenRegister}
                className="px-3 py-1.5 border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium rounded-lg transition-colors"
              >
                Profilni tahrirlash
              </button>
            )}
            <button
              onClick={onBackToProfile}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Tanishuv sahifasiga qaytish
            </button>
          </div>
        </div>

        {/* 3-Stage Progress Chain: HTML -> CSS -> JS */}
        <div className="pt-5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
            <span>Ta'lim Yo'lagi (HTML → CSS → JS)</span>
            <span className="font-mono text-stone-600">
              {studentAccount?.completedStages.length || 0} / 3 Yakunlandi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Stage 1: HTML */}
            <button
              onClick={() => handleSelectStage('html')}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                activeStageId === 'html'
                  ? 'border-rose-400 bg-rose-50/40 ring-2 ring-rose-200/50'
                  : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-[#e34f26] text-white text-[10px] flex items-center justify-center font-bold">
                    H
                  </span>
                  1. HTML Asoslari
                </span>
                {isHtmlDone ? (
                  <span className="text-emerald-600 text-[11px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Bajarildi
                  </span>
                ) : (
                  <span className="text-rose-600 text-[11px] font-medium">Boshlang'ich</span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 line-clamp-1">
                Sayt suyaklari, teglar, matn va formalar
              </p>
            </button>

            {/* Stage 2: CSS */}
            <button
              onClick={() => handleSelectStage('css')}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                activeStageId === 'css'
                  ? 'border-sky-400 bg-sky-50/40 ring-2 ring-sky-200/50'
                  : isHtmlDone || studentAccount?.currentStage === 'css' || studentAccount?.currentStage === 'js'
                  ? 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                  : 'border-stone-200/50 bg-stone-100/50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-[#1572b6] text-white text-[10px] flex items-center justify-center font-bold">
                    C
                  </span>
                  2. CSS Stillari
                </span>
                {isCssDone ? (
                  <span className="text-emerald-600 text-[11px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Bajarildi
                  </span>
                ) : isHtmlDone ? (
                  <span className="text-sky-600 text-[11px] font-medium">Ochiq</span>
                ) : (
                  <span className="text-stone-400 text-[11px] flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Qulflangan
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 line-clamp-1">
                Ranglar, shriftlar, flexbox va dizayn
              </p>
            </button>

            {/* Stage 3: JavaScript */}
            <button
              onClick={() => handleSelectStage('js')}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                activeStageId === 'js'
                  ? 'border-amber-400 bg-amber-50/40 ring-2 ring-amber-200/50'
                  : isCssDone || studentAccount?.currentStage === 'js'
                  ? 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                  : 'border-stone-200/50 bg-stone-100/50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-[#eab308] text-white text-[10px] flex items-center justify-center font-bold">
                    JS
                  </span>
                  3. JavaScript Harakati
                </span>
                {isJsDone ? (
                  <span className="text-emerald-600 text-[11px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Bajarildi
                  </span>
                ) : isCssDone ? (
                  <span className="text-amber-600 text-[11px] font-medium">Ochiq</span>
                ) : (
                  <span className="text-stone-400 text-[11px] flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Qulflangan
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 line-clamp-1">
                Tugmalar bosilishi, mantiq va hodisalar
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Split: Concepts + W3Schools Direct Redirection + Quiz */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Stage Explanation & Code Examples */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Bosqich mazmuni
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-700">
                {currentStage.shortTitle}
              </span>
            </div>

            <h3 className="text-xl font-bold text-stone-900 mb-2">
              {currentStage.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
              {currentStage.description}
            </p>

            {/* Concepts and Code */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Asosiy tushunchalar va namunalar
              </h4>
              {currentStage.concepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50 p-4 rounded-xl border border-stone-200/80"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h5 className="text-xs font-bold text-stone-900">
                      {concept.name}
                    </h5>
                    <button
                      onClick={() => handleCopyCode(concept.codeExample, idx)}
                      className="text-[11px] font-medium text-stone-500 hover:text-stone-800 flex items-center gap-1"
                    >
                      {copiedCodeIdx === idx ? (
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
                  <p className="text-xs text-stone-600 mb-2.5">
                    {concept.description}
                  </p>
                  <pre className="p-3 bg-stone-900 text-stone-100 rounded-lg text-xs font-mono overflow-x-auto">
                    <code>{concept.codeExample}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* W3Schools Gateway Section */}
          <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white rounded-2xl p-6 shadow-sm border border-stone-800">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                W3Schools Rasmiy Darsligi Integratsiyasi
              </span>
            </div>
            <h4 className="text-base font-bold mb-2">
              W3Schools da {currentStage.shortTitle} darsini o'rganish
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed mb-4">
              Siz ushbu havola orqali bevosita W3Schools ning {currentStage.shortTitle} bo'limiga o'tasiz. O'zbek tilidagi avtomatik qo'llab-quvvatlash orqali butun dunyo bo'yicha eng mashhur platformada amaliy kod yozib mashq qilishingiz mumkin!
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <a
                href={currentStage.w3schoolsUzbekUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
              >
                <span>W3Schools O'zbekcha Tarjima Bilan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={currentStage.w3schoolsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl transition-colors border border-stone-700"
              >
                <span>Asl Inglizcha Dars</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Quiz & Stage Progression */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    Bilimni sinash testi
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    3 ta savolga to'g'ri javob bering
                  </p>
                </div>
              </div>

              {isCurrentQuizPassed && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  ✓ Qabul qilindi
                </span>
              )}
            </div>

            <form onSubmit={handleSubmitQuiz} className="space-y-4">
              {currentStage.quiz.map((q, qIdx) => {
                const userChoice = quizAnswers[qIdx];
                const isAnswered = userChoice !== undefined;
                const isCorrect = userChoice === q.correctIndex;

                return (
                  <div
                    key={qIdx}
                    className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70"
                  >
                    <p className="text-xs font-semibold text-stone-800 mb-2.5">
                      {qIdx + 1}. {q.question}
                    </p>

                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userChoice === optIdx;
                        let optionClass =
                          'bg-white text-stone-700 border-stone-200 hover:border-stone-300';

                        if (quizSubmitted) {
                          if (optIdx === q.correctIndex) {
                            optionClass =
                              'bg-emerald-50 border-emerald-300 text-emerald-800 font-medium';
                          } else if (isSelected) {
                            optionClass =
                              'bg-rose-50 border-rose-300 text-rose-800 line-through';
                          }
                        } else if (isSelected) {
                          optionClass =
                            'bg-stone-900 border-stone-900 text-white font-medium shadow-xs';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleAnswer(qIdx, optIdx)}
                            className={`w-full text-left p-2.5 rounded-lg text-xs border transition-all ${optionClass}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <p className="text-[11px] mt-2 text-stone-500 italic">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}

              {!quizSubmitted ? (
                <button
                  type="submit"
                  disabled={Object.keys(quizAnswers).length < currentStage.quiz.length}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Javoblarni tekshirish</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <div
                    className={`p-3 rounded-xl border text-xs ${
                      correctCount === currentStage.quiz.length
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}
                  >
                    <div className="font-semibold mb-0.5">
                      Natijangiz: {correctCount} / {currentStage.quiz.length} to'g'ri
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {correctCount === currentStage.quiz.length
                        ? "Tabriklaymiz! Siz barcha savollarga to'g'ri javob berdingiz."
                        : "Barcha savollarga to'g'ri javob berib, keyingi bosqichga o'tish uchun qaytadan urinib ko'ring."}
                    </p>
                  </div>

                  {correctCount < currentStage.quiz.length && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Qaytadan urinish</span>
                    </button>
                  )}
                </div>
              )}
            </form>

            {/* Next Stage Progression Button */}
            {isCurrentQuizPassed && currentStage.nextStage && (
              <div className="mt-5 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleAdvanceToNextStage}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors animate-pulse"
                >
                  <span>
                    Keyingi bosqichga ({currentStage.nextStage.toUpperCase()} ga) avtomatik o'tish!
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* All Completed Banner */}
            {isHtmlDone && isCssDone && isJsDone && (
              <div className="mt-5 p-4 bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 rounded-xl text-center">
                <Award className="w-8 h-8 text-amber-600 mx-auto mb-1.5" />
                <h5 className="text-xs font-bold text-stone-900">
                  Tabriklaymiz, {studentAccount?.name}!
                </h5>
                <p className="text-[11px] text-stone-600 mt-1">
                  Siz HTML, CSS va JavaScript asoslarini to'liq muvaffaqiyatli tamomladingiz. Endi o'z shaxsiy tanishuv va veb-loyihalaringizni bemalol mustaqil yarata olasiz!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
