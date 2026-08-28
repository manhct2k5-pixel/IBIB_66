import React from 'react';
import { 
  X, 
  HelpCircle, 
  ShieldCheck, 
  Globe, 
  Building2, 
  PhoneCall, 
  Home, 
  ChevronRight 
} from 'lucide-react';

interface MoreMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onGoHome: () => void;
  onOpenGuide: () => void;
  onOpenDataInfo: () => void;
  onOpenEmergency: () => void;
  language: 'vi' | 'en';
  onChangeLanguage: (lang: 'vi' | 'en') => void;
}

export const MoreMenuDrawer: React.FC<MoreMenuDrawerProps> = ({
  isOpen,
  onClose,
  onGoHome,
  onOpenGuide,
  onOpenDataInfo,
  onOpenEmergency,
  language,
  onChangeLanguage
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="more-menu-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div 
        id="more-menu-content"
        className="w-full max-w-sm h-full bg-white shadow-2xl flex flex-col justify-between p-5 animate-in slide-in-from-right duration-200"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-700 text-white flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Menu tùy chọn
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  MedNav Bệnh viện Bạch Mai
                </p>
              </div>
            </div>

            <button
              id="btn-close-more-menu"
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              aria-label="Đóng menu"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            <button
              onClick={() => {
                onGoHome();
                onClose();
              }}
              className="w-full h-14 px-4 bg-slate-50 hover:bg-slate-100 rounded-2xl font-bold text-base text-slate-900 flex items-center justify-between transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-cyan-800" />
                <span>Trang bắt đầu</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <button
              onClick={() => {
                onOpenGuide();
                onClose();
              }}
              className="w-full h-14 px-4 bg-slate-50 hover:bg-slate-100 rounded-2xl font-bold text-base text-slate-900 flex items-center justify-between transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-cyan-800" />
                <span>Hướng dẫn sử dụng</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <button
              onClick={() => {
                onOpenDataInfo();
                onClose();
              }}
              className="w-full h-14 px-4 bg-slate-50 hover:bg-slate-100 rounded-2xl font-bold text-base text-slate-900 flex items-center justify-between transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-800" />
                <span>Nguồn & Giới hạn dữ liệu</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <button
              onClick={() => {
                onOpenEmergency();
                onClose();
              }}
              className="w-full h-14 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl font-bold text-base text-rose-950 flex items-center justify-between transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-rose-600" />
                <span>Hỗ trợ cấp cứu (115 / A9)</span>
              </div>
              <ChevronRight className="w-5 h-5 text-rose-400" />
            </button>
          </div>

          {/* Language Switch */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <Globe className="w-4 h-4 text-cyan-700" />
              <span>Ngôn ngữ hiển thị</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChangeLanguage('vi')}
                className={`h-11 rounded-xl font-bold text-sm transition cursor-pointer ${
                  language === 'vi' 
                    ? 'bg-cyan-700 text-white shadow-xs' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Tiếng Việt
              </button>
              <button
                onClick={() => onChangeLanguage('en')}
                className={`h-11 rounded-xl font-bold text-sm transition cursor-pointer ${
                  language === 'en' 
                    ? 'bg-cyan-700 text-white shadow-xs' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 text-center space-y-1 font-medium">
          <p>MedNav Bệnh viện Bạch Mai</p>
          <p>Số 78 Đường Giải Phóng, Hà Nội</p>
        </div>
      </div>
    </div>
  );
};
