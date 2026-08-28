import { QRCheckpoint, BuildingId } from '../../types';
import { BACH_MAI_NODES } from './nodes';

export interface VerifiedQRCheckpoint {
  code: string;
  nodeId: string;
  title: string;
  titleEn: string;
  buildingId: BuildingId;
  landmarkNear: string;
  description: string;
  aliases: string[];
}

export const BACH_MAI_QR_CHECKPOINTS: VerifiedQRCheckpoint[] = [
  {
    code: 'CP-GATE-1',
    nodeId: 'node_gate_1',
    title: 'Mã QR Cổng số 1 (78 Giải Phóng)',
    titleEn: 'QR Checkpoint Gate 1 (78 Giai Phong St)',
    buildingId: 'OUTDOOR',
    landmarkNear: 'Cổng 1 đường Giải Phóng, gần Tòa K3 và A9',
    description: 'Vị trí lối vào chính đường Giải Phóng, cổng ưu tiên ô tô tiếp cận A9, A10 và K3.',
    aliases: ['gate 1', 'gate1', 'cong 1', 'cổng 1', '78 giai phong', 'cp-gate-1']
  },
  {
    code: 'CP-GATE-2',
    nodeId: 'node_gate_2',
    title: 'Mã QR Cổng số 2 (Giải Phóng)',
    titleEn: 'QR Checkpoint Gate 2 (Giai Phong St)',
    buildingId: 'OUTDOOR',
    landmarkNear: 'Cổng 2 đường Giải Phóng, lối ô tô đi ra giờ hành chính',
    description: 'Vị trí cổng số 2 đường Giải Phóng.',
    aliases: ['gate 2', 'gate2', 'cong 2', 'cổng 2', 'cp-gate-2']
  },
  {
    code: 'CP-GATE-3',
    nodeId: 'node_gate_3',
    title: 'Mã QR Cổng số 3 (Phương Mai)',
    titleEn: 'QR Checkpoint Gate 3 (Phuong Mai St)',
    buildingId: 'OUTDOOR',
    landmarkNear: 'Cổng 3 phố Phương Mai, gần Tòa Q, F, H, T1-T6',
    description: 'Lối vào từ đường Phương Mai, mở 05:30 - 22:00 hằng ngày.',
    aliases: ['gate 3', 'gate3', 'cong 3', 'cổng 3', 'phuong mai', 'phương mai', 'cp-gate-3']
  },
  {
    code: 'CP-GATE-4',
    nodeId: 'node_gate_4',
    title: 'Mã QR Cổng số 4 (Giải Phóng)',
    titleEn: 'QR Checkpoint Gate 4 (Giai Phong St)',
    buildingId: 'OUTDOOR',
    landmarkNear: 'Cổng 4 đường Giải Phóng, lối vào trực tiếp Tòa K1 và K2',
    description: 'Lối vào thuận tiện nhất để đi thẳng vào Khoa Khám bệnh K1 và K2.',
    aliases: ['gate 4', 'gate4', 'cong 4', 'cổng 4', 'cp-gate-4']
  },
  {
    code: 'CP-K1',
    nodeId: 'node_k1_entrance',
    title: 'Mã QR Cửa sảnh Tòa K1',
    titleEn: 'QR Checkpoint Building K1 Lobby',
    buildingId: 'K1',
    landmarkNear: 'Sảnh chính Tòa K1 (Trung tâm Khám bệnh & Điều trị ban ngày)',
    description: 'Khu tiếp đón, đăng ký khám ngoại trú và thu viện phí.',
    aliases: ['k1', 'toa k1', 'tòa k1', 'kham benh k1', 'khám bệnh k1', 'cp-k1']
  },
  {
    code: 'CP-K2',
    nodeId: 'node_k2_entrance',
    title: 'Mã QR Cửa sảnh Tòa K2',
    titleEn: 'QR Checkpoint Building K2 Lobby',
    buildingId: 'K2',
    landmarkNear: 'Sảnh chính Tòa K2 (Điều trị trong ngày & Thận nhân tạo)',
    description: 'Khu điều trị ban ngày, đơn vị thận nhân tạo và can thiệp trong ngày.',
    aliases: ['k2', 'toa k2', 'tòa k2', 'cp-k2']
  },
  {
    code: 'CP-A9',
    nodeId: 'node_a9_emergency_entrance',
    title: 'Mã QR Cửa Trung tâm Cấp cứu A9',
    titleEn: 'QR Checkpoint A9 Emergency Center Lobby',
    buildingId: 'A9',
    landmarkNear: 'Cửa Trung tâm Cấp cứu A9 (24/7), gần Tòa A10',
    description: 'Đầu mối tiếp nhận cấp cứu khẩn cấp 24/7 của Bệnh viện Bạch Mai.',
    aliases: ['a9', 'cap cuu a9', 'cấp cứu a9', 'toa a9', 'tòa a9', 'cp-a9']
  },
  {
    code: 'CP-A10',
    nodeId: 'node_a10_stroke_entrance',
    title: 'Mã QR Cửa Trung tâm Đột quỵ (A10)',
    titleEn: 'QR Checkpoint A10 Stroke Center Lobby',
    buildingId: 'A10',
    landmarkNear: 'Cửa Trung tâm Đột quỵ A10 (kế bên Tòa A9)',
    description: 'Trung tâm Đột quỵ can thiệp giờ vàng.',
    aliases: ['a10', 'dot quy', 'đột quỵ', 'toa a10', 'tòa a10', 'cp-a10']
  },
  {
    code: 'CP-K3',
    nodeId: 'node_k3_poison_entrance',
    title: 'Mã QR Cửa Tòa K3 (Chống độc / Da liễu)',
    titleEn: 'QR Checkpoint Building K3 (Poison Control)',
    buildingId: 'K3',
    landmarkNear: 'Cửa Tòa K3, nằm sát Cổng 1 đường Giải Phóng',
    description: 'Trung tâm Chống độc Quốc gia và Khoa Da liễu.',
    aliases: ['k3', 'chong doc', 'chống độc', 'toa k3', 'tòa k3', 'cp-k3']
  },
  {
    code: 'CP-VTM',
    nodeId: 'node_vtm_entrance',
    title: 'Mã QR Cửa Viện Tim Mạch',
    titleEn: 'QR Checkpoint Vietnam Heart Institute',
    buildingId: 'VTM',
    landmarkNear: 'Sảnh chính Viện Tim Mạch Việt Nam (Nhà C)',
    description: 'Đầu mối chuyên sâu tim mạch, can thiệp tim mạch và phẫu thuật tim.',
    aliases: ['vtm', 'vien tim', 'viện tim', 'tim mach', 'tim mạch', 'vien tim mach', 'viện tim mạch', 'cp-vtm']
  },
  {
    code: 'CP-P',
    nodeId: 'node_p_vietnhat_entrance',
    title: 'Mã QR Cửa Tòa P (Việt Nhật)',
    titleEn: 'QR Checkpoint Building P (Vietnam - Japan)',
    buildingId: 'P',
    landmarkNear: 'Sảnh Tòa nhà Việt Nhật (P)',
    description: 'Trung tâm khám chữa bệnh kỹ thuật cao hợp tác Việt - Nhật.',
    aliases: ['p', 'viet nhat', 'việt nhật', 'toa p', 'tòa p', 'cp-p']
  },
  {
    code: 'CP-Q',
    nodeId: 'node_q_21story_entrance',
    title: 'Mã QR Cửa Tòa Q (21 tầng)',
    titleEn: 'QR Checkpoint Building Q (21 Floors)',
    buildingId: 'Q',
    landmarkNear: 'Sảnh Tòa Q 21 tầng (TT Ung bướu & YHHN)',
    description: 'Tòa nhà cao tầng trung tâm khuôn viên.',
    aliases: ['q', 'toa q', 'tòa q', 'toa 21 tang', 'tòa 21 tầng', '21 tang', '21 tầng', 'cp-q']
  },
  {
    code: 'CP-H',
    nodeId: 'node_h_onco_entrance',
    title: 'Mã QR Cửa Tòa H (Y học hạt nhân)',
    titleEn: 'QR Checkpoint Building H',
    buildingId: 'H',
    landmarkNear: 'Cửa Tòa H (Trung tâm Y học hạt nhân & Ung bướu)',
    description: 'Trung tâm Y học hạt nhân PET/CT và xạ trị.',
    aliases: ['h', 'toa h', 'tòa h', 'ung buou', 'ung bướu', 'cp-h']
  },
  {
    code: 'CP-F',
    nodeId: 'node_f_tropical_entrance',
    title: 'Mã QR Cửa Tòa F (Bệnh nhiệt đới)',
    titleEn: 'QR Checkpoint Building F (Tropical Diseases)',
    buildingId: 'F',
    landmarkNear: 'Cửa Tòa F (Viện Y học nhiệt đới & Truyền nhiễm)',
    description: 'Trung tâm Bệnh nhiệt đới, điều trị bệnh truyền nhiễm.',
    aliases: ['f', 'toa f', 'tòa f', 'nhiet doi', 'nhiệt đới', 'truyen nhiem', 'truyền nhiễm', 'cp-f']
  },
  {
    code: 'CP-T1',
    nodeId: 'node_t1_neuro_entrance',
    title: 'Mã QR Cụm T1 - T3 (Thần kinh)',
    titleEn: 'QR Checkpoint Buildings T1 - T3',
    buildingId: 'T1',
    landmarkNear: 'Cửa vào Cụm nhà T1 - T3 (Viện Thần kinh)',
    description: 'Khám và điều trị nội trú thần kinh.',
    aliases: ['t1', 't2', 't3', 't1-t3', 'cum t1-t3', 'cụm t1-t3', 'than kinh', 'thần kinh', 'cp-t1']
  },
  {
    code: 'CP-T4',
    nodeId: 'node_t4_mental_entrance',
    title: 'Mã QR Cụm T4 - T6 (Sức khỏe tâm thần)',
    titleEn: 'QR Checkpoint Buildings T4 - T6',
    buildingId: 'T4',
    landmarkNear: 'Cửa vào Cụm nhà T4 - T6 (Viện Sức khỏe tâm thần)',
    description: 'Viện Sức khỏe tâm thần và tâm lý học lâm sàng.',
    aliases: ['t4', 't5', 't6', 't4-t6', 'cum t4-t6', 'cụm t4-t6', 'tam than', 'tâm thần', 'cp-t4']
  },
  {
    code: 'CP-JUNCTION-A9',
    nodeId: 'node_path_junction_a9_k3',
    title: 'Mã QR Ngã ba Cổng 1 (Vào K3, A9, A10)',
    titleEn: 'QR Checkpoint Gate 1 Inner Junction',
    buildingId: 'OUTDOOR',
    landmarkNear: 'Ngã ba đường nội bộ sau Cổng 1, rẽ trái vào K3, thẳng tới A9',
    description: 'Điểm giao thông nội khu Cổng 1.',
    aliases: ['nga ba cong 1', 'ngã ba cổng 1', 'junction a9', 'cp-junction-a9']
  },
  {
    code: 'CP-JUNCTION-K1',
    nodeId: 'node_path_junction_k1_k2',
    title: 'Mã QR Lối vào cụm K1 & K2',
    titleEn: 'QR Checkpoint K1 & K2 Pathway Junction',
    buildingId: 'OUTDOOR',
    landmarkNear: 'Đường nội khu sau Cổng 4, tiếp giáp sảnh Tòa K1 và K2',
    description: 'Điểm giao thông nội khu tiếp cận K1 và K2.',
    aliases: ['nga ba k1', 'ngã ba k1', 'junction k1', 'cp-junction-k1']
  },
  {
    code: 'CP-CENTER',
    nodeId: 'node_path_central_axis',
    title: 'Mã QR Trục đường trung tâm khuôn viên',
    titleEn: 'QR Checkpoint Central Campus Pathway Axis',
    buildingId: 'OUTDOOR',
    landmarkNear: 'Trục đường trung tâm bệnh viện, giữa Tòa P và Tòa Q',
    description: 'Trục đường chính kết nối các khu điều trị trung tâm.',
    aliases: ['truc trung tam', 'trục trung tâm', 'trung tam', 'trung tâm', 'cp-center']
  }
];

export function findQRCheckpointByCode(codeOrInput: string): VerifiedQRCheckpoint | undefined {
  if (!codeOrInput) return undefined;
  const clean = codeOrInput.toLowerCase().trim();
  
  return BACH_MAI_QR_CHECKPOINTS.find(cp => {
    if (cp.code.toLowerCase() === clean) return true;
    if (cp.nodeId.toLowerCase() === clean) return true;
    return cp.aliases.some(alias => alias.toLowerCase() === clean);
  });
}
