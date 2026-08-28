import React from 'react';
import { 
  HelpCircle, 
  X, 
  MapPin, 
  Search, 
  Navigation, 
  CheckCircle2, 
  PhoneCall, 
  Volume2 
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'vi' | 'en';
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  language = 'vi'
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="user-guide-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        id="user-guide-modal-content"
        className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-cyan-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight leading-snug">
                Hướng dẫn sử dụng MedNav
              </h2>
              <p className="text-xs text-cyan-100 font-medium">
                Dành cho người lần đầu đến Bệnh viện Bạch Mai
              </p>
            </div>
          </div>

          <button
            id="btn-close-guide-modal"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            aria-label="Đóng hướng dẫn"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="w-9 h-9 rounded-xl bg-cyan-700 text-white font-black text-base flex items-center justify-center shrink-0">
              1
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">
                Chọn nơi muốn đến
              </h3>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                Bấm vào các ô địa điểm phổ biến (như Khám bệnh K1, Cấp cứu A9, Viện Tim mạch) hoặc gõ/nói tên tòa nhà vào thanh tìm kiếm.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="w-9 h-9 rounded-xl bg-cyan-700 text-white font-black text-base flex items-center justify-center shrink-0">
              2
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">
                Chọn vị trí đang đứng
              </h3>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                Chọn Cổng 1, 2, 3, hoặc 4 nơi bác vừa bước vào, hoặc bấm "Quét mã vị trí" để quét mã dán tại cổng.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="w-9 h-9 rounded-xl bg-cyan-700 text-white font-black text-base flex items-center justify-center shrink-0">
              3
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">
                Đi theo hướng dẫn từng bước
              </h3>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                Nhìn mốc tòa nhà trên thực tế và bấm "Tôi đã đến mốc này" để chuyển sang hướng dẫn tiếp theo. Có thể bấm "Nghe hướng dẫn" để nghe giọng đọc.
              </p>
            </div>
          </div>

          {/* Emergency Note */}
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
            <PhoneCall className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-sm text-rose-950 font-medium leading-relaxed">
              Trường hợp khẩn cấp, bấm nút đỏ <strong>Cấp cứu</strong> ở góc trên bên phải để gọi tổng đài 115 hoặc Hotline A9.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="w-full h-12 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-base rounded-xl transition cursor-pointer"
          >
            Đã hiểu, đóng hướng dẫn
          </button>
        </div>
      </div>
    </div>
  );
};
