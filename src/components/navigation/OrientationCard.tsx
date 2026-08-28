import React from 'react';
import { Compass, CheckCircle2, Navigation } from 'lucide-react';
import type { RouteNode } from '../../types';

interface OrientationCardProps {
  startNode?: RouteNode;
  onConfirm: () => void;
  isConfirmed?: boolean;
}

export const OrientationCard: React.FC<OrientationCardProps> = ({
  startNode,
  onConfirm,
  isConfirmed = false
}) => {
  const facingText =
    startNode?.facingInstruction ||
    'Hãy đứng quay mặt vào phía trong bệnh viện, lưng quay về đường Trần Hưng Đạo.';

  return (
    <div
      data-testid="orientation-card"
      className={`w-full rounded-2xl p-4 sm:p-5 transition-all duration-300 ${
        isConfirmed
          ? 'bg-teal-50/70 border border-teal-200'
          : 'bg-amber-50 border-2 border-amber-300 shadow-md'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            isConfirmed
              ? 'bg-teal-100 text-teal-800'
              : 'bg-amber-100 text-amber-900 animate-pulse'
          }`}
        >
          {isConfirmed ? (
            <CheckCircle2 className="w-7 h-7" />
          ) : (
            <Compass className="w-7 h-7" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isConfirmed
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-amber-200 text-amber-950 uppercase tracking-wide'
              }`}
            >
              {isConfirmed ? 'Đã xác nhận hướng' : 'Trước khi đi: Định hướng ban đầu'}
            </span>
          </div>

          <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {facingText}
          </p>

          {!isConfirmed && (
            <div className="mt-3.5">
              <button
                type="button"
                data-testid="confirm-orientation-btn"
                onClick={onConfirm}
                className="w-full min-h-[56px] px-4 py-3 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <Navigation className="w-5 h-5" />
                <span>Tôi đang đứng đúng hướng</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
