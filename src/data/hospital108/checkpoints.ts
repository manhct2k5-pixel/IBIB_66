import { Hospital108Checkpoint } from '../../types';

export const HOSPITAL_108_CHECKPOINTS: Hospital108Checkpoint[] = [
  {
    id: 'chk_gate_01',
    code: '108-GATE-01',
    name: 'Cổng chính số 1 Trần Hưng Đạo',
    building: 'Khuôn viên Bệnh viện 108',
    floor: 'Mặt bằng',
    verificationStatus: 'verified_checkpoint',
    verificationSource: 'benhvien108.vn',
    verifiedDate: '2026-08-28',
    mapLinkId: 'campus'
  },
  {
    id: 'chk_c1_1_lobby',
    code: '108-C1-1-LOBBY',
    name: 'Sảnh tiếp đón Tòa C1-1 (Tầng 1)',
    building: 'Nhà C1-1',
    floor: 'Tầng 1',
    verificationStatus: 'verified_checkpoint',
    verificationSource: 'benhvien108.vn/huong-dan-tim-duong.htm',
    verifiedDate: '2026-08-28',
    mapLinkId: 'c1-1-floor1'
  },
  {
    id: 'chk_yeucau_lobby',
    code: '108-YEUCAU-LOBBY',
    name: 'Sảnh tiếp đón Nhà Khám theo yêu cầu (Tầng 1)',
    building: 'Nhà Khoa Khám bệnh theo yêu cầu',
    floor: 'Tầng 1',
    verificationStatus: 'verified_checkpoint',
    verificationSource: 'benhvien108.vn/huong-dan-tim-duong.htm',
    verifiedDate: '2026-08-28',
    mapLinkId: 'kham-yeu-cau-floor1'
  },
  {
    id: 'chk_trung_tam_lobby',
    code: '108-TRUNG-TAM-LOBBY',
    name: 'Sảnh B Tòa nhà Trung tâm (Tầng 1)',
    building: 'Tòa nhà Trung tâm',
    floor: 'Tầng 1',
    verificationStatus: 'verified_checkpoint',
    verificationSource: 'benhvien108.vn/quy-trinh-kham/quy-trinh-kham-benh-doi-ngoai-quoc-te.htm',
    verifiedDate: '2026-08-28',
    mapLinkId: 'campus'
  }
];

export function lookupCheckpointByCode(inputCode: string): Hospital108Checkpoint | null {
  const normalized = inputCode.trim().toUpperCase();
  return HOSPITAL_108_CHECKPOINTS.find(c => c.code.toUpperCase() === normalized) || null;
}
