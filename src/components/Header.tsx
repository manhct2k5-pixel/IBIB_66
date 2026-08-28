import React, { useState } from 'react';
import { 
  Building2, 
  ShieldAlert, 
  Sparkles, 
  Globe, 
  Compass, 
  Home, 
  Info,
  Menu,
  X
} from 'lucide-react';

export type AppNavTab = 'home' | 'navigation' | 'data_info';

interface HeaderProps {
  language: 'vi' | 'en';
  onChangeLanguage: (lang: 'vi' | 'en') => void;
  onOpenEmergency: () => void;
  onOpenAIAssistant: () => void;
  activeTab: AppNavTab;
  onChangeTab: (tab: AppNavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onChangeLanguage,
  onOpenEmergency,
  onOpenAIAssistant,
  activeTab,
  onChangeTab
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3 text-slate-800 shrink-0 z-30 shadow-2xs">
      {/* Brand & Logo */}
      <div 
        className="flex items-center gap-2.5 min-w-0 cursor-pointer select-none"
        onClick={() => onChangeTab('home')}
      >
        <div className="w-8 h-8 rounded-xl bg-cyan-600 flex items-center justify-center text-white font-black shadow-xs shrink-0">
          <Building2 className="w-4 h-4 stroke-[2.5]" />
        </div>

        <div className="min-w-0">
          <h1 className="text-sm font-black tracking-tight text-slate-900 flex items-center gap-1.5 truncate">
            <span className="text-cyan-700 font-extrabold shrink-0 text-base">MedNav</span>
            <span className="text-xs text-slate-500 font-semibold truncate border-l border-slate-200 pl-1.5">
              Bệnh viện Bạch Mai
            </span>
          </h1>
        </div>
      </div>

      {/* Center Nav Tabs (Desktop) */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80">
        <button
          id="nav-tab-home"
          onClick={() => onChangeTab('home')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'bg-white text-cyan-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Trang chủ</span>
        </button>

        <button
          id="nav-tab-navigation"
          onClick={() => onChangeTab('navigation')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'navigation'
              ? 'bg-white text-cyan-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Chỉ đường</span>
        </button>

        <button
          id="nav-tab-data-info"
          onClick={() => onChangeTab('data_info')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'data_info'
              ? 'bg-white text-cyan-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>Thông tin dữ liệu</span>
        </button>
      </nav>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Emergency Action */}
        <button
          id="btn-header-emergency"
          onClick={onOpenEmergency}
          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          title="Hỗ trợ cấp cứu khẩn cấp"
        >
          <ShieldAlert className="w-4 h-4 text-white animate-pulse" />
          <span className="text-xs">Cấp cứu</span>
        </button>

        {/* AI Assistant Button */}
        <button
          id="btn-header-ai"
          onClick={onOpenAIAssistant}
          className="hidden sm:flex px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-xs rounded-xl border border-cyan-200 transition items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
          title="Hỏi trợ lý AI y tế"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          <span>Hỏi AI</span>
        </button>

        {/* Language switch */}
        <button
          id="btn-toggle-language"
          onClick={() => onChangeLanguage(language === 'vi' ? 'en' : 'vi')}
          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 transition flex items-center gap-1 cursor-pointer"
          title="Đổi ngôn ngữ"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-600" />
          <span>{language === 'vi' ? 'VI' : 'EN'}</span>
        </button>

        {/* Mobile Menu Toggle */}
        <button
          id="btn-mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-3 shadow-lg flex flex-col gap-1.5 z-40">
          <button
            onClick={() => {
              onChangeTab('home');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-left ${
              activeTab === 'home' ? 'bg-cyan-50 text-cyan-800' : 'text-slate-700'
            }`}
          >
            <Home className="w-4 h-4 text-cyan-600" />
            <span>Trang chủ</span>
          </button>

          <button
            onClick={() => {
              onChangeTab('navigation');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-left ${
              activeTab === 'navigation' ? 'bg-cyan-50 text-cyan-800' : 'text-slate-700'
            }`}
          >
            <Compass className="w-4 h-4 text-cyan-600" />
            <span>Chỉ đường</span>
          </button>

          <button
            onClick={() => {
              onChangeTab('data_info');
              setIsMobileMenuOpen(false);
            }}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-left ${
              activeTab === 'data_info' ? 'bg-cyan-50 text-cyan-800' : 'text-slate-700'
            }`}
          >
            <Info className="w-4 h-4 text-cyan-600" />
            <span>Thông tin dữ liệu</span>
          </button>

          <button
            onClick={() => {
              onOpenAIAssistant();
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-left text-cyan-800 bg-cyan-50/60"
          >
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span>Hỏi trợ lý AI</span>
          </button>
        </div>
      )}
    </header>
  );
};
