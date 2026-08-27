import React, { useState, useMemo } from 'react';
import { 
  MapNode, 
  RoutingProfile,
  HospitalCampus
} from '../types';
import { 
  MAP_NODES_DATA, 
  getRoomById 
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
  HelpCircle
} from 'lucide-react';

interface SearchAndRoutePanelProps {
  currentCampus: HospitalCampus;
  onSelectCampus: (campus: HospitalCampus) => void;
  startNode: MapNode | null;
  destinationNode: MapNode | null;
  onSelectStartNode: (node: MapNode | null) => void;
  onSelectDestinationNode: (node: MapNode | null) => void;
  onSwapNodes: () => void;
  routingProfile: RoutingProfile;
  onChangeRoutingProfile: (profile: RoutingProfile) => void;
  onStartNavigation: () => void;
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
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Available room nodes
  const allSelectableNodes = useMemo(() => {
    return MAP_NODES_DATA.filter(n => n.type !== 'corridor');
  }, []);

  // Filtered nodes based on query & category
  const filteredNodes = useMemo(() => {
    let list = allSelectableNodes;

    if (activeCategory !== 'all') {
      list = list.filter(n => {
        if (activeCategory === 'emergency') return n.type === 'emergency';
        if (activeCategory === 'pharmacy') return n.type === 'pharmacy' || n.type === 'cashier';
        if (activeCategory === 'gates') return n.type === 'gate';
        if (activeCategory === 'clinical') {
          const room = n.roomId ? getRoomById(n.roomId) : null;
          return room?.category === 'clinical' || n.type === 'room' || n.type === 'reception';
        }
        return true;
      });
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(n => {
      const room = n.roomId ? getRoomById(n.roomId) : null;
      const matchName = n.name.toLowerCase().includes(q) || n.nameEn.toLowerCase().includes(q);
      const matchCode = room?.code?.toLowerCase().includes(q);
      const matchSymptoms = room?.commonSymptoms?.some(s => s.toLowerCase().includes(q));
      const matchDesc = room?.description?.toLowerCase().includes(q);

      return matchName || matchCode || matchSymptoms || matchDesc;
    });
  }, [allSelectableNodes, activeCategory, searchQuery]);

  // Clean categories
  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'emergency', label: 'Cấp cứu A9 & Đột quỵ' },
    { id: 'gates', label: 'Cổng viện (1-4)' },
    { id: 'clinical', label: 'Khoa / Phòng khám' },
    { id: 'pharmacy', label: 'Thuốc & Viện phí' }
  ];

  return (
    <div className="w-full bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden select-none text-slate-800 shadow-sm">
      {/* Hospital Identity Header - Fixed to Bach Mai */}
      <div className="px-3.5 py-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-lg bg-cyan-600 flex items-center justify-center text-white shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">
              {currentCampus.name}
            </div>
            <div className="text-[10px] text-cyan-700 font-semibold truncate flex items-center gap-1">
              <span>Phiên bản thử nghiệm</span>
              <span>•</span>
              <span>Dữ liệu sơ đồ xác minh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Route Selector Box */}
      <div className="p-3 border-b border-slate-200 space-y-2.5 bg-slate-50/70">
        <div className="space-y-2 relative">
          {/* Start Node */}
          <div 
            onClick={() => {
              if (startNode) onSelectStartNode(null);
            }}
            className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 py-2 cursor-pointer hover:border-cyan-500 hover:shadow-xs transition"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-xs" />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Điểm xuất phát</span>
              <div className="text-xs font-bold text-slate-900 truncate">
                {startNode ? `${startNode.name} (Tòa ${startNode.buildingId} - T${startNode.floorId})` : 'Chọn điểm xuất phát...'}
              </div>
            </div>
            {startNode && (
              <button 
                onClick={(e) => { e.stopPropagation(); onSelectStartNode(null); }}
                className="text-slate-400 hover:text-slate-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Swap Button */}
          <button
            id="btn-swap-route-nodes"
            onClick={onSwapNodes}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white hover:bg-slate-100 text-slate-600 hover:text-cyan-700 border border-slate-200 rounded-full flex items-center justify-center shadow-md transition cursor-pointer"
            title="Đổi chiều xuất phát - điểm đến"
          >
            <ArrowDownUp className="w-3.5 h-3.5" />
          </button>

          {/* Destination Node */}
          <div 
            onClick={() => {
              if (destinationNode) onSelectDestinationNode(null);
            }}
            className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 py-2 cursor-pointer hover:border-cyan-500 hover:shadow-xs transition"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 shadow-xs" />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Điểm đến</span>
              <div className="text-xs font-bold text-slate-900 truncate">
                {destinationNode ? `${destinationNode.name} (Tòa ${destinationNode.buildingId} - T${destinationNode.floorId})` : 'Chọn nơi muốn đến...'}
              </div>
            </div>
            {destinationNode && (
              <button 
                onClick={(e) => { e.stopPropagation(); onSelectDestinationNode(null); }}
                className="text-slate-400 hover:text-slate-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Routing Profile Options */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <button
            id="btn-profile-fastest"
            onClick={() => onChangeRoutingProfile('fastest')}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
              routingProfile === 'fastest'
                ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Nhanh nhất</span>
          </button>

          <button
            id="btn-profile-accessible"
            onClick={() => onChangeRoutingProfile('accessible')}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
              routingProfile === 'accessible'
                ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Tránh cầu thang bộ, ưu tiên thang máy & ram dốc xe lăn"
          >
            <Accessibility className="w-3.5 h-3.5" />
            <span>Xe lăn</span>
          </button>

          <button
            id="btn-profile-emergency"
            onClick={() => onChangeRoutingProfile('emergency')}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
              routingProfile === 'emergency'
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
            }`}
            title="Ưu tiên lối thoát & cấp cứu khẩn cấp"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Cấp cứu</span>
          </button>
        </div>

        {/* Start Route Action Button */}
        {startNode && destinationNode && (
          <button
            id="btn-sidebar-start-route"
            onClick={onStartNavigation}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Navigation className="w-4 h-4" />
            <span>BẮT ĐẦU CHỈ ĐƯỜNG</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-slate-200 bg-white">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            id="input-sidebar-search-rooms"
            type="text"
            placeholder="Tìm khoa, triệu chứng, cổng viện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Destination List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Danh sách điểm đến ({filteredNodes.length})</span>
        </div>

        {filteredNodes.map((node) => {
          const room = node.roomId ? getRoomById(node.roomId) : null;
          const isVerified = node.verificationStatus === 'verified' && room?.verificationStatus !== 'estimated';

          return (
            <div
              key={node.id}
              onClick={() => {
                if (!startNode) {
                  onSelectStartNode(node);
                } else {
                  onSelectDestinationNode(node);
                }
              }}
              className="p-2.5 bg-white hover:bg-slate-50 border border-slate-100 hover:border-cyan-300 rounded-xl transition cursor-pointer space-y-1 group"
            >
              <div className="flex items-start justify-between gap-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  {room?.code && (
                    <span className="px-1.5 py-0.5 bg-cyan-50 text-cyan-700 font-bold rounded text-[10px] border border-cyan-200 shrink-0">
                      {room.code}
                    </span>
                  )}
                  <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-cyan-700 transition">
                    {node.name}
                  </h4>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 shrink-0" />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Tòa {node.buildingId} • Tầng {node.floorId}</span>
                {isVerified ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Đã xác minh
                  </span>
                ) : node.verificationStatus === 'campus_verified' ? (
                  <span className="text-sky-700 font-medium flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3 text-sky-600" />
                    Tọa độ khuôn viên
                  </span>
                ) : (
                  <span className="text-slate-400 italic">
                    Chưa có dữ liệu xác minh
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
