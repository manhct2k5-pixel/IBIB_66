import React from 'react';
import { 
  Building2, 
  Layers, 
  Users, 
  Map, 
  ArrowLeft, 
  Phone, 
  AlertCircle 
} from 'lucide-react';
import { SpeechGuideButton } from './SpeechGuideButton';
import { HOSPITAL_108_SOURCES } from '../data/hospital108';

interface UnknownLocationHelpProps {
  onBackToSelect: () => void;
  onOpenCampusMap: () => void;
}

export function UnknownLocationHelp({
  onBackToSelect,
  onOpenCampusMap
}: UnknownLocationHelpProps) {
  const speechText = `Bốn bước để tự xác định vị trí trong Bệnh viện 108. Bước 1: Nhìn tên tòa nhà hoặc biển chỉ dẫn gần nhất. Bước 2: Kiểm tra số tầng bác đang đứng ở cầu thang hoặc thang máy. Bước 3: Tìm quầy tiếp đón hoặc hỏi nhân viên bảo vệ, hoặc gọi Ban Công tác xã hội qua số 0333 100 018. Bước 4: Mở bản đồ toàn cảnh bệnh viện để đối chiếu. Lưu ý: Định vị GPS điện thoại không xác định chính xác vị trí bên trong tòa nhà.`;

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto p-4 sm:p-6 flex flex-col justify-between animate-in fade-in duration-200">
      <div className="space-y-5">
        {/* Thanh điều hướng & nút nghe */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToSelect}
            className="h-12 px-3 -ml-2 rounded-xl text-slate-600 hover:bg-slate-200/60 active:bg-slate-200 flex items-center gap-1.5 font-bold text-base transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Quay lại chọn vị trí</span>
          </button>

          <SpeechGuideButton textToSpeak={speechText} label="Nghe hướng dẫn" />
        </div>

        {/* Tiêu đề chính */}
        <div className="bg-teal-700 text-white p-6 rounded-3xl shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-black mb-2">
            Bác chưa rõ mình đang ở đâu?
          </h2>
          <p className="text-teal-100 text-base sm:text-lg font-medium leading-relaxed">
            Hãy làm theo 4 bước đơn giản dưới đây để xác định vị trí hiện tại:
          </p>
        </div>

        {/* 4 bước hướng dẫn trực quan */}
        <div className="space-y-3">
          {/* Bước 1 */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center font-black text-teal-800 text-xl shrink-0">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-700 shrink-0" />
                Nhìn tên tòa nhà hoặc biển chỉ dẫn gần nhất
              </h3>
              <p className="text-base font-medium text-slate-600 mt-1 leading-relaxed">
                Tìm biển tên tòa nhà ở lối vào, hành lang hoặc trên trần (ví dụ: Nhà C1-1, Nhà Khám bệnh theo yêu cầu, Tòa nhà Trung tâm).
              </p>
            </div>
          </div>

          {/* Bước 2 */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center font-black text-teal-800 text-xl shrink-0">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-700 shrink-0" />
                Kiểm tra số tầng bác đang đứng
              </h3>
              <p className="text-base font-medium text-slate-600 mt-1 leading-relaxed">
                Xem số tầng được dán cạnh cửa thang máy, cửa buồng thang bộ hoặc trên các cột chỉ dẫn.
              </p>
            </div>
          </div>

          {/* Bước 3 */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center font-black text-teal-800 text-xl shrink-0">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-700 shrink-0" />
                Tìm quầy tiếp đón hoặc hỏi nhân viên y tế
              </h3>
              <p className="text-base font-medium text-slate-600 mt-1 leading-relaxed">
                Đến quầy hướng dẫn ở sảnh tầng 1 hoặc liên hệ Ban Công tác xã hội:{' '}
                <a 
                  href={`tel:${HOSPITAL_108_SOURCES.hotlines.congTacXaHoi}`} 
                  className="text-teal-700 font-bold underline"
                >
                  {HOSPITAL_108_SOURCES.hotlines.congTacXaHoi}
                </a>.
              </p>
            </div>
          </div>

          {/* Bước 4 */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center font-black text-teal-800 text-xl shrink-0">
              4
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Map className="w-5 h-5 text-teal-700 shrink-0" />
                Mở bản đồ toàn cảnh để định hướng
              </h3>
              <p className="text-base font-medium text-slate-600 mt-1 leading-relaxed">
                Bác có thể mở sơ đồ toàn viện để đối chiếu các tòa nhà xung quanh mình.
              </p>
            </div>
          </div>
        </div>

        {/* Cảnh báo GPS trong nhà */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base font-medium text-amber-900 leading-relaxed">
            <span className="font-bold">Lưu ý quan trọng:</span> GPS không xác định chính xác vị trí bên trong tòa nhà. Bác hãy dựa vào biển báo thực tế để chọn đúng điểm xuất phát.
          </p>
        </div>
      </div>

      {/* Cụm 2 nút hành động */}
      <div className="pt-6 pb-4 flex flex-col gap-3">
        <button
          onClick={onOpenCampusMap}
          className="w-full h-16 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white rounded-2xl font-black text-lg sm:text-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Map className="w-6 h-6" />
          <span>Mở bản đồ toàn cảnh</span>
        </button>

        <button
          onClick={onBackToSelect}
          className="w-full h-14 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-2xl font-bold text-base sm:text-lg transition-all flex items-center justify-center"
        >
          Quay lại chọn vị trí
        </button>
      </div>
    </div>
  );
}
