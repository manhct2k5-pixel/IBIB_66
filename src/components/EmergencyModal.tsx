import React from 'react';
import { ShieldAlert, PhoneCall, ArrowRight, HeartPulse, X, AlertTriangle } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToEmergency: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onNavigateToEmergency
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white border border-rose-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-rose-600 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-rose-600 flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-wide uppercase">
                HỖ TRỢ CẤP CỨU KHẨN CẤP (24/7)
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                Khoa Cấp Cứu - Tòa A, Tầng 1 (Phòng A-100)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-rose-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 text-slate-800 text-xs">
          {/* Main Action: Navigate to Emergency Room immediately */}
          <button
            id="btn-direct-emergency-route"
            onClick={() => {
              onNavigateToEmergency();
              onClose();
            }}
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-2xl shadow-lg transition active:scale-98 flex items-center justify-center gap-2 tracking-wide uppercase cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
            <span>CHỈ ĐƯỜNG GẤP TỚI PHÒNG CẤP CỨU (A-100)</span>
          </button>

          {/* Hotline Quick Call Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="tel:115"
              className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 hover:bg-rose-100 transition"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-medium">Cấp cứu Quốc gia</span>
                <span className="text-base font-bold text-rose-700">115</span>
              </div>
            </a>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-medium">Tổng đài BV Nội bộ</span>
                <span className="text-sm font-bold text-slate-900">Ext: 100 / 101</span>
              </div>
            </div>
          </div>

          {/* Rapid Triage Advice */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-rose-700 flex items-center gap-1.5 text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Dấu hiệu cần chuyển Cấp Cứu ngay lập tức:</span>
            </h4>
            <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
              <li>Đau tức ngực dữ dội kèm khó thở, vã mồ hôi lạnh</li>
              <li>Đột ngột yếu liệt nửa người, méo miệng, nói ngọng (Đột quỵ)</li>
              <li>Chấn thương mất máu nhiều, gãy xương hở, hôn mê, co giật</li>
              <li>Trẻ sơ sinh sốt cao co giật, tím tái hoặc hóc dị vật đường thở</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
