import React, { useState, useMemo } from 'react';
import { 
  MapNode, 
  RoutingProfile,
  HospitalCampus
} from '../types';
import { 
  MAP_NODES_DATA, 
  getRoomById,
  BACH_MAI_GATES,
  BACH_MAI_BUILDINGS
} from '../data/hospitalData';
import { 
  Search, 
  ArrowDownUp, 
  X,
  ChevronRight,
  Building2,
  Navigation,
  Sparkles,
  Accessibility,
  Zap,
  Activity,
  CheckCircle2,
  HelpCircle,
  QrCode,
  MapPin,
  AlertCircle,
  Info,
  Footprints,
  Clock,
  Flame,
  ArrowRight
} from 'lucide-react';
import { VerifiedQRCheckpoint } from '../data/bachMai/checkpoints';

interface SearchAndRoutePanelProps {
  currentCampus: HospitalCampus;
  startNode: MapNode | null;
  destinationNode: MapNode | null;
  onSelectStartNode: (node: MapNode | null) => void;
  onSelectDestinationNode: (node: MapNode | null) => void;
  onSwapNodes: () => void;
  routingProfile: RoutingProfile;
  onChangeRoutingProfile: (profile: RoutingProfile) => void;
  onStartNavigation: () => void;
  onOpenQRScanner: () => void;
  lastVerifiedCheckpoint?: VerifiedQRCheckpoint | null;
  language: 'vi' | 'en';
}

export const SearchAndRoutePanel: React.FC<SearchAndRoutePanelProps> = ({
  currentCampus,
  startNode,
  destinationNode,
  onSelectStartNode,
  onSelectDestinationNode,
  onSwapNodes,
  routingProfile,
  onChangeRoutingProfile,
  onStartNavigation,
  onOpenQRScanner,
  lastVerifiedCheckpoint,
  language
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showUnknownLocationGuide, setShowUnknownLocationGuide] = useState<boolean>(false);
  const [showAllBuildingsModal, setShowAllBuildingsModal] = useState<boolean>(false);

  // Normalize search string helper
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .trim();
  };

  const isCanteenSearch = useMemo(() => {
    const norm = normalizeText(searchQuery);
    return norm.includes('cang tin') || norm.includes('canteen') || norm.includes('nha an') || norm.includes('an uong');
  }, [searchQuery]);

  // Selectable Destination nodes
  const selectableDestinations = useMemo(() => {
    return MAP_NODES_DATA.filter(n => n.type !== 'corridor' && n.type !== 'gate');
  }, []);

  // Filtered nodes based on query
  const filteredDestinationNodes = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const normQ = normalizeText(searchQuery);
    const rawQ = searchQuery.toLowerCase().trim();

    return selectableDestinations.filter(n => {
      const room = n.roomId ? getRoomById(n.roomId) : null;
      const nameNorm = normalizeText(n.name);
      const nameEnNorm = normalizeText(n.nameEn);
      const bIdNorm = normalizeText(n.buildingId);
      const roomDescNorm = room ? normalizeText(room.description) : '';
      const specialtyNorm = room?.specialty ? normalizeText(room.specialty) : '';
      const symptomsNorm = room?.commonSymptoms ? room.commonSymptoms.map(normalizeText).join(' ') : '';

      return (
        nameNorm.includes(normQ) ||
        nameEnNorm.includes(normQ) ||
        bIdNorm === normQ ||
        `toa ${bIdNorm}`.includes(normQ) ||
        `tòa ${bIdNorm}`.includes(rawQ) ||
        roomDescNorm.includes(normQ) ||
        specialtyNorm.includes(normQ) ||
        symptomsNorm.includes(normQ)
      );
    });
  }, [selectableDestinations, searchQuery]);

  // Quick Pick Destination list
  const quickDestinations = [
    { label: 'Tòa K1 (Khám bệnh)', nodeId: 'node_k1_entrance', badge: 'K1' },
    { label: 'Tòa K2 (Điều trị trong ngày)', nodeId: 'node_k2_entrance', badge: 'K2' },
    { label: 'Trung tâm Cấp cứu A9', nodeId: 'node_a9_emergency_entrance', badge: 'A9', isEmergency: true },
    { label: 'Trung tâm Đột quỵ A10', nodeId: 'node_a10_stroke_entrance', badge: 'A10' },
    { label: 'Trung tâm Chống độc K3', nodeId: 'node_k3_poison_entrance', badge: 'K3' },
    { label: 'Viện Tim Mạch (C)', nodeId: 'node_vtm_entrance', badge: 'VTM' },
    { label: 'Tòa P (Việt Nhật)', nodeId: 'node_p_vietnhat_entrance', badge: 'P' },
    { label: 'Tòa Q (21 tầng)', nodeId: 'node_q_21story_entrance', badge: 'Q' },
    { label: 'Tòa H (Y học hạt nhân)', nodeId: 'node_h_onco_entrance', badge: 'H' },
    { label: 'Tòa F (Bệnh nhiệt đới)', nodeId: 'node_f_tropical_entrance', badge: 'F' },
    { label: 'Cụm T1 - T3 (Thần kinh)', nodeId: 'node_t1_neuro_entrance', badge: 'T1' },
    { label: 'Cụm T4 - T6 (Sức khỏe tâm thần)', nodeId: 'node_t4_mental_entrance', badge: 'T4' }
  ];

  // Helper to handle selecting a quick node
  const handleSelectQuickNode = (nodeId: string, isStart: boolean = false) => {
    const node = MAP_NODES_DATA.find(n => n.id === nodeId);
    if (node) {
      if (isStart) {
        onSelectStartNode(node);
        setShowUnknownLocationGuide(false);
      } else {
        onSelectDestinationNode(node);
        setSearchQuery('');
      }
    }
  };

  return (
    <div 
      id="search-and-route-panel"
      className="w-full bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden select-none text-slate-800 shadow-xs"
    >
      {/* ================= FLOW STEP 1: DESTINATION SELECTION ================= */}
      {!destinationNode ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Bạn muốn đến đâu?</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Tìm theo tên tòa nhà (K1, K2, A9, Q, P...), khoa chuyên môn hoặc triệu chứng
            </p>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-destination-search"
              type="text"
              placeholder="Nhập tên khoa, số tòa (VD: K1, Cấp cứu, Đột quỵ, Ung bướu...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600 transition"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Special Canteen Notice */}
          {isCanteenSearch && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl space-y-1 text-xs text-amber-950 animate-in fade-in">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Thông báo dữ liệu</span>
              </div>
              <p className="leading-relaxed">
                Chưa có dữ liệu xác minh vị trí căng tin trong phiên bản hiện tại.
              </p>
            </div>
          )}

          {/* Search Results */}
          {searchQuery.trim() && !isCanteenSearch && (
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Kết quả tìm kiếm ({filteredDestinationNodes.length}):
              </div>

              {filteredDestinationNodes.length > 0 ? (
                filteredDestinationNodes.map(node => (
                  <button
                    key={node.id}
                    onClick={() => {
                      onSelectDestinationNode(node);
                      setSearchQuery('');
                    }}
                    className="w-full p-2.5 bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-400 rounded-2xl flex items-center justify-between text-left transition cursor-pointer group"
                  >
                    <div className="space-y-0.5 min-w-0 flex-1 pr-2">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-900 truncate">
                        {node.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        Tòa {node.buildingId} • {node.floorId ? `Tầng ${node.floorId}` : 'Sảnh tầng 1'}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 shrink-0" />
                  </button>
                ))
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-center animate-in fade-in">
                  <p className="text-xs font-bold text-slate-700">
                    Không tìm thấy địa điểm phù hợp.
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowAllBuildingsModal(true)}
                      className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 transition cursor-pointer"
                    >
                      Xem danh sách toàn bộ tòa nhà
                    </button>
                    <button
                      onClick={() => handleSelectQuickNode('node_k1_entrance')}
                      className="w-full py-2 px-3 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-xl text-xs font-bold text-cyan-900 transition cursor-pointer"
                    >
                      Đến quầy tiếp đón K1 để được hỗ trợ
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Destination Chips */}
          {!searchQuery.trim() && (
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Điểm đến phổ biến tại Bạch Mai:
              </div>

              <div className="grid grid-cols-2 gap-2">
                {quickDestinations.map(item => (
                  <button
                    key={item.nodeId}
                    onClick={() => handleSelectQuickNode(item.nodeId)}
                    className={`p-2.5 text-left rounded-2xl border transition cursor-pointer flex flex-col justify-between h-20 ${
                      item.isEmergency
                        ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-950'
                        : 'bg-slate-50 hover:bg-cyan-50 border-slate-200 hover:border-cyan-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded font-mono ${
                        item.isEmergency ? 'bg-rose-200 text-rose-900' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                      {item.isEmergency && <Flame className="w-3.5 h-3.5 text-rose-600" />}
                    </div>
                    <div className="text-xs font-bold leading-tight line-clamp-2">
                      {item.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ================= FLOW STEP 2: START LOCATION & ROUTE CONFIRMATION ================= */
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Selected Destination Summary Card */}
          <div className="p-3 bg-cyan-50/80 border border-cyan-200 rounded-2xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                Đích
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-cyan-800 font-bold uppercase tracking-wider">Điểm đến đã chọn</div>
                <div className="text-xs sm:text-sm font-black text-slate-900 truncate">
                  {destinationNode.name}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  Tòa {destinationNode.buildingId}
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectDestinationNode(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition cursor-pointer text-xs font-bold"
              title="Đổi điểm đến"
            >
              Đổi
            </button>
          </div>

          {/* Sub-step: Choose Start Location if not set */}
          {!startNode ? (
            <div className="space-y-3.5 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Bạn đang đứng ở đâu?
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Chọn cổng bạn vừa vào hoặc quét mã QR gần nhất để bắt đầu chỉ đường
                </p>
              </div>

              {/* Option 1: The 4 Official Gates */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  1. Chọn một trong 4 cổng bệnh viện:
                </div>
                <div className="space-y-1.5">
                  {BACH_MAI_GATES.map(gate => (
                    <button
                      key={gate.id}
                      onClick={() => handleSelectQuickNode(gate.nodeId, true)}
                      className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl flex items-start gap-2.5 text-left transition cursor-pointer group"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition">
                        {gate.gateNumber}
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-950">
                          {gate.name}
                        </div>
                        <div className="text-[11px] text-slate-500 leading-snug">
                          {gate.descriptionVi}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 2: Scan QR Checkpoint */}
              <div className="pt-1">
                <button
                  id="btn-trigger-qr-scanner"
                  onClick={onOpenQRScanner}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2.5 shadow-md transition cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-cyan-400" />
                  <span>2. Quét mã QR Checkpoint tại chỗ</span>
                </button>
              </div>

              {/* Option 3: "Tôi chưa biết vị trí" */}
              <div className="pt-1">
                <button
                  id="btn-unknown-start-location"
                  onClick={() => setShowUnknownLocationGuide(!showUnknownLocationGuide)}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>3. Tôi chưa biết vị trí đang đứng</span>
                </button>

                {showUnknownLocationGuide && (
                  <div className="mt-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 text-xs text-amber-950 animate-in fade-in">
                    <p className="leading-relaxed font-medium">
                      Hãy quan sát biển tên cổng hoặc tòa nhà gần nhất, sau đó chọn trong danh sách dưới đây. Nếu có mã QR MedNav tại vị trí đang đứng, bạn có thể quét mã để xác nhận vị trí.
                    </p>

                    <div className="space-y-1.5 pt-1 border-t border-amber-200">
                      <div className="font-bold text-amber-900 text-[11px]">
                        Chọn tòa nhà bạn đang đứng gần:
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {quickDestinations.slice(0, 6).map(b => (
                          <button
                            key={b.nodeId}
                            onClick={() => handleSelectQuickNode(b.nodeId, true)}
                            className="p-1.5 text-left bg-white hover:bg-amber-100/70 border border-amber-200 rounded-xl text-[11px] font-bold text-slate-800 truncate cursor-pointer"
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ================= STEP 3: READY TO NAVIGATE ================= */
            <div className="space-y-3.5 animate-in fade-in">
              {/* Start Point Card */}
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    Xuất phát
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Điểm xuất phát</div>
                    <div className="text-xs sm:text-sm font-black text-slate-900 truncate">
                      {startNode.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      Tòa {startNode.buildingId}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectStartNode(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition cursor-pointer text-xs font-bold"
                  title="Đổi điểm xuất phát"
                >
                  Đổi
                </button>
              </div>

              {/* Verified QR Confirmation banner if available */}
              {lastVerifiedCheckpoint && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-950 flex items-start gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Đã xác nhận vị trí qua mã QR:</div>
                    <div className="text-[11px] text-emerald-800">
                      {lastVerifiedCheckpoint.title} • {lastVerifiedCheckpoint.landmarkNear}
                    </div>
                  </div>
                </div>
              )}

              {/* Routing Profile Selector */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Tùy chọn di chuyển:
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => onChangeRoutingProfile('fastest')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      routingProfile === 'fastest'
                        ? 'bg-cyan-50 border-cyan-400 text-cyan-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-cyan-600" />
                    <span className="text-[10px]">Nhanh nhất</span>
                  </button>

                  <button
                    onClick={() => onChangeRoutingProfile('accessible')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      routingProfile === 'accessible'
                        ? 'bg-cyan-50 border-cyan-400 text-cyan-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Accessibility className="w-4 h-4 text-cyan-600" />
                    <span className="text-[10px]">Xe lăn / Thang máy</span>
                  </button>

                  <button
                    onClick={() => onChangeRoutingProfile('visually_impaired')}
                    className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                      routingProfile === 'visually_impaired'
                        ? 'bg-cyan-50 border-cyan-400 text-cyan-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Activity className="w-4 h-4 text-cyan-600" />
                    <span className="text-[10px]">Khiếm thị</span>
                  </button>
                </div>
              </div>

              {/* Start Navigation Action Button */}
              <div className="pt-2">
                <button
                  id="btn-start-navigation"
                  onClick={onStartNavigation}
                  className="w-full py-3.5 px-4 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2.5 shadow-lg transition cursor-pointer"
                >
                  <Navigation className="w-5 h-5 text-white" />
                  <span>Bắt đầu chỉ đường</span>
                </button>
              </div>

              {/* Swap action */}
              <button
                onClick={onSwapNodes}
                className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowDownUp className="w-3.5 h-3.5" />
                <span>Đổi chiều xuất phát ⇄ điểm đến</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal: All Buildings List */}
      {showAllBuildingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-5 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                Danh sách tòa nhà Bệnh viện Bạch Mai
              </h3>
              <button
                onClick={() => setShowAllBuildingsModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {BACH_MAI_BUILDINGS.map(b => (
                <div
                  key={b.id}
                  onClick={() => {
                    const node = MAP_NODES_DATA.find(n => n.buildingId === b.id && n.type === 'entrance') ||
                                 MAP_NODES_DATA.find(n => n.buildingId === b.id);
                    if (node) {
                      onSelectDestinationNode(node);
                      setShowAllBuildingsModal(false);
                    }
                  }}
                  className="p-2.5 bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 rounded-xl transition cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Tòa {b.id} - {b.name}
                    </span>
                    {b.floorsCount && (
                      <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-semibold text-slate-700">
                        {b.floorsCount} tầng
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAllBuildingsModal(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
            >
              Đóng danh sách
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
