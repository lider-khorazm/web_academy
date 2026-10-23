import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { GeneratedTest, TestSubmissionResult } from '../types';
import { getTestById, submitTest } from '../services/storage';

interface TestTakingModalProps {
  initialTestId?: string;
  onClose: () => void;
  onTestSubmittedSuccess: () => void;
}

export const TestTakingModal: React.FC<TestTakingModalProps> = ({
  initialTestId = '',
  onClose,
  onTestSubmittedSuccess,
}) => {
  const [testId, setTestId] = useState(initialTestId);
  const [activeTest, setActiveTest] = useState<GeneratedTest | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 daqiqa
  const [submissionComplete, setSubmissionComplete] = useState<TestSubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial ID bo'lsa avtomatik yuklash
  useEffect(() => {
    if (initialTestId) {
      loadTest(initialTestId);
    }
  }, [initialTestId]);

  // Taymer
  useEffect(() => {
    if (!activeTest || submissionComplete) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTest, submissionComplete]);

  const loadTest = (id: string) => {
    setErrorMessage('');
    const found = getTestById(id);
    if (!found) {
      setErrorMessage("Kechirasiz, ushbu Test ID topilmadi yoki u allaqachon topshirilib bazadan o'chirib yuborilgan!");
      setActiveTest(null);
    } else {
      setActiveTest(found);
      setCurrentQuestionIdx(0);
      setSelectedAnswers({});
      setTimeLeft(found.questions.length * 120); // Har bir savolga 2 daqiqa
    }
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleAutoSubmit = () => {
    handleSubmit();
  };

  const handleSubmit = () => {
    if (!activeTest) return;

    setIsSubmitting(true);
    const answersPayload = activeTest.questions.map((q) => ({
      questionId: q.id,
      selectedIndex: selectedAnswers[q.id] !== undefined ? selectedAnswers[q.id] : -1,
    }));

    setTimeout(() => {
      const res = submitTest(activeTest.id, answersPayload);
      setIsSubmitting(false);

      if (res.success && res.result) {
        setSubmissionComplete(res.result);
        onTestSubmittedSuccess();
      } else {
        setErrorMessage(res.message);
      }
    }, 800);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Test Sinovi Tizimi</span>
                {activeTest && (
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs border border-indigo-500/30">
                    {activeTest.id}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Bir martalik ID asosidagi test sinovi (topshirilgach bazadan avtomatik o'chadi)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* STEP 1: Agar test hali yuklanmagan bo'lsa - ID kiritish */}
          {!activeTest && !submissionComplete && (
            <div className="max-w-md mx-auto py-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30 shadow-lg">
                <KeyRound className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Test ID ni Kiriting</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Ustozingiz sizga va 15 kishilik guruh chatiga yuborgan test ID sini kiriting.
                </p>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Masalan: TEST-HTML-7482"
                  value={testId}
                  onChange={(e) => setTestId(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-sm font-mono uppercase text-cyan-300 placeholder-slate-600 outline-none focus:ring-2 focus:ring-indigo-500 tracking-wider font-bold"
                />

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-left flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  onClick={() => loadTest(testId)}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Testga Kirish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: TEST SAVOLLARI */}
          {activeTest && !submissionComplete && (
            <div className="space-y-6">
              
              {/* Test Top Bar */}
              <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">
                    Savol {currentQuestionIdx + 1} / {activeTest.questions.length}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px] uppercase">
                    {activeTest.stage}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                  <Clock className="w-4 h-4" />
                  <span>Qolgan vaqt: {formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIdx + 1) / activeTest.questions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Current Question Card */}
              {activeTest.questions[currentQuestionIdx] && (
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-base font-bold text-white leading-relaxed">
                    {currentQuestionIdx + 1}. {activeTest.questions[currentQuestionIdx].question}
                  </h3>

                  {activeTest.questions[currentQuestionIdx].codeSnippet && (
                    <pre className="bg-slate-900 p-4 rounded-xl font-mono text-xs text-cyan-300 border border-slate-800 overflow-x-auto">
                      {activeTest.questions[currentQuestionIdx].codeSnippet}
                    </pre>
                  )}

                  {/* Options */}
                  <div className="space-y-2.5 pt-2">
                    {activeTest.questions[currentQuestionIdx].options.map((opt, optIdx) => {
                      const isSelected =
                        selectedAnswers[activeTest.questions[currentQuestionIdx].id] === optIdx;

                      return (
                        <button
                          key={optIdx}
                          onClick={() =>
                            handleSelectOption(activeTest.questions[currentQuestionIdx].id, optIdx)
                          }
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-600/20 ring-1 ring-indigo-500'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 ${
                                isSelected
                                  ? 'bg-indigo-500 text-white'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>

                          {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation between questions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 rounded-xl text-xs font-semibold"
                >
                  ← Oldingi
                </button>

                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {activeTest.questions.map((q, idx) => {
                    const answered = selectedAnswers[q.id] !== undefined;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIdx(idx)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                          currentQuestionIdx === idx
                            ? 'ring-2 ring-indigo-400 bg-indigo-600 text-white'
                            : answered
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {currentQuestionIdx < activeTest.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    Keyingi →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Tekshirilmoqda..." : "Testni Yakunlash"}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: NATIJA VA AVTOMATIK TEST O'CHIRILISHI BILDIRISHNOMASI */}
          {submissionComplete && (
            <div className="py-8 max-w-lg mx-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 shadow-xl shadow-emerald-500/20 animate-bounce">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white">
                  Test Muvaffaqiyatli Topshirildi!
                </h3>
                <p className="text-xs text-slate-400 mt-1.5">
                  Foydalanuvchi qoidasiga binoan, bir martalik <strong>[{submissionComplete.testId}]</strong> kodi
                  bazadan butunlay o'chirildi va qayta ishlatilmaydi.
                </p>
              </div>

              {/* Student Result Card */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs text-slate-400">Umumiy Natijangiz:</span>
                  <span className="text-lg font-black text-emerald-400">
                    {submissionComplete.percentage}% ({submissionComplete.score} ball)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">To'g'ri javoblar:</span>
                  <span className="font-bold text-white">
                    {submissionComplete.answers.filter((a) => a.isCorrect).length} ta / {submissionComplete.totalQuestions} tadan
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Keyingi bosqich:</span>
                  <span className="font-bold text-amber-300">
                    Admin tasdig'i kutilmoqda
                  </span>
                </div>
              </div>

              {/* User rule notice */}
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300 text-left space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Natijalar Ustoz va Adminga yo'llandi!
                </p>
                <p className="text-[11px] text-slate-400">
                  To'liq savollar tahlili va to'g'ri/noto'g'ri javoblar faqat ustoz va admin panelida ko'rinadi.
                  Admin sizning test natijangizni ko'rib chiqib keyingi bosqichga o'tishingizni tasdiqlaydi.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all"
              >
                Tushundim, Yopish
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
