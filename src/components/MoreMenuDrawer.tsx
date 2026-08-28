import React from 'react';
import { X, Map, Info, Phone, HeartPulse, Building2 } from 'lucide-react';
import { HOSPITAL_108_SOURCES } from '../data/hospital108';

interface MoreMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MoreMenuDrawer({ isOpen, onClose }: MoreMenuDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-sm sm:max-w-md bg-slate-50 h-[100dvh] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-slate-200 shrink-0">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">Menu</h2>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <X className="w-7 h-7 text-slate-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20">
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 mb-6 text-center shadow-sm">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-emerald-700" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">MedNav 108</h3>
            <p className="text-base font-medium text-slate-600 leading-relaxed mb-4">
              Bản đồ chỉ dẫn Bệnh viện Trung ương Quân đội 108
            </p>
            <div className="text-sm font-bold text-slate-600 bg-slate-100 px-4 py-2.5 rounded-lg inline-block">
              {HOSPITAL_108_SOURCES.address}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider px-2">Liên hệ & Hỗ trợ</h3>
            
            <a href={`tel:${HOSPITAL_108_SOURCES.hotlines.khamTheoYeuCau.replace(/\s+/g, '')}`} className="flex items-center justify-between p-4 min-h-[80px] bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <HeartPulse className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900 group-hover:text-emerald-700">Khám theo yêu cầu</div>
                  <div className="text-base font-medium text-slate-600">{HOSPITAL_108_SOURCES.hotlines.khamTheoYeuCau}</div>
                </div>
              </div>
              <Phone className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 shrink-0" />
            </a>

            <a href={`tel:${HOSPITAL_108_SOURCES.hotlines.congTacXaHoi.replace(/\s+/g, '')}`} className="flex items-center justify-between p-4 min-h-[80px] bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center shrink-0">
                  <Info className="w-6 h-6 text-sky-700" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900 group-hover:text-sky-700">Ban Công tác xã hội</div>
                  <div className="text-base font-medium text-slate-600">Hướng dẫn thủ tục • {HOSPITAL_108_SOURCES.hotlines.congTacXaHoi}</div>
                </div>
              </div>
              <Phone className="w-6 h-6 text-slate-400 group-hover:text-sky-600 shrink-0" />
            </a>

            <a href={`tel:${HOSPITAL_108_SOURCES.hotlines.keHoachTongHop.replace(/\s+/g, '')}`} className="flex items-center justify-between p-4 min-h-[80px] bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-indigo-700" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900 group-hover:text-indigo-700">Phòng Kế hoạch Tổng hợp</div>
                  <div className="text-base font-medium text-slate-600">BHYT & Chuyên môn • {HOSPITAL_108_SOURCES.hotlines.keHoachTongHop}</div>
                </div>
              </div>
              <Phone className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 shrink-0" />
            </a>

          </div>
          
          <div className="mt-8 space-y-4">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider px-2">Nguồn thông tin</h3>
            <a 
              href={HOSPITAL_108_SOURCES.mainWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 min-h-[80px] bg-white rounded-2xl border-2 border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                <Map className="w-6 h-6 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-bold text-slate-900">Website Bệnh viện 108</div>
                <div className="text-base font-medium text-slate-600 truncate">benhvien108.vn</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
