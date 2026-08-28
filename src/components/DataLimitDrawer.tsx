import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Map, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  Building2
} from 'lucide-react';

interface DataLimitDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'vi' | 'en';
}

export const DataLimitDrawer: React.FC<DataLimitDrawerProps> = ({
  isOpen,
  onClose,
  language = 'vi'
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="data-limit-drawer-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        id="data-limit-drawer-content"
        className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight leading-snug">
                Nguồn & Giới hạn dữ liệu
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Minh bạch thông tin sơ đồ Bệnh viện Bạch Mai
              </p>
            </div>
          </div>

          <button
            id="btn-close-data-limit-drawer"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            aria-label="Đóng bảng thông tin dữ liệu"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Source 1: Verified Campus Data */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Dữ liệu khuôn viên đã kiểm tra</span>
            </div>
            <p className="text-sm sm:text-base text-emerald-900 font-medium leading-relaxed">
              Tọa độ các tòa nhà (K1, K2, A9, A10, Q, P, VTM...), 4 cổng chính và mạng lưới đường nội bộ được số hóa từ sơ đồ quy hoạch chính thức của Bệnh viện Bạch Mai (bachmai.gov.vn).
            </p>
          </div>

          {/* Source 2: Technical Boundaries */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Giới hạn kỹ thuật ứng dụng:</span>
            </div>
            <ul className="text-sm sm:text-base text-slate-700 font-medium space-y-1.5 list-disc pl-5 leading-relaxed">
              <li>
                <strong>Phạm vi chỉ đường:</strong> MedNav chỉ hướng dẫn đến cửa hoặc sảnh tòa nhà. Vui lòng kiểm tra phiếu khám và biển chỉ dẫn tại tòa nhà để đến đúng phòng/tầng.
              </li>
              <li>
                <strong>Không mô phỏng GPS ảo:</strong> MedNav sử dụng vị trí xuất phát do bạn chọn hoặc quét mã vị trí tại cổng/tòa nhà thực tế để đảm bảo độ tin cậy.
              </li>
              <li>
                <strong>Căng tin & Tiện ích phụ:</strong> Chưa có dữ liệu số hóa xác minh vị trí căng tin và dịch vụ ăn uống trong phiên bản này.
              </li>
            </ul>
          </div>

          {/* Official Portal Reference Link */}
          <a
            href="https://bachmai.gov.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-2xl text-cyan-950 font-bold text-sm transition"
          >
            <span>Cổng thông tin Bệnh viện Bạch Mai</span>
            <ExternalLink className="w-4 h-4 text-cyan-700" />
          </a>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base rounded-xl transition cursor-pointer"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
