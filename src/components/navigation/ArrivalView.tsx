import React from 'react';
import { CheckCircle2, MapPin, FileText, Home, RotateCcw, Building2, PhoneCall } from 'lucide-react';
import type { Destination } from '../../types';

interface ArrivalViewProps {
  destination: Destination;
  onGoHome: () => void;
  onReviewRoute: () => void;
}

export const ArrivalView: React.FC<ArrivalViewProps> = ({
  destination,
  onGoHome,
  onReviewRoute
}) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-4 sm:p-6">
      {/* Vùng thông báo thành công */}
      <div className="max-w-xl mx-auto w-full flex flex-col items-center text-center pt-8 pb-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-500/20 border-4 border-emerald-400 flex items-center justify-center mb-5 animate-bounce">
          <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-400" />
        </div>

        <span className="px-4 py-1 rounded-full bg-emerald-500/30 text-emerald-300 text-sm font-extrabold uppercase tracking-wider mb-2 border border-emerald-500/40">
          Đã hoàn thành tuyến
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
          Bác đã đến nơi!
        </h1>
        <p className="text-base sm:text-lg text-slate-300 font-medium max-w-md">
          Bác đang có mặt tại khu vực tiếp đón của điểm đến.
        </p>

        {/* Card thông tin điểm đến */}
        <div className="w-full bg-slate-800/90 rounded-2xl p-5 border border-slate-700 mt-6 text-left flex flex-col gap-3 shadow-xl">
          <div className="flex items-start gap-3">
            <MapPin className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {destination.name}
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-300 mt-1">
                <Building2 className="w-4 h-4 text-teal-400" />
                <span>{destination.building} — {destination.floor}</span>
              </div>
            </div>
          </div>

          {destination.notes && (
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80 text-sm text-slate-200 flex items-start gap-2">
              <FileText className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>{destination.notes}</span>
            </div>
          )}

          <div className="text-sm text-slate-400 pt-2 border-t border-slate-700/80 flex items-center justify-between">
            <span>Cần trợ giúp trực tiếp tại viện?</span>
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <PhoneCall className="w-4 h-4" />
              Bàn hướng dẫn sảnh C1-1
            </span>
          </div>
        </div>
      </div>

      {/* Hành động dưới cùng */}
      <div className="max-w-xl mx-auto w-full flex flex-col sm:flex-row items-center gap-3 pt-4 pb-2 safe-bottom">
        <button
          type="button"
          onClick={onReviewRoute}
          className="w-full sm:flex-1 min-h-[52px] h-14 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl font-black text-base flex items-center justify-center gap-2 border border-slate-700 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Xem lại sơ đồ tuyến</span>
        </button>

        <button
          type="button"
          onClick={onGoHome}
          className="w-full sm:flex-1 min-h-[52px] h-14 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>Về trang chủ MedNav</span>
        </button>
      </div>
    </div>
  );
};
