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
  CheckCircle2
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

type FilterCategory = 'all' | 'clinical' | 'emergency' | 'diagnostic' | 'pharmacy_cashier' | 'amenity' | 'transit';

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
  const touchStartRef = useRef<{ x: number; y: number; dist: number; initialScale: number } | null>(null);

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
        (n.roomId && getRoomById(n.roomId)?.code.toLowerCase().includes(q)) ||
        (n.roomId && getRoomById(n.roomId)?.doctorInCharge?.toLowerCase().includes(q))
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

  // Active obstacles on this floor
  const floorObstacles = useMemo(() => {
    return ACTIVE_HOSPITAL_OBSTACLES.filter(obs => {
      const n1 = MAP_NODES_DATA.find(n => n.id === obs.fromNodeId);
      const n2 = MAP_NODES_DATA.find(n => n.id === obs.toNodeId);
      return (n1 && n1.buildingId === currentBuildingId && n1.floorId === currentFloorId) ||
             (n2 && n2.buildingId === currentBuildingId && n2.floorId === currentFloorId);
    });
  }, [currentBuildingId, currentFloorId]);

  // Current walking avatar location
  const currentAvatarNode = useMemo(() => {
    if (!activeRoute || !activeRoute.steps || simulatedStepIndex >= activeRoute.steps.length) return null;
    const currentStep = activeRoute.steps[simulatedStepIndex];
    return currentStep ? currentStep.fromNode : null;
  }, [activeRoute, simulatedStepIndex]);

  // Check if simulated avatar is on this floor
  const isAvatarOnThisFloor = useMemo(() => {
    if (!currentAvatarNode) return false;
    return currentAvatarNode.buildingId === currentBuildingId && currentAvatarNode.floorId === currentFloorId;
  }, [currentAvatarNode, currentBuildingId, currentFloorId]);

  // Mouse / Touch pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('.interactive-card') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const getTouchDistance = (t1: React.Touch, t2: React.Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-card') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('button')) return;

    if (e.touches.length === 1) {
      const t = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: t.clientX - pan.x, y: t.clientY - pan.y });
      touchStartRef.current = { x: t.clientX - pan.x, y: t.clientY - pan.y, dist: 0, initialScale: scale };
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = getTouchDistance(e.touches[0], e.touches[1]);
      touchStartRef.current = { x: pan.x, y: pan.y, dist, initialScale: scale };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging && touchStartRef.current) {
      const t = e.touches[0];
      setPan({
        x: t.clientX - dragStart.x,
        y: t.clientY - dragStart.y
      });
    } else if (e.touches.length === 2 && touchStartRef.current && touchStartRef.current.dist > 0) {
      const currentDist = getTouchDistance(e.touches[0], e.touches[1]);
      const factor = currentDist / touchStartRef.current.dist;
      const newScale = Math.min(Math.max(touchStartRef.current.initialScale * factor, 0.4), 2.5);
      setScale(newScale);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartRef.current = null;
  };

  const handleResetView = () => {
    setScale(0.95);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  // Center view on route or start pin
  const handleCenterOnRoute = () => {
    if (startNode && startNode.buildingId === currentBuildingId && startNode.floorId === currentFloorId) {
      const targetPanX = (500 - startNode.x) * 0.7;
      const targetPanY = (400 - startNode.y) * 0.7;
      setPan({ x: targetPanX, y: targetPanY });
      setScale(1.1);
    } else {
      handleResetView();
    }
  };

  // Auto-switch floor when route simulator enters a new floor
  useEffect(() => {
    if (currentAvatarNode && (currentAvatarNode.buildingId !== currentBuildingId || currentAvatarNode.floorId !== currentFloorId)) {
      onSelectBuilding(currentAvatarNode.buildingId);
      onSelectFloor(currentAvatarNode.floorId);
    }
  }, [currentAvatarNode]);

  const selectedRoom: RoomDetails | undefined = selectedNode?.roomId ? getRoomById(selectedNode.roomId) : undefined;

  // Helper to test if a node matches the active category filter
  const matchesFilter = (node: MapNode): boolean => {
    if (activeFilter === 'all') return true;
    const room = node.roomId ? getRoomById(node.roomId) : null;
    const cat = room?.category;

    if (activeFilter === 'emergency') {
      return node.type === 'emergency' || cat === 'emergency';
    }
    if (activeFilter === 'clinical') {
      return cat === 'clinical' || cat === 'surgical' || node.type === 'room';
    }
    if (activeFilter === 'diagnostic') {
      return node.type === 'lab' || node.type === 'imaging' || cat === 'diagnostic';
    }
    if (activeFilter === 'pharmacy_cashier') {
      return node.type === 'pharmacy' || node.type === 'cashier' || cat === 'pharmacy_cashier';
    }
    if (activeFilter === 'amenity') {
      return node.type === 'restroom' || node.type === 'atm' || node.type === 'canteen' || cat === 'amenity';
    }
    if (activeFilter === 'transit') {
      return node.type === 'elevator' || node.type === 'stairs' || node.type === 'skybridge' || node.type === 'entrance';
    }
    return true;
  };

  // Category filter chips data
  const filterChips: { id: FilterCategory; labelVi: string; labelEn: string; icon: any; color: string }[] = [
    { id: 'all', labelVi: 'Tất cả', labelEn: 'All Areas', icon: Layers, color: 'text-slate-700' },
    { id: 'clinical', labelVi: 'Khám Bệnh', labelEn: 'Clinics', icon: Stethoscope, color: 'text-sky-600' },
    { id: 'emergency', labelVi: 'Cấp Cứu A9', labelEn: 'Emergency A9', icon: Flame, color: 'text-rose-600' },
    { id: 'diagnostic', labelVi: 'Xét Nghiệm', labelEn: 'Labs & Imaging', icon: Microscope, color: 'text-purple-600' },
    { id: 'pharmacy_cashier', labelVi: 'Thu Ngân / Thuốc', labelEn: 'Pharmacy & Pay', icon: Pill, color: 'text-emerald-600' },
    { id: 'amenity', labelVi: 'Tiện Ích / WC', labelEn: 'Amenities', icon: Info, color: 'text-amber-600' },
    { id: 'transit', labelVi: 'Thang Máy', labelEn: 'Elevators & Transit', icon: Navigation, color: 'text-indigo-600' },
  ];

  return (
    <div 
      ref={containerRef}
      id="hospital-2d-clear-map"
      className="relative w-full h-full min-h-[400px] bg-slate-100 flex flex-col overflow-hidden select-none cursor-grab active:cursor-grabbing touch-none font-sans"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ================= TOP CLEAN FLOATING CONTROL BAR ================= */}
      <div className="absolute top-2 sm:top-3.5 left-2 sm:left-3.5 right-2 sm:right-3.5 z-30 flex flex-col gap-1.5 sm:gap-2 pointer-events-none">
        
        {/* Main Bar: Building / Floor Switcher + Search + Zoom */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white/95 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border border-slate-200/90 shadow-sm pointer-events-auto">
          
          {/* Building Selector & Floor Picker */}
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
                    <span>{b.id === 'A' ? 'Tòa K1' : b.id === 'B' ? 'Tòa A1' : 'Tòa C'}</span>
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

        {/* Category Filter Chips Bar */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-0.5 pointer-events-auto no-scrollbar touch-pan-x">
          {filterChips.map(chip => {
            const Icon = chip.icon;
            const isActive = activeFilter === chip.id;
            return (
              <button
                key={chip.id}
                id={`filter-chip-${chip.id}`}
                onClick={() => setActiveFilter(chip.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-2xs ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                    : 'bg-white/90 backdrop-blur-md text-slate-700 border-slate-200/90 hover:bg-white hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : chip.color}`} />
                <span>{language === 'vi' ? chip.labelVi : chip.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= CRISP 2D SVG VIEWPORT ================= */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center pt-8">
        <div 
          className="transition-transform duration-75 ease-out select-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Main 2D Floor Plan SVG: 1040 x 820 Coordinate Space */}
          <svg
            width="1040"
            height="820"
            viewBox="0 0 1040 820"
            className="bg-white rounded-3xl border border-slate-300 shadow-xl overflow-hidden"
          >
            <defs>
              {/* Clean Blueprint Grid */}
              <pattern id="grid-2d-arch" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#f1f5f9" strokeWidth="0.8" />
              </pattern>

              {/* Skybridge Glass Pattern */}
              <pattern id="glass-skybridge" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 0 16 L 16 0 M 0 0 L 16 16" fill="none" stroke="#0d9488" strokeWidth="0.8" opacity="0.25" />
              </pattern>

              {/* Crosswalk Pattern for Gates */}
              <pattern id="crosswalk-stripes" width="14" height="24" patternUnits="userSpaceOnUse">
                <rect x="2" y="0" width="10" height="24" fill="#ffffff" opacity="0.85" />
              </pattern>

              {/* Soft Drop Shadow for Room Cards */}
              <filter id="card-shadow" x="-8%" y="-8%" width="116%" height="116%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.06" />
              </filter>

              {/* Active Selection Glow */}
              <filter id="active-glow" x="-15%" y="-15%" width="130%" height="130%">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#0284c7" floodOpacity="0.4" />
              </filter>

              {/* Route Glow Filter */}
              <filter id="route-glow-2d-vibrant" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Directional Route Arrow Marker */}
              <marker
                id="route-arrowhead"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0284c7" />
              </marker>
            </defs>

            {/* Canvas Background */}
            <rect width="1040" height="820" fill="#fcfdfe" />
            <rect width="1040" height="820" fill="url(#grid-2d-arch)" />

            {/* Building Outer Perimeter (Clean Rounded Wall) */}
            <rect 
              x="40" 
              y="70" 
              width="960" 
              height="700" 
              rx="24" 
              fill="#ffffff" 
              stroke="#94a3b8" 
              strokeWidth="2.5" 
            />

            {/* Main Corridors (East-West Hallway & North-South Spine) */}
            <rect x="70" y="335" width="900" height="90" rx="14" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.2" />
            <rect x="440" y="100" width="120" height="580" rx="14" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.2" />
            
            {/* Center Hallway Guide Dashes */}
            <line x1="80" y1="380" x2="960" y2="380" stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="6 6" />
            <line x1="500" y1="110" x2="500" y2="670" stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="6 6" />

            {/* Waiting Zone Center Decal */}
            <g id="central-waiting-zone" transform="translate(500, 470)">
              <rect x="-80" y="-14" width="160" height="28" rx="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" opacity="0.8" />
              <text x="0" y="4" textAnchor="middle" fill="#0369a1" fontSize="9.5" fontWeight="bold">
                🪑 SẢNH CHỜ TRUNG TÂM
              </text>
            </g>

            {/* Ground Street Entrance Zone (When Floor 1) */}
            {currentFloorId === '1' && (
              <g id="ground-street-entrance-zone">
                <rect x="44" y="700" width="952" height="66" rx="16" fill="#1e293b" />
                <rect x="44" y="708" width="952" height="18" fill="url(#crosswalk-stripes)" />
                
                {/* Gate 1 Label */}
                <g transform="translate(500, 770)">
                  <rect x="-160" y="-12" width="320" height="24" rx="12" fill="#0284c7" />
                  <text textAnchor="middle" y="4" fill="#ffffff" fontSize="10.5" fontWeight="bold">
                    🏛️ CỔNG 1: 78 ĐƯỜNG GIẢI PHÓNG (CHÍNH)
                  </text>
                </g>

                {/* Gate 2 Emergency Lane Label */}
                <g transform="translate(140, 770)">
                  <rect x="-85" y="-12" width="170" height="24" rx="12" fill="#dc2626" />
                  <text textAnchor="middle" y="4" fill="#ffffff" fontSize="10" fontWeight="bold">
                    🚨 CỔNG 2: LÀN CẤP CỨU A9
                  </text>
                </g>

                {/* Gate 3 Phuong Mai Gate Label */}
                <g transform="translate(860, 770)">
                  <rect x="-85" y="-12" width="170" height="24" rx="12" fill="#7c3aed" />
                  <text textAnchor="middle" y="4" fill="#ffffff" fontSize="10" fontWeight="bold">
                    🚪 CỔNG 3: PHƯƠNG MAI
                  </text>
                </g>
              </g>
            )}

            {/* Skybridge Connector Graphic (Floor 2) */}
            {currentFloorId === '2' && (
              <g id="skybridge-connector-graphic" transform="translate(900, 335)">
                <rect width="80" height="90" rx="12" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
                <rect width="80" height="90" fill="url(#glass-skybridge)" rx="12" />
                <text x="40" y="40" textAnchor="middle" fill="#047857" fontSize="10" fontWeight="bold">CẦU VƯỢT</text>
                <text x="40" y="56" textAnchor="middle" fill="#065f46" fontSize="9" fontWeight="bold">SANG TÒA C ➔</text>
              </g>
            )}

            {/* Floor Blueprint Header Tag */}
            <g id="blueprint-title-header" transform="translate(60, 90)">
              <rect x="0" y="0" width="380" height="38" rx="12" fill="#0f172a" />
              <circle cx="20" cy="19" r="9" fill="#0284c7" />
              <text x="20" y="22.5" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="black">
                {currentBuilding.id}
              </text>
              <text x="38" y="17" fill="#ffffff" fontSize="11" fontWeight="bold">
                {currentBuilding.name.split('-')[0].trim()} • {currentFloor.name.toUpperCase()}
              </text>
              <text x="38" y="30" fill="#94a3b8" fontSize="8.5" fontWeight="medium">
                {currentFloor.description.slice(0, 52)}...
              </text>
            </g>

            {/* North Compass Indicator */}
            <g id="compass-rose" transform="translate(960, 105)">
              <circle r="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <polygon points="0,-12 3.5,-2 0,0 -3.5,-2" fill="#ef4444" />
              <polygon points="0,12 3.5,2 0,0 -3.5,2" fill="#64748b" />
              <text y="-15" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="black">BẮC</text>
            </g>

            {/* Obstacle Blocks & Warnings */}
            {floorObstacles.map(obs => {
              const n1 = MAP_NODES_DATA.find(n => n.id === obs.fromNodeId);
              const n2 = MAP_NODES_DATA.find(n => n.id === obs.toNodeId);
              if (!n1 || !n2) return null;
              const midX = (n1.x + n2.x) / 2;
              const midY = (n1.y + n2.y) / 2;

              return (
                <g key={obs.id}>
                  <line
                    x1={n1.x}
                    y1={n1.y}
                    x2={n2.x}
                    y2={n2.y}
                    stroke="#f59e0b"
                    strokeWidth="8"
                    strokeDasharray="6 4"
                    opacity="0.85"
                  />
                  <circle cx={midX} cy={midY} r="12" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
                  <text x={midX} y={midY + 3.5} textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="bold">⚠️</text>
                </g>
              );
            })}

            {/* ================= ARCHITECTURAL ROOM CARDS ================= */}
            {floorNodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              const isStart = startNode?.id === node.id;
              const isDest = destinationNode?.id === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isFilterMatched = matchesFilter(node);
              const room = node.roomId ? getRoomById(node.roomId) : null;

              // Corridors & Waypoints
              if (node.type === 'corridor') {
                return (
                  <g key={node.id} id={`corridor-node-${node.id}`}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="4"
                      fill="#94a3b8"
                      stroke="#64748b"
                      strokeWidth="1"
                    />
                  </g>
                );
              }

              // Card Dimensions
              let width = 230;
              let height = 76;
              if (node.type === 'entrance') {
                width = 200;
                height = 50;
              } else if (node.type === 'elevator' || node.type === 'stairs') {
                width = 120;
                height = 64;
              } else if (node.type === 'restroom' || node.type === 'atm') {
                width = 125;
                height = 64;
              }

              const rectX = node.x - width / 2;
              const rectY = node.y - height / 2;

              // Color Schemes & Categorization
              let fill = '#ffffff';
              let stroke = '#cbd5e1';
              let textFill = '#0f172a';
              let badgeFill = '#f1f5f9';
              let badgeText = '#475569';
              let iconEmoji = '🏥';
              let categoryLabel = 'KHOA PHÒNG';

              if (node.type === 'emergency' || room?.category === 'emergency') {
                fill = '#fef2f2';
                stroke = '#ef4444';
                textFill = '#991b1b';
                badgeFill = '#fee2e2';
                badgeText = '#b91c1c';
                iconEmoji = '🚨';
                categoryLabel = 'CẤP CỨU';
              } else if (node.type === 'pharmacy' || node.type === 'cashier' || room?.category === 'pharmacy_cashier') {
                fill = '#f0fdf4';
                stroke = '#22c55e';
                textFill = '#14532d';
                badgeFill = '#dcfce7';
                badgeText = '#15803d';
                iconEmoji = node.type === 'pharmacy' ? '💊' : '💳';
                categoryLabel = node.type === 'pharmacy' ? 'NHÀ THUỐC' : 'VIỆN PHÍ';
              } else if (node.type === 'imaging' || node.type === 'lab' || room?.category === 'diagnostic') {
                fill = '#faf5ff';
                stroke = '#a855f7';
                textFill = '#581c87';
                badgeFill = '#f3e8ff';
                badgeText = '#7e22ce';
                iconEmoji = node.type === 'lab' ? '🔬' : '📷';
                categoryLabel = node.type === 'lab' ? 'XÉT NGHIỆM' : 'CĐ HÌNH ẢNH';
              } else if (node.type === 'elevator') {
                fill = '#f5f3ff';
                stroke = '#8b5cf6';
                textFill = '#6b21a8';
                badgeFill = '#ede9fe';
                badgeText = '#7c3aed';
                iconEmoji = '🛗';
                categoryLabel = 'THANG MÁY';
              } else if (node.type === 'stairs') {
                fill = '#fffbeb';
                stroke = '#f59e0b';
                textFill = '#92400e';
                badgeFill = '#fef3c7';
                badgeText = '#b45309';
                iconEmoji = '🪜';
                categoryLabel = 'THANG BỘ';
              } else if (node.type === 'skybridge') {
                fill = '#ecfdf5';
                stroke = '#10b981';
                textFill = '#065f46';
                badgeFill = '#d1fae5';
                badgeText = '#047857';
                iconEmoji = '🌉';
                categoryLabel = 'CẦU VƯỢT';
              } else if (node.type === 'restroom') {
                fill = '#f0f9ff';
                stroke = '#0ea5e9';
                textFill = '#0369a1';
                badgeFill = '#e0f2fe';
                badgeText = '#0284c7';
                iconEmoji = '🚻';
                categoryLabel = 'VỆ SINH';
              } else if (node.type === 'atm') {
                fill = '#f8fafc';
                stroke = '#64748b';
                textFill = '#334155';
                badgeFill = '#e2e8f0';
                badgeText = '#475569';
                iconEmoji = '🏧';
                categoryLabel = 'ATM';
              } else if (node.type === 'entrance') {
                fill = '#f0f9ff';
                stroke = '#0284c7';
                textFill = '#0369a1';
                badgeFill = '#e0f2fe';
                badgeText = '#0284c7';
                iconEmoji = '🚪';
                categoryLabel = 'LỐI VÀO';
              } else if (node.type === 'canteen') {
                fill = '#fff7ed';
                stroke = '#ea580c';
                textFill = '#9a3412';
                badgeFill = '#ffedd5';
                badgeText = '#c2410c';
                iconEmoji = '☕';
                categoryLabel = 'CĂN TIN';
              } else if (room?.category === 'clinical' || node.type === 'room') {
                fill = '#f0f9ff';
                stroke = '#0284c7';
                textFill = '#0c4a6e';
                badgeFill = '#e0f2fe';
                badgeText = '#0369a1';
                iconEmoji = '🩺';
                categoryLabel = 'PHÒNG KHÁM';
              }

              // Selected state styling
              if (isSelected) {
                fill = '#0284c7';
                stroke = '#0369a1';
                textFill = '#ffffff';
                badgeFill = '#0369a1';
                badgeText = '#ffffff';
              }

              const cardOpacity = isFilterMatched ? 1 : 0.25;

              // Clean Room Name
              let cleanName = node.name;
              if (cleanName.includes('(')) {
                cleanName = cleanName.split('(')[0].trim();
              }

              return (
                <g
                  key={node.id}
                  id={`room-card-${node.id}`}
                  onClick={() => setSelectedNode(node)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  opacity={cardOpacity}
                  className="cursor-pointer transition-all duration-150"
                  filter={isSelected ? 'url(#active-glow)' : 'url(#card-shadow)'}
                >
                  {/* Room Container Rect */}
                  <rect
                    x={rectX}
                    y={rectY}
                    width={width}
                    height={height}
                    rx={14}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                    className="transition-all"
                  />

                  {/* Card Header: Room Code Badge & Category Icon */}
                  <g transform={`translate(${rectX + 8}, ${rectY + 8})`}>
                    {room?.code ? (
                      <g>
                        <rect 
                          x="0" 
                          y="0" 
                          width={room.code.length > 6 ? 54 : 46} 
                          height="18" 
                          rx="6" 
                          fill={badgeFill} 
                        />
                        <text
                          x={room.code.length > 6 ? 27 : 23}
                          y="12.5"
                          fill={badgeText}
                          fontSize="9.5"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {room.code}
                        </text>
                      </g>
                    ) : (
                      <g>
                        <rect 
                          x="0" 
                          y="0" 
                          width="56" 
                          height="18" 
                          rx="6" 
                          fill={badgeFill} 
                        />
                        <text
                          x="28"
                          y="12.5"
                          fill={badgeText}
                          fontSize="8"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {categoryLabel}
                        </text>
                      </g>
                    )}

                    {/* Category Emoji */}
                    <text
                      x={width - 20}
                      y="14"
                      fontSize="12"
                      textAnchor="middle"
                    >
                      {iconEmoji}
                    </text>

                    {/* Accessible Wheelchair Icon */}
                    {node.isAccessible && (
                      <text
                        x={width - 36}
                        y="13"
                        fontSize="10"
                        textAnchor="middle"
                        fill={isSelected ? '#ffffff' : '#0284c7'}
                      >
                        ♿
                      </text>
                    )}
                  </g>

                  {/* Room Title */}
                  <text
                    x={node.x}
                    y={rectY + (height > 60 ? 42 : 32)}
                    fill={textFill}
                    fontSize={node.type === 'entrance' ? '10' : '11.5'}
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {cleanName.length > 26 ? `${cleanName.slice(0, 25)}…` : cleanName}
                  </text>

                  {/* Doctor or Subtitle info */}
                  {height > 60 && (
                    <text
                      x={node.x}
                      y={rectY + 58}
                      fill={isSelected ? '#e0f2fe' : '#64748b'}
                      fontSize="9"
                      fontWeight="500"
                      textAnchor="middle"
                    >
                      {room?.doctorInCharge 
                        ? `BS: ${room.doctorInCharge.replace('PGS.TS.BS ', 'PGS. ').replace('ThS.BS ', 'ThS. ').replace('TS.BS ', 'TS. ')}`
                        : room?.operatingHours 
                        ? room.operatingHours.slice(0, 26)
                        : node.nameEn.slice(0, 26)}
                    </text>
                  )}

                  {/* Start Point Marker */}
                  {isStart && (
                    <g transform={`translate(${node.x}, ${node.y})`}>
                      <circle
                        r="24"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeDasharray="6 4"
                        className="animate-spin"
                        style={{ transformOrigin: '0px 0px' }}
                      />
                      <circle r="30" fill="#10b981" opacity="0.2" className="animate-ping" />
                    </g>
                  )}

                  {/* Destination Point Marker */}
                  {isDest && (
                    <g transform={`translate(${node.x}, ${node.y})`}>
                      <circle
                        r="24"
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="3"
                        strokeDasharray="6 4"
                        className="animate-spin"
                        style={{ transformOrigin: '0px 0px' }}
                      />
                      <circle r="30" fill="#f43f5e" opacity="0.2" className="animate-ping" />
                    </g>
                  )}
                </g>
              );
            })}

            {/* ================= 2D ROUTE PATH RENDERING ================= */}
            {floorPathSegments.map((segment, sIdx) => {
              if (segment.length < 2) return null;
              const pathD = segment.reduce((acc, pt, idx) => {
                return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
              }, '');

              return (
                <g key={sIdx} id={`route-segment-${sIdx}`}>
                  {/* Subtle Glow Outer Trail */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.4"
                    filter="url(#route-glow-2d-vibrant)"
                  />

                  {/* High Contrast Cyan Route Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="10 8"
                    markerEnd="url(#route-arrowhead)"
                    className="animate-pulse"
                  />

                  {/* Turn Waypoint Badges */}
                  {segment.map((pt, pIdx) => {
                    if (pIdx === 0 || pIdx === segment.length - 1) return null;
                    return (
                      <g key={pIdx} transform={`translate(${pt.x}, ${pt.y})`}>
                        <circle r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                        <text y="3" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="black">
                          {pIdx + 1}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Start Pin */}
            {startNode && startNode.buildingId === currentBuildingId && startNode.floorId === currentFloorId && (
              <g id="start-node-pin-callout" transform={`translate(${startNode.x}, ${startNode.y})`}>
                <circle r="14" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" filter="url(#card-shadow)" />
                <text y="4.5" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="black">S</text>
                
                <g transform="translate(0, -22)">
                  <rect x="-42" y="-10" width="84" height="18" rx="9" fill="#10b981" stroke="#ffffff" strokeWidth="1.2" />
                  <text y="2.5" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">XUẤT PHÁT</text>
                </g>
              </g>
            )}

            {/* Destination Pin */}
            {destinationNode && destinationNode.buildingId === currentBuildingId && destinationNode.floorId === currentFloorId && (
              <g id="dest-node-pin-callout" transform={`translate(${destinationNode.x}, ${destinationNode.y})`}>
                <circle r="14" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" filter="url(#card-shadow)" />
                <text y="4.5" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="black">D</text>

                <g transform="translate(0, -22)">
                  <rect x="-38" y="-10" width="76" height="18" rx="9" fill="#ef4444" stroke="#ffffff" strokeWidth="1.2" />
                  <text y="2.5" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">ĐIỂM ĐẾN</text>
                </g>
              </g>
            )}

            {/* Walking Avatar */}
            {isAvatarOnThisFloor && currentAvatarNode && (
              <g id="walking-avatar-indicator" transform={`translate(${currentAvatarNode.x}, ${currentAvatarNode.y})`}>
                <circle r="20" fill="#0284c7" opacity="0.3" className="animate-ping" />
                <circle r="12" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" filter="url(#card-shadow)" />
                <circle r="5" fill="#38bdf8" />
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Multi-floor Transition Banner */}
      {activeRoute && activeRoute.floorsInvolved.length > 1 && (
        <div className="absolute top-26 sm:top-24 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 bg-white/95 border border-slate-200 rounded-full shadow-md flex items-center gap-2 text-xs text-slate-800 backdrop-blur-md font-semibold pointer-events-auto">
          <Layers className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
          <span>
            Chuyển tầng:
            {activeRoute.floorsInvolved.map((fi, idx) => (
              <button
                key={idx}
                id={`btn-route-floor-${fi.buildingId}-${fi.floorId}`}
                onClick={() => {
                  onSelectBuilding(fi.buildingId);
                  onSelectFloor(fi.floorId);
                }}
                className={`ml-1 px-2 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  currentBuildingId === fi.buildingId && currentFloorId === fi.floorId
                    ? 'bg-cyan-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {fi.buildingId === 'A' ? 'K1' : fi.buildingId === 'B' ? 'A1' : 'C'}-{fi.floorId === 'B1' ? 'B1' : `T${fi.floorId}`}
              </button>
            ))}
          </span>
        </div>
      )}

      {/* ================= BOTTOM MINIMAL LEGEND ================= */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3 text-[11px] font-medium text-slate-600 overflow-x-auto">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>Phòng khám</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Cấp cứu A9</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>Xét nghiệm & CĐHA</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Dược & Viện phí</span>
          </span>
          <span className="flex items-center gap-1">
            <span>♿</span>
            <span>Xe lăn</span>
          </span>
        </div>

        <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-2xl hidden md:flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Nhấn vào phòng để xem chi tiết bác sĩ & chỉ đường</span>
        </div>
      </div>

      {/* ================= SELECTED ROOM DETAIL CARD / BOTTOM SHEET ================= */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="interactive-card absolute bottom-2 sm:bottom-4 left-2 right-2 sm:left-auto sm:right-4 sm:w-92 z-40 bg-white/98 backdrop-blur-xl border border-slate-200 rounded-3xl p-3.5 sm:p-4 shadow-2xl text-slate-800 max-h-[75vh] flex flex-col overflow-hidden"
          >
            {/* Mobile Drag Indicator Bar */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-2 sm:hidden shrink-0" />

            <div className="flex items-start justify-between gap-2 mb-2 shrink-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedRoom?.code && (
                    <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-black rounded-lg shrink-0">
                      {selectedRoom.code}
                    </span>
                  )}
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">
                    Tòa {selectedNode.buildingId === 'A' ? 'K1' : selectedNode.buildingId === 'B' ? 'A1' : 'C'} • Tầng {selectedNode.floorId}
                  </span>
                  {selectedNode.isAccessible && (
                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-md flex items-center gap-0.5 shrink-0">
                      ♿ Xe lăn
                    </span>
                  )}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 truncate">
                  {selectedNode.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">{selectedNode.nameEn}</p>
              </div>

              <button
                id="btn-close-room-card"
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto no-scrollbar space-y-2 flex-1 pr-0.5">
              {selectedRoom && (
                <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200">
                  <p className="text-slate-600 text-[11px] leading-relaxed">{selectedRoom.description}</p>
                  {selectedRoom.doctorInCharge && (
                    <div className="flex items-center gap-1.5 text-cyan-700 font-semibold text-[11px] pt-1">
                      <User className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Phụ trách: {selectedRoom.doctorInCharge}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-slate-500 text-[10px] sm:text-[11px] pt-1 border-t border-slate-200/80">
                    <span className="flex items-center gap-1 truncate">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{selectedRoom.operatingHours}</span>
                    </span>
                    {selectedRoom.phoneExtension && (
                      <span className="flex items-center gap-1 text-slate-600 font-medium shrink-0 ml-1">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span>Ext: {selectedRoom.phoneExtension}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 mt-2 pt-2 border-t border-slate-100 shrink-0">
              <button
                id="btn-set-as-start-2d"
                onClick={() => {
                  onSelectStartNode(selectedNode);
                  setSelectedNode(null);
                }}
                className="flex-1 py-2 px-2 sm:px-3 bg-emerald-50 hover:bg-emerald-100 active:scale-98 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer min-h-[38px]"
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Đặt xuất phát</span>
              </button>
              <button
                id="btn-set-as-destination-2d"
                onClick={() => {
                  onSelectDestinationNode(selectedNode);
                  setSelectedNode(null);
                }}
                className="flex-1 py-2 px-2 sm:px-3 bg-cyan-600 hover:bg-cyan-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1 cursor-pointer min-h-[38px]"
              >
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Chỉ đường đến đây</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
