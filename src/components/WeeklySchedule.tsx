import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  Sparkles,
  Video,
  CheckCircle2,
  Users,
  ChevronRight,
  Flame,
  AlertCircle
} from 'lucide-react';
import { CourseStage, Teacher } from '../types';

interface ScheduleItem {
  id: string;
  day: string;
  dayShort: string;
  time: string;
  stage: CourseStage;
  topic: string;
  type: 'live' | 'practice' | 'review' | 'exam';
  teacherName?: string;
  isToday?: boolean;
  status: 'upcoming' | 'live_soon' | 'completed';
}

interface WeeklyScheduleProps {
  currentStage: CourseStage;
  teacher?: Teacher | null;
  onSelectLessonTopic?: (topic: string) => void;
}

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  currentStage,
  teacher,
  onSelectLessonTopic,
}) => {
  // Haftalik darslar jadvali (15 kishilik maxsus guruhlar uchun)
  const scheduleData: ScheduleItem[] = [
    {
      id: 'sch-1',
      day: 'Dushanba',
      dayShort: 'Dush',
      time: '19:00 - 20:30',
      stage: 'html',
      topic: 'HTML Semantikasi, audio/video teglar va amaliy forma yaratish',
      type: 'live',
      teacherName: teacher ? `${teacher.name} ${teacher.surname}` : 'Guruh ustozi',
      isToday: new Date().getDay() === 1,
      status: 'upcoming',
    },
    {
      id: 'sch-2',
      day: 'Seshanba',
      dayShort: 'Sesh',
      time: '18:30 - 20:00',
      stage: 'html',
      topic: 'Mustaqil amaliyot & Kod tahlili: Semantik veb sahifa skeleti',
      type: 'practice',
      teacherName: 'Mentor yordamchisi',
      isToday: new Date().getDay() === 2,
      status: 'upcoming',
    },
    {
      id: 'sch-3',
      day: 'Chorshanba',
      dayShort: 'Chor',
      time: '19:00 - 20:30',
      stage: 'css',
      topic: 'CSS Flexbox va Grid: Zamonaviy moslashuvchan (Responsive) kartalar',
      type: 'live',
      teacherName: teacher ? `${teacher.name} ${teacher.surname}` : 'Guruh ustozi',
      isToday: new Date().getDay() === 3,
      status: 'upcoming',
    },
    {
      id: 'sch-4',
      day: 'Payshanba',
      dayShort: 'Pay',
      time: '19:00 - 20:15',
      stage: 'css',
      topic: 'CSS Animatsiyalar & Tailwind asoslari bo\'yicha jonli vorkshop',
      type: 'practice',
      teacherName: 'Front-End Mentor',
      isToday: new Date().getDay() === 4,
      status: 'upcoming',
    },
    {
      id: 'sch-5',
      day: 'Juma',
      dayShort: 'Jum',
      time: '19:00 - 20:30',
      stage: 'javascript',
      topic: 'JavaScript DOM manipulyatsiyasi va Event Listenerlar bilan ishlash',
      type: 'live',
      teacherName: teacher ? `${teacher.name} ${teacher.surname}` : 'Guruh ustozi',
      isToday: new Date().getDay() === 5,
      status: 'upcoming',
    },
    {
      id: 'sch-6',
      day: 'Shanba',
      dayShort: 'Shan',
      time: '17:00 - 18:30',
      stage: 'javascript',
      topic: 'Haftalik Test & 15 talaba bilan savol-javob, kod reviziyasi',
      type: 'review',
      teacherName: teacher ? `${teacher.name} ${teacher.surname}` : 'Guruh ustozi',
      isToday: new Date().getDay() === 6,
      status: 'upcoming',
    },
  ];

  const [filterType, setFilterType] = useState<'all' | 'stage' | 'live'>('all');

  const filteredSchedule = scheduleData.filter((item) => {
    if (filterType === 'stage') {
      if (currentStage === 'graduated') return true;
      return item.stage === currentStage;
    }
    if (filterType === 'live') {
      return item.type === 'live';
    }
    return true;
  });

  const getTypeBadge = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'live':
        return {
          label: 'Jonli Dars',
          className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          dotColor: 'bg-emerald-400',
        };
      case 'practice':
        return {
          label: 'Amaliyot',
          className: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
          dotColor: 'bg-cyan-400',
        };
      case 'review':
        return {
          label: 'Test & Tahlil',
          className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          dotColor: 'bg-amber-400',
        };
      case 'exam':
      default:
        return {
          label: 'Imtihon',
          className: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
          dotColor: 'bg-purple-400',
        };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden transition-colors">
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/90 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shadow-sm">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Haftalik Dars Jadvali</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 uppercase">
                Guruh Rejasi
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            15 kishilik guruh uchun belgilangan dars kunlari, vaqti va mavzular rejasi
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Barchasi (6 kun)
          </button>
          <button
            onClick={() => setFilterType('stage')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer uppercase ${
              filterType === 'stage'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {currentStage === 'graduated' ? 'Barcha bosqichlar' : `${currentStage} darslari`}
          </button>
          <button
            onClick={() => setFilterType('live')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'live'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Jonli efirlar
          </button>
        </div>
      </div>

      {/* Schedule Table / Grid */}
      <div className="mt-4 overflow-x-auto relative z-10">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <th className="py-2.5 px-3">Kun</th>
              <th className="py-2.5 px-3">Vaqt</th>
              <th className="py-2.5 px-3">Dars Mavzusi</th>
              <th className="py-2.5 px-3">Format</th>
              <th className="py-2.5 px-3 hidden sm:table-cell">Mas'ul</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70 text-slate-300">
            {filteredSchedule.map((item) => {
              const badge = getTypeBadge(item.type);

              return (
                <tr
                  key={item.id}
                  className={`transition-colors group hover:bg-slate-800/40 ${
                    item.isToday ? 'bg-indigo-950/25 border-l-2 border-indigo-500' : ''
                  }`}
                >
                  {/* Kun */}
                  <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>{item.day}</span>
                      {item.isToday && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-indigo-500 text-white uppercase tracking-wider animate-pulse">
                          Bugun
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Vaqt */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-mono text-cyan-300 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{item.time}</span>
                    </div>
                  </td>

                  {/* Dars Mavzusi */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium leading-snug">
                        {item.topic}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                        {item.stage}
                      </span>
                    </div>
                  </td>

                  {/* Format */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${badge.className}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                      <span>{badge.label}</span>
                    </span>
                  </td>

                  {/* Mas'ul ustoz */}
                  <td className="py-3 px-3 whitespace-nowrap hidden sm:table-cell text-slate-400 text-[11px]">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-500" />
                      <span>{item.teacherName}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Schedule Footer Note */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Dars boshlanishidan 10 daqiqa oldin guruh chatiga kirish havolasi yuboriladi.</span>
        </div>
        <div className="text-slate-500 font-medium">
          Haftada 3 ta asosiy jonli dars + 3 ta amaliy mashg'ulot
        </div>
      </div>
    </div>
  );
};
