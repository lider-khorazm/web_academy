import React, { useState } from 'react';
import {
  KeyRound,
  Sparkles,
  CheckCircle2,
  Copy,
  Users,
  MessageSquare,
  Bot
} from 'lucide-react';
import { Student, Teacher, CourseStage, GeneratedTest } from '../types';
import { createTest } from '../services/storage';

interface CreateTestModalProps {
  teacher: Teacher;
  student: Student;
  initialStage: CourseStage;
  studentsList: Student[];
  onClose: () => void;
  onTestCreated: (test: GeneratedTest) => void;
}

export const CreateTestModal: React.FC<CreateTestModalProps> = ({
  teacher,
  student,
  initialStage,
  studentsList,
  onClose,
  onTestCreated,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState(student.id);
  const [stage, setStage] = useState<CourseStage>(initialStage);
  const [questionCount, setQuestionCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTest, setGeneratedTest] = useState<GeneratedTest | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedStudent =
    studentsList.find((s) => s.id === selectedStudentId) || student;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const newTest = createTest({
        studentId: selectedStudent.id,
        studentName: `${selectedStudent.name} ${selectedStudent.surname}`,
        stage: stage,
        teacherId: teacher.id,
        questionCount: questionCount,
      });

      setIsGenerating(false);
      setGeneratedTest(newTest);
      onTestCreated(newTest);
    }, 900);
  };

  const handleCopyId = () => {
    if (generatedTest) {
      navigator.clipboard.writeText(generatedTest.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
        >
          ✕
        </button>

        {!generatedTest ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>Groq AI Test Generatori</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                    Ustoz Paneli
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  O'quvchiga individual Test ID yaratish va guruh chatiga avtomatik yuborish
                </p>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              
              {/* 1. Student selection */}
              <div>
                <label className="text-slate-300 font-bold block mb-1.5">
                  1. O'quvchi (Ism-Familiyasi) *
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-medium outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {studentsList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} {st.surname} (Bosqich: {st.stage.toUpperCase()} | {st.xp} XP)
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Stage selection */}
              <div>
                <label className="text-slate-300 font-bold block mb-1.5">
                  2. Kelgan Bosqichi *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['html', 'css', 'javascript'] as CourseStage[]).map((stg) => (
                    <button
                      key={stg}
                      type="button"
                      onClick={() => setStage(stg)}
                      className={`py-2.5 px-3 rounded-xl font-bold uppercase text-center border transition-all ${
                        stage === stg
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {stg}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Question count */}
              <div>
                <label className="text-slate-300 font-bold block mb-1.5">
                  3. Savollar Soni: <span className="text-cyan-400 font-mono text-sm">{questionCount} ta savol</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 8, 10, 15].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className={`py-2 rounded-xl font-bold text-center border transition-all ${
                        questionCount === count
                          ? 'bg-cyan-600 border-cyan-400 text-white shadow-md shadow-cyan-600/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {count} ta
                    </button>
                  ))}
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  Avtomatik Guruh E'loni:
                </p>
                <p>
                  Test yaratilgach, shu 15 kishilik guruh chatida avtomatik:
                  <em className="text-cyan-300 block mt-0.5 font-mono">
                    "Hurmatli {selectedStudent.name}, test ID bilan testga kiring: ID: [TEST-ID]"
                  </em>
                  deb e'lon qilinadi.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 active:scale-95"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Generatsiya qilinmoqda...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Testni Yaratish va ID Berish</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* RESULT: GENERATED TEST ID DISPLAY */
          <div className="text-center py-4 space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Test ID Muvaffaqiyatli Yaratildi!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Guruh chatiga xabar yuborildi va talabaga ID taqdim etildi.
              </p>
            </div>

            {/* Test ID Banner */}
            <div className="p-4 bg-slate-950 border-2 border-indigo-500/50 rounded-2xl flex items-center justify-between gap-3 shadow-inner">
              <div className="text-left">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  Bir martalik Test ID
                </span>
                <span className="text-xl font-black font-mono text-cyan-300 tracking-wider">
                  {generatedTest.id}
                </span>
              </div>
              <button
                onClick={handleCopyId}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "Nusxalandi!" : "Nusxalash"}</span>
              </button>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs text-left text-slate-300 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Talaba:</span>
                <span className="font-bold text-white">{generatedTest.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bosqich:</span>
                <span className="font-bold text-cyan-400 uppercase">{generatedTest.stage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Savollar soni:</span>
                <span className="font-bold text-emerald-400">{generatedTest.questionCount} ta savol</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
            >
              Yopish
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
