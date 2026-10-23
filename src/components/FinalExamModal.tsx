import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Clock,
  Send,
  Download,
  Flame,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FINAL_BOSS_QUESTIONS } from '../data/mockData';
import { Student } from '../types';

interface FinalExamModalProps {
  student: Student;
  onClose: () => void;
  onPassed100Percent: () => void;
}

export const FinalExamModal: React.FC<FinalExamModalProps> = ({
  student,
  onClose,
  onPassed100Percent,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [examResult, setExamResult] = useState<{
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
  } | null>(null);

  const questions = FINAL_BOSS_QUESTIONS;

  const handleSelect = (questionId: string, optionIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleFinish = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage === 100; // 100% TALAB QILINADI!

    setExamResult({
      score: correctCount,
      total: questions.length,
      percentage,
      passed,
    });

    if (passed) {
      // 100% olinganida bayramona confetti!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
      onPassed100Percent();
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIdx(0);
    setExamResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-amber-950/40 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">
                  Umumiy Qiyin Final Imtihon
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-[10px] border border-amber-500/40 uppercase">
                  100% Talab Qilinadi
                </span>
              </div>
              <p className="text-xs text-slate-400">
                HTML + CSS + JavaScript chuqurlashtirilgan savollar to'plami
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!examResult ? (
            <div className="space-y-6">
              
              {/* Question progress */}
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-bold">
                <span className="text-slate-300">
                  Savol {currentIdx + 1} / {questions.length}
                </span>
                <span className="text-amber-400 font-mono">
                  Tanlangan javoblar: {Object.keys(answers).length} / {questions.length}
                </span>
              </div>

              {/* Question box */}
              {questions[currentIdx] && (
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-base font-bold text-white whitespace-pre-wrap leading-relaxed">
                    {currentIdx + 1}. {questions[currentIdx].question}
                  </h3>

                  <div className="space-y-2.5 pt-2">
                    {questions[currentIdx].options.map((opt, oIdx) => {
                      const isSelected = answers[questions[currentIdx].id] === oIdx;

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelect(questions[currentIdx].id, oIdx)}
                          className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-white shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 ${
                                isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  ← Oldingi
                </button>

                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        currentIdx === idx
                          ? 'ring-2 ring-amber-400 bg-amber-500 text-slate-950 font-black'
                          : answers[q.id] !== undefined
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx((p) => p + 1)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                  >
                    Keyingi →
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs font-black shadow-lg shadow-amber-500/30 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Natijani Tekshirish</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* RESULT VIEW */
            <div className="py-8 max-w-lg mx-auto text-center space-y-6">
              {examResult.passed ? (
                <div className="space-y-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/40 ring-4 ring-amber-400/30 animate-bounce">
                    <Sparkles className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-amber-400 block">
                      Dasturchi Maqomi Qo'lga Kiritildi!
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1">
                      MUBORAK BO'LSIN! 100% NATIJA! 🏆
                    </h3>
                    <p className="text-xs text-slate-300 mt-2">
                      Siz umumiy qiyin imtihondan barcha 10 ta savolga 100% to'g'ri javob berdingiz.
                      DevMaster Academy ning rasmiy Junior Full-Stack Developer sertifikatiga ega bo'ldingiz!
                    </p>
                  </div>

                  {/* Certificate preview card */}
                  <div className="p-6 bg-gradient-to-br from-slate-950 via-amber-950/40 to-slate-950 border-2 border-amber-500/60 rounded-2xl text-left shadow-2xl space-y-3">
                    <div className="flex justify-between items-center border-b border-amber-500/30 pb-3">
                      <div>
                        <span className="text-[10px] text-amber-400 uppercase font-bold tracking-widest block">
                          Rasmiy Sertifikat
                        </span>
                        <h4 className="text-sm font-black text-white">DevMaster Academy Diplom</h4>
                      </div>
                      <Award className="w-8 h-8 text-amber-400" />
                    </div>
                    <p className="text-xs text-slate-300">
                      Ushbu sertifikat <strong className="text-white">{student.name} {student.surname}</strong>ga
                      HTML, CSS va JavaScript bo'yicha mukammal bilimga egaligi va 100% lik natijasi uchun taqdim etiladi.
                    </p>
                    <div className="text-[10px] text-slate-500 pt-2 flex justify-between">
                      <span>Sana: {new Date().toLocaleDateString('uz-UZ')}</span>
                      <span>Sertifikat ID: DM-{Math.floor(100000 + Math.random() * 900000)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => alert("Sertifikat yuklab olindi! (PDF format)")}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      <span>Sertifikatni Yuklab Olish</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
                    >
                      Yopish
                    </button>
                  </div>
                </div>
              ) : (
                /* FAILED < 100% - RETRY AS MUCH AS WANTED */
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/40">
                    <AlertTriangle className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">
                      To'plangan Natija: {examResult.percentage}% ({examResult.score}/{examResult.total} to'g'ri)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5">
                      Foydalanuvchi qoidasi: <em>"undan 100% olmaguncha topshiraveradi"</em>.
                      Sertifikat olish uchun to'liq 100% (10 ta to'g'ri) talab etiladi.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300 text-left space-y-2">
                    <p className="text-amber-300 font-semibold flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-400" />
                      Taslim bo'lmang!
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Siz xohlagancha qayta topshirishingiz mumkin. Xatolarni o'rganing va yana urinib ko'ring!
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleRetry}
                      className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Qayta topshirish (Yana urinish)</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                    >
                      Chiqish
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
