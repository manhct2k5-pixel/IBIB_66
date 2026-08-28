import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  ThumbsUp, 
  ThumbsDown, 
  Building2, 
  Search, 
  Home, 
  Info,
  Check,
  MapPin
} from 'lucide-react';
import { MapNode } from '../types';
import { BACH_MAI_FLOOR_DIRECTORY } from '../data/hospitalData';

interface ArrivalViewProps {
  destinationNode: MapNode;
  onFinish: () => void;
  onSearchAnother: () => void;
  language?: 'vi' | 'en';
}

export const ArrivalView: React.FC<ArrivalViewProps> = ({
  destinationNode,
  onFinish,
  onSearchAnother,
  language = 'vi'
}) => {
  const [feedback, setFeedback] = useState<'easy' | 'hard' | null>(null);

  const directoryEntries = useMemo(() => {
    if (!BACH_MAI_FLOOR_DIRECTORY) return [];
    return BACH_MAI_FLOOR_DIRECTORY.filter(dir => dir.buildingId === destinationNode.buildingId);
  }, [destinationNode.buildingId]);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-200">
      {/* Big Green Checkmark Icon */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-100 border-4 border-emerald-300 flex items-center justify-center text-emerald-600 shadow-lg">
        <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 stroke-[2.5]" />
      </div>

      {/* Main Arrival Title */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
          Bạn đã đến {destinationNode.displayAlias || destinationNode.name}
        </h1>
        <p className="text-base sm:text-lg font-bold text-cyan-800">
          Điểm đến: Cửa / Sảnh tòa nhà
        </p>
      </div>

      {/* Hospital Scope Limit Notice Card or Floor Directory */}
      {directoryEntries.length > 0 ? (
        <div className="w-full p-4 sm:p-5 bg-emerald-50 border-2 border-emerald-200 rounded-3xl text-left space-y-3 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-950 font-black text-lg">
            <Building2 className="w-6 h-6 text-emerald-700 shrink-0" />
            <span>Danh bạ Tòa {destinationNode.buildingId}</span>
          </div>
          <div className="space-y-2">
            {directoryEntries.map((dir, idx) => (
              <div key={idx} className="p-3 bg-white rounded-xl border border-emerald-100 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 text-base">{dir.destinationName}</div>
                  <div className="text-emerald-700 font-bold text-sm mt-0.5">{dir.floorLabel}</div>
                  {dir.instructionNote && (
                    <div className="text-xs font-medium text-slate-500 mt-1">{dir.instructionNote}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-emerald-800 font-medium pt-2 border-t border-emerald-200/60 leading-relaxed">
            MedNav chỉ hướng dẫn đường đi ngoài trời. Vui lòng vào trong và sử dụng thang máy hoặc thang bộ theo danh bạ trên.
          </p>
        </div>
      ) : (
        <div className="w-full p-4 sm:p-5 bg-slate-50 border-2 border-slate-200 rounded-3xl text-left space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
            <Info className="w-5 h-5 text-cyan-700 shrink-0" />
            <span>Lưu ý quan trọng:</span>
          </div>
          <p className="text-base text-slate-700 font-medium leading-relaxed">
            MedNav chỉ hướng dẫn đến cửa hoặc sảnh tòa nhà. Vui lòng kiểm tra phiếu khám và biển chỉ dẫn tại tòa nhà để đến đúng phòng.
          </p>
        </div>
      )}

      {/* Simple 2-Button Feedback Card */}
      <div className="w-full p-4 sm:p-5 bg-cyan-50/70 border-2 border-cyan-200 rounded-3xl space-y-3">
        <div className="text-base sm:text-lg font-black text-cyan-950">
          Hướng dẫn này có dễ sử dụng không?
        </div>

        {feedback === null ? (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              id="btn-feedback-easy"
              onClick={() => setFeedback('easy')}
              className="h-14 bg-white hover:bg-emerald-50 border-2 border-emerald-300 text-emerald-950 font-black text-base rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
            >
              <ThumbsUp className="w-5 h-5 text-emerald-600" />
              <span>Dễ sử dụng</span>
            </button>

            <button
              id="btn-feedback-hard"
              onClick={() => setFeedback('hard')}
              className="h-14 bg-white hover:bg-rose-50 border-2 border-rose-300 text-rose-950 font-black text-base rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
            >
              <ThumbsDown className="w-5 h-5 text-rose-600" />
              <span>Khó sử dụng</span>
            </button>
          </div>
        ) : (
          <div className="p-3 bg-white border border-cyan-300 rounded-2xl text-cyan-900 font-bold text-base flex items-center justify-center gap-2">
            <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />
            <span>Cảm ơn bác đã phản hồi! MedNav sẽ tiếp tục cải thiện.</span>
          </div>
        )}
      </div>

      {/* Main Buttons */}
      <div className="w-full space-y-3 pt-2">
        <button
          id="btn-finish-navigation"
          onClick={onFinish}
          className="w-full h-16 bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-900 text-white font-black text-xl rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-600/40"
        >
          <Home className="w-6 h-6 stroke-[2.5]" />
          <span>Kết thúc</span>
        </button>

        <button
          id="btn-search-another-destination"
          onClick={onSearchAnother}
          className="w-full h-14 bg-white hover:bg-slate-100 border-2 border-slate-300 text-slate-800 font-bold text-base rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Search className="w-5 h-5 text-slate-600" />
          <span>Tìm địa điểm khác</span>
        </button>
      </div>
    </div>
  );
};
