import React, { useState, useRef, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Map as MapIcon,
  ExternalLink,
  Info
} from 'lucide-react';
import type { RouteNode, RouteEdge, NavigationStep } from '../../types';

export interface TechnicalRouteMapProps {
  nodes: RouteNode[];
  edges: RouteEdge[];
  pathNodeIds: string[];
  currentNodeId: string;
  currentStepIndex: number;
  steps: NavigationStep[];
  onOpenOfficialMap?: () => void;
}

export const TechnicalRouteMap: React.FC<TechnicalRouteMapProps> = ({
  nodes,
  edges,
  pathNodeIds,
  currentNodeId,
  currentStepIndex,
  steps: _steps,
  onOpenOfficialMap
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const startDragRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Map các node theo ID bằng globalThis.Map và useMemo tránh khởi tạo lại không cần thiết
  const nodeMap = useMemo(() => {
    return new globalThis.Map<string, RouteNode>(
      nodes.map(node => [node.id, node])
    );
  }, [nodes]);

  // Tập hợp các node thuộc tuyến đi
  const pathSet = useMemo(() => {
    return new globalThis.Set<string>(pathNodeIds);
  }, [pathNodeIds]);

  // Lọc các node hợp lệ trên tuyến đi
  const pathNodes = useMemo(() => {
    return pathNodeIds
      .map(id => nodeMap.get(id))
      .filter((node): node is RouteNode => Boolean(node));
  }, [pathNodeIds, nodeMap]);

  // Lấy các node có tọa độ x, y để tính bounding box an toàn
  const { viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight, hasValidCoordinates } = useMemo(() => {
    const positionedPathNodes = pathNodes.filter(
      n => typeof n.x === 'number' && typeof n.y === 'number' && !Number.isNaN(n.x) && !Number.isNaN(n.y)
    );
    
    if (positionedPathNodes.length === 0) {
      return {
        viewBoxX: 0,
        viewBoxY: 0,
        viewBoxWidth: 800,
        viewBoxHeight: 600,
        hasValidCoordinates: false
      };
    }

    const xs = positionedPathNodes.map(n => n.x as number);
    const ys = positionedPathNodes.map(n => n.y as number);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const padding = 100;
    const width = Math.max(maxX - minX + padding * 2, 400);
    const height = Math.max(maxY - minY + padding * 2, 350);

    return {
      viewBoxX: minX - padding,
      viewBoxY: minY - padding,
      viewBoxWidth: width,
      viewBoxHeight: height,
      hasValidCoordinates: true
    };
  }, [pathNodes]);

  // Các hàm điều khiển zoom & pan
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.6));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Kéo thả chuột để di chuyển bản đồ
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    isDraggingRef.current = true;
    startDragRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDraggingRef.current) return;
    setPan({
      x: e.clientX - startDragRef.current.x,
      y: e.clientY - startDragRef.current.y
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Chạm kéo trên màn hình cảm ứng
  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      const touch = e.touches[0];
      startDragRef.current = { x: touch.clientX - pan.x, y: touch.clientY - pan.y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPan({
      x: touch.clientX - startDragRef.current.x,
      y: touch.clientY - startDragRef.current.y
    });
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <div 
      data-testid="technical-route-map-container"
      className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col relative"
    >
      {/* Header thanh công cụ bản đồ */}
      <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <MapIcon className="w-4 h-4 text-teal-400" />
          <span className="text-sm font-bold text-slate-200">
            Sơ đồ kỹ thuật & đối chiếu
          </span>
          <span className="text-sm px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            Debug
          </span>
        </div>

        {/* Các nút thu phóng */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            data-testid="zoom-in-btn"
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors"
            title="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            data-testid="zoom-out-btn"
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            data-testid="reset-view-btn"
            onClick={handleResetView}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors"
            title="Vừa màn hình"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Vùng hiển thị SVG tương tác */}
      <div className="relative w-full h-[220px] sm:h-[260px] bg-slate-950 overflow-hidden cursor-grab active:cursor-grabbing select-none">
        {hasValidCoordinates ? (
          <svg
            className="w-full h-full"
            viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <defs>
              <pattern
                id="grid-pattern"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 30 0 L 0 0 0 30"
                  fill="none"
                  stroke="rgba(51, 65, 85, 0.3)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            {/* Lưới nền */}
            <rect
              x={viewBoxX}
              y={viewBoxY}
              width={viewBoxWidth}
              height={viewBoxHeight}
              fill="url(#grid-pattern)"
            />

            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} style={{ transformOrigin: 'center' }}>
              {/* 1. Vẽ các cạnh nền (toàn viện) */}
              {edges.map(edge => {
                const fromNode = nodeMap.get(edge.from);
                const toNode = nodeMap.get(edge.to);
                if (!fromNode || !toNode || fromNode.x === undefined || fromNode.y === undefined || toNode.x === undefined || toNode.y === undefined) return null;

                const isPathEdge =
                  pathSet.has(edge.from) &&
                  pathSet.has(edge.to) &&
                  Math.abs(pathNodeIds.indexOf(edge.from) - pathNodeIds.indexOf(edge.to)) === 1;

                if (isPathEdge) return null; // Vẽ đè ở lớp trên

                return (
                  <line
                    key={edge.id}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="#334155"
                    strokeWidth="3"
                    strokeDasharray="4,4"
                  />
                );
              })}

              {/* 2. Vẽ tuyến đường đang chọn (Path Highlights) */}
              {pathNodes.map((node, idx) => {
                if (idx >= pathNodes.length - 1) return null;
                const nextNode = pathNodes[idx + 1];
                if (!node || !nextNode || node.x === undefined || node.y === undefined || nextNode.x === undefined || nextNode.y === undefined) return null;

                const isTraversed = idx < currentStepIndex;

                return (
                  <g key={`path_seg_${node.id}_${nextNode.id}`}>
                    <line
                      x1={node.x}
                      y1={node.y}
                      x2={nextNode.x}
                      y2={nextNode.y}
                      stroke={isTraversed ? '#0d9488' : '#f59e0b'}
                      strokeWidth="6"
                      strokeLinecap="round"
                      className={!isTraversed ? 'animate-pulse' : ''}
                    />
                  </g>
                );
              })}

              {/* 3. Vẽ tất cả các node */}
              {nodes.map(node => {
                if (node.x === undefined || node.y === undefined) return null;

                const isStart = node.id === pathNodeIds[0];
                const isDest = node.id === pathNodeIds[pathNodeIds.length - 1];
                const isCurrent = node.id === currentNodeId;
                const isInPath = pathSet.has(node.id);

                let fill = '#475569';
                let stroke = '#1e293b';
                let radius = 7;

                if (isInPath) {
                  fill = '#0d9488'; // Teal
                  radius = 9;
                }

                if (isStart) {
                  fill = '#10b981'; // Xanh lá
                  radius = 11;
                }

                if (isDest) {
                  fill = '#f43f5e'; // Đỏ
                  radius = 11;
                }

                if (isCurrent) {
                  fill = '#f59e0b'; // Vàng cam
                  radius = 13;
                  stroke = '#ffffff';
                }

                return (
                  <g key={node.id} className="cursor-pointer">
                    {isCurrent && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={22}
                        fill="#f59e0b"
                        opacity={0.3}
                        className="animate-ping"
                      />
                    )}

                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={radius}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={isCurrent ? 3 : 2}
                    />

                    {/* Tên nhãn node */}
                    <text
                      x={node.x}
                      y={node.y - radius - 5}
                      textAnchor="middle"
                      fill={isCurrent ? '#fde68a' : isInPath ? '#e2e8f0' : '#64748b'}
                      fontSize={isCurrent ? '13' : '11'}
                      fontWeight={isCurrent || isStart || isDest ? 'bold' : 'normal'}
                      className="pointer-events-none drop-shadow-sm select-none"
                    >
                      {node.shortName || node.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-slate-400">
            <Info className="w-8 h-8 text-teal-500/60 mb-2" />
            <p className="text-sm font-medium text-slate-300">
              Chưa có dữ liệu sơ đồ cho tuyến này
            </p>
            <p className="text-sm text-slate-400 mt-1 max-w-xs">
              Vui lòng theo dõi thẻ chỉ dẫn từng bước hoặc đối chiếu với sơ đồ chính thức của Bệnh viện 108.
            </p>
          </div>
        )}
      </div>

      {/* Footer bản đồ */}
      {onOpenOfficialMap && (
        <div className="bg-slate-950/90 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
          <span>Sơ đồ phân đoạn đồ thị</span>
          <button
            type="button"
            data-testid="open-official-map-btn"
            onClick={onOpenOfficialMap}
            className="flex items-center gap-1 text-teal-400 hover:text-teal-300 font-bold underline transition-colors"
          >
            <span>Bản đồ chính thức 108</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
