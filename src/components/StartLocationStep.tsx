import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  HelpCircle, 
  ArrowLeft, 
  Building,
  Layers,
  ExternalLink
} from 'lucide-react';
import type { 
  Hospital108StartLocation, 
  Hospital108Destination 
} from '../types';
import { 
  HOSPITAL_108_START_LOCATIONS
} from '../data/hospital108';
import { normalizeSearchText } from '../utils/search';
import { SpeechGuideButton } from './SpeechGuideButton';

interface StartLocationStepProps {
  destination: Hospital108Destination;
  onSelectStartLocation: (start: Hospital108StartLocation) => void;
  onBack: () => void;
  onShowUnknownHelp: () => void;
}

export function StartLocationStep({
  destination,
  onSelectStartLocation,
  onBack,
  onShowUnknownHelp
}: StartLocationStepProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Lọc tìm kiếm điểm xuất phát từ danh sách điểm xuất phát xác minh
  const filteredStartLocations = useMemo(() => {
    if (!searchQuery.trim()) {
      return HOSPITAL_108_START_LOCATIONS;
    }
    const norm = normalizeSearchText(searchQuery);
    return HOSPITAL_108_START_LOCATIONS.filter(item => {
      if (normalizeSearchText(item.name).includes(norm)) return true;
      if (normalizeSearchText(item.building).includes(norm)) return true;
      if (item.floor && normalizeSearchText(item.floor).includes(norm)) return true;
      return item.aliases.some(a => normalizeSearchText(a).includes(norm));
    });
  }, [searchQuery]);

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto p-4 sm:p-6 flex flex-col justify-between animate-in fade-in duration-200">
      <div className="space-y-4">
        {/* Header điều hướng */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="h-12 px-3 -ml-2 rounded-xl text-slate-600 hover:bg-slate-200/60 active:bg-slate-200 flex items-center gap-1.5 font-bold text-base transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Đổi nơi muốn đến</span>
          </button>

          <SpeechGuideButton 
            textToSpeak="Bác đang ở đâu trong bệnh viện? Hãy chọn vị trí nhìn thấy quanh bác hoặc bấm nút Tôi không biết mình đang ở đâu để được trợ giúp." 
            label="Nghe hướng dẫn"
          />
        </div>

        {/* Tóm tắt điểm đến đã chọn */}
        <div className="p-4 bg-teal-50 border-2 border-teal-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white font-bold text-base shrink-0">
              Đến
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-teal-800 uppercase tracking-wider">Nơi muốn đến</div>
              <div className="text-base sm:text-lg font-black text-slate-900 truncate">{destination.name}</div>
            </div>
          </div>
          <span className="text-sm font-bold text-teal-900 bg-white px-3 py-1.5 rounded-xl border border-teal-200 shrink-0 self-start sm:self-auto">
            {destination.building}
          </span>
        </div>

        {/* Tiêu đề câu hỏi */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Bác đang ở đâu?
          </h2>
          <p className="text-base sm:text-lg font-medium text-slate-600 mt-1">
            Chọn vị trí bác đang đứng để mở đúng phân khu bản đồ chính thức.
          </p>
        </div>

        {/* Nút hỗ trợ nếu chưa rõ vị trí */}
        <div className="grid grid-cols-1 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onShowUnknownHelp}
            className="min-h-[56px] w-full p-4 bg-amber-50 hover:bg-amber-100/80 active:bg-amber-200 border-2 border-amber-300 rounded-2xl text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-200/80 flex items-center justify-center shrink-0">
                <HelpCircle className="w-6 h-6 text-amber-900" />
              </div>
              <div className="min-w-0">
                <div className="font-black text-base sm:text-lg text-amber-950 truncate">
                  Tôi không biết mình đang ở đâu
                </div>
                <div className="text-sm font-semibold text-amber-800 mt-0.5">
                  Xem 4 bước xác định vị trí hoặc mở bản đồ toàn viện
                </div>
              </div>
            </div>
            <span className="min-h-[36px] h-9 px-3.5 bg-white text-amber-900 rounded-xl font-bold text-sm border border-amber-300 flex items-center justify-center shrink-0 self-stretch sm:self-auto text-center">
              Trợ giúp
            </span>
          </button>
        </div>

        {/* Danh sách vị trí nhìn thấy */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              Chọn vị trí đang nhìn thấy:
            </h3>
            <span className="text-sm font-semibold text-slate-500">
              {filteredStartLocations.length} vị trí đã xác minh
            </span>
          </div>

          {/* Ô tìm kiếm điểm xuất phát */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập tên cổng, tòa nhà hoặc tầng..."
              className="w-full h-14 pl-12 pr-12 bg-white border-2 border-slate-200 focus:border-teal-600 rounded-2xl text-base sm:text-lg font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-all"
            />
            <Search className="w-6 h-6 text-slate-400 absolute left-4 top-4" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 h-8 px-3 text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Danh sách các điểm xuất phát */}
          <div className="space-y-2.5 max-h-[46vh] overflow-y-auto pr-1">
            {filteredStartLocations.length === 0 ? (
              <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-lg font-bold text-slate-700">Không tìm thấy vị trí khớp với từ khóa</p>
                <p className="text-base text-slate-500 mt-1">Bác hãy thử tìm từ khóa đơn giản như &quot;Cổng&quot;, &quot;C1-1&quot;, &quot;Yêu cầu&quot;</p>
              </div>
            ) : (
              filteredStartLocations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => onSelectStartLocation(loc)}
                  className="w-full p-4 bg-white hover:bg-teal-50 active:bg-teal-100 border-2 border-slate-200 hover:border-teal-500 rounded-2xl transition-all text-left flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 group shadow-sm"
                >
                  <div className="flex items-start gap-3.5 pr-2 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-teal-100 flex items-center justify-center shrink-0 transition-colors">
                      <MapPin className="w-6 h-6 text-slate-600 group-hover:text-teal-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-teal-950 truncate">
                        {loc.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600">
                          <Building className="w-4 h-4 text-slate-400" />
                          {loc.building}
                        </span>
                        {loc.floor && (
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600">
                            <Layers className="w-4 h-4 text-slate-400" />
                            {loc.floor}
                          </span>
                        )}
                      </div>
                      {loc.description && (
                        <p className="text-sm font-medium text-slate-500 mt-1 line-clamp-1">
                          {loc.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 self-stretch sm:self-auto">
                    <span className="min-h-[44px] h-11 px-4 bg-slate-100 group-hover:bg-teal-700 text-slate-700 group-hover:text-white rounded-xl font-bold text-base transition-colors flex items-center justify-center">
                      Chọn điểm này
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Chân trang nguồn xác minh */}
      <div className="pt-4 pb-2 text-center">
        <a
          href="https://benhvien108.vn/huong-dan-tim-duong.htm"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800 hover:underline"
        >
          <span>Dữ liệu sơ đồ theo nguồn chính thức Bệnh viện 108</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
