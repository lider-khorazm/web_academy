import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Users,
  Send,
  Sparkles,
  KeyRound,
  Edit3,
  Check,
  X,
  ArrowLeft
} from 'lucide-react';
import { Teacher, Student, GroupChatMessage } from '../types';
import { getGroupMessages, sendGroupMessage, updateTeacherGroupName } from '../services/storage';
import { AvatarBadge } from './AvatarBadge';

interface GroupChatModalProps {
  teacher: Teacher;
  allTeachers?: Teacher[];
  students: Student[];
  currentRole: 'student' | 'teacher' | 'admin';
  currentStudent: Student | null;
  onClose: () => void;
  onStartTestWithId: (testId: string) => void;
  onUpdateGroupName?: (teacherId: string, newName: string) => void;
}

export const GroupChatModal: React.FC<GroupChatModalProps> = ({
  teacher,
  allTeachers,
  students,
  currentRole,
  currentStudent,
  onClose,
  onStartTestWithId,
  onUpdateGroupName,
}) => {
  const [activeTeacherId, setActiveTeacherId] = useState<string>(teacher?.id || 't-1');
  const [messages, setMessages] = useState<GroupChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (teacher?.id) {
      setActiveTeacherId(teacher.id);
    }
  }, [teacher?.id]);

  const fallbackTeacher: Teacher = {
    id: 't-1',
    name: "O'qituvchi",
    surname: "Ustoz",
    username: "teacher1",
    avatar: '👨‍🏫',
    specialty: 'Web Dasturlash',
    bio: '',
    experienceYears: 3,
    phone: '+998901234567',
    email: 'teacher@devmaster.uz',
    studentIds: [],
    rating: 5,
    activeSince: '2024',
    groupName: 'Frontend Guruh'
  };

  const activeTeacher =
    allTeachers?.find((t) => t.id === activeTeacherId) || teacher || fallbackTeacher;

  const [nameInput, setNameInput] = useState(
    activeTeacher?.groupName || `${activeTeacher?.name || "Guruh"} Guruhi`
  );

  useEffect(() => {
    setNameInput(activeTeacher.groupName || `${activeTeacher.name} Guruhi`);
    setIsEditingName(false);
  }, [activeTeacher.id, activeTeacher.groupName]);

  // Bu ustozga biriktirilgan o'quvchilar
  const groupStudents = students.filter((s) => s.teacherId === activeTeacher.id);

  const loadMessages = () => {
    const list = getGroupMessages(activeTeacher.id);
    setMessages(list);
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [activeTeacher.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSaveGroupName = () => {
    if (!nameInput.trim()) return;
    const trimmed = nameInput.trim();
    updateTeacherGroupName(activeTeacher.id, trimmed);
    if (onUpdateGroupName) {
      onUpdateGroupName(activeTeacher.id, trimmed);
    }
    setIsEditingName(false);
    loadMessages();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    let senderId = 'anonymous';
    let senderName = "Mehmon";
    let senderRole: 'student' | 'teacher' | 'admin' = currentRole;
    let avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';

    if (currentRole === 'teacher') {
      senderId = activeTeacher.id;
      senderName = `${activeTeacher.name} ${activeTeacher.surname} (Ustoz)`;
      avatar = activeTeacher.avatar;
    } else if (currentRole === 'admin') {
      senderId = 'admin';
      senderName = 'Bosh Administrator';
      avatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200';
    } else if (currentStudent) {
      senderId = currentStudent.id;
      senderName = `${currentStudent.name} ${currentStudent.surname}`;
      avatar = currentStudent.avatar;
    }

    sendGroupMessage({
      teacherId: activeTeacher.id,
      senderId,
      senderName,
      senderRole,
      avatar,
      text: inputText.trim(),
    });

    setInputText('');
    loadMessages();
  };

  const currentGroupName = activeTeacher.groupName || `${activeTeacher.name} Guruhi`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Chat Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            {/* Panelga qaytish strelkasi */}
            <button
              onClick={onClose}
              className="px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/80 flex items-center gap-1.5 group cursor-pointer shadow-sm active:scale-95 shrink-0"
              title="Panelga qaytish"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs font-bold text-slate-200">Panelga qaytish</span>
            </button>

            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {isEditingName ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSaveGroupName();
                        }
                      }}
                      className="px-2.5 py-1 text-xs bg-slate-900 border border-emerald-500 rounded-lg text-white font-bold outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveGroupName}
                      className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs"
                      title="Saqlash"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setNameInput(currentGroupName);
                        setIsEditingName(false);
                      }}
                      className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                      title="Bekor qilish"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-base font-black text-white flex items-center gap-1.5">
                      <span>{currentGroupName}</span>
                      {currentRole === 'teacher' && activeTeacher.id === teacher.id && (
                        <button
                          onClick={() => setIsEditingName(true)}
                          className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                          title="Guruh nomini o'zgartirish"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {groupStudents.length} / 15 Talaba + Ustoz + Admin
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Ustoz: <strong className="text-indigo-300">{activeTeacher.name} {activeTeacher.surname}</strong> • Rasmiy guruh muloqot chati
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowMembers(!showMembers)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">A'zolar</span> ({groupStudents.length + 2})
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Admin Multi-Group Switcher (Admindagi guruh chati degan joyda hamma guruhdagi chat ko'rinadi) */}
        {currentRole === 'admin' && allTeachers && allTeachers.length > 0 && (
          <div className="bg-slate-950/95 border-b border-slate-800 px-4 py-2.5 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
              Guruhni tanlang:
            </span>
            <div className="flex items-center gap-1.5">
              {allTeachers.map((t) => {
                const isSelected = t.id === activeTeacherId;
                const count = students.filter((s) => s.teacherId === t.id).length;
                const gName = t.groupName || `${t.name} Guruhi`;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTeacherId(t.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <span>{gName}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {count}/15
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Chat Body (Messages + Members Drawer) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Messages Column */}
          <div className="flex-1 flex flex-col justify-between bg-slate-900/60 p-4 overflow-y-auto space-y-4">
            <div className="space-y-3.5">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  <MessageSquare className="w-8 h-8 mx-auto text-slate-600 mb-2 opacity-50" />
                  <p>Bu guruhda hali xabarlar yo'q. Birinchi bo'lib xabar qoldiring!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  if (msg.senderRole === 'system') {
                    return (
                      <div key={msg.id} className="flex justify-center my-2">
                        <div className="bg-slate-800/90 border border-slate-700/60 rounded-full px-4 py-1 text-[11px] text-slate-300 font-medium flex items-center gap-2 shadow-sm">
                          <span>{msg.text}</span>
                          <span className="text-[9px] text-slate-500 font-mono">{msg.timestamp}</span>
                        </div>
                      </div>
                    );
                  }

                  const isMe =
                    (currentRole === 'teacher' && msg.senderRole === 'teacher') ||
                    (currentRole === 'admin' && msg.senderRole === 'admin') ||
                    (currentStudent && msg.senderId === currentStudent.id);

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                    >
                      <AvatarBadge
                        name={msg.senderName}
                        role={msg.senderRole}
                        size="sm"
                        className="w-8 h-8 mt-1 text-[11px]"
                      />

                      <div
                        className={`max-w-md rounded-2xl p-3.5 text-xs shadow-md ${
                          msg.isTestAlert
                            ? 'bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 border-2 border-indigo-500/60 text-white w-full'
                            : msg.senderRole === 'admin'
                            ? 'bg-rose-950/40 border border-rose-500/40 text-slate-200'
                            : msg.senderRole === 'teacher'
                            ? 'bg-indigo-950/40 border border-indigo-500/40 text-slate-200'
                            : isMe
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-800 border border-slate-700 text-slate-200'
                        }`}
                      >
                        {/* Sender Tag */}
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <span className="font-bold flex items-center gap-1.5">
                            {msg.senderRole === 'admin' && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-300 font-black">
                                ADMIN
                              </span>
                            )}
                            {msg.senderRole === 'teacher' && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 font-black">
                                USTOZ
                              </span>
                            )}
                            {msg.senderName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                        </div>

                        {/* Message Body */}
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                        {/* If Test Alert - Clickable Start Button */}
                        {msg.isTestAlert && msg.testId && (
                          <div className="mt-3 pt-2.5 border-t border-indigo-500/30 flex items-center justify-between">
                            <span className="text-[11px] font-mono text-cyan-300 font-bold bg-slate-950 px-2.5 py-1 rounded border border-indigo-500/40">
                              {msg.testId}
                            </span>
                            <button
                              onClick={() => {
                                onClose();
                                onStartTestWithId(msg.testId || '');
                              }}
                              className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                              <span>Testga Kirish</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="mt-2 flex items-center gap-2">
              <input
                type="text"
                placeholder={
                  currentRole === 'teacher'
                    ? "Ustoz sifatida xabar yozing..."
                    : currentRole === 'admin'
                    ? "Administrator sifatida xabar yozing..."
                    : "Savol yoki xabaringizni yozing..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Yuborish</span>
              </button>
            </form>
          </div>

          {/* Members Sidebar */}
          {showMembers && (
            <div className="w-64 bg-slate-950 border-l border-slate-800 p-4 flex flex-col justify-between overflow-y-auto text-xs">
              <div>
                <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Guruh A'zolari
                </h4>

                <div className="space-y-3">
                  {/* Admin */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                      A
                    </div>
                    <div>
                      <span className="font-bold text-white block">Bosh Admin</span>
                      <span className="text-[10px] text-rose-400 font-semibold">Moderator</span>
                    </div>
                  </div>

                  {/* Ustoz */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
                    <AvatarBadge
                      name={`${activeTeacher.name} ${activeTeacher.surname}`}
                      role="teacher"
                      size="sm"
                      className="w-7 h-7 text-[10px] ring-1 ring-indigo-500"
                    />
                    <div>
                      <span className="font-bold text-white block">
                        {activeTeacher.name} {activeTeacher.surname}
                      </span>
                      <span className="text-[10px] text-indigo-400 font-semibold">Ustoz / Mentor</span>
                    </div>
                  </div>

                  {/* 15 Talabalar */}
                  <span className="text-[10px] text-slate-500 font-semibold block pt-2">
                    Guruh Talabalari ({groupStudents.length} / 15)
                  </span>

                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {groupStudents.map((st) => (
                      <div
                        key={st.id}
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                      >
                        <AvatarBadge
                          name={`${st.name} ${st.surname}`}
                          role="student"
                          size="sm"
                          className="w-6 h-6 text-[9px] rounded-lg"
                        />
                        <div className="truncate flex-1">
                          <span className="font-semibold text-slate-300 block truncate">
                            {st.name} {st.surname}
                          </span>
                          <span className="text-[9px] text-cyan-400 uppercase font-mono">
                            {st.stage} • {st.xp} XP
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 text-center">
                Maksimal 15 talaba + 1 Ustoz + Admin
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
