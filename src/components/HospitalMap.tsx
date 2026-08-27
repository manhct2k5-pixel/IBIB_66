import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BuildingId, 
  FloorId, 
  MapNode, 
  NavigationRoute, 
  RoomDetails, 
  RoutingProfile,
  PDRPositionState
} from '../types';
import { BUILDINGS_DATA, getRoomById, MAP_NODES_DATA } from '../data/hospitalData';
import { ACTIVE_HOSPITAL_OBSTACLES } from '../utils/pathfinding';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  MapPin, 
  ArrowRight, 
  Phone, 
  Clock, 
  User, 
  X, 
  Sparkles, 
  Crosshair, 
  Stethoscope, 
  Pill, 
  Microscope, 
  Flame, 
  Info, 
  Navigation, 
  Search,
  CheckCircle2,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HospitalMapProps {
  currentBuildingId: BuildingId;
  currentFloorId: FloorId;
  onSelectBuilding: (buildingId: BuildingId) => void;
  onSelectFloor: (floorId: FloorId) => void;
  startNode: MapNode | null;
  destinationNode: MapNode | null;
  onSelectStartNode: (node: MapNode) => void;
  onSelectDestinationNode: (node: MapNode) => void;
  activeRoute: NavigationRoute | null;
  simulatedStepIndex: number;
  routingProfile: RoutingProfile;
  pdrPosition?: PDRPositionState | null;
  language: 'vi' | 'en';
  onOpenAIAssistant?: () => void;
  onOpenEmergency?: () => void;
}

type FilterCategory = 'all' | 'clinical' | 'emergency' | 'pharmacy_cashier' | 'amenity' | 'transit';

export const HospitalMap: React.FC<HospitalMapProps> = ({
  currentBuildingId,
  currentFloorId,
  onSelectBuilding,
  onSelectFloor,
  startNode,
  destinationNode,
  onSelectStartNode,
  onSelectDestinationNode,
  activeRoute,
  simulatedStepIndex,
  language
}) => {
  const [scale, setScale] = useState<number>(0.95);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentBuilding = useMemo(() => {
    return BUILDINGS_DATA.find(b => b.id === currentBuildingId) || BUILDINGS_DATA[0];
  }, [currentBuildingId]);

  const currentFloor = useMemo(() => {
    return currentBuilding.floors.find(f => f.id === currentFloorId) || currentBuilding.floors[0];
  }, [currentBuilding, currentFloorId]);

  // Current floor's nodes
  const floorNodes = useMemo(() => {
    let nodes = MAP_NODES_DATA.filter(n => n.buildingId === currentBuildingId && n.floorId === currentFloorId);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      nodes = nodes.filter(n => 
        n.name.toLowerCase().includes(q) || 
        n.nameEn.toLowerCase().includes(q) ||
        (n.roomId && n.roomId.toLowerCase().includes(q)) ||
        (n.roomId && getRoomById(n.roomId)?.code?.toLowerCase().includes(q)) ||
        (n.roomId && getRoomById(n.roomId)?.commonSymptoms?.some(s => s.toLowerCase().includes(q)))
      );
    }
    return nodes;
  }, [currentBuildingId, currentFloorId, searchQuery]);

  // Contiguous path segments on THIS specific floor
  const floorPathSegments = useMemo(() => {
    if (!activeRoute || activeRoute.pathNodes.length < 2) return [];

    const segments: { x: number; y: number; node: MapNode; index: number }[][] = [];
    let currentSegment: { x: number; y: number; node: MapNode; index: number }[] = [];

    for (let i = 0; i < activeRoute.pathNodes.length; i++) {
      const node = activeRoute.pathNodes[i];
      if (node.buildingId === currentBuildingId && node.floorId === currentFloorId) {
        currentSegment.push({ x: node.x, y: node.y, node, index: i });
      } else {
        if (currentSegment.length > 0) {
          segments.push(currentSegment);
          currentSegment = [];
        }
      }
    }
    if (currentSegment.length > 0) {
      segments.push(currentSegment);
    }
    return segments;
  }, [activeRoute, currentBuildingId, currentFloorId]);

  // Current walking avatar location
  const currentAvatarNode = useMemo(() => {
    if (!activeRoute || !activeRoute.steps || simulatedStepIndex >= activeRoute.steps.length) return null;
    const currentStep = activeRoute.steps[simulatedStepIndex];
    return currentStep ? currentStep.fromNode : null;
  }, [activeRoute, simulatedStepIndex]);

  const isAvatarOnThisFloor = useMemo(() => {
    if (!currentAvatarNode) return false;
    return currentAvatarNode.buildingId === currentBuildingId && currentAvatarNode.floorId === currentFloorId;
  }, [currentAvatarNode, currentBuildingId, currentFloorId]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('.interactive-card') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleResetView = () => {
    setScale(0.95);
    setPan({ x: 0, y: 0 });
  };

  // Center on Route
  const handleCenterOnRoute = () => {
    if (!activeRoute || activeRoute.pathNodes.length === 0) return;
    const currentFloorNodes = activeRoute.pathNodes.filter(
      n => n.buildingId === currentBuildingId && n.floorId === currentFloorId
    );
    if (currentFloorNodes.length === 0) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const node of currentFloorNodes) {
      if (node.x < minX) minX = node.x;
      if (node.x > maxX) maxX = node.x;
      if (node.y < minY) minY = node.y;
      if (node.y > maxY) maxY = node.y;
    }

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    const viewportW = containerRef.current ? containerRef.current.clientWidth : 800;
    const viewportH = containerRef.current ? containerRef.current.clientHeight : 600;

    setPan({
      x: viewportW / 2 - midX * 0.95,
      y: viewportH / 2 - midY * 0.95
    });
    setScale(1.1);
  };

  // Filter chips matching
  const matchesFilter = (node: MapNode) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'emergency') return node.type === 'emergency';
    if (activeFilter === 'pharmacy_cashier') return node.type === 'pharmacy' || node.type === 'cashier';
    if (activeFilter === 'transit') return node.type === 'elevator' || node.type === 'stairs' || node.type === 'entrance';
    if (activeFilter === 'clinical') {
      const r = node.roomId ? getRoomById(node.roomId) : null;
      return r?.category === 'clinical' || node.type === 'room' || node.type === 'reception';
    }
    return true;
  };

  const selectedRoom: RoomDetails | undefined = selectedNode?.roomId 
    ? getRoomById(selectedNode.roomId) 
    : undefined;

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-slate-50 select-none flex flex-col"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Floating Controls Bar */}
      <div className="absolute top-2 left-2 right-2 sm:left-4 sm:right-4 z-20 flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 pointer-events-auto bg-white/95 backdrop-blur-md px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border border-slate-200 shadow-sm flex-wrap">
          
          {/* Building Selector */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1 sm:flex-initial">
            <div className="flex items-center bg-slate-100/90 rounded-xl p-0.5 border border-slate-200 shrink-0">
              {BUILDINGS_DATA.map(b => {
                const isSelected = currentBuildingId === b.id;
                const isBuildingInRoute = activeRoute?.floorsInvolved.some(fi => fi.buildingId === b.id);

                return (
                  <button
                    key={b.id}
                    id={`btn-select-building-${b.id}`}
                    onClick={() => {
                      onSelectBuilding(b.id);
                      onSelectFloor(b.floors[0].id);
                    }}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer relative shrink-0 ${
                      isSelected
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <span>{b.code || b.name.split(' - ')[0]}</span>
                    {isBuildingInRoute && !isSelected && (
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-4 w-px bg-slate-200 mx-0.5 shrink-0" />

            {/* Floor Level Picker */}
            <div className="flex items-center gap-1 shrink-0">
              {currentBuilding.floors.map(f => {
                const isFloorInRoute = activeRoute?.floorsInvolved.some(
                  fi => fi.buildingId === currentBuildingId && fi.floorId === f.id
                );
                const isSelected = currentFloorId === f.id;

                return (
                  <button
                    key={f.id}
                    id={`btn-select-floor-${f.id}`}
                    onClick={() => onSelectFloor(f.id)}
                    className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-bold rounded-lg transition-all relative flex items-center gap-1 cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                    title={f.description}
                  >
                    <span>{f.id === 'B1' ? 'B1' : `T${f.id}`}</span>
                    {isFloorInRoute && (
                      <span className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Tools: Search & Zoom */}
          <div className="flex items-center gap-1 sm:gap-1.5 ml-auto shrink-0">
            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 sm:left-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm phòng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-6 sm:pl-7 pr-5 sm:pr-6 py-1 text-[11px] sm:text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl w-24 sm:w-36 md:w-44 focus:outline-none focus:ring-1.5 focus:ring-cyan-500 text-slate-800 transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1.5 text-slate-400 hover:text-slate-600 text-xs p-0.5"
                >
                  ×
                </button>
              )}
            </div>

            {activeRoute && (
              <button
                id="btn-center-route"
                onClick={handleCenterOnRoute}
                className="px-2 sm:px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 text-[11px] sm:text-xs font-bold rounded-xl border border-cyan-200 transition flex items-center gap-1 cursor-pointer"
                title="Căn giữa lộ trình"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Lộ trình</span>
              </button>
            )}

            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5 shadow-2xs">
              <button
                id="btn-zoom-in-2d"
                onClick={() => setScale(s => Math.min(s + 0.15, 2.4))}
                className="p-1 hover:bg-white rounded-lg text-slate-700 hover:text-cyan-700 transition cursor-pointer"
                title="Phóng to"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-zoom-out-2d"
                onClick={() => setScale(s => Math.max(s - 0.15, 0.4))}
                className="p-1 hover:bg-white rounded-lg text-slate-700 hover:text-cyan-700 transition cursor-pointer"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-reset-view-2d"
                onClick={handleResetView}
                className="p-1 hover:bg-white rounded-lg text-slate-700 hover:text-cyan-700 transition cursor-pointer"
                title="Đặt lại góc nhìn"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Viewport / Canvas */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center pt-8">
        <div 
          className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
        >
          <svg 
            width="1040" 
            height="820" 
            viewBox="0 0 1040 820" 
            className="w-auto h-auto max-w-none shadow-xl rounded-3xl bg-white border border-slate-200"
          >
            {/* Canvas Background */}
            <rect width="1040" height="820" fill="#f8fafc" />

            {/* Building Floorplate Outline */}
            <rect 
              x="80" 
              y="100" 
              width="880" 
              height="620" 
              rx="24" 
              fill="#ffffff" 
              stroke="#94a3b8" 
              strokeWidth="2.5" 
            />

            {/* Corridors */}
            <rect x="110" y="340" width="820" height="100" rx="14" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.2" />
            <line x1="120" y1="390" x2="920" y2="390" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="6 6" />

            {/* Building Header Tag */}
            <g id="blueprint-title-header" transform="translate(100, 120)">
              <rect x="0" y="0" width="460" height="42" rx="12" fill="#0f172a" />
              <text x="16" y="26" fill="#ffffff" fontSize="12" fontWeight="bold">
                {currentBuilding.name} • {currentFloor.name}
              </text>
            </g>

            {/* Unverified Notice for buildings without digitized indoor CAD */}
            {!currentBuilding.hasVerifiedIndoorMap && (
              <g transform="translate(240, 240)">
                <rect width="560" height="80" rx="16" fill="#fffbeb" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="280" y="35" textAnchor="middle" fill="#b45309" fontSize="13" fontWeight="bold">
                  ℹ️ Sơ đồ chi tiết từng phòng của tòa nhà này đang được xác minh
                </text>
                <text x="280" y="58" textAnchor="middle" fill="#78350f" fontSize="11">
                  Vui lòng theo dõi bảng chỉ dẫn và hướng dẫn của nhân viên tại sảnh Tầng 1.
                </text>
              </g>
            )}

            {/* Ground Street Entrance Zone */}
            {currentFloorId === '1' && (
              <g id="ground-street-entrance-zone" transform="translate(100, 650)">
                <rect width="840" height="50" rx="12" fill="#e2e8f0" />
                <text x="420" y="30" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="bold">
                  🚪 LỐI VÀO SẢNH TẦNG 1 (KẾT NỐI KHUÔN VIÊN BỆNH VIỆN BẠCH MAI)
                </text>
              </g>
            )}

            {/* Render Nodes / Rooms on this floor */}
            {floorNodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              const isStart = startNode?.id === node.id;
              const isDest = destinationNode?.id === node.id;
              const isFilterMatched = matchesFilter(node);
              const room = node.roomId ? getRoomById(node.roomId) : null;

              if (node.type === 'corridor') {
                return (
                  <circle
                    key={node.id}
                    cx={node.x}
                    cy={node.y}
                    r="4"
                    fill="#94a3b8"
                  />
                );
              }

              let width = 200;
              let height = 70;
              if (node.type === 'elevator' || node.type === 'stairs') {
                width = 110;
                height = 60;
              }

              const rectX = node.x - width / 2;
              const rectY = node.y - height / 2;

              let fill = '#ffffff';
              let stroke = '#cbd5e1';
              let textFill = '#0f172a';

              if (node.type === 'emergency') {
                fill = '#fef2f2';
                stroke = '#ef4444';
                textFill = '#991b1b';
              } else if (node.type === 'pharmacy' || node.type === 'cashier') {
                fill = '#f0fdf4';
                stroke = '#22c55e';
                textFill = '#14532d';
              } else if (node.type === 'elevator' || node.type === 'stairs') {
                fill = '#f5f3ff';
                stroke = '#8b5cf6';
                textFill = '#5b21b6';
              }

              if (isSelected) {
                fill = '#0284c7';
                stroke = '#0369a1';
                textFill = '#ffffff';
              }

              return (
                <g
                  key={node.id}
                  id={`room-card-${node.id}`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer"
                  opacity={isFilterMatched ? 1 : 0.3}
                >
                  <rect
                    x={rectX}
                    y={rectY}
                    width={width}
                    height={height}
                    rx="12"
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />

                  {room?.code && (
                    <text
                      x={rectX + 10}
                      y={rectY + 20}
                      fill={isSelected ? '#e0f2fe' : '#0284c7'}
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {room.code}
                    </text>
                  )}

                  <text
                    x={rectX + 10}
                    y={rectY + (room?.code ? 38 : 28)}
                    fill={textFill}
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {node.name.length > 24 ? node.name.slice(0, 24) + '...' : node.name}
                  </text>

                  {/* Start / Dest Pin Indicator */}
                  {isStart && (
                    <g transform={`translate(${node.x}, ${rectY - 12})`}>
                      <circle r="10" fill="#10b981" />
                      <text textAnchor="middle" y="4" fill="#ffffff" fontSize="9" fontWeight="bold">A</text>
                    </g>
                  )}
                  {isDest && (
                    <g transform={`translate(${node.x}, ${rectY - 12})`}>
                      <circle r="10" fill="#ef4444" />
                      <text textAnchor="middle" y="4" fill="#ffffff" fontSize="9" fontWeight="bold">B</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Active Route Segments on this floor */}
            {floorPathSegments.map((segment, sIdx) => {
              if (segment.length < 2) return null;
              const pathD = segment.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');

              return (
                <g key={`route-segment-${sIdx}`}>
                  {/* Route glow outline */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.6"
                  />
                  {/* Main Route solid line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              );
            })}

            {/* Walking Avatar on this floor */}
            {isAvatarOnThisFloor && currentAvatarNode && (
              <g id="avatar-pin" transform={`translate(${currentAvatarNode.x}, ${currentAvatarNode.y})`}>
                <circle r="14" fill="#0284c7" className="animate-ping opacity-75" />
                <circle r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Selected Room Bottom Sheet */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="interactive-card absolute bottom-4 right-4 w-92 z-40 bg-white/98 backdrop-blur-xl border border-slate-200 rounded-3xl p-4 shadow-2xl text-slate-800 max-h-[75vh] flex flex-col"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  {selectedRoom?.code && (
                    <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-bold rounded-lg">
                      {selectedRoom.code}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 font-semibold">
                    Tòa {selectedNode.buildingId} • Tầng {selectedNode.floorId}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {selectedNode.name}
                </h3>
              </div>

              <button
                id="btn-close-room-card"
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-xl cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedRoom && (
              <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                <p className="text-slate-600 text-[11px] leading-relaxed">{selectedRoom.description}</p>
                <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedRoom.operatingHours}</span>
                  </span>
                  {selectedRoom.phoneExtension && (
                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{selectedRoom.phoneExtension}</span>
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
              <button
                id="btn-set-as-start-2d"
                onClick={() => {
                  onSelectStartNode(selectedNode);
                  setSelectedNode(null);
                }}
                className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Đặt xuất phát</span>
              </button>
              <button
                id="btn-set-as-destination-2d"
                onClick={() => {
                  onSelectDestinationNode(selectedNode);
                  setSelectedNode(null);
                }}
                className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Chỉ đường tới đây</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
