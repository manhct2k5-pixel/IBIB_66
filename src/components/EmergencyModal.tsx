import React from 'react';
import { 
  NATIONAL_EMERGENCY_PHONE 
} from '../data/hospitalData';
import { 
  PhoneCall, 
  Navigation, 
  X, 
  ShieldAlert, 
  ChevronRight
} from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmergencyDestination: () => void;
  language?: 'vi' | 'en';
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onSelectEmergencyDestination,
  language = 'vi'
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="emergency-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div 
        id="emergency-modal-content"
        className="w-full max-w-lg bg-white rounded-3xl border-2 border-rose-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                Bạn cần hỗ trợ cấp cứu?
              </h2>
              <p className="text-xs sm:text-sm text-rose-100 font-medium">
                Bệnh viện Bạch Mai • Hà Nội
              </p>
            </div>
          </div>

          <button
            id="btn-close-emergency-modal"
            onClick={onClose}
            className="h-10 px-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-sm transition flex items-center gap-1 cursor-pointer"
            aria-label="Đóng bảng cấp cứu"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
            <span className="hidden sm:inline">Đóng</span>
          </button>
        </div>

        {/* 3 Large Vertical Buttons */}
        <div className="p-5 space-y-3.5 overflow-y-auto">
          {/* Button 1: Call 115 */}
          <a
            id="btn-call-115"
            href={`tel:${NATIONAL_EMERGENCY_PHONE}`}
            className="w-full min-h-18 p-4 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border-2 border-rose-300 rounded-2xl flex items-center justify-between transition cursor-pointer text-rose-950 font-bold shadow-xs focus:outline-none focus:ring-4 focus:ring-rose-500/40"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <PhoneCall className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <div className="text-sm text-rose-700 font-bold">Tổng đài Cấp cứu Toàn quốc</div>
                <div className="text-xl sm:text-2xl font-black">Gọi 115</div>
              </div>
            </div>
            <span className="text-base font-black px-3.5 py-1.5 bg-rose-600 text-white rounded-xl shrink-0">
              115
            </span>
          </a>

          {/* Button 2: Call Hotline A9 */}
          <a
            id="btn-call-hotline-a9"
            href="tel:0869587707"
            className="w-full min-h-18 p-4 bg-red-50 hover:bg-red-100 active:bg-red-200 border-2 border-red-300 rounded-2xl flex items-center justify-between transition cursor-pointer text-red-950 font-bold shadow-xs focus:outline-none focus:ring-4 focus:ring-red-500/40"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-red-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                <PhoneCall className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <div className="text-sm text-red-700 font-bold">Hotline Cấp cứu A9 Bạch Mai</div>
                <div className="text-lg sm:text-xl font-black">Gọi A9: 086 958 7707</div>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-red-700 text-white rounded-lg shrink-0">
              24/7
            </span>
          </a>

          {/* Button 3: Route to A9 */}
          <button
            id="btn-route-to-a9"
            onClick={() => {
              onSelectEmergencyDestination();
              onClose();
            }}
            className="w-full min-h-18 p-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-black text-lg sm:text-xl rounded-2xl flex items-center justify-between transition cursor-pointer shadow-lg focus:outline-none focus:ring-4 focus:ring-slate-700/40"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Navigation className="w-6 h-6 text-rose-400 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <div>Chỉ đường đến Cấp cứu A9</div>
                <div className="text-xs sm:text-sm text-slate-300 font-medium">Tòa A9 cạnh Cổng số 1 Giải Phóng</div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-slate-400 shrink-0" />
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <button
            id="btn-close-emergency-bottom"
            onClick={onClose}
            className="w-full h-12 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-base rounded-xl transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
