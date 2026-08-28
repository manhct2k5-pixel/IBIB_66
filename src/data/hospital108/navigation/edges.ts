import type { RouteEdge } from '../../../types';

/**
 * Danh sách RouteEdge thí điểm tại Bệnh viện 108.
 * LƯU Ý TRUNG THỰC: Đây là tuyến thử nghiệm nguyên mẫu (prototype),
 * chưa qua nghiệm thu thực địa chính thức.
 */
export const HOSPITAL_108_ROUTE_EDGES: RouteEdge[] = [
  {
    id: 'edge_gate01_to_yard',
    from: 'node_gate_01',
    to: 'node_yard_junction',
    distanceMeters: 45,
    bidirectional: true,
    pathType: 'outdoor_walkway',
    accessibility: {
      wheelchair: true,
      elderlyFriendly: true,
      avoidWhenRaining: false
    },
    status: 'open',
    instruction: 'Đi thẳng tới bùng binh phía trước',
    reverseInstruction: 'Đi thẳng theo trục đường nội bộ hướng ra Cổng chính số 1',
    verificationStatus: 'prototype',
    sourceUrl: 'https://benhvien108.vn/huong-dan-tim-duong.htm'
  },
  {
    id: 'edge_yard_to_c1_1_entrance',
    from: 'node_yard_junction',
    to: 'node_c1_1_entrance',
    distanceMeters: 30,
    bidirectional: true,
    pathType: 'outdoor_walkway',
    accessibility: {
      wheelchair: true,
      elderlyFriendly: true,
      avoidWhenRaining: false
    },
    status: 'open',
    instruction: 'Tại bùng binh, đi chếch sang trái về phía Nhà C1-1',
    reverseInstruction: 'Từ cửa chính Nhà C1-1, đi thẳng ra sân và chếch sang phải tới bùng binh',
    verificationStatus: 'prototype',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-trung-tam-kham-benh-da-khoa-va-dieu-tri-theo-yeu-cau-c1-1.htm'
  },
  {
    id: 'edge_entrance_to_c1_1_lobby',
    from: 'node_c1_1_entrance',
    to: 'node_c1_1_lobby',
    distanceMeters: 10,
    bidirectional: true,
    pathType: 'indoor_hallway',
    accessibility: {
      wheelchair: true,
      elderlyFriendly: true,
      avoidWhenRaining: false
    },
    status: 'open',
    instruction: 'Bước qua cửa kính tự động vào sảnh đón tiếp Tầng 1',
    reverseInstruction: 'Từ sảnh trung tâm Tầng 1, đi thẳng hướng ra cửa kính để ra sân',
    verificationStatus: 'prototype',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-trung-tam-kham-benh-da-khoa-va-dieu-tri-theo-yeu-cau-c1-1.htm'
  },
  {
    id: 'edge_lobby_to_c1_1_a_desk',
    from: 'node_c1_1_lobby',
    to: 'node_c1_1_a_desk',
    distanceMeters: 15,
    bidirectional: true,
    pathType: 'indoor_hallway',
    accessibility: {
      wheelchair: true,
      elderlyFriendly: true,
      avoidWhenRaining: false
    },
    status: 'open',
    instruction: 'Nhìn sang bên phải tới quầy tiếp đón & đăng ký khám C1.1-A',
    reverseInstruction: 'Từ quầy đăng ký C1.1-A, đi sang bên trái quay lại sảnh trung tâm đón tiếp',
    verificationStatus: 'prototype',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-trung-tam-kham-benh-da-khoa-va-dieu-tri-theo-yeu-cau-c1-1.htm'
  }
];

export function getEdgeBetweenNodes(
  fromNodeId: string,
  toNodeId: string
): RouteEdge | undefined {
  return HOSPITAL_108_ROUTE_EDGES.find(
    e =>
      (e.from === fromNodeId && e.to === toNodeId) ||
      (e.bidirectional && e.from === toNodeId && e.to === fromNodeId)
  );
}
