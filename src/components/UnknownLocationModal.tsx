import React from 'react';
import { 
  HelpCircle, 
  X, 
  QrCode, 
  MapPin, 
  Building2, 
  PhoneCall, 
  ChevronRight 
} from 'lucide-react';
import { MapNode } from '../types';
import { MAP_NODES_DATA } from '../data/hospitalData';

interface UnknownLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGate: (gateId: string) => void;
  onOpenQRScanner: () => void;
  onSelectNode: (node: MapNode) => void;
}

export const UnknownLocationModal: React.FC<UnknownLocationModalProps> = ({
  isOpen,
  onClose,
  onSelectGate,
  onOpenQRScanner,
  onSelectNode
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="unknown-location-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        id="unknown-location-modal-content"
        className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-cyan-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight leading-snug">
                Hướng dẫn xác định vị trí
              </h2>
              <p className="text-xs text-cyan-100 font-medium">
                4 bước đơn giản để tìm vị trí đứng
              </p>
            </div>
          </div>

          <button
            id="btn-close-unknown-modal"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            aria-label="Đóng hướng dẫn"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* 4 Steps Guide */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="w-7 h-7 rounded-full bg-cyan-700 text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="text-base text-slate-800 font-medium leading-snug">
                <strong>Nhìn biển tên cổng hoặc tòa nhà gần nhất</strong> (ví dụ: Biển "Cổng 4", "Tòa K1", "Tòa A9").
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="w-7 h-7 rounded-full bg-cyan-700 text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="text-base text-slate-800 font-medium leading-snug">
                <strong>Quét mã MedNav</strong> nếu bác thấy bảng mã QR dán tại cột cổng hoặc sảnh đón.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="w-7 h-7 rounded-full bg-cyan-700 text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="text-base text-slate-800 font-medium leading-snug">
                <strong>Chọn một trong 4 Cổng</strong> nếu bác vừa bước vào bệnh viện từ đường phố.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="w-7 h-7 rounded-full bg-cyan-700 text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5">
                4
              </div>
              <div className="text-base text-slate-800 font-medium leading-snug">
                Nếu vẫn chưa xác định được, hãy <strong>hỏi nhân viên bảo vệ</strong> tại cổng hoặc <strong>quầy tiếp đón</strong> gần nhất.
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="text-sm font-bold text-slate-700">
              Thao tác nhanh:
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenQRScanner();
              }}
              className="w-full h-14 px-4 bg-cyan-50 hover:bg-cyan-100 border-2 border-cyan-300 rounded-2xl flex items-center justify-between text-cyan-950 font-bold text-base transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <QrCode className="w-6 h-6 text-cyan-700" />
                <span>Quét mã vị trí tại chỗ</span>
              </div>
              <ChevronRight className="w-5 h-5 text-cyan-700" />
            </button>

            <button
              onClick={() => {
                onSelectGate('node_gate_4');
                onClose();
              }}
              className="w-full h-14 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-2xl flex items-center justify-between text-slate-900 font-bold text-base transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-emerald-700" />
                <span>Chọn Cổng 4 (Cổng chính khám bệnh)</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="w-full h-13 bg-slate-800 hover:bg-slate-900 text-white font-bold text-base rounded-2xl transition cursor-pointer"
          >
            Đã hiểu, quay lại chọn vị trí
          </button>
        </div>
      </div>
    </div>
  );
};
