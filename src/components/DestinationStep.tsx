import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  ChevronRight, 
  Mic, 
  X, 
  History, 
  Trash2, 
  Map, 
  ListFilter
} from 'lucide-react';
import { HOSPITAL_108_DESTINATIONS } from '../data/hospital108';
import type { Hospital108Destination } from '../types';
import { matchesSearchQuery } from '../utils/search';
import { getRecentDestinationIds, clearRecentDestinations } from '../utils/history';
import { MapPrecisionBadge } from './MapPrecisionBadge';

interface DestinationStepProps {
  onSelectDestination: (dest: Hospital108Destination) => void;
  onOpenVoiceModal: () => void;
  onOpenGeneralMap: () => void;
}

export function DestinationStep({ 
  onSelectDestination, 
  onOpenVoiceModal,
  onOpenGeneralMap 
}: DestinationStepProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    setRecentIds(getRecentDestinationIds());
  }, []);

  const handleClearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearRecentDestinations();
    setRecentIds([]);
  };

  const recentDestinations = useMemo(() => {
    return recentIds
      .map(id => HOSPITAL_108_DESTINATIONS.find(d => d.id === id))
      .filter((d): d is Hospital108Destination => !!d);
  }, [recentIds]);

  const defaultTop4 = useMemo(() => {
    const topIds = ['c1_1_a', 'c1_1_b', 'cap_cuu', 'kham_quoc_te'];
    return topIds
      .map(id => HOSPITAL_108_DESTINATIONS.find(d => d.id === id))
      .filter((d): d is Hospital108Destination => !!d);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return showAll ? HOSPITAL_108_DESTINATIONS : defaultTop4;
    }
    
    return HOSPITAL_108_DESTINATIONS.filter(dest => {
      const targets = [dest.name, dest.building, ...(dest.aliases || [])];
      return matchesSearchQuery(searchQuery, targets);
    });
  }, [searchQuery, showAll, defaultTop4]);

  return (
    <div className="flex flex-col h-full bg-slate-50 w-full max-w-2xl mx-auto pb-10">
      {/* Header tìm kiếm lớn */}
      <div className="bg-teal-700 pt-5 pb-7 px-4 sm:px-6 text-white rounded-b-3xl shadow-md shrink-0">
        <h2 className="text-2xl sm:text-3xl font-black mb-2 text-center">
          Bác muốn đến đâu trong Bệnh viện 108?
        </h2>
        <p className="text-teal-100 mb-5 text-base sm:text-lg font-medium text-center max-w-lg mx-auto leading-relaxed">
          Nói hoặc nhập tên khoa phòng để xem vị trí trên bản đồ chính thức.
        </p>

        {/* Thanh tìm kiếm lớn tích hợp Micro */}
        <div className="relative max-w-xl mx-auto w-full flex items-center">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-6 h-6 text-teal-700 stroke-[2.5]" />
          </div>

          <input
            type="text"
            className="block w-full pl-12 pr-28 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-teal-300 focus:ring-4 focus:ring-teal-500/20 text-slate-900 text-lg sm:text-xl font-bold placeholder-slate-400 shadow-lg transition-all h-16"
            placeholder="Ví dụ: Cấp cứu, Khám bệnh, C1-1..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="absolute inset-y-0 right-2 flex items-center gap-1">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Xóa nội dung"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={onOpenVoiceModal}
              className="h-12 px-3 bg-teal-50 hover:bg-teal-100 active:bg-teal-200 text-teal-800 rounded-xl flex items-center gap-1.5 font-bold transition-all border border-teal-200 shadow-sm"
              title="Tìm bằng giọng nói"
              aria-label="Tìm bằng giọng nói"
            >
              <Mic className="w-6 h-6 text-teal-700" />
              <span className="text-sm sm:text-base hidden sm:inline">Nói</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nội dung danh sách */}
      <div className="flex-1 p-4 sm:p-6 space-y-5">
        {/* Nơi đã xem gần đây (nếu không có tìm kiếm) */}
        {!searchQuery && recentDestinations.length > 0 && (
          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
                <History className="w-5 h-5 text-teal-700" />
                <span>Nơi đã xem gần đây</span>
              </div>
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-1 text-slate-500 hover:text-rose-600 font-semibold text-sm transition-colors py-1 px-2 rounded-lg hover:bg-rose-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa lịch sử</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recentDestinations.map(dest => (
                <button
                  key={`recent-${dest.id}`}
                  onClick={() => onSelectDestination(dest)}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 text-left transition-colors flex items-center justify-between group"
                >
                  <span className="font-bold text-slate-800 text-base group-hover:text-teal-800 truncate">
                    {dest.name}
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-700 shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tiêu đề danh sách */}
        <div className="flex items-center justify-between px-1">
          <h3 className="text-slate-600 font-bold text-base uppercase tracking-wider">
            {searchQuery 
              ? `Kết quả tìm kiếm (${searchResults.length})` 
              : showAll 
                ? 'Tất cả địa điểm đã xác minh' 
                : 'Địa điểm phổ biến (Tối đa 4)'}
          </h3>
        </div>

        {/* Danh sách địa điểm */}
        {searchResults.length === 0 ? (
          <div className="text-center py-10 px-4 bg-white rounded-2xl border-2 border-slate-200 border-dashed">
            <p className="text-slate-700 font-bold text-lg">Không tìm thấy địa điểm phù hợp.</p>
            <p className="text-slate-500 text-base mt-2">Bác vui lòng thử gõ từ khóa khác hoặc bấm nút Micro để nói.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {searchResults.map((dest) => (
              <button
                key={dest.id}
                onClick={() => onSelectDestination(dest)}
                className="w-full text-left bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 hover:border-teal-600 hover:shadow-md active:bg-slate-50 transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 group-hover:bg-teal-100 transition-colors mt-0.5">
                    <MapPin className="w-6 h-6 text-teal-700" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-teal-800 transition-colors leading-snug">
                      {dest.name}
                    </h4>
                    <p className="text-slate-600 text-base font-medium mt-1">
                      {dest.building}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <MapPrecisionBadge precision={dest.mapPrecision} />
                      <span className="text-sm font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md">
                        Mở bản đồ và chỉ đường
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-teal-700 group-hover:text-white flex items-center justify-center text-slate-600 transition-colors shrink-0">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Các nút điều hướng nhanh ở cuối */}
        {!searchQuery && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex-1 h-14 bg-white hover:bg-slate-100 text-slate-800 rounded-2xl border-2 border-slate-200 font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <ListFilter className="w-5 h-5 text-slate-600" />
              <span>{showAll ? 'Thu gọn danh sách' : 'Xem tất cả địa điểm'}</span>
            </button>

            <button
              onClick={onOpenGeneralMap}
              className="flex-1 h-14 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <Map className="w-5 h-5 text-white" />
              <span>Mở bản đồ toàn viện</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
