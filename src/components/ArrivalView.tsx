import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ThumbsUp, 
  ThumbsDown, 
  Building2, 
  Search, 
  Home, 
  Info,
  Check
} from 'lucide-react';
import { MapNode } from '../types';

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

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-200">
      {/* Big Green Checkmark Icon */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-100 border-4 border-emerald-300 flex items-center justify-center text-emerald-600 shadow-lg">
        <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 stroke-[2.5]" />
      </div>

      {/* Main Arrival Title */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
          Bạn đã đến {destinationNode.name}
        </h1>
        <p className="text-base sm:text-lg font-bold text-cyan-800">
          Vị trí sảnh đón / Lối vào tầng 1
        </p>
      </div>

      {/* Hospital Scope Limit Notice Card */}
      <div className="p-4 sm:p-5 bg-slate-50 border-2 border-slate-200 rounded-3xl text-left space-y-2 shadow-2xs">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
          <Info className="w-5 h-5 text-cyan-700 shrink-0" />
          <span>Lưu ý tiếp đón:</span>
        </div>
        <p className="text-base text-slate-700 font-medium leading-relaxed">
          MedNav hiện chỉ hướng dẫn đến cửa hoặc sảnh tòa nhà. Vui lòng xem biển chỉ dẫn hoặc liên hệ quầy tiếp đón để đến đúng phòng khám.
        </p>
      </div>

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
