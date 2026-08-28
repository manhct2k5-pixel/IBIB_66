import type { RouteProfile } from '../../../types';

export interface PredefinedPilotRoute {
  id: string;
  name: string;
  startNodeId: string;
  destinationNodeId: string;
  destinationId: string;
  profile: RouteProfile;
  totalDistanceMeters: number;
  description: string;
  verificationStatus: 'prototype' | 'field_verified';
}

/**
 * Tuyến thí điểm nguyên mẫu (prototype) tại Bệnh viện 108
 */
export const HOSPITAL_108_PILOT_ROUTES: PredefinedPilotRoute[] = [
  {
    id: 'route_pilot_gate01_to_c1_1_a',
    name: 'Cổng 1 Trần Hưng Đạo → Quầy tiếp đón Khám Đa Khoa C1.1-A',
    startNodeId: 'node_gate_01',
    destinationNodeId: 'node_c1_1_a_desk',
    destinationId: 'c1_1_a',
    profile: 'shortest_walk',
    totalDistanceMeters: 100,
    description: 'Tuyến thử nghiệm đi bộ từ cổng chính, qua bùng binh sân vào sảnh Tầng 1 Nhà C1-1 tới quầy tiếp đón.',
    verificationStatus: 'prototype'
  }
];
