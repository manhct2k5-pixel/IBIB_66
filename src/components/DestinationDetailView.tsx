import React, { useState, useEffect } from 'react';
import { Hospital108Destination } from '../data/hospital108';
import { 
  MapPin, 
  Clock, 
  Info, 
  Navigation, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Building
} from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';

interface DestinationDetailViewProps {
  destination: Hospital108Destination;
  onStartNavigation: () => void;
  onBack: () => void;
}

export function DestinationDetailView({
  destination,
  onStartNavigation,
  onBack
}: DestinationDetailViewProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    let precisionText = '';
    if (destination.mapPrecision === 'building_start_view') {
      precisionText = `Bản đồ sẽ mở tại ${destination.building}, bắt đầu ở tầng 1. ${destination.locationNotice || ''}`;
    } else if (destination.mapPrecision === 'campus_only') {
      precisionText = `Bản đồ sẽ mở tại khuôn viên tổng quan Bệnh viện 108. ${destination.locationNotice || ''}`;
    } else {
      precisionText = `Bản đồ đã được xác minh vị trí.`;
    }

    const textToRead = `Bác đang xem thông tin ${destination.name}. Vị trí tại: ${destination.building}. ${destination.description ? 'Thời gian hoạt động: ' + destination.description + '.' : ''} ${precisionText}`;

    setIsSpeaking(true);
    speakText(
      textToRead,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const getPrecisionBadge = () => {
    switch (destination.mapPrecision) {
      case 'exact_facility':
        return (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-base sm:text-lg">Đã xác minh vị trí chính xác</div>
              <p className="text-sm sm:text-base font-medium text-emerald-800 mt-0.5">
                Bản đồ sẽ mở đúng phòng/vị trí của khoa.
              </p>
            </div>
          </div>
        );
      case 'verified_floor':
        return (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-base sm:text-lg">Đã xác minh tòa nhà và tầng</div>
              <p className="text-sm sm:text-base font-medium text-emerald-800 mt-0.5">
                Bản đồ sẽ mở đúng tầng của tòa nhà.
              </p>
            </div>
          </div>
        );
      case 'building_start_view':
        return (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
            <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-base sm:text-lg">Mở sơ đồ tòa nhà – Bắt đầu tại tầng 1</div>
              <p className="text-sm sm:text-base font-medium text-amber-800 mt-1 leading-relaxed">
                {destination.locationNotice || 'Chưa xác minh được vị trí chính xác của khoa trên mặt bằng. Hãy sử dụng ô tìm kiếm trong bản đồ chính thức.'}
              </p>
            </div>
          </div>
        );
      case 'campus_only':
      default:
        return (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-900">
            <Info className="w-6 h-6 text-slate-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-base sm:text-lg">Bản đồ khuôn viên tổng quan</div>
              <p className="text-sm sm:text-base font-medium text-slate-700 mt-1 leading-relaxed">
                {destination.locationNotice || 'Chưa xác minh được vị trí chính xác của khoa trên mặt bằng. Hãy sử dụng bản đồ tổng quan.'}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto p-4 sm:p-6 flex flex-col justify-between animate-in fade-in duration-200">
      <div className="space-y-6">
        {/* Nút quay lại & Tiêu đề view */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="h-12 px-3 -ml-2 rounded-xl text-slate-600 hover:bg-slate-200/60 active:bg-slate-200 flex items-center gap-1.5 font-bold text-base transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Chọn nơi khác</span>
          </button>

          <button
            onClick={handleSpeak}
            className={`h-12 px-4 rounded-full font-bold text-base flex items-center gap-2 border transition-all ${
              isSpeaking
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-5 h-5 text-amber-800" />
                <span>Dừng đọc</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 text-teal-700" />
                <span>Nghe thông tin</span>
              </>
            )}
          </button>
        </div>

        {/* Thẻ thông tin điểm đến chính */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center shrink-0">
              <MapPin className="w-8 h-8 text-teal-700" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {destination.name}
              </h2>
              <div className="flex items-center gap-2 text-slate-600 font-bold text-lg mt-2">
                <Building className="w-5 h-5 text-slate-500 shrink-0" />
                <span>{destination.building}</span>
              </div>
            </div>
          </div>

          {/* Giờ làm việc & thông tin tiếp đón */}
          {destination.description && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <Clock className="w-6 h-6 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">Thời gian tiếp đón:</div>
                <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  {destination.description}
                </div>
              </div>
            </div>
          )}

          {/* Huy hiệu độ chính xác bản đồ */}
          {getPrecisionBadge()}

          {/* Nguồn thông tin chính thức */}
          {destination.sourceUrl && (
            <div className="pt-2">
              <a
                href={destination.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-base font-bold text-teal-700 hover:text-teal-800 hover:underline"
              >
                <span>Xem nguồn xác minh trên benhvien108.vn</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Cụm nút hành động chính ở dưới */}
      <div className="pt-6 pb-4 flex flex-col gap-3">
        <button
          onClick={onStartNavigation}
          className="w-full h-16 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white rounded-2xl font-black text-xl shadow-lg transition-all flex items-center justify-center gap-3"
        >
          <Navigation className="w-7 h-7" />
          <span>Bắt đầu chỉ đường</span>
        </button>

        <button
          onClick={onBack}
          className="w-full h-14 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-2xl font-bold text-lg transition-all flex items-center justify-center"
        >
          Chọn điểm đến khác
        </button>
      </div>
    </div>
  );
}
