import React from 'react';
import { Phone, Map, X, ExternalLink, ShieldAlert } from 'lucide-react';
import { HOSPITAL_108_SOURCES } from '../data/hospital108';

interface EmergencyModalProps {
  onClose: () => void;
  onOpenMap: () => void;
}

export function EmergencyModal({ onClose, onOpenMap }: EmergencyModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-rose-600 p-6 flex flex-col items-center text-center text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
            <ShieldAlert className="w-8 h-8 text-rose-600 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black mb-2">Hỗ trợ khẩn cấp</h2>
          <p className="text-rose-100 font-medium text-sm">
            Trong trường hợp nguy kịch, hãy gọi 115 và làm theo hướng dẫn của nhân viên y tế.
          </p>
        </div>

        <div className="p-4 sm:p-6 flex flex-col gap-3">
          <a 
            href={`tel:${HOSPITAL_108_SOURCES.nationalEmergency}`}
            className="w-full flex items-center justify-between p-4 bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 rounded-2xl transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center shadow-md">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-lg font-black text-slate-900">Gọi 115</div>
                <div className="text-sm font-medium text-slate-600">Cấp cứu Quốc gia</div>
              </div>
            </div>
          </a>

          <a 
            href={`tel:${HOSPITAL_108_SOURCES.emergencyPhone.replace(/\s+/g, '')}`}
            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 rounded-2xl transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-200 group-hover:bg-rose-100 rounded-xl flex items-center justify-center transition-colors">
                <Phone className="w-6 h-6 text-slate-600 group-hover:text-rose-600" />
              </div>
              <div className="text-left">
                <div className="text-lg font-black text-slate-900">Gọi Khoa Cấp cứu</div>
                <div className="text-sm font-medium text-slate-600">Bệnh viện 108 • {HOSPITAL_108_SOURCES.emergencyPhone}</div>
              </div>
            </div>
          </a>

          <button 
            onClick={() => {
              onClose();
              onOpenMap();
            }}
            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 rounded-2xl transition-colors group mt-2"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center">
                <Map className="w-6 h-6 text-slate-600" />
              </div>
              <div className="text-left">
                <div className="text-lg font-black text-slate-900">Mở bản đồ Bệnh viện</div>
                <div className="text-sm font-medium text-slate-600">Xem sơ đồ khuôn viên</div>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
