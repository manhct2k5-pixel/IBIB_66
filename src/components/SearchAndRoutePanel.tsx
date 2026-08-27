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
import { REAL_HOSPITALS_LIST } from '../data/realHospitalsData';
import { 
  Search, 
  ArrowDownUp, 
  X,
  ChevronRight,
  Building2,
  Navigation
} from 'lucide-react';

interface SearchAndRoutePanelProps {
  currentCampus: HospitalCampus;
  onSelectCampus: (campus: HospitalCampus) => void;
  startNode: MapNode | null;
  destinationNode: MapNode | null;
  onSelectStartNode: (node: MapNode) => void;
  onSelectDestinationNode: (node: MapNode) => void;
  onSwapNodes: () => void;
  routingProfile: RoutingProfile;
  onChangeRoutingProfile: (profile: RoutingProfile) => void;
  onStartNavigation: () => void;
  language: 'vi' | 'en';
}

export const SearchAndRoutePanel: React.FC<SearchAndRoutePanelProps> = ({
  currentCampus,
  onSelectCampus,
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
        if (activeCategory === 'diagnostic') return n.type === 'lab' || n.type === 'imaging';
        if (activeCategory === 'amenity') return n.type === 'restroom' || n.type === 'atm' || n.type === 'canteen';
        if (activeCategory === 'clinical') {
          const room = n.roomId ? getRoomById(n.roomId) : null;
          return room?.category === 'clinical';
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
      const matchDoctor = room?.doctorInCharge?.toLowerCase().includes(q);
      const matchSymptoms = room?.commonSymptoms?.some(s => s.toLowerCase().includes(q));
      const matchDesc = room?.description?.toLowerCase().includes(q);

      return matchName || matchCode || matchDoctor || matchSymptoms || matchDesc;
    });
  }, [allSelectableNodes, activeCategory, searchQuery]);

  // Clean categories
  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'emergency', label: 'Cấp cứu' },
    { id: 'clinical', label: 'Khám bệnh' },
    { id: 'diagnostic', label: 'Xét nghiệm' },
    { id: 'pharmacy', label: 'Thuốc & Viện phí' },
    { id: 'amenity', label: 'Tiện ích' },
  ];

  return (
    <div className="w-full bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden select-none text-slate-800 shadow-sm">
      {/* Hospital Selector Bar */}
      <div className="px-3.5 py-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Building2 className="w-4 h-4 text-cyan-600 shrink-0" />
          <select
            id="sidebar-select-hospital"
            value={currentCampus.id}
            onChange={(e) => {
              const target = REAL_HOSPITALS_LIST.find(h => h.id === e.target.value);
              if (target) onSelectCampus(target);
            }}
            className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer truncate w-full"
          >
            {REAL_HOSPITALS_LIST.map(h => (
              <option key={h.id} value={h.id} className="bg-white text-slate-900">
                {h.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Route Selector Box */}
      <div className="p-3 border-b border-slate-200 space-y-2.5 bg-slate-50/70">
        <div className="space-y-2 relative">
          {/* Start Node */}
          <div 
            onClick={() => {
              if (startNode) onSelectStartNode(null as any);
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
                onClick={(e) => { e.stopPropagation(); onSelectStartNode(null as any); }}
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
              if (destinationNode) onSelectDestinationNode(null as any);
            }}
            className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 py-2 cursor-pointer hover:border-cyan-500 hover:shadow-xs transition"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 shadow-xs" />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Điểm đến</span>
              <div className="text-xs font-bold text-slate-900 truncate">
                {destinationNode ? `${destinationNode.name} (Tòa ${destinationNode.buildingId} - T${destinationNode.floorId})` : 'Chọn điểm đến...'}
              </div>
            </div>
            {destinationNode && (
              <button 
                onClick={(e) => { e.stopPropagation(); onSelectDestinationNode(null as any); }}
                className="text-slate-400 hover:text-slate-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Profile Selector */}
        <div className="grid grid-cols-3 gap-1 bg-slate-200/70 p-1 rounded-xl text-xs">
          <button
            id="btn-profile-fastest"
            onClick={() => onChangeRoutingProfile('fastest')}
            className={`py-1.5 px-1 rounded-lg font-semibold transition text-[11px] text-center truncate cursor-pointer ${
              routingProfile === 'fastest'
                ? 'bg-white text-cyan-800 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Nhanh nhất
          </button>

          <button
            id="btn-profile-accessible"
            onClick={() => onChangeRoutingProfile('accessible')}
            className={`py-1.5 px-1 rounded-lg font-semibold transition text-[11px] text-center truncate cursor-pointer ${
              routingProfile === 'accessible'
                ? 'bg-white text-cyan-800 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Dành cho xe lăn, tránh bậc thang"
          >
            ♿ Xe lăn
          </button>

          <button
            id="btn-profile-visually-impaired"
            onClick={() => onChangeRoutingProfile('visually_impaired')}
            className={`py-1.5 px-1 rounded-lg font-semibold transition text-[11px] text-center truncate cursor-pointer ${
              routingProfile === 'visually_impaired'
                ? 'bg-white text-cyan-800 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Dành cho người khiếm thị"
          >
            🔊 Khiếm thị
          </button>
        </div>

        {/* Start Navigation Action Button */}
        {startNode && destinationNode && (
          <button
            id="btn-start-navigation-action"
            onClick={onStartNavigation}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Navigation className="w-4 h-4" />
            <span>Bắt đầu chỉ đường</span>
          </button>
        )}
      </div>

      {/* Search Input & Category Pills */}
      <div className="p-3 border-b border-slate-200 space-y-2 bg-white">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-departments"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm phòng khám, khoa, bác sĩ..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Horizontal Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`btn-cat-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition text-[11px] font-semibold cursor-pointer ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clean Room List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/50">
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 font-semibold">
          <span>{filteredNodes.length} địa điểm</span>
        </div>

        {filteredNodes.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            <p>Không tìm thấy phòng phù hợp</p>
          </div>
        ) : (
          filteredNodes.map(node => {
            const room = node.roomId ? getRoomById(node.roomId) : null;
            const isDest = destinationNode?.id === node.id;
            const isStart = startNode?.id === node.id;

            return (
              <div
                key={node.id}
                id={`room-item-${node.id}`}
                onClick={() => onSelectDestinationNode(node)}
                className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 shadow-xs ${
                  isDest
                    ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200'
                    : isStart
                    ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
                    : 'bg-white hover:bg-slate-50 hover:border-slate-300 border-slate-200'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    {room?.code && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {room.code}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 font-medium">
                      Tòa {node.buildingId} • T{node.floorId}
                    </span>
                    {node.type === 'emergency' && (
                      <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded">
                        Cấp cứu
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {node.name}
                  </h4>
                  {room?.doctorInCharge && (
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      BS: {room.doctorInCharge}
                    </p>
                  )}
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
