import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Map, ExternalLink } from 'lucide-react';
import type { RouteNode, RouteEdge, NavigationStep } from '../../types';

interface RouteMapProps {
  nodes: RouteNode[];
  edges: RouteEdge[];
  pathNodeIds: string[];
  currentNodeId: string;
  currentStepIndex: number;
  steps: NavigationStep[];
  onOpenOfficialMap?: () => void;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  nodes,
  edges,
  pathNodeIds,
  currentNodeId,
  currentStepIndex,
  steps,
  onOpenOfficialMap
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const startDragRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Map các node theo ID
  const nodeMap = new Map<string, RouteNode>();
  for (const n of nodes) {
    nodeMap.set(n.id, n);
  }

  // Tập hợp các node thuộc tuyến đi
  const pathSet = new Set(pathNodeIds);

  // Tính tọa độ bounding box cơ bản để tự động căn giữa
  const pathNodes = pathNodeIds.map(id => nodeMap.get(id)).filter(Boolean) as RouteNode[];
  const minX = Math.min(...pathNodes.map(n => n.x ?? 100), 50);
  const maxX = Math.max(...pathNodes.map(n => n.x ?? 700), 750);
  const minY = Math.min(...pathNodes.map(n => n.y ?? 100), 50);
  const maxY = Math.max(...pathNodes.map(n => n.y ?? 500), 550);

  const viewBoxWidth = Math.max(maxX - minX + 160, 400);
  const viewBoxHeight = Math.max(maxY - minY + 160, 300);
  const viewBoxX = minX - 80;
  const viewBoxY = minY - 80;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.6));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startDragRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    setPan({
      x: e.clientX - startDragRef.current.x,
      y: e.clientY - startDragRef.current.y
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="relative w-full h-64 sm:h-80 bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-inner select-none">
      {/* Nút điều khiển phóng to / thu nhỏ / căn giữa */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 bg-slate-900/90 backdrop-blur-sm p-1 rounded-xl border border-slate-700/80 shadow-md">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 transition-colors"
          title="Phóng to"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 transition-colors"
          title="Thu nhỏ"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={handleResetView}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 transition-colors"
          title="Vừa màn hình"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Nút mở bản đồ chính thức đối chiếu */}
      {onOpenOfficialMap && (
        <button
          type="button"
          onClick={onOpenOfficialMap}
          className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-teal-300 border border-teal-500/40 text-sm font-bold shadow-md transition-colors"
        >
          <Map className="w-4 h-4 text-teal-400" />
          <span>Bản đồ đối chiếu</span>
          <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
        </button>
      )}

      {/* SVG Canvas sơ đồ đồ thị */}
      <svg
        className="w-full h-full cursor-grab active:cursor-grabbing"
        viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Lưới grid nền trang trí */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
            </pattern>
          </defs>
          <rect
            x={viewBoxX - 500}
            y={viewBoxY - 500}
            width={viewBoxWidth + 1000}
            height={viewBoxHeight + 1000}
            fill="url(#grid)"
          />

          {/* 1. Vẽ các CẠNH ngoài tuyến (màu xám tối) */}
          {edges.map(edge => {
            const fromNode = nodeMap.get(edge.from);
            const toNode = nodeMap.get(edge.to);
            if (!fromNode || !toNode || fromNode.x === undefined || fromNode.y === undefined || toNode.x === undefined || toNode.y === undefined) return null;

            const isPartOfRoute = pathSet.has(edge.from) && pathSet.has(edge.to);
            if (isPartOfRoute) return null; // Vẽ ở bước sau

            return (
              <line
                key={`edge_${edge.id}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="#334155"
                strokeWidth="3"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* 2. Vẽ các CẠNH thuộc tuyến đi (phân biệt Đã đi / Hiện tại / Tiếp theo) */}
          {pathNodeIds.map((nodeId, idx) => {
            if (idx >= pathNodeIds.length - 1) return null;
            const nextNodeId = pathNodeIds[idx + 1];
            const fromNode = nodeMap.get(nodeId);
            const toNode = nodeMap.get(nextNodeId);
            if (!fromNode || !toNode || fromNode.x === undefined || fromNode.y === undefined || toNode.x === undefined || toNode.y === undefined) return null;

            let strokeColor = '#0284c7'; // Xanh nhạt cho chặng tiếp theo
            let strokeWidth = 6;
            let strokeDasharray = 'none';

            if (idx < currentStepIndex) {
              // Chặng đã đi qua -> xám nét đứt
              strokeColor = '#64748b';
              strokeWidth = 4;
              strokeDasharray = '6 6';
            } else if (idx === currentStepIndex) {
              // Chặng hiện tại -> Vàng cam rực rỡ
              strokeColor = '#f59e0b';
              strokeWidth = 8;
            }

            return (
              <g key={`path_seg_${nodeId}_${nextNodeId}`}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* 3. Vẽ các NODE */}
          {nodes.map(node => {
            if (node.x === undefined || node.y === undefined) return null;

            const isCurrentNode = node.id === currentNodeId;
            const isStartNode = node.id === pathNodeIds[0];
            const isDestNode = node.id === pathNodeIds[pathNodeIds.length - 1];
            const isPartOfRoute = pathSet.has(node.id);

            let nodeFill = '#475569';
            let nodeRadius = 7;
            let strokeColor = '#1e293b';

            if (isPartOfRoute) {
              nodeFill = '#38bdf8';
              nodeRadius = 9;
            }
            if (isStartNode) {
              nodeFill = '#10b981'; // Xanh lá bắt đầu
              nodeRadius = 11;
            }
            if (isDestNode) {
              nodeFill = '#f43f5e'; // Đỏ điểm đến
              nodeRadius = 12;
            }
            if (isCurrentNode) {
              nodeFill = '#fbbf24'; // Vàng vị trí hiện tại
              nodeRadius = 14;
              strokeColor = '#ffffff';
            }

            return (
              <g key={`node_${node.id}`} className="transition-all duration-300">
                {/* Vòng tròn nhấp nháy cho node hiện tại */}
                {isCurrentNode && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="24"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    className="animate-ping opacity-75"
                  />
                )}

                <circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeRadius}
                  fill={nodeFill}
                  stroke={strokeColor}
                  strokeWidth="3"
                />

                {/* Nhãn tên mốc */}
                {isPartOfRoute && (
                  <text
                    x={node.x}
                    y={node.y + 22}
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="11"
                    fontWeight="bold"
                    className="drop-shadow-md"
                  >
                    {node.shortName || node.name}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
