import React from 'react';
import { 
  Building2, 
  ShieldAlert, 
  Sparkles, 
  Globe, 
  Layers,
  Activity,
  AlertTriangle,
  Map
} from 'lucide-react';
import { ACTIVE_HOSPITAL_OBSTACLES } from '../utils/pathfinding';

export type AppViewMode = 'overview_2d' | 'floor_2d' | '3d';

interface HeaderProps {
  language: 'vi' | 'en';
  onChangeLanguage: (lang: 'vi' | 'en') => void;
  onOpenEmergency: () => void;
  onOpenAIAssistant: () => void;
  activeObstaclesCount?: number;
  viewMode: AppViewMode;
  onChangeViewMode: (mode: AppViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onChangeLanguage,
  onOpenEmergency,
  onOpenAIAssistant,
  viewMode,
  onChangeViewMode
}) => {
  const obstaclesCount = ACTIVE_HOSPITAL_OBSTACLES.length;

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 text-slate-800 shrink-0 z-30 shadow-xs">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-cyan-600 flex items-center justify-center text-white font-black shadow-sm shrink-0">
          <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
        </div>

        <div className="min-w-0">
          <h1 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 flex items-center gap-1.5 truncate">
            <span className="text-cyan-700 font-extrabold shrink-0">MedNav</span>
            <span className="text-[11px] text-slate-500 font-semibold truncate">
              Bạch Mai
            </span>
            <span className="text-[10px] text-slate-400 font-normal hidden lg:inline border-l border-slate-200 pl-2">
              Bản Đồ Toàn Cảnh & Sơ Đồ Từng Tầng
            </span>
          </h1>
        </div>
      </div>

      {/* 3-Way Mode Selector: Hidden on mobile (synced with bottom nav bar), visible on md+ */}
      <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
        <button
          id="btn-switch-overview-2d-mode"
          onClick={() => onChangeViewMode('overview_2d')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            viewMode === 'overview_2d'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Sơ đồ 2D toàn cảnh chuẩn theo biển chỉ dẫn bệnh viện"
        >
          <Map className="w-3.5 h-3.5" />
          <span>Toàn cảnh 2D</span>
        </button>

        <button
          id="btn-switch-floor-2d-mode"
          onClick={() => onChangeViewMode('floor_2d')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            viewMode === 'floor_2d'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Sơ đồ 2D chi tiết các phòng khám & chỉ đường A*"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Từng tầng 2D</span>
        </button>

        <button
          id="btn-switch-3d-mode"
          onClick={() => onChangeViewMode('3d')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            viewMode === '3d'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Mô hình 3D khuôn viên toàn viện"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Toàn cảnh 3D</span>
        </button>
      </div>

      {/* Pathfinding Algorithm & Status Indicators */}
      <div className="hidden xl:flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          <span>Thuật toán A* Đa Tầng</span>
        </div>

        {obstaclesCount > 0 && (
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-medium"
            title="Đang cập nhật sự cố/vật cản thời gian thực để tự động tính đường vòng"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{obstaclesCount} cảnh báo</span>
          </div>
        )}
      </div>

      {/* Right Controls: Emergency, AI, Language */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Emergency Button */}
        <button
          id="btn-header-emergency"
          onClick={onOpenEmergency}
          className="px-2.5 sm:px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1 sm:gap-1.5 cursor-pointer active:scale-95"
          title="Khẩn cấp / Cấp cứu"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-white animate-pulse" />
          <span className="text-[11px] sm:text-xs">Cấp cứu</span>
        </button>

        {/* AI Assistant Button */}
        <button
          id="btn-header-ai"
          onClick={onOpenAIAssistant}
          className="px-2.5 sm:px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-xs rounded-xl border border-cyan-200 transition flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-xs active:scale-95"
          title="Hỏi trợ lý AI y tế"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          <span className="hidden xs:inline text-[11px] sm:text-xs">Hỏi AI</span>
        </button>

        {/* Language switch */}
        <button
          id="btn-toggle-language"
          onClick={() => onChangeLanguage(language === 'vi' ? 'en' : 'vi')}
          className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 transition flex items-center gap-1 cursor-pointer"
          title="Đổi ngôn ngữ"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-600" />
          <span className="text-[11px]">{language === 'vi' ? 'VI' : 'EN'}</span>
        </button>
      </div>
    </header>
  );
};
