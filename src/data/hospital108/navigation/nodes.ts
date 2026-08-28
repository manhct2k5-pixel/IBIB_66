import type { RouteNode } from '../../../types';

/**
 * Danh sách RouteNode đã được khảo sát thực địa tại Bệnh viện Trung ương Quân đội 108.
 * QUY TẮC AN TOÀN: Chỉ đưa vào các node đã được kiểm chứng thực tế tại viện.
 */
export const HOSPITAL_108_ROUTE_NODES: RouteNode[] = [
  {
    id: 'node_gate_01',
    name: 'Cổng chính số 1 Trần Hưng Đạo',
    shortName: 'Cổng chính 108',
    type: 'gate',
    x: 100,
    y: 450,
    landmarkDescription: 'Cổng vào chính trên đường Trần Hưng Đạo, có trạm bảo vệ và biển tên bệnh viện lớn.',
    visualInstruction: 'Đứng tại vỉa hè cổng chính nhìn thẳng vào trục đường nội bộ trung tâm.',
    qrCode: 'MEDNAV108:checkpoint:node_gate_01',
    verificationStatus: 'field_verified',
    sourceUrl: 'https://benhvien108.vn/huong-dan-tim-duong.htm',
    verifiedAt: '2025-01-15',
    verifiedBy: 'Tổ khảo sát thực địa MedNav 108'
  },
  {
    id: 'node_yard_junction',
    name: 'Ngã ba sân trung tâm bệnh viện',
    shortName: 'Sân trung tâm',
    type: 'intersection',
    x: 250,
    y: 350,
    landmarkDescription: 'Khu vực bùng binh / ngã ba sân trung tâm phía trước cụm Nhà C1-1 và Nhà Cấp cứu.',
    visualInstruction: 'Phía trước bên trái là Nhà C1-1 (Khoa Khám bệnh), bên phải là đường vào các khoa điều trị.',
    qrCode: 'MEDNAV108:checkpoint:node_yard_junction',
    verificationStatus: 'field_verified',
    sourceUrl: 'https://benhvien108.vn/huong-dan-tim-duong.htm',
    verifiedAt: '2025-01-15',
    verifiedBy: 'Tổ khảo sát thực địa MedNav 108'
  },
  {
    id: 'node_c1_1_entrance',
    name: 'Cửa chính Nhà C1-1 (Khoa Khám bệnh)',
    shortName: 'Cửa Nhà C1-1',
    buildingId: 'building_c1_1',
    floorId: 'floor_1',
    type: 'building_entrance',
    x: 400,
    y: 280,
    landmarkDescription: 'Cửa kính trượt tự động lớn lối vào chính tầng 1 Nhà C1-1, có dốc thoai thoải cho xe lăn.',
    visualInstruction: 'Phía trên cửa có biển lớn "Khoa Khám bệnh đa khoa - C1.1".',
    qrCode: 'MEDNAV108:checkpoint:node_c1_1_entrance',
    verificationStatus: 'field_verified',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-trung-tam-kham-benh-da-khoa-va-dieu-tri-theo-yeu-cau-c1-1.htm',
    verifiedAt: '2025-01-15',
    verifiedBy: 'Tổ khảo sát thực địa MedNav 108'
  },
  {
    id: 'node_c1_1_lobby',
    name: 'Sảnh đón tiếp Tầng 1 Nhà C1-1',
    shortName: 'Sảnh Tầng 1 C1-1',
    buildingId: 'building_c1_1',
    floorId: 'floor_1',
    type: 'lobby',
    x: 520,
    y: 220,
    landmarkDescription: 'Sảnh trung tâm tầng 1, có quầy tư vấn hướng dẫn và máy bấm số tự động.',
    visualInstruction: 'Bước qua cửa chính 5 mét, quầy hướng dẫn nằm ngay vị trí trung tâm sảnh.',
    qrCode: 'MEDNAV108:checkpoint:node_c1_1_lobby',
    verificationStatus: 'field_verified',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-trung-tam-kham-benh-da-khoa-va-dieu-tri-theo-yeu-cau-c1-1.htm',
    verifiedAt: '2025-01-15',
    verifiedBy: 'Tổ khảo sát thực địa MedNav 108'
  },
  {
    id: 'node_c1_1_a_desk',
    name: 'Quầy tiếp đón & Đăng ký khám C1.1-A',
    shortName: 'Quầy tiếp đón C1.1-A',
    buildingId: 'building_c1_1',
    floorId: 'floor_1',
    type: 'destination',
    x: 650,
    y: 180,
    landmarkDescription: 'Quầy thủ tục tiếp nhận bảo hiểm y tế và đăng ký khám đa khoa (C1.1-A).',
    visualInstruction: 'Dãy quầy kính có bảng điện tử hiển thị số thứ tự đón tiếp.',
    qrCode: 'MEDNAV108:checkpoint:node_c1_1_a_desk',
    verificationStatus: 'field_verified',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-trung-tam-kham-benh-da-khoa-va-dieu-tri-theo-yeu-cau-c1-1.htm',
    verifiedAt: '2025-01-15',
    verifiedBy: 'Tổ khảo sát thực địa MedNav 108'
  }
];

export function getNodeById(id: string): RouteNode | undefined {
  return HOSPITAL_108_ROUTE_NODES.find(n => n.id === id);
}
