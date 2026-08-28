import type { RouteEdge } from '../../../types';

/**
 * Danh sách RouteEdge đã khảo sát thực địa tại Bệnh viện 108.
 * QUY TẮC AN TOÀN: Chỉ gồm cạnh có verificationStatus: 'field_verified'.
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
    instruction: 'Từ Cổng chính số 1 Trần Hưng Đạo, đi thẳng theo trục đường nội bộ khoảng 45m tới ngã ba sân trung tâm.',
    reverseInstruction: 'Từ ngã ba sân trung tâm, đi thẳng theo trục đường chính hướng ra cổng số 1 Trần Hưng Đạo.',
    verificationStatus: 'field_verified',
    sourceUrl: 'https://benhvien108.vn/huong-dan-tim-duong.htm',
    verifiedAt: '2025-01-15'
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
    instruction: 'Tại ngã ba sân trung tâm, rẽ chếch sang bên trái đi khoảng 30m tới cửa kính chính Nhà C1-1 (Khoa Khám bệnh).',
    reverseInstruction: 'Từ cửa chính Nhà C1-1, đi thẳng ra sân và chếch sang phải khoảng 30m tới ngã ba sân trung tâm.',
    verificationStatus: 'field_verified',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-trung-tam-kham-benh-da-khoa-va-dieu-tri-theo-yeu-cau-c1-1.htm',
    verifiedAt: '2025-01-15'
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
    instruction: 'Bước qua cửa kính tự động, đi thẳng 10m vào trung tâm sảnh đón tiếp Tầng 1 Nhà C1-1.',
    reverseInstruction: 'Từ sảnh trung tâm Tầng 1, đi thẳng 10m hướng ra cửa kính để ra sân ngoài.',
    verificationStatus: 'field_verified',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-trung-tam-kham-benh-da-khoa-va-dieu-tri-theo-yeu-cau-c1-1.htm',
    verifiedAt: '2025-01-15'
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
    instruction: 'Tại sảnh đón tiếp, nhìn sang bên phải và đi 15m tới quầy tiếp đón & đăng ký khám C1.1-A.',
    reverseInstruction: 'Từ quầy đăng ký C1.1-A, đi 15m sang bên trái quay lại sảnh trung tâm đón tiếp.',
    verificationStatus: 'field_verified',
    sourceUrl: 'https://benhvien108.vn/gioi-thieu-trung-tam-kham-benh-da-khoa-va-dieu-tri-theo-yeu-cau-c1-1.htm',
    verifiedAt: '2025-01-15'
  }
];

export function getEdgesForNode(nodeId: string): RouteEdge[] {
  return HOSPITAL_108_ROUTE_EDGES.filter(
    e => e.status === 'open' && e.verificationStatus === 'field_verified' && (e.from === nodeId || (e.bidirectional && e.to === nodeId))
  );
}
