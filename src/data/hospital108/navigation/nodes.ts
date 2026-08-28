import type { RouteNode } from '../../../types';

/**
 * Danh sách RouteNode thí điểm tại Bệnh viện Trung ương Quân đội 108.
 * LƯU Ý TRUNG THỰC: Đây là tuyến thử nghiệm nguyên mẫu (prototype),
 * chưa qua nghiệm thu thực địa chính thức.
 */
export const HOSPITAL_108_ROUTE_NODES: RouteNode[] = [
  {
    id: 'node_gate_01',
    name: 'Cổng chính số 1 Trần Hưng Đạo',
    shortName: 'Cổng chính',
    type: 'gate',
    x: 100,
    y: 450,
    landmarkDescription: 'Cổng vào chính trên đường Trần Hưng Đạo, có bốt trực bảo vệ và cổng vòm lớn.',
    visualInstruction: 'Đứng tại vỉa hè cổng chính nhìn thẳng vào trục đường nội bộ trung tâm.',
    qrCode: 'MEDNAV108:checkpoint:node_gate_01',
    facingInstruction: 'Hãy đứng quay mặt vào phía trong bệnh viện, lưng quay về phía đường Trần Hưng Đạo.',
    approachInstruction: 'Từ vỉa hè đường Trần Hưng Đạo, đi qua cổng bảo vệ tiến vào khuôn viên viện.',
    visibleCue: 'Cổng vòm lớn của bệnh viện 108 và bốt gác bảo vệ ở lối vào.',
    confirmationLabel: 'Đã tới Cổng chính',
    instructionWhenNotVisible: 'Tìm cổng lớn có bốt gác quân y trên đường Trần Hưng Đạo hoặc hỏi bảo vệ tại cổng.',
    dataStatus: 'prototype',
    verificationStatus: 'prototype',
    sourceUrl: 'https://benhvien108.vn/huong-dan-tim-duong.htm'
  },
  {
    id: 'node_yard_junction',
    name: 'Bùng binh sân trung tâm bệnh viện',
    shortName: 'Sân trung tâm',
    type: 'intersection',
    x: 250,
    y: 350,
    landmarkDescription: 'Khu vực bùng binh sân rộng phía trước cụm Nhà C1-1 và Nhà Cấp cứu.',
    visualInstruction: 'Khu sân rộng nơi đường nội bộ tách thành các hướng đi tới các tòa nhà.',
    qrCode: 'MEDNAV108:checkpoint:node_yard_junction',
    facingInstruction: 'Đứng tại bùng binh, quay mặt hướng về phía cụm tòa nhà cao tầng phía trước.',
    approachInstruction: 'Đi thẳng theo trục đường nội bộ chính từ cổng số 1 tới bùng binh phía trước.',
    visibleCue: 'Khu sân rộng nơi đường nội bộ tách thành các hướng đi tới các tòa nhà.',
    confirmationLabel: 'Đã tới Sân trung tâm',
    instructionWhenNotVisible: 'Đi thẳng từ cổng số 1 theo trục đường rợp cây khoảng 40 bước chân tới bùng binh tròn.',
    dataStatus: 'prototype',
    verificationStatus: 'prototype',
    sourceUrl: 'https://benhvien108.vn/huong-dan-tim-duong.htm'
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
    landmarkDescription: 'Cửa kính lớn lối vào tầng 1 Nhà C1-1, có dốc thoai thoải cho xe lăn.',
    visualInstruction: 'Phía trên cửa có biển lớn "Khoa Khám bệnh đa khoa - C1.1".',
    qrCode: 'MEDNAV108:checkpoint:node_c1_1_entrance',
    facingInstruction: 'Đứng quay mặt về phía tòa nhà có biển C1-1.',
    approachInstruction: 'Tại bùng binh sân trung tâm, đi chếch sang trái về phía tòa Nhà C1-1.',
    visibleCue: 'Cửa kính lớn, phía trên có biển tên Khoa Khám bệnh Nhà C1-1.',
    confirmationLabel: 'Đã tới Cửa Nhà C1-1',
    instructionWhenNotVisible: 'Tìm tòa nhà kính nhiều tầng bên tay trái có biển chữ C1.1 hoặc hỏi nhân viên bảo vệ gần đó.',
    dataStatus: 'prototype',
    verificationStatus: 'prototype',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-trung-tam-kham-benh-da-khoa-va-dieu-tri-theo-yeu-cau-c1-1.htm'
  },
  {
    id: 'node_c1_1_lobby',
    name: 'Sảnh đón tiếp Tầng 1 Nhà C1-1',
    shortName: 'Sảnh Tầng 1',
    buildingId: 'building_c1_1',
    floorId: 'floor_1',
    type: 'lobby',
    x: 520,
    y: 220,
    landmarkDescription: 'Sảnh trung tâm tầng 1, có quầy tư vấn hướng dẫn và máy bấm số tự động.',
    visualInstruction: 'Bước qua cửa kính tự động vào ngay trung tâm sảnh tầng 1.',
    qrCode: 'MEDNAV108:checkpoint:node_c1_1_lobby',
    facingInstruction: 'Đứng giữa sảnh đón tiếp nhìn bao quát các quầy dịch vụ xung quanh.',
    approachInstruction: 'Bước qua cửa kính tự động, đi thẳng vào bên trong sảnh tầng 1.',
    visibleCue: 'Quầy thông tin tư vấn trung tâm và máy bấm lấy số thứ tự khám.',
    confirmationLabel: 'Đã tới Sảnh Tầng 1',
    instructionWhenNotVisible: 'Bước vào bên trong cửa kính, tìm quầy tư vấn có nhân viên hướng dẫn mặc áo blouse.',
    dataStatus: 'prototype',
    verificationStatus: 'prototype',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-trung-tam-kham-benh-da-khoa-va-dieu-tri-theo-yeu-cau-c1-1.htm'
  },
  {
    id: 'node_c1_1_a_desk',
    name: 'Quầy tiếp đón & Đăng ký khám C1.1-A',
    shortName: 'Quầy C1.1-A',
    buildingId: 'building_c1_1',
    floorId: 'floor_1',
    type: 'destination',
    x: 650,
    y: 180,
    landmarkDescription: 'Quầy thủ tục tiếp nhận bảo hiểm y tế và đăng ký khám đa khoa (C1.1-A).',
    visualInstruction: 'Dãy quầy kính có bảng điện tử hiển thị số thứ tự đón tiếp.',
    qrCode: 'MEDNAV108:checkpoint:node_c1_1_a_desk',
    facingInstruction: 'Đứng trước quầy kính có biển số C1.1-A chuẩn bị sổ khám hoặc thẻ BHYT/CCCD.',
    approachInstruction: 'Từ sảnh trung tâm tầng 1, nhìn sang phía tay phải và đi tới quầy C1.1-A.',
    visibleCue: 'Dãy quầy giao dịch có biển điện tử sáng đèn ghi "C1.1-A Tiếp đón & Đăng ký".',
    confirmationLabel: 'Đã tới Quầy C1.1-A',
    instructionWhenNotVisible: 'Nhìn về dãy quầy thủ tục bên tay phải sảnh, hoặc hỏi bàn tư vấn quầy đăng ký khám đa khoa C1.1-A.',
    dataStatus: 'prototype',
    verificationStatus: 'prototype',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-trung-tam-kham-benh-da-khoa-va-dieu-tri-theo-yeu-cau-c1-1.htm'
  }
];

export function getNodeById(id: string): RouteNode | undefined {
  return HOSPITAL_108_ROUTE_NODES.find(n => n.id === id);
}
