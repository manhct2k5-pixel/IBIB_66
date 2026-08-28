import React from 'react';
import { 
  Navigation, 
  Building2, 
  Layers, 
  RotateCcw, 
  ShieldCheck, 
  Info, 
  ExternalLink 
} from 'lucide-react';
import type { 
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

  // Quyết định mapLinkId mở ra: ưu tiên mapLinkId của điểm đến nếu có phân khu cụ thể, hoặc điểm xuất phát
  const targetMapLinkId = (destination.mapLinkId && destination.mapLinkId !== 'campus') 
    ? destination.mapLinkId 
    : (startLocation.mapLinkId || 'campus');

  const activeMapLink = HOSPITAL_108_OFFICIAL_MAP_LINKS.find(l => l.id === targetMapLinkId) || destMapLink || startMapLink;

  const speechText = `Kiểm tra tuyến đường: Điểm xuất phát tại ${startLocation.name}, ${startLocation.building}. Nơi muốn đến là ${destination.name}, ${destination.building}. MedNav sẽ mở khu vực bản đồ ${activeMapLink?.label || 'khuôn viên'}. Trên bản đồ InMapz chính thức, bác hãy bấm nút Chỉ đường, sau đó chọn điểm bắt đầu và nơi muốn đến.`;

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
            Xác nhận điểm đầu và điểm đến trước khi mở bản đồ chính thức.
          </p>
        </div>

        {/* Thẻ tuyến đường trực quan: Điểm xuất phát -> Điểm đến */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-sm space-y-4">
          {/* Điểm xuất phát (Từ) */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-800 font-black shrink-0">
                Từ
              </div>
              <div className="w-0.5 h-12 bg-slate-300 my-1" />
            </div>

            <div className="flex-1">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Điểm xuất phát</div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                {startLocation.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  {startLocation.building}
                </span>
                {startLocation.floor && (
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Layers className="w-4 h-4 text-slate-500" />
                    {startLocation.floor}
                  </span>
                )}
              </div>
              <button
                onClick={onChangeStart}
                className="mt-2 inline-block text-sm font-bold text-teal-700 hover:text-teal-800 underline"
              >
                Đổi điểm xuất phát khác
              </button>
            </div>
          </div>

          {/* Điểm đến (Đến) */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white font-black shrink-0 shadow-sm">
              Đến
            </div>

            <div className="flex-1">
              <div className="text-sm font-bold text-teal-800 uppercase tracking-wider">Nơi muốn đến</div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                {destination.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-sm font-bold text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                  <Building2 className="w-4 h-4 text-teal-700" />
                  {destination.building}
                </span>
                {destination.floor && (
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                    <Layers className="w-4 h-4 text-teal-700" />
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
          <div className="flex items-center justify-between text-base font-medium text-slate-700">
            <span className="flex items-center gap-1.5 text-slate-600">
              <ShieldCheck className="w-5 h-5 text-teal-700" />
              Nguồn bản đồ:
            </span>
            <span className="font-bold text-slate-900">Bản đồ InMapz chính thức BV 108</span>
          </div>

          <div className="flex items-center justify-between text-base font-medium text-slate-700">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Layers className="w-5 h-5 text-teal-700" />
              Khu vực bản đồ sẽ mở:
            </span>
            <span className="font-bold text-slate-900">
              {activeMapLink?.label || 'Tổng quan khuôn viên'}
            </span>
          </div>
        </div>

        {/* Thông báo trung thực về cách thức hoạt động */}
        <div className="p-4 bg-teal-50 rounded-2xl border-2 border-teal-200 flex items-start gap-3">
          <Info className="w-6 h-6 text-teal-700 shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base font-medium text-teal-950 leading-relaxed">
            MedNav mở đúng khu vực bản đồ. Tuyến đi chi tiết do bản đồ InMapz chính thức của Bệnh viện 108 cung cấp. Trên bản đồ, bác hãy chọn <span className="font-bold">“Chỉ đường”</span>, sau đó chọn điểm bắt đầu và nơi muốn đến.
          </p>
        </div>
      </div>

      {/* Nút hành động chính */}
      <div className="pt-6 pb-4 space-y-3">
        <button
          onClick={() => onStartNavigation(targetMapLinkId)}
          className="w-full min-h-[56px] h-16 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white rounded-2xl font-black text-xl shadow-lg transition-all flex items-center justify-center gap-3"
        >
          <Navigation className="w-7 h-7" />
          <span>Mở bản đồ và bắt đầu chỉ đường</span>
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
