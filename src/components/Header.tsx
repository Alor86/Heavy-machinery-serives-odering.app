import { Wrench, User, LogOut } from 'lucide-react';
import { ScreenMode } from '../types';

interface HeaderProps {
  id?: string;
  currentScreen: ScreenMode;
  onLogout: () => void;
  userEmail?: string;
}

export default function Header({ id = 'app-header', currentScreen, onLogout, userEmail }: HeaderProps) {
  const getInitials = (email: string) => {
    if (!email) return 'OP';
    const part = email.split('@')[0];
    return part.slice(0, 2).toUpperCase();
  };

  return (
    <header
      id={id}
      className="flex justify-between items-center w-full px-5 h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shrink-0"
    >
      {currentScreen === 'PORTAL' && userEmail ? (
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xs tracking-wider border border-indigo-700 shadow-sm shadow-indigo-100">
            {getInitials(userEmail)}
          </div>
          <div className="text-left">
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none">
              Welcome back
            </p>
            <p className="text-xs font-bold text-slate-800 tracking-tight truncate max-w-[120px] capitalize pt-0.5">
              {userEmail.split('@')[0]}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div id="logo-icon-container" className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-100">
            <Wrench className="w-4 h-4" aria-hidden="true" />
          </div>
          <span className="font-sans text-base font-black tracking-tight text-slate-800">
            HEAVYGEAR
          </span>
        </div>
      )}

      <div className="flex items-center gap-2">
        {currentScreen === 'PORTAL' ? (
          <button
            id="btn-logout"
            onClick={onLogout}
            title="Log Out"
            className="p-1.5 px-3 rounded-xl bg-slate-50 border border-slate-150 hover:bg-rose-50 hover:border-rose-100 text-slate-500 hover:text-rose-600 transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        ) : (
          <div
            id="profile-avatar"
            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-200"
            title="Guest Operator"
          >
            <User className="w-4 h-4 text-slate-400" />
          </div>
        )}
      </div>
    </header>
  );
}
