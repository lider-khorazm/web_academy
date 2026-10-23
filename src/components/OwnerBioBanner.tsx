import React from 'react';
import {
  Coffee,
  Code2,
  Tv,
  Sparkles,
  ShieldCheck,
  Terminal,
  Heart,
  LogIn,
  UserPlus,
  Download
} from 'lucide-react';
import { OWNER_PROFILE } from '../data/mockData';
import { AuthUser } from '../types';
import { AvatarBadge } from './AvatarBadge';

interface OwnerBioBannerProps {
  currentUser: AuthUser | null;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onDownloadZip?: () => void;
}

export const OwnerBioBanner: React.FC<OwnerBioBannerProps> = ({
  currentUser,
  onOpenLogin,
  onOpenRegister,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border-2 border-indigo-500/40 p-6 sm:p-8 shadow-2xl mb-8">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-1/4 -mt-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 -mb-16 -mr-16 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
        
        {/* Left: Owner Photo & Story */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative shrink-0">
            <AvatarBadge
              name={OWNER_PROFILE.name}
              role="owner"
              size="xl"
              className="ring-4 ring-amber-400/50 shadow-2xl shadow-amber-500/30"
            />
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] shadow-lg uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> OWNER
            </span>
          </div>

          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {OWNER_PROFILE.name}
              </h1>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                @{OWNER_PROFILE.username}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                👑 Boshqaruvchi & Asoschi
              </span>
            </div>

            <p className="text-sm font-medium text-slate-300 leading-relaxed">
              {OWNER_PROFILE.bio}
            </p>

            {/* Interest Badges Requested by User */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <span className="px-3 py-1 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Coffee className="w-3.5 h-3.5 text-amber-400" />
                Qahva ichishni yaxshi ko'radi ☕
              </span>

              <span className="px-3 py-1 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                Frontend (React, TS, CSS) 💻
              </span>

              <span className="px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Python Dasturlash 🐍
              </span>

              <span className="px-3 py-1 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <Tv className="w-3.5 h-3.5 text-purple-400" />
                Anime & Manga Ishqibozi 🎌
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Login / Status Card */}
        <div className="w-full lg:w-auto shrink-0 bg-slate-950/80 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
              Tizim Holati
            </span>
            {currentUser ? (
              <div className="mt-1">
                <span className="text-xs text-slate-400 block">Hozirgi profil:</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {currentUser.name} ({currentUser.role.toUpperCase()})
                </span>
              </div>
            ) : (
              <div className="mt-1">
                <span className="text-sm font-bold text-cyan-400 block">
                  Xush kelibsiz!
                </span>
                <span className="text-xs text-slate-400">
                  Platformaga kiring yoki o'quvchi sifatida ro'yxatdan o'ting.
                </span>
              </div>
            )}
          </div>

          {!currentUser && (
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onOpenLogin}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Kirish (Login)</span>
              </button>

              <button
                onClick={onOpenRegister}
                className="flex-1 px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Ro'yxatdan o'tish</span>
              </button>
            </div>
          )}

          {/* ZIP Download Button Requested by User */}
          <div className="pt-1">
            <a
              href="/devmaster-project.zip"
              download="devmaster-project.zip"
              className="w-full px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-emerald-200" />
              <span>Loyihani Yuklab Olish (ZIP)</span>
            </a>
          </div>

          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-2 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Bosh Administrator & Ta'lim Raxbari</span>
            <span className="text-emerald-400 font-bold">100% Rasmsiz (Toza)</span>
          </div>
        </div>

      </div>
    </div>
  );
};
