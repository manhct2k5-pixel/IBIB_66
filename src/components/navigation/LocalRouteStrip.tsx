import React from 'react';
import { ArrowDown, Check, Dot, Circle, MapPin } from 'lucide-react';
import type { RouteNode } from '../../types';

interface LocalRouteStripProps {
  previousNode?: RouteNode | null;
  currentNode: RouteNode;
  nextNode?: RouteNode | null;
  currentStepNumber: number;
  totalSteps: number;
}

export const LocalRouteStrip: React.FC<LocalRouteStripProps> = ({
  previousNode,
  currentNode,
  nextNode,
  currentStepNumber,
  totalSteps
}) => {
  return (
    <div
      data-testid="local-route-strip"
      className="w-full bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col gap-2.5"
    >
      {/* Tiêu đề & Cảnh báo không theo tỷ lệ */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
          Trình tự 3 mốc liên tiếp
        </span>
        <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
          Sơ đồ trình tự mốc – không theo tỷ lệ
        </span>
      </div>

      {/* Danh sách 3 mốc thẳng đứng trực quan */}
      <div className="flex flex-col gap-1.5 py-1">
        {/* 1. Mốc trước / Điểm vừa qua */}
        {previousNode ? (
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-slate-50 text-slate-500">
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 text-slate-600 stroke-[3]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-600">Vừa qua:</div>
              <div className="text-sm font-semibold truncate text-slate-700">
                {previousNode.shortName || previousNode.name}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-slate-50 text-slate-500">
            <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5 text-teal-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-teal-700">Điểm xuất phát:</div>
              <div className="text-sm font-semibold truncate text-slate-700">
                Bắt đầu hành trình
              </div>
            </div>
          </div>
        )}

        {/* Mũi tên liên kết */}
        <div className="flex justify-start pl-5 text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* 2. Mốc đang tìm (Nổi bật) */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 shadow-xs">
          <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shrink-0 shadow-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-ping" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wide">
              Đang tìm tới (Mốc {currentStepNumber}/{totalSteps}):
            </div>
            <div className="text-base font-black truncate text-slate-950">
              {currentNode.shortName || currentNode.name}
            </div>
          </div>
        </div>

        {/* Mũi tên liên kết */}
        <div className="flex justify-start pl-5 text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* 3. Mốc tiếp theo */}
        {nextNode ? (
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-slate-50 text-slate-600">
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
              <Circle className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-600">Mốc tiếp theo sau đó:</div>
              <div className="text-sm font-semibold truncate text-slate-700">
                {nextNode.shortName || nextNode.name}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-emerald-50 text-emerald-800">
            <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 text-emerald-800 stroke-[3]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-emerald-700">Đích đến cuối cùng:</div>
              <div className="text-sm font-bold truncate text-emerald-900">
                Đến nơi khám bệnh
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
