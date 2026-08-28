import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  BuildingId, 
  FloorId, 
  MapNode, 
  NavigationRoute, 
  RoutingProfile
} from '../types';
import { MAP_NODES_DATA, BACH_MAI_QR_CHECKPOINTS } from '../data/hospitalData';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2,
  Crosshair,
  MapPin, 
  ArrowRight, 
  Phone, 
  Clock, 
  X, 
  Sparkles, 
  Layers, 
  Navigation, 
  Search,
  Building2,
  Flame,
  Stethoscope,
  Info,
  QrCode,
  CheckCircle2,
  Footprints
} from 'lucide-react';

interface Hospital2DCampusMapProps {
  onSwitchToFloorMap?: (buildingId: BuildingId, floorId?: FloorId) => void;
  startNode: MapNode | null;
  destinationNode: MapNode | null;
  onSelectStartNode: (node: MapNode) => void;
  onSelectDestinationNode: (node: MapNode) => void;
  activeRoute: NavigationRoute | null;
  currentStepIndex?: number;
  isNavigating?: boolean;
  routingProfile: RoutingProfile;
  language: 'vi' | 'en';
  onOpenAIAssistant?: () => void;
  onOpenEmergency?: () => void;
  onOpenQRScanner?: () => void;
}

interface CampusBlock {
  num: number | string;
  id: string;
  name: string;
  nameEn: string;
  category: 'clinical' | 'emergency' | 'admin' | 'service' | 'education' | 'neighbor';
  buildingId?: BuildingId;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  polygonPoints?: string;
  colorType: 'yellow' | 'red' | 'gray' | 'blue' | 'purple' | 'green';
  entranceX?: number;
  entranceY?: number;
  emergencyIcon?: boolean;
}

const MASTER_CAMPUS_BLOCKS: CampusBlock[] = [
  // 1: KHU NHÀ P (TÒA NHÀ VIỆT NHẬT)
  {
    num: 1,
    id: 'block_p_viet_nhat',
    name: 'Khu Nhà P (Tòa Nhà Việt - Nhật)',
    nameEn: 'Building P (Vietnam - Japan Center)',
    category: 'clinical',
    buildingId: 'P',
    description: 'Trung tâm khám chữa bệnh kỹ thuật cao hợp tác Việt - Nhật.',
    x: 440,
    y: 430,
    width: 140,
    height: 200,
    polygonPoints: '440,430 500,430 500,510 580,510 580,630 450,630 450,540 440,540',
    colorType: 'yellow',
    entranceX: 470,
    entranceY: 630
  },
  // 2: TÒA NHÀ Q - TT UNG BƯỚU VÀ YHHN TRẺ EM
  {
    num: 2,
    id: 'block_q_onco',
    name: 'Tòa Nhà Q (21 tầng - TT Ung Bướu & YHHN)',
    nameEn: 'Building Q (21 Floors - Oncology & Nuclear Med)',
    category: 'clinical',
    buildingId: 'Q',
    description: 'Trung tâm điều trị ung bướu, xạ trị kỹ thuật cao và y học hạt nhân (Tòa nhà Q 21 tầng).',
    x: 520,
    y: 390,
    width: 60,
    height: 105,
    colorType: 'yellow',
    entranceX: 550,
    entranceY: 495
  },
  // 4: KHU NHÀ K1 (KHÁM BỆNH)
  {
    num: 4,
    id: 'block_4_outpatient_k1',
    name: 'Tòa K1 (Khoa Khám Bệnh Đa Khoa)',
    nameEn: 'Building K1 (General Outpatient Clinic)',
    category: 'clinical',
    buildingId: 'K1',
    description: 'Khu tiếp đón, đăng ký khám bảo hiểm y tế và khám theo yêu cầu các chuyên khoa tổng quát.',
    x: 230,
    y: 580,
    width: 100,
    height: 70,
    colorType: 'yellow',
    entranceX: 280,
    entranceY: 580
  },
  // KHU NHÀ K2
  {
    num: 'K2',
    id: 'block_k2_daycare',
    name: 'Tòa K2 (Điều Trị Trong Ngày & Thận Nhân Tạo)',
    nameEn: 'Building K2 (Day Treatment & Dialysis)',
    category: 'clinical',
    buildingId: 'K2',
    description: 'Khu điều trị ban ngày, đơn vị thận nhân tạo lọc máu chu kỳ.',
    x: 340,
    y: 580,
    width: 90,
    height: 70,
    colorType: 'yellow',
    entranceX: 380,
    entranceY: 580
  },
  // 5: TRUNG TÂM Y HỌC HẠT NHÂN & UNG BƯỚU (H)
  {
    num: 5,
    id: 'block_5_nuclear_med_h',
    name: 'Tòa H (TT Y Học Hạt Nhân & Ung Bướu)',
    nameEn: 'Building H (Nuclear Medicine & Oncology)',
    category: 'clinical',
    buildingId: 'H',
    description: 'Chẩn đoán PET/CT, SPECT, xạ trị và điều trị ung bướu.',
    x: 590,
    y: 555,
    width: 50,
    height: 95,
    colorType: 'yellow',
    entranceX: 615,
    entranceY: 600
  },
  // 7: CỤM VIỆN THẦN KINH (T1 - T2 - T3)
  {
    num: 7,
    id: 'block_7_neuro_t1_t3',
    name: 'Cụm Nhà T1 - T2 - T3 (Viện Thần Kinh)',
    nameEn: 'Buildings T1-T3 (Neurology Institute)',
    category: 'clinical',
    buildingId: 'T1',
    description: 'Khám, điều trị nội trú bệnh lý thần kinh và điện não đồ.',
    x: 670,
    y: 430,
    width: 80,
    height: 120,
    colorType: 'yellow',
    entranceX: 710,
    entranceY: 490
  },
  // 8: CỤM VIỆN SỨC KHỎE TÂM THẦN (T4 - T5 - T6)
  {
    num: 8,
    id: 'block_8_psychiatry_t4_t6',
    name: 'Cụm Nhà T4 - T5 - T6 (Viện Sức Khỏe Tâm Thần)',
    nameEn: 'Buildings T4-T6 (National Institute of Mental Health)',
    category: 'clinical',
    buildingId: 'T4',
    description: 'Viện Sức khỏe tâm thần Quốc gia, khám và tư vấn tâm lý.',
    x: 760,
    y: 430,
    width: 65,
    height: 120,
    colorType: 'yellow',
    entranceX: 790,
    entranceY: 490
  },
  // 9: VIỆN Y HỌC NHIỆT ĐỚI (F)
  {
    num: 9,
    id: 'block_9_tropical_f',
    name: 'Tòa Nhà F (Viện Y Học Nhiệt Đới)',
    nameEn: 'Building F (Tropical Medicine Institute)',
    category: 'clinical',
    buildingId: 'F',
    description: 'Chuyên khoa truyền nhiễm, sốt xuất huyết, viêm gan virus và bệnh nhiệt đới.',
    x: 670,
    y: 330,
    width: 155,
    height: 60,
    colorType: 'yellow',
    entranceX: 740,
    entranceY: 360
  },
  // 18: TRUNG TÂM CẤP CỨU A9 (KHỐI ĐỎ KHẨN CẤP)
  {
    num: 18,
    id: 'block_18_a9_emergency',
    name: 'Tòa A9 (Trung Tâm Cấp Cứu 24/7)',
    nameEn: 'Building A9 (24/7 Emergency Center)',
    category: 'emergency',
    buildingId: 'A9',
    description: 'Đầu mối tiếp nhận mọi ca cấp cứu đa khoa, hồi sức tích cực 24/7.',
    x: 645,
    y: 575,
    width: 65,
    height: 75,
    colorType: 'red',
    entranceX: 680,
    entranceY: 575,
    emergencyIcon: true
  },
  // 19: TRUNG TÂM ĐỘT QUỴ (A10)
  {
    num: 19,
    id: 'block_19_a10_stroke',
    name: 'Tòa A10 (Trung Tâm Đột Quỵ)',
    nameEn: 'Building A10 (Stroke Center)',
    category: 'emergency',
    buildingId: 'A10',
    description: 'Trung tâm can thiệp đột quỵ cấp, tiêu sợi huyết và lấy huyết khối giờ vàng.',
    x: 715,
    y: 575,
    width: 60,
    height: 75,
    colorType: 'red',
    entranceX: 745,
    entranceY: 575,
    emergencyIcon: true
  },
  // 21: TRUNG TÂM CHỐNG ĐỘC & DA LIỄU (K3)
  {
    num: 21,
    id: 'block_21_k3_poison',
    name: 'Tòa K3 (Trung Tâm Chống Độc / Da Liễu)',
    nameEn: 'Building K3 (Poison Control & Dermatology)',
    category: 'clinical',
    buildingId: 'K3',
    description: 'Trung tâm Chống độc Quốc gia và Khoa Da liễu, gần Cổng 1 Giải Phóng.',
    x: 645,
    y: 655,
    width: 130,
    height: 55,
    colorType: 'yellow',
    entranceX: 710,
    entranceY: 655
  },
  // 26: VIỆN TIM MẠCH VIỆT NAM (NHÀ C)
  {
    num: 26,
    id: 'block_26_heart_institute',
    name: 'Viện Tim Mạch Việt Nam (Nhà C)',
    nameEn: 'Vietnam National Heart Institute (Building C)',
    category: 'clinical',
    buildingId: 'VTM',
    description: 'Đầu mối chuyên sâu tim mạch hàng đầu cả nước.',
    x: 440,
    y: 330,
    width: 70,
    height: 80,
    colorType: 'yellow',
    entranceX: 475,
    entranceY: 370
  }
];

export const Hospital2DCampusMap: React.FC<Hospital2DCampusMapProps> = ({
  startNode,
  destinationNode,
  onSelectStartNode,
  onSelectDestinationNode,
  activeRoute,
  currentStepIndex = 0,
  isNavigating = false,
  language,
  onOpenQRScanner
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Transform states
  const [scale, setScale] = useState<number>(0.95);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState<number | null>(null);

  const [selectedBlock, setSelectedBlock] = useState<CampusBlock | null>(null);

  // Fit to screen handler
  const handleFitToScreen = useCallback(() => {
    setScale(0.95);
    setPan({ x: 0, y: 0 });
  }, []);

  // Reset view handler
  const handleResetView = useCallback(() => {
    setScale(1.0);
    setPan({ x: 0, y: 0 });
  }, []);

  // Center active route handler
  const handleCenterActiveRoute = useCallback(() => {
    if (!activeRoute || activeRoute.pathNodes.length === 0) {
      handleFitToScreen();
      return;
    }

    const nodes = activeRoute.pathNodes;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      if (n.x < minX) minX = n.x;
      if (n.x > maxX) maxX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.y > maxY) maxY = n.y;
    });

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // SVG center is (490, 430)
    const targetPanX = (490 - centerX) * 0.9;
    const targetPanY = (430 - centerY) * 0.9;

    setPan({ x: targetPanX, y: targetPanY });
    setScale(1.15);
  }, [activeRoute, handleFitToScreen]);

  // Center route on start navigation
  useEffect(() => {
    if (isNavigating && activeRoute) {
      handleCenterActiveRoute();
    }
  }, [isNavigating, activeRoute, handleCenterActiveRoute]);

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setScale(prev => Math.min(Math.max(prev * zoomFactor, 0.45), 2.4));
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
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

  // Touch Handlers (Pan and Pinch to zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      setTouchDistance(Math.sqrt(dx * dx + dy * dy));
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    } else if (e.touches.length === 2 && touchDistance !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.sqrt(dx * dx + dy * dy);
      const factor = newDist / touchDistance;
      setScale(prev => Math.min(Math.max(prev * factor, 0.45), 2.4));
      setTouchDistance(newDist);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchDistance(null);
  };

  // Route segments with step highlights
  const routeSegments = useMemo(() => {
    if (!activeRoute || activeRoute.pathNodes.length < 2) return [];

    const segments: {
      from: MapNode;
      to: MapNode;
      status: 'completed' | 'current' | 'upcoming' | 'preview';
      stepIndex: number;
    }[] = [];

    const nodes = activeRoute.pathNodes;

    for (let i = 0; i < nodes.length - 1; i++) {
      const from = nodes[i];
      const to = nodes[i + 1];

      let status: 'completed' | 'current' | 'upcoming' | 'preview' = 'preview';
      if (isNavigating) {
        if (i < currentStepIndex) {
          status = 'completed';
        } else if (i === currentStepIndex) {
          status = 'current';
        } else {
          status = 'upcoming';
        }
      }

      segments.push({ from, to, status, stepIndex: i });
    }

    return segments;
  }, [activeRoute, isNavigating, currentStepIndex]);

  return (
    <div 
      ref={containerRef}
      id="hospital-master-2d-campus-map"
      className="relative w-full h-full min-h-[380px] bg-slate-100 flex flex-col overflow-hidden select-none cursor-grab active:cursor-grabbing font-sans touch-none"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ================= RIGHT FLOATING SENIOR CONTROL COLUMN ================= */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2.5 pointer-events-auto">
        {/* Zoom In */}
        <button
          id="btn-map-zoom-in"
          onClick={() => setScale(s => Math.min(s + 0.15, 2.4))}
          className="w-13 h-13 bg-white/95 hover:bg-cyan-50 active:bg-cyan-100 text-slate-800 hover:text-cyan-800 rounded-2xl border-2 border-slate-300 shadow-md transition flex items-center justify-center cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-600/30"
          aria-label="Phóng to bản đồ"
          title="Phóng to (+)"
        >
          <ZoomIn className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Zoom Out */}
        <button
          id="btn-map-zoom-out"
          onClick={() => setScale(s => Math.max(s - 0.15, 0.45))}
          className="w-13 h-13 bg-white/95 hover:bg-cyan-50 active:bg-cyan-100 text-slate-800 hover:text-cyan-800 rounded-2xl border-2 border-slate-300 shadow-md transition flex items-center justify-center cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-600/30"
          aria-label="Thu nhỏ bản đồ"
          title="Thu nhỏ (−)"
        >
          <ZoomOut className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Fit to screen */}
        <button
          id="btn-map-fit-screen"
          onClick={handleFitToScreen}
          className="w-13 h-13 bg-white/95 hover:bg-cyan-50 active:bg-cyan-100 text-slate-800 hover:text-cyan-800 rounded-2xl border-2 border-slate-300 shadow-md transition flex items-center justify-center cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-600/30"
          aria-label="Xem toàn bộ khuôn viên bệnh viện"
          title="Vừa màn hình"
        >
          <Maximize2 className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Center Active Route */}
        {activeRoute && (
          <button
            id="btn-map-center-route"
            onClick={handleCenterActiveRoute}
            className="w-13 h-13 bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-900 text-white rounded-2xl border-2 border-cyan-800 shadow-md transition flex items-center justify-center cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-600/40"
            aria-label="Căn giữa tuyến đường đang đi"
            title="Căn giữa tuyến đường"
          >
            <Crosshair className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}

        {/* Reset View */}
        <button
          id="btn-map-reset-view"
          onClick={handleResetView}
          className="w-13 h-13 bg-white/95 hover:bg-cyan-50 active:bg-cyan-100 text-slate-800 hover:text-cyan-800 rounded-2xl border-2 border-slate-300 shadow-md transition flex items-center justify-center cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-600/30"
          aria-label="Đặt lại góc nhìn ban đầu"
          title="Đặt lại góc nhìn"
        >
          <RotateCcw className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* ================= MAP SVG CANVAS ================= */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center">
        <div 
          className="transition-transform duration-75 ease-out select-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          <svg
            width="980"
            height="860"
            viewBox="0 0 980 860"
            className="bg-white rounded-3xl border-2 border-slate-300 shadow-xl overflow-hidden"
          >
            <defs>
              {/* Pattern for background */}
              <pattern id="campus-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="0.8" />
              </pattern>
            </defs>

            {/* Campus Background Yard */}
            <rect width="980" height="860" fill="#f8fafc" />
            <rect width="980" height="860" fill="url(#campus-grid)" />

            {/* Campus Outer Boundary */}
            <rect 
              x="20" 
              y="20" 
              width="940" 
              height="820" 
              rx="20" 
              fill="#ffffff" 
              stroke="#cbd5e1" 
              strokeWidth="2" 
            />

            {/* ================= STREETS & GATES ================= */}

            {/* Phố Phương Mai (Right Street) */}
            <g id="street-phuong-mai">
              <rect x="830" y="100" width="70" height="580" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
              <text 
                x="865" 
                y="390" 
                fill="#475569" 
                fontSize="13" 
                fontWeight="bold" 
                textAnchor="middle"
                transform="rotate(90, 865, 390)"
              >
                PHỐ PHƯƠNG MAI
              </text>

              {/* Gate 3 Marker */}
              <g 
                transform="translate(865, 440)" 
                className="cursor-pointer"
                onClick={() => {
                  const node = MAP_NODES_DATA.find(n => n.id === 'node_gate_3');
                  if (node) onSelectStartNode(node);
                }}
              >
                <circle cx="0" cy="0" r="16" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                <text x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">C3</text>
                <text x="0" y="28" fill="#065f46" fontSize="10" fontWeight="bold" textAnchor="middle">Cổng số 3</text>
              </g>
            </g>

            {/* Đường Giải Phóng (Bottom Street) */}
            <g id="street-giai-phong">
              <rect x="180" y="720" width="650" height="70" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="500" y="785" fill="#475569" fontSize="13" fontWeight="bold" textAnchor="middle">
                ĐƯỜNG GIẢI PHÓNG
              </text>

              {/* Gate 4 Marker */}
              <g 
                transform="translate(280, 740)" 
                className="cursor-pointer"
                onClick={() => {
                  const node = MAP_NODES_DATA.find(n => n.id === 'node_gate_4');
                  if (node) onSelectStartNode(node);
                }}
              >
                <circle cx="0" cy="0" r="15" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                <text x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">C4</text>
                <text x="0" y="-18" fill="#065f46" fontSize="10" fontWeight="bold" textAnchor="middle">Cổng số 4 (K1, K2)</text>
              </g>

              {/* Gate 2 Marker */}
              <g 
                transform="translate(480, 740)" 
                className="cursor-pointer"
                onClick={() => {
                  const node = MAP_NODES_DATA.find(n => n.id === 'node_gate_2');
                  if (node) onSelectStartNode(node);
                }}
              >
                <circle cx="0" cy="0" r="15" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                <text x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">C2</text>
                <text x="0" y="-18" fill="#065f46" fontSize="10" fontWeight="bold" textAnchor="middle">Cổng số 2 (Ra ô tô)</text>
              </g>

              {/* Gate 1 Marker */}
              <g 
                transform="translate(680, 740)" 
                className="cursor-pointer"
                onClick={() => {
                  const node = MAP_NODES_DATA.find(n => n.id === 'node_gate_1');
                  if (node) onSelectStartNode(node);
                }}
              >
                <circle cx="0" cy="0" r="16" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                <text x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">C1</text>
                <text x="0" y="-18" fill="#065f46" fontSize="10" fontWeight="bold" textAnchor="middle">Cổng số 1 (A9, K3)</text>
              </g>
            </g>

            {/* Internal Pathways Network */}
            <g id="campus-internal-walkways" stroke="#e2e8f0" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none">
              {/* Main South-North axis */}
              <line x1="280" y1="740" x2="280" y2="650" />
              <line x1="480" y1="740" x2="480" y2="480" />
              <line x1="680" y1="740" x2="680" y2="640" />
              {/* Central cross connections */}
              <line x1="280" y1="650" x2="680" y2="640" />
              <line x1="480" y1="480" x2="865" y2="440" />
              <line x1="680" y1="640" x2="680" y2="440" />
              <line x1="550" y1="495" x2="680" y2="490" />
            </g>

            {/* ================= BUILDINGS BLOCKS ================= */}
            <g id="campus-building-blocks">
              {MASTER_CAMPUS_BLOCKS.map(block => {
                const isSelected = selectedBlock?.id === block.id;
                const isEmergency = block.category === 'emergency';
                const fillColor = isEmergency ? '#fee2e2' : isSelected ? '#e0f2fe' : '#fef9c3';
                const strokeColor = isEmergency ? '#ef4444' : isSelected ? '#0284c7' : '#ca8a04';

                return (
                  <g
                    key={block.id}
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedBlock(block)}
                  >
                    {block.polygonPoints ? (
                      <polygon
                        points={block.polygonPoints}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={isSelected ? '3' : '2'}
                      />
                    ) : (
                      <rect
                        x={block.x}
                        y={block.y}
                        width={block.width}
                        height={block.height}
                        rx="8"
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={isSelected ? '3' : '2'}
                      />
                    )}

                    {/* Block Number / Code */}
                    <text
                      x={block.x + block.width / 2}
                      y={block.y + block.height / 2 - 4}
                      fill={isEmergency ? '#991b1b' : '#713f12'}
                      fontSize="12"
                      fontWeight="black"
                      textAnchor="middle"
                    >
                      {block.num}
                    </text>

                    {/* Building Name */}
                    <text
                      x={block.x + block.width / 2}
                      y={block.y + block.height / 2 + 12}
                      fill={isEmergency ? '#991b1b' : '#334155'}
                      fontSize="9.5"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {block.name.split('(')[0].trim()}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* ================= QR CHECKPOINT MARKERS ================= */}
            <g id="campus-qr-checkpoints">
              {BACH_MAI_QR_CHECKPOINTS.slice(0, 10).map(cp => {
                const node = MAP_NODES_DATA.find(n => n.id === cp.nodeId);
                if (!node) return null;

                return (
                  <g
                    key={cp.code}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer group"
                    onClick={() => {
                      onSelectStartNode(node);
                    }}
                  >
                    <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                    <text x="0" y="3" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">QR</text>
                  </g>
                );
              })}
            </g>

            {/* ================= ACTIVE NAVIGATION ROUTE RENDER ================= */}
            {routeSegments.length > 0 && (
              <g id="active-navigation-route">
                {routeSegments.map((seg, idx) => {
                  let strokeColor = '#38bdf8'; // preview default
                  let strokeWidth = '6';
                  let strokeDasharray = 'none';

                  if (seg.status === 'completed') {
                    strokeColor = '#94a3b8'; // gray
                    strokeWidth = '4';
                  } else if (seg.status === 'current') {
                    strokeColor = '#0284c7'; // vibrant cyan/blue
                    strokeWidth = '8';
                    strokeDasharray = '6 3';
                  } else if (seg.status === 'upcoming') {
                    strokeColor = '#38bdf8'; // medium blue
                    strokeWidth = '5';
                  }

                  return (
                    <line
                      key={idx}
                      x1={seg.from.x}
                      y1={seg.from.y}
                      x2={seg.to.x}
                      y2={seg.to.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDasharray}
                      strokeLinecap="round"
                    />
                  );
                })}

                {/* Waypoint nodes along route */}
                {activeRoute?.pathNodes.map((n, idx) => (
                  <circle
                    key={idx}
                    cx={n.x}
                    cy={n.y}
                    r={idx === 0 || idx === activeRoute.pathNodes.length - 1 ? 7 : 4}
                    fill={idx === 0 ? '#059669' : idx === activeRoute.pathNodes.length - 1 ? '#e11d48' : '#0284c7'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                ))}
              </g>
            )}

            {/* ================= START PIN ================= */}
            {startNode && (
              <g transform={`translate(${startNode.x}, ${startNode.y - 12})`}>
                <circle cx="0" cy="0" r="14" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                <text x="0" y="4" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">ĐI</text>
                <text x="0" y="-18" fill="#065f46" fontSize="11" fontWeight="black" textAnchor="middle">
                  Vị trí đã chọn: {startNode.name}
                </text>
              </g>
            )}

            {/* ================= DESTINATION PIN ================= */}
            {destinationNode && (
              <g transform={`translate(${destinationNode.x}, ${destinationNode.y - 14})`}>
                <circle cx="0" cy="0" r="15" fill="#e11d48" stroke="#ffffff" strokeWidth="2" />
                <text x="0" y="4" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">ĐÍCH</text>
                <text x="0" y="-20" fill="#9f1239" fontSize="11" fontWeight="black" textAnchor="middle">
                  Nơi đến: {destinationNode.name}
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* ================= MAP LEGEND (CHÚ THÍCH) ================= */}
      <div className="absolute bottom-2.5 left-2.5 z-20 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold text-slate-700 flex flex-wrap items-center gap-3 pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-cyan-700" />
          <span>Đang đi</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-400" />
          <span>Đã qua</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-sky-400" />
          <span>Tiếp theo</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-600" />
          <span>Nơi đến</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-900 border border-cyan-400" />
          <span>Mã vị trí</span>
        </div>
      </div>

      {/* ================= SELECTED BUILDING MODAL / CARD ================= */}
      {selectedBlock && (
        <div className="absolute bottom-12 right-2.5 max-w-xs w-full bg-white border border-slate-200 rounded-2xl shadow-xl p-3.5 space-y-2.5 z-30 animate-in fade-in">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-cyan-800">
                Thông tin khối nhà
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">
                {selectedBlock.name}
              </h4>
            </div>
            <button
              onClick={() => setSelectedBlock(null)}
              className="p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-600 leading-snug">
            {selectedBlock.description}
          </p>

          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
            <button
              onClick={() => {
                const node = MAP_NODES_DATA.find(n => n.buildingId === selectedBlock.buildingId) ||
                             MAP_NODES_DATA.find(n => n.id === `node_${selectedBlock.buildingId.toLowerCase()}_entrance`);
                if (node) {
                  onSelectDestinationNode(node);
                  setSelectedBlock(null);
                }
              }}
              className="flex-1 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl text-center"
            >
              Chọn làm đích đến
            </button>
            <button
              onClick={() => {
                const node = MAP_NODES_DATA.find(n => n.buildingId === selectedBlock.buildingId) ||
                             MAP_NODES_DATA.find(n => n.id === `node_${selectedBlock.buildingId.toLowerCase()}_entrance`);
                if (node) {
                  onSelectStartNode(node);
                  setSelectedBlock(null);
                }
              }}
              className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl text-center"
            >
              Chọn xuất phát
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
