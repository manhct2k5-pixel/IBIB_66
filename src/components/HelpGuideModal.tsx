import React, { useState, useEffect } from 'react';
import { X, Search, Navigation, Footprints, Volume2, VolumeX, ExternalLink, Phone, Check } from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';
import { HOSPITAL_108_SOURCES } from '../data/hospital108';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  mapUrl?: string;
}

export function HelpGuideModal({ isOpen, onClose, mapUrl }: HelpGuideModalProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `Cách xem tuyến trên bản đồ InMapz gồm ba bước đơn giản. Bước 1: Chạm vào ô tìm kiếm trên bản đồ hoặc bấm nút Chỉ đường. Bước 2: Chọn nơi đang đứng và nơi muốn đến. Bước 3: Đi theo đường được bản đồ đánh dấu. Nếu cần chuyển tầng, bản đồ InMapz sẽ hiển thị vị trí thang máy hoặc thang bộ. Nếu cần nhân viên hỗ trợ trực tiếp, bác có thể liên hệ Ban Công tác xã hội qua số điện thoại 0333 100 018.`;

    setIsSpeaking(true);
    speakText(
      textToRead,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 my-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Cách xem tuyến trên bản đồ InMapz
          </h3>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors shrink-0"
            aria-label="Đóng"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {/* Bước 1 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-teal-50 border border-teal-100">
            <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-xl shrink-0">
              1
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-teal-700 shrink-0" />
                Chạm vào ô tìm kiếm trên bản đồ
              </h4>
              <p className="text-base font-medium text-slate-600 mt-1 leading-relaxed">
                Nhập tên khoa phòng hoặc chọn trực tiếp một điểm trên sơ đồ.
              </p>
            </div>
          </div>

          {/* Bước 2 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-teal-50 border border-teal-100">
            <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-xl shrink-0">
              2
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-teal-700 shrink-0" />
                Chọn nơi đứng và nơi đến
              </h4>
              <p className="text-base font-medium text-slate-600 mt-1 leading-relaxed">
                Bấm nút "Chỉ đường" trên bản đồ và chọn vị trí xuất phát.
              </p>
            </div>
          </div>

          {/* Bước 3 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-teal-50 border border-teal-100">
            <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-xl shrink-0">
              3
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Footprints className="w-5 h-5 text-teal-700 shrink-0" />
                Đi theo đường được vẽ trên bản đồ
              </h4>
              <p className="text-base font-medium text-slate-600 mt-1 leading-relaxed">
                Nếu cần chuyển tầng, bản đồ InMapz sẽ hiển thị vị trí thang máy hoặc thang bộ.
              </p>
            </div>
          </div>

          {/* Hỗ trợ chính thức */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-teal-700 shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-500 uppercase">Cần hỗ trợ hướng dẫn trực tiếp:</div>
                <div className="text-base font-bold text-slate-900">
                  Ban Công tác xã hội: <a href={`tel:${HOSPITAL_108_SOURCES.hotlines.congTacXaHoi}`} className="text-teal-700 underline font-black">{HOSPITAL_108_SOURCES.hotlines.congTacXaHoi}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Các nút hành động */}
        <div className="pt-2 flex flex-col gap-3">
          <button
            onClick={handleSpeak}
            className={`w-full h-14 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 border-2 ${
              isSpeaking 
                ? 'bg-amber-100 border-amber-300 text-amber-900' 
                : 'bg-white border-teal-700 text-teal-700 hover:bg-teal-50'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-6 h-6 text-amber-800" />
                <span>Dừng đọc hướng dẫn</span>
              </>
            ) : (
              <>
                <Volume2 className="w-6 h-6 text-teal-700" />
                <span>Đọc hướng dẫn bằng giọng nói</span>
              </>
            )}
          </button>

          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-14 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-5 h-5 text-slate-600" />
              <span>Mở bản đồ ở tab mới</span>
            </a>
          )}

          <button
            onClick={onClose}
            className="w-full h-14 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <Check className="w-6 h-6" />
            <span>Tôi đã hiểu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
