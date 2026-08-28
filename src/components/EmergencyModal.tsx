import React from 'react';
import { 
  DEFAULT_EMERGENCY_NODE_ID, 
  DEFAULT_EMERGENCY_PHONE, 
  NATIONAL_EMERGENCY_PHONE 
} from '../data/hospitalData';
import { 
  ShieldAlert, 
  PhoneCall, 
  Navigation, 
  X, 
  AlertTriangle
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        id="emergency-modal-content"
        className="w-full max-w-lg bg-white rounded-3xl border border-rose-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-snug">
                {language === 'vi' ? 'Hỗ trợ cấp cứu khẩn cấp' : 'Emergency Assistance'}
              </h2>
              <p className="text-[11px] text-rose-100 font-medium">
                Bệnh viện Bạch Mai • Hà Nội
              </p>
            </div>
          </div>

          <button
            id="btn-close-emergency-modal"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            aria-label="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Warning */}
        <div className="p-5 space-y-4 overflow-y-auto">
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs sm:text-sm text-amber-950 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">
              Trường hợp nguy cấp, hãy gọi <strong>115</strong> hoặc đến <strong>Trung tâm Cấp cứu A9</strong>. MedNav chỉ hỗ trợ chỉ đường, không thay thế nhân viên y tế.
            </p>
          </div>

          <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <p className="font-semibold text-slate-800">
              📍 Vị trí Trung tâm Cấp cứu A9:
            </p>
            <p>
              Tòa nhà A9, gần Cổng số 1 (Số 78 Đường Giải Phóng, Hà Nội). Hoạt động 24/7 đón nhận mọi ca nguy kịch.
            </p>
          </div>

          {/* 3 Clear Action Buttons */}
          <div className="space-y-2.5 pt-1">
            {/* Button 1: 115 */}
            <a
              id="btn-call-115"
              href={`tel:${NATIONAL_EMERGENCY_PHONE}`}
              className="w-full py-3 px-4 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border-2 border-rose-300 rounded-2xl flex items-center justify-between transition cursor-pointer text-rose-950 font-bold"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-rose-700 font-semibold">Tổng đài cấp cứu toàn quốc</div>
                  <div className="text-base font-black">Gọi 115</div>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 bg-rose-600 text-white rounded-lg font-bold">
                115
              </span>
            </a>

            {/* Button 2: Hotline A9 */}
            <a
              id="btn-call-hotline-a9"
              href="tel:0869587707"
              className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 active:bg-red-200 border-2 border-red-300 rounded-2xl flex items-center justify-between transition cursor-pointer text-red-950 font-bold"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-red-700 font-semibold">Hotline Cấp cứu A9 Bạch Mai</div>
                  <div className="text-sm sm:text-base font-black">Gọi Hotline A9: 086 958 7707</div>
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-red-600 text-white rounded-lg font-bold">
                24/7
              </span>
            </a>

            {/* Button 3: Direct Navigation to A9 */}
            <button
              id="btn-route-to-a9"
              onClick={() => {
                onSelectEmergencyDestination();
                onClose();
              }}
              className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2.5 shadow-lg transition cursor-pointer"
            >
              <Navigation className="w-5 h-5 text-rose-400" />
              <span>Chỉ đường đến Trung tâm Cấp cứu A9</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Địa chỉ: Số 78 Đường Giải Phóng, Phường Kim Liên, Hà Nội
        </div>
      </div>
    </div>
  );
};
