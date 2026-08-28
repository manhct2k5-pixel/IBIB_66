import React, { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, X, AlertCircle, CheckCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { 
  VoiceRecognitionService, 
  isVoiceRecognitionSupported, 
  matchDestinationFromVoice 
} from '../utils/voiceRecognition';
import { HOSPITAL_108_DESTINATIONS, Hospital108Destination } from '../data/hospital108';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDestination: (dest: Hospital108Destination) => void;
}

export function VoiceSearchModal({
  isOpen,
  onClose,
  onSelectDestination
}: VoiceSearchModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [matchedDest, setMatchedDest] = useState<Hospital108Destination | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const serviceRef = useRef<VoiceRecognitionService | null>(null);

  const supported = isVoiceRecognitionSupported();

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setMatchedDest(null);
      setErrorMessage(null);

      if (!supported) {
        setErrorMessage('Trình duyệt này chưa hỗ trợ tìm bằng giọng nói. Bác vui lòng nhập tên nơi cần đến.');
        return;
      }

      const service = new VoiceRecognitionService();
      serviceRef.current = service;
      startListening();
    } else {
      if (serviceRef.current) {
        serviceRef.current.stopListening();
      }
      setIsListening(false);
    }

    return () => {
      if (serviceRef.current) {
        serviceRef.current.stopListening();
      }
    };
  }, [isOpen]);

  const startListening = () => {
    if (!serviceRef.current) return;
    setTranscript('');
    setMatchedDest(null);
    setErrorMessage(null);
    setIsListening(true);

    serviceRef.current.startListening({
      onResult: (text: string) => {
        setTranscript(text);
        const match = matchDestinationFromVoice(text, HOSPITAL_108_DESTINATIONS);
        setMatchedDest(match);
      },
      onError: (err: string) => {
        setIsListening(false);
        setErrorMessage(err);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });
  };

  const handleRetry = () => {
    startListening();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-6 h-6 text-slate-600" />
        </button>

        <h3 className="text-2xl font-black text-slate-900 mb-2 mt-2">
          Tìm bằng giọng nói
        </h3>

        {/* Trạng thái hỗ trợ */}
        {!supported ? (
          <div className="py-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MicOff className="w-8 h-8 text-amber-700" />
            </div>
            <p className="text-base font-medium text-slate-700 leading-relaxed mb-6">
              Trình duyệt này chưa hỗ trợ tìm bằng giọng nói. Bác vui lòng nhập tên nơi cần đến.
            </p>
            <button
              onClick={onClose}
              className="w-full h-14 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center"
            >
              Tôi đã hiểu
            </button>
          </div>
        ) : matchedDest ? (
          /* Đã nhận dạng được điểm đến */
          <div className="py-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-700" />
            </div>
            
            {transcript && (
              <p className="text-base text-slate-500 italic mb-2">
                "&nbsp;{transcript}&nbsp;"
              </p>
            )}

            <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-6">
              Bác muốn đến <span className="text-teal-700">{matchedDest.name}</span> phải không?
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  onSelectDestination(matchedDest);
                  onClose();
                }}
                className="w-full h-14 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>Đúng, mở bản đồ</span>
                <ArrowRight className="w-6 h-6" />
              </button>

              <button
                onClick={handleRetry}
                className="w-full h-14 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Chọn lại / Nói lại</span>
              </button>
            </div>
          </div>
        ) : isListening ? (
          /* Đang lắng nghe */
          <div className="py-6">
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-teal-200 rounded-full animate-ping opacity-40"></div>
              <div className="relative w-20 h-20 bg-teal-700 rounded-full flex items-center justify-center shadow-lg">
                <Mic className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>

            <p className="text-xl font-bold text-slate-900 mb-2">
              Đang lắng nghe bác nói...
            </p>
            <p className="text-base font-medium text-slate-600">
              Ví dụ: "Tôi muốn đến khoa cấp cứu" hoặc "C1 một A"
            </p>
          </div>
        ) : errorMessage ? (
          /* Bị lỗi */
          <div className="py-4">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-rose-600" />
            </div>

            <p className="text-base font-medium text-slate-700 leading-relaxed mb-6">
              {errorMessage}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleRetry}
                className="w-full h-14 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Thử nói lại</span>
              </button>
              
              <button
                onClick={onClose}
                className="w-full h-14 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        ) : (
          /* Kết thúc nhưng chưa match */
          <div className="py-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-slate-600" />
            </div>

            {transcript ? (
              <div className="mb-6">
                <p className="text-base text-slate-500 mb-1">Hệ thống nghe được:</p>
                <p className="text-lg font-bold text-slate-900">"{transcript}"</p>
                <p className="text-base text-slate-600 mt-2">
                  Chưa nhận ra địa điểm chính xác. Bác hãy thử nói lại hoặc gõ tên vào ô tìm kiếm.
                </p>
              </div>
            ) : (
              <p className="text-lg font-medium text-slate-700 mb-6">
                Chưa nhận được giọng nói. Bác hãy bấm nút bên dưới để thử lại.
              </p>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleRetry}
                className="w-full h-14 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Nói lại</span>
              </button>
              
              <button
                onClick={onClose}
                className="w-full h-14 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-lg transition-colors"
              >
                Nhập bằng bàn phím
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
