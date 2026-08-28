import React, { useState } from 'react';
import { X, Check, Dot, Circle, MapPin, Map, ExternalLink, Code2 } from 'lucide-react';
import type { RouteNode, RouteEdge, NavigationStep } from '../../types';
import { TechnicalRouteMap } from './TechnicalRouteMap';

interface RouteOverviewSheetProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: RouteNode[];
  edges: RouteEdge[];
  pathNodeIds: string[];
  currentStepIndex: number;
  steps: NavigationStep[];
  onOpenOfficialMap?: () => void;
}

export const RouteOverviewSheet: React.FC<RouteOverviewSheetProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  pathNodeIds,
  currentStepIndex,
  steps,
  onOpenOfficialMap
}) => {
  const [showTechnicalMap, setShowTechnicalMap] = useState<boolean>(false);

  if (!isOpen) return null;

  const nodeMap = new globalThis.Map<string, RouteNode>(
    nodes.map(n => [n.id, n])
  );

  const pathNodes = pathNodeIds
    .map(id => nodeMap.get(id))
    .filter((n): n is RouteNode => Boolean(n));

  const totalLandmarks = pathNodes.length;
  const passedCount = currentStepIndex; // Số mốc đã hoàn thành
  const currentNodeId = pathNodeIds[currentStepIndex] || pathNodeIds[0];

  return (
    <div
      data-testid="route-overview-sheet"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 p-0 sm:p-4"
    >
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Danh sách toàn tuyến mốc
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-teal-700 mt-0.5">
              Đã qua {passedCount} trong {totalLandmarks} mốc
            </p>
          </div>
          <button
            type="button"
            data-testid="close-overview-btn"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thân danh sách */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3">
          {/* Banner thử nghiệm */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 font-medium">
            Tuyến thử nghiệm – chưa dùng để chỉ đường thực tế
          </div>

          {/* Danh sách mốc thứ tự */}
          <div className="flex flex-col gap-2">
            {pathNodes.map((node, index) => {
              const isPast = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isFuture = index > currentStepIndex;
              const isFirst = index === 0;
              const isLast = index === pathNodes.length - 1;

              return (
                <div
                  key={node.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                    isCurrent
                      ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                      : isPast
                      ? 'bg-slate-50/70 border-slate-200 text-slate-500'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  {/* Icon trạng thái mốc */}
                  <div className="mt-0.5 shrink-0">
                    {isPast && (
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                    {isCurrent && (
                      <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 shadow-xs">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />
                      </div>
                    )}
                    {isFuture && (
                      <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-400">
                        <Circle className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Chi tiết mốc */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">
                        Mốc {index + 1}:
                      </span>
                      <h4
                        className={`text-sm sm:text-base font-bold ${
                          isCurrent
                            ? 'text-slate-950 font-black'
                            : isPast
                            ? 'text-slate-600'
                            : 'text-slate-900'
                        }`}
                      >
                        {node.shortName || node.name}
                      </h4>
                      {isCurrent && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-bold">
                          Đang đi tới
                        </span>
                      )}
                      {isFirst && !isCurrent && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                          Bắt đầu
                        </span>
                      )}
                      {isLast && !isCurrent && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          Đích đến
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {node.landmarkDescription || node.visualInstruction}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Toggle mở Technical Map đối chiếu kỹ thuật */}
          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
            <button
              type="button"
              data-testid="toggle-technical-map-btn"
              onClick={() => setShowTechnicalMap(prev => !prev)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-slate-500" />
                <span>{showTechnicalMap ? 'Ẩn sơ đồ đối chiếu kỹ thuật' : 'Xem sơ đồ đối chiếu kỹ thuật (Debug)'}</span>
              </div>
              <span className="text-xs text-slate-500">Chỉ dành cho kỹ thuật</span>
            </button>

            {showTechnicalMap && (
              <div className="mt-2 animate-in fade-in duration-150">
                <TechnicalRouteMap
                  nodes={nodes}
                  edges={edges}
                  pathNodeIds={pathNodeIds}
                  currentNodeId={currentNodeId}
                  currentStepIndex={currentStepIndex}
                  steps={steps}
                  onOpenOfficialMap={onOpenOfficialMap}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {onOpenOfficialMap ? (
            <button
              type="button"
              onClick={onOpenOfficialMap}
              className="flex items-center gap-1.5 text-teal-700 hover:text-teal-800 text-sm font-bold transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Mở bản đồ chính thức 108</span>
            </button>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
