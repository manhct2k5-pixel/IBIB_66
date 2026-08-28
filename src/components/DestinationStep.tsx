import React, { useState, useMemo } from 'react';
import { Search, MapPin, ExternalLink, ChevronRight, CheckCircle2 } from 'lucide-react';
import { HOSPITAL_108_DESTINATIONS, Hospital108Destination } from '../data/hospital108';

interface DestinationStepProps {
  onSelectDestination: (mapLinkId: string) => void;
}

export function DestinationStep({ onSelectDestination }: DestinationStepProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return HOSPITAL_108_DESTINATIONS; // Show all by default if no query
    
    return HOSPITAL_108_DESTINATIONS.filter(dest => {
      const nameMatch = dest.name.toLowerCase().includes(q);
      const aliasMatch = dest.aliases.some(alias => alias.toLowerCase().includes(q));
      return nameMatch || aliasMatch;
    });
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full bg-slate-50 w-full max-w-3xl mx-auto">
      {/* Hero Section */}
      <div className="bg-emerald-700 pt-6 pb-8 px-4 sm:px-8 text-center text-white rounded-b-3xl shadow-md">
        <h2 className="text-2xl sm:text-3xl font-black mb-3">
          Bác muốn đến đâu trong Bệnh viện 108?
        </h2>
        <p className="text-emerald-100 mb-6 text-sm sm:text-base font-medium max-w-lg mx-auto">
          Nhập khoa, phòng, hoặc khu vực bác cần đến để xem vị trí trên bản đồ chính thức.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-6 h-6 text-emerald-600 stroke-[2.5]" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/20 text-slate-900 text-lg font-bold placeholder-slate-400 shadow-lg transition-all"
            placeholder="Ví dụ: Cấp cứu, Khoa Khám bệnh..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Destinations List */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-4 px-1">
          {searchQuery ? 'Kết quả tìm kiếm' : 'Các khu vực phổ biến'}
        </h3>
        
        {searchResults.length === 0 ? (
          <div className="text-center py-10 px-4 bg-white rounded-2xl border-2 border-slate-200 border-dashed">
            <p className="text-slate-500 font-medium">Không tìm thấy địa điểm phù hợp.</p>
            <p className="text-slate-400 text-sm mt-1">Vui lòng thử tìm với từ khóa khác.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {searchResults.map((dest) => (
              <button
                key={dest.id}
                onClick={() => onSelectDestination(dest.mapLinkId)}
                className="w-full text-left bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:shadow-md active:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{dest.name}</h4>
                    <p className="text-slate-600 text-sm font-medium mt-0.5">{dest.building}</p>
                    {dest.description && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md w-fit">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {dest.description}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-2 h-12 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0 sm:self-center">
                  <span>Xem trên bản đồ</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
