import React from 'react';
import { ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { MapPrecision } from '../types';

interface MapPrecisionBadgeProps {
  precision: MapPrecision;
  className?: string;
}

export function MapPrecisionBadge({ precision, className = '' }: MapPrecisionBadgeProps) {
  switch (precision) {
    case 'exact_facility':
      return (
        <span className={`inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl ${className}`}>
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700 shrink-0" />
          <span>Mở đúng địa điểm trên bản đồ</span>
        </span>
      );
    case 'verified_floor':
      return (
        <span className={`inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl ${className}`}>
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700 shrink-0" />
          <span>Đã xác minh tòa và tầng</span>
        </span>
      );
    case 'building_start_view':
      return (
        <span className={`inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl ${className}`}>
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 shrink-0" />
          <span>Mở bản đồ tại tầng bắt đầu</span>
        </span>
      );
    case 'campus_only':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl ${className}`}>
          <Info className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 shrink-0" />
          <span>Chỉ xác minh vị trí trên khuôn viên</span>
        </span>
      );
  }
}
