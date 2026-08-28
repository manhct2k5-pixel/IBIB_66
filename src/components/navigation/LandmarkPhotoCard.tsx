import React from 'react';
import { Eye, ImageOff, CheckCircle, ShieldCheck } from 'lucide-react';
import type { RouteNode } from '../../types';

interface LandmarkPhotoCardProps {
  landmarkNode?: RouteNode;
  stepLandmarkName: string;
  stepVisualCue?: string;
  onOpenPhotoDetail?: () => void;
}

export const LandmarkPhotoCard: React.FC<LandmarkPhotoCardProps> = ({
  landmarkNode,
  stepLandmarkName,
  stepVisualCue,
  onOpenPhotoDetail
}) => {
  const cue =
    landmarkNode?.visibleCue ||
    stepVisualCue ||
    landmarkNode?.landmarkDescription ||
    'Quan sát biển chỉ dẫn và khu vực đặc trưng phía trước.';

  const hasVerifiedPhoto =
    Boolean(landmarkNode?.landmarkPhotoUrl) &&
    landmarkNode?.dataStatus === 'field_verified';

  return (
    <div
      data-testid="landmark-photo-card"
      className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col gap-3"
    >
      {/* Tiêu đề mục tiêu mốc */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-amber-600" />
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-700">
            Mốc cần tìm
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
          Mốc nhận biết thực tế
        </span>
      </div>

      {/* Tên mốc lớn */}
      <div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
          {landmarkNode?.name || stepLandmarkName}
        </h3>
      </div>

      {/* Dấu hiệu nhận biết */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex flex-col gap-1">
        <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
          Dấu hiệu nhận biết:
        </span>
        <p className="text-base font-medium text-slate-800 leading-relaxed">
          {cue}
        </p>
      </div>

      {/* Khu vực ảnh mốc */}
      {hasVerifiedPhoto && landmarkNode?.landmarkPhotoUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
          <img
            src={landmarkNode.landmarkPhotoUrl}
            alt={landmarkNode.landmarkPhotoAlt || landmarkNode.name}
            className="w-full h-48 sm:h-56 object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-transparent p-3 text-white flex items-center justify-between">
            <span className="text-xs flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Ảnh khảo sát thực địa
            </span>
            {landmarkNode.photoCapturedAt && (
              <span className="text-xs text-slate-300">
                {landmarkNode.photoCapturedAt}
              </span>
            )}
          </div>
          {onOpenPhotoDetail && (
            <button
              type="button"
              onClick={onOpenPhotoDetail}
              className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs font-bold backdrop-blur-xs transition-colors"
            >
              Xem lớn hơn
            </button>
          )}
        </div>
      ) : (
        <div
          data-testid="no-verified-photo-notice"
          className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center flex flex-col items-center justify-center gap-1.5"
        >
          <div className="w-10 h-10 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-500 mb-0.5">
            <ImageOff className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-slate-700">
            Chưa có ảnh mốc đã xác minh
          </span>
          <span className="text-xs text-slate-500 max-w-xs">
            Bác vui lòng quan sát biển chữ và dấu hiệu mô tả phía trên.
          </span>
        </div>
      )}
    </div>
  );
};
