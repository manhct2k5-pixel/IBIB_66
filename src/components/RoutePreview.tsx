import React from 'react';
import { 
  Navigation, 
  MapPin, 
  Building2, 
  Layers, 
  RotateCcw, 
  ShieldCheck, 
  Info, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { 
  Hospital108Destination, 
  Hospital108StartLocation 
} from '../types';
import { HOSPITAL_108_OFFICIAL_MAP_LINKS } from '../data/hospital108';
import { MapPrecisionBadge } from './MapPrecisionBadge';
import { SpeechGuideButton } from './SpeechGuideButton';

interface RoutePreviewProps {
  startLocation: Hospital108StartLocation;
  destination: Hospital108Destination;
  onStartNavigation: (chosenMapLinkId?: string) => void;
  onChangeStart: () => void;
  onChangeDestination: () => void;
}

export function RoutePreview({
  startLocation,
  destination,
  onStartNavigation,
  onChangeStart,
  onChangeDestination
}: RoutePreviewProps) {
  // Tìm map link đích và xuất phát
  const destMapLink = HOSPITAL_108_OFFICIAL_MAP_LINKS.find(l => l.id === destination.mapLinkId);
  const startMapLink = HOSPITAL_108_OFFICIAL_MAP_LINKS.find(l => l.id === startLocation.mapLinkId);

  // Quyết định mapLinkId mở ra: ưu tiên mapLinkId của điểm đến, nếu là campus thì dùng điểm xuất phát nếu có floor cụ thể
  const targetMapLinkId = (destination.mapLinkId && destination.mapLinkId !== 'campus') 
    ? destination.mapLinkId 
    : (startLocation.mapLinkId || 'campus');

  const speechText = `Tuyến đường từ ${startLocation.name}, ${startLocation.building}, đến ${destination.name}, ${destination.building}. Bấm nút Bắt đầu chỉ đường để mở bản đồ chính thức. Trên bản đồ, bác bấm nút Chỉ đường và chọn hai điểm này.`;

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto p-4 sm:p-6 flex flex-col justify-between animate-in fade-in duration-200">
      <div className="space-y-4">
        {/* Header điều hướng & nút nghe */}
        <div className="flex items-center justify-between">
          <button
            onClick={onChangeStart}
            className="h-12 px-3 -ml-2 rounded-xl text-slate-600 hover:bg-slate-200/60 active:bg-slate-200 flex items-center gap-1.5 font-bold text-base transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Đổi điểm xuất phát</span>
          </button>

          <SpeechGuideButton textToSpeak={speechText} label="Nghe tóm tắt" />
        </div>

        {/* Tiêu đề trang */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Kiểm tra tuyến đường
          </h2>
          <p className="text-base sm:text-lg font-medium text-slate-600 mt-1">
            Xác nhận thông tin trước khi bắt đầu chỉ đường trên bản đồ chính thức.
          </p>
        </div>

        {/* Thẻ tuyến đường trực quan: Điểm xuất phát -> Điểm đến */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-sm space-y-4">
          {/* Điểm xuất phát (Từ) */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-black shrink-0">
                Từ
              </div>
              <div className="w-0.5 h-12 bg-dashed border-l-2 border-slate-300 my-1" />
            </div>

            <div className="flex-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Điểm xuất phát</div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                {startLocation.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  {startLocation.building}
                </span>
                {startLocation.floor && (
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    {startLocation.floor}
                  </span>
                )}
              </div>
              <button
                onClick={onChangeStart}
                className="mt-2 text-sm font-bold text-teal-700 hover:text-teal-800 underline"
              >
                Đổi điểm xuất phát khác
              </button>
            </div>
          </div>

          {/* Điểm đến (Đến) */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black shrink-0 shadow-sm">
              Đến
            </div>

            <div className="flex-1">
              <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">Nơi muốn đến</div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                {destination.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-900 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                  <Building2 className="w-3.5 h-3.5 text-teal-700" />
                  {destination.building}
                </span>
                {destination.floor && (
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-900 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                    <Layers className="w-3.5 h-3.5 text-teal-700" />
                    {destination.floor}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <MapPrecisionBadge precision={destination.mapPrecision} />
              </div>
              <button
                onClick={onChangeDestination}
                className="mt-2 block text-sm font-bold text-teal-700 hover:text-teal-800 underline"
              >
                Đổi nơi muốn đến khác
              </button>
            </div>
          </div>
        </div>

        {/* Thông tin bản đồ & Độ chính xác */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between text-sm sm:text-base font-medium text-slate-700">
            <span className="flex items-center gap-1.5 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              Nguồn bản đồ:
            </span>
            <span className="font-bold text-slate-900">Bản đồ InMapz chính thức BV 108</span>
          </div>

          <div className="flex items-center justify-between text-sm sm:text-base font-medium text-slate-700">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Layers className="w-4 h-4 text-teal-700" />
              Khu vực mở:
            </span>
            <span className="font-bold text-slate-900">
              {destMapLink?.label || startMapLink?.label || 'Tổng quan khuôn viên'}
            </span>
          </div>
        </div>

        {/* Thông báo trung thực về cách thức hoạt động */}
        <div className="p-4 bg-teal-50/80 rounded-2xl border border-teal-200 flex items-start gap-3">
          <Info className="w-6 h-6 text-teal-700 shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base font-medium text-teal-900 leading-relaxed">
            <span className="font-bold">Hướng dẫn thao tác:</span> MedNav đã chuẩn bị sẵn khu vực bản đồ. Khi màn hình bản đồ mở ra, bác chỉ cần chọn nút <span className="font-bold">“Chỉ đường”</span> trên bản đồ để xem tuyến đi chi tiết.
          </p>
        </div>
      </div>

      {/* Nút hành động chính */}
      <div className="pt-6 pb-4 space-y-3">
        <button
          onClick={() => onStartNavigation(targetMapLinkId)}
          className="w-full h-16 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white rounded-2xl font-black text-xl shadow-lg transition-all flex items-center justify-center gap-3"
        >
          <Navigation className="w-7 h-7" />
          <span>Bắt đầu chỉ đường</span>
        </button>

        <div className="flex gap-2">
          <button
            onClick={onChangeStart}
            className="flex-1 h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base rounded-xl transition-colors"
          >
            Đổi điểm xuất phát
          </button>
          <button
            onClick={onChangeDestination}
            className="flex-1 h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base rounded-xl transition-colors"
          >
            Đổi nơi đến
          </button>
        </div>
      </div>
    </div>
  );
}
