import React from 'react';
import { User, ShieldAlert, GraduationCap, Crown } from 'lucide-react';

interface AvatarBadgeProps {
  name: string;
  role?: 'owner' | 'teacher' | 'student' | 'admin' | 'system';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AvatarBadge: React.FC<AvatarBadgeProps> = ({
  name,
  role = 'student',
  size = 'md',
  className = '',
}) => {
  // Extract initials
  const parts = name.trim().split(/\s+/);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : (name.slice(0, 2) || 'U').toUpperCase();

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-14 h-14 text-sm font-black',
    xl: 'w-24 h-24 sm:w-28 sm:h-28 text-2xl font-black',
  };

  const roleGradients = {
    owner: 'from-amber-500 via-orange-600 to-amber-700 text-white ring-amber-400/40 shadow-amber-500/20',
    admin: 'from-rose-600 via-red-600 to-pink-700 text-white ring-rose-500/40 shadow-rose-500/20',
    teacher: 'from-indigo-600 via-purple-600 to-indigo-800 text-white ring-indigo-400/40 shadow-indigo-500/20',
    student: 'from-cyan-600 via-blue-600 to-indigo-700 text-white ring-cyan-400/40 shadow-cyan-500/20',
    system: 'from-slate-700 via-slate-800 to-slate-900 text-cyan-400 ring-slate-600/40 shadow-slate-900/50',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center font-bold rounded-2xl bg-gradient-to-tr ring-2 shadow-lg select-none shrink-0 ${
        sizeClasses[size]
      } ${roleGradients[role]} ${className}`}
      title={name}
    >
      <span>{initials}</span>

      {/* Small corner role icon indicator for lg & xl */}
      {(size === 'lg' || size === 'xl') && (
        <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-950 border border-slate-700 shadow flex items-center justify-center">
          {role === 'owner' ? (
            <Crown className="w-3.5 h-3.5 text-amber-400" />
          ) : role === 'admin' ? (
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          ) : role === 'teacher' ? (
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
          ) : (
            <User className="w-3.5 h-3.5 text-cyan-400" />
          )}
        </span>
      )}
    </div>
  );
};
