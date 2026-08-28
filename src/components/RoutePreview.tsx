import React from 'react';
import { 
  Navigation, 
  Building2, 
  Layers, 
  RotateCcw, 
  ShieldCheck, 
  AlertCircle,
  Map
} from 'lucide-react';
import type { 
  Hospital108Destination, 
  Hospital108StartLocation,
  RouteLaunchResult
} from '../types';
import { createInMapzRouteLaunch } from '../services/inmapzRouting';
import { MapPrecisionBadge } from './MapPrecisionBadge';
import { SpeechGuideButton } from './SpeechGuideButton';

interface RoutePreviewProps {
  startLocation: Hospital108StartLocation;
  destination: Hospital108Destination;
  onStartNavigation: (routeResult: RouteLaunchResult) => void;
  onStartAssistedNavigation?: () => void;
  onChangeStart: () => void;
  onChangeDestination: () => void;
}

export function RoutePreview({
  startLocation,
  destination,
  onStartNavigation,
  onStartAssistedNavigation,
  onChangeStart,
  onChangeDestination
}: RoutePreviewProps) {
  // Gọi dịch vụ định tuyến thật với cả startLocation.id và destination.id
  const routeLaunchResult = createInMapzRouteLaunch({
    startLocationId: startLocation.id,
    destinationId: destination.id
  });

  const isDeepLink = routeLaunchResult.mode === 'official_deep_link' && routeLaunchResult.routePreloaded;

  const speechText = isDeepLink
    ? `Tuyến chính thức đã sẵn sàng từ ${startLocation.name} đến ${destination.name}. Bấm bắt đầu chỉ đường để xem tuyến.`
    : `Bác cần chọn lại trên bản đồ. MedNav đã ghi nhớ xuất phát từ ${startLocation.name}, ${startLocation.building} đến ${destination.name}, ${destination.building}. Sau khi mở InMapz, bác bấm nút Chỉ đường và chọn lại hai địa điểm trên.`;

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

        {/* Trạng thái tích hợp trung thực */}
        {isDeepLink ? (
          <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-sm sm:text-base font-medium text-emerald-950 leading-relaxed">
              <p className="font-bold text-emerald-900">Tuyến chính thức đã sẵn sàng</p>
              <p className="mt-1">Điểm đầu và điểm đến sẽ được mở sẵn trên InMapz.</p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-sm sm:text-base font-medium text-amber-950 leading-relaxed space-y-2">
              <p className="font-black text-amber-900 text-base">Cần chọn lại trên bản đồ</p>
              
              <div className="bg-white/80 p-3 rounded-xl border border-amber-200 text-slate-800 font-semibold space-y-1">
                <p className="text-sm uppercase tracking-wider text-slate-500 font-bold">MedNav đã ghi nhớ:</p>
                <p>• Từ: <span className="font-bold text-slate-900">{startLocation.name}</span></p>
                <p>• Đến: <span className="font-bold text-teal-800">{destination.name}</span></p>
              </div>

              <p className="text-slate-700">
                Sau khi mở InMapz, bác bấm <strong className="text-slate-900">“Chỉ đường”</strong> và chọn lại hai địa điểm trên.
              </p>
            </div>
          </div>
        )}

        {/* Thông tin bản đồ */}
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
              Khu vực mở trước:
            </span>
            <span className="font-bold text-slate-900">
              {routeLaunchResult.targetMapLink.label}
            </span>
          </div>
        </div>
      </div>

      {/* Nút hành động chính */}
      <div className="pt-6 pb-4 space-y-3">
        {onStartAssistedNavigation && (
          <button
            onClick={onStartAssistedNavigation}
            className="w-full min-h-[56px] h-16 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 rounded-2xl font-black text-lg sm:text-xl shadow-lg shadow-amber-950/20 transition-all flex items-center justify-center gap-3 px-4 text-center border-2 border-amber-500/50"
          >
            <Navigation className="w-7 h-7 shrink-0 stroke-[2.5]" />
            <span>Bắt đầu chỉ đường từng bước (MedNav)</span>
          </button>
        )}

        <button
          onClick={() => onStartNavigation(routeLaunchResult)}
          className={`w-full min-h-[52px] h-14 ${
            onStartAssistedNavigation 
              ? 'bg-teal-800 hover:bg-teal-900 text-white' 
              : 'bg-teal-700 hover:bg-teal-800 text-white'
          } rounded-2xl font-black text-base sm:text-lg shadow-md transition-all flex items-center justify-center gap-2.5 px-4 text-center`}
        >
          {isDeepLink ? (
            <>
              <Map className="w-6 h-6 shrink-0" />
              <span>Xem trên Bản đồ InMapz chính thức</span>
            </>
          ) : (
            <>
              <Map className="w-6 h-6 shrink-0" />
              <span>Mở chức năng Chỉ đường trên InMapz</span>
            </>
          )}
        </button>

        {!isDeepLink && (
          <p className="text-center text-sm font-semibold text-slate-600 px-2 leading-relaxed">
            Bác sẽ cần chọn lại điểm bắt đầu và nơi muốn đến trên bản đồ chính thức.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            onClick={onChangeStart}
            className="flex-1 min-h-[48px] h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base rounded-xl transition-colors flex items-center justify-center"
          >
            Đổi điểm xuất phát
          </button>
          <button
            onClick={onChangeDestination}
            className="flex-1 min-h-[48px] h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base rounded-xl transition-colors flex items-center justify-center"
          >
            Đổi nơi đến
          </button>
        </div>
      </div>
    </div>
  );
}
