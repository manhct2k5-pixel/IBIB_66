import React from 'react';
import { 
  Building2, 
  PhoneCall, 
  Menu,
  ArrowLeft,
  Home
} from 'lucide-react';
import { AppFlowState } from '../App';

interface SimpleHeaderProps {
  flowState: AppFlowState;
  onGoHome: () => void;
  onBack?: () => void;
  onOpenEmergency: () => void;
  onOpenGuide: () => void;
  onOpenMenu: () => void;
  language?: 'vi' | 'en';
}

export const SimpleHeader: React.FC<SimpleHeaderProps> = ({
  flowState,
  onGoHome,
  onBack,
  onOpenEmergency,
  onOpenGuide,
  onOpenMenu,
  language = 'vi'
}) => {
  const showBackButton = onBack && (flowState === 'start_location' || flowState === 'route_preview' || flowState === 'navigating');

  return (
    <header className="w-full h-14 sm:h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between gap-2 text-slate-900 shrink-0 z-30 shadow-2xs select-none">
      {/* Left side: Back Button OR Logo */}
      <div className="flex items-center gap-2 min-w-0">
        {showBackButton ? (
          <button
            id="btn-header-back"
            onClick={onBack}
            className="h-11 px-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl flex items-center gap-1.5 text-slate-800 font-bold text-base cursor-pointer focus:outline-none focus:ring-3 focus:ring-cyan-600/30"
            aria-label="Quay lại bước trước"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            <span className="text-sm font-black">Lại</span>
          </button>
        ) : null}

        <button
          id="btn-header-home"
          onClick={onGoHome}
          className="flex items-center gap-2 min-w-0 cursor-pointer text-left rounded-xl p-1 focus:outline-none focus:ring-3 focus:ring-cyan-600/30"
          aria-label="Về trang chủ MedNav Bệnh viện Bạch Mai"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-700 flex items-center justify-center text-white font-black shrink-0 shadow-2xs">
            <Building2 className="w-5 h-5 stroke-[2.5]" />
          </div>

          <div className="flex items-baseline gap-1.5 min-w-0">
            <span className="text-lg font-black tracking-tight text-cyan-800">
              MedNav
            </span>
            <span className="text-xs font-bold text-slate-500 truncate hidden xs:inline">
              Bạch Mai
            </span>
          </div>
        </button>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Big Emergency Button (min 88x48px, bold red, always visible) */}
        <button
          id="btn-header-emergency"
          onClick={onOpenEmergency}
          className="min-w-[88px] h-11 sm:h-12 px-3.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-sm sm:text-base rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none focus:ring-3 focus:ring-rose-500/40"
          aria-label="Hỗ trợ cấp cứu khẩn cấp"
        >
          <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5] shrink-0" />
          <span>Cấp cứu</span>
        </button>

        {/* 3-Dots / Menu Button */}
        <button
          id="btn-header-menu"
          onClick={onOpenMenu}
          className="w-11 h-11 sm:w-12 sm:h-12 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold rounded-xl border border-slate-200 transition flex items-center justify-center cursor-pointer focus:outline-none focus:ring-3 focus:ring-cyan-600/30"
          aria-label="Mở menu tùy chọn"
        >
          <Menu className="w-5 h-5 text-slate-700 stroke-[2.5]" />
        </button>
      </div>
    </header>
  );
};
