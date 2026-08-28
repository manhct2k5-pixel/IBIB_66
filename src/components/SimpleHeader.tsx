import React from 'react';
import { 
  Building2, 
  PhoneCall, 
  HelpCircle, 
  Menu,
  Home
} from 'lucide-react';

interface SimpleHeaderProps {
  onGoHome: () => void;
  onOpenEmergency: () => void;
  onOpenGuide: () => void;
  onOpenMenu: () => void;
  language?: 'vi' | 'en';
}

export const SimpleHeader: React.FC<SimpleHeaderProps> = ({
  onGoHome,
  onOpenEmergency,
  onOpenGuide,
  onOpenMenu,
  language = 'vi'
}) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 px-3.5 sm:px-6 py-3 flex items-center justify-between gap-3 text-slate-900 shrink-0 z-30 shadow-xs">
      {/* Brand & Logo */}
      <button
        id="btn-header-home"
        onClick={onGoHome}
        className="flex items-center gap-2.5 min-w-0 cursor-pointer select-none text-left rounded-xl p-1 -m-1 focus:outline-none focus:ring-4 focus:ring-cyan-600/30"
        aria-label="Về trang bắt đầu MedNav Bệnh viện Bạch Mai"
      >
        <div className="w-10 h-10 rounded-2xl bg-cyan-700 flex items-center justify-center text-white font-black shadow-xs shrink-0">
          <Building2 className="w-5 h-5 stroke-[2.5]" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight text-cyan-800">
              MedNav
            </span>
            <span className="text-sm font-bold text-slate-600 border-l border-slate-300 pl-2 truncate hidden sm:inline">
              Bệnh viện Bạch Mai
            </span>
            <span className="text-sm font-bold text-slate-600 border-l border-slate-300 pl-2 truncate sm:hidden">
              Bạch Mai
            </span>
          </div>
        </div>
      </button>

      {/* Center Nav Actions (Desktop Only) */}
      <div className="hidden md:flex items-center gap-2">
        <button
          id="btn-desktop-home"
          onClick={onGoHome}
          className="px-4 py-2.5 text-base font-bold text-slate-700 hover:text-cyan-800 hover:bg-slate-100 rounded-xl transition flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-600/30"
        >
          <Home className="w-5 h-5 text-slate-500" />
          <span>Trang chủ</span>
        </button>

        <button
          id="btn-desktop-guide"
          onClick={onOpenGuide}
          className="px-4 py-2.5 text-base font-bold text-slate-700 hover:text-cyan-800 hover:bg-slate-100 rounded-xl transition flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-600/30"
        >
          <HelpCircle className="w-5 h-5 text-cyan-700" />
          <span>Hướng dẫn sử dụng</span>
        </button>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Big Emergency Button */}
        <button
          id="btn-header-emergency"
          onClick={onOpenEmergency}
          className="h-12 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-base rounded-2xl shadow-xs transition flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-rose-500/40"
          aria-label="Hỗ trợ cấp cứu khẩn cấp"
        >
          <PhoneCall className="w-5 h-5 text-white stroke-[2.5]" />
          <span>Cấp cứu</span>
        </button>

        {/* Menu Button */}
        <button
          id="btn-header-menu"
          onClick={onOpenMenu}
          className="h-12 px-3.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-base rounded-2xl border border-slate-200 transition flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-600/30"
          aria-label="Mở menu tùy chọn"
        >
          <Menu className="w-5 h-5 text-slate-700 stroke-[2.5]" />
          <span className="hidden sm:inline">Menu</span>
        </button>
      </div>
    </header>
  );
};
