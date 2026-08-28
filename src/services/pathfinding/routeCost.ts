import type { RouteEdge, RouteProfile } from '../../types';

/**
 * Cấu hình hệ số chi phí tuyến đường
 */
export const ROUTE_COST_CONFIG = {
  elderlyStairsPenaltyMultiplier: 3.5, // Phạt nặng cầu thang bộ đối với người cao tuổi
  elderlyRampPenaltyMultiplier: 1.2,   // Dốc vừa phải
  elderlyUnfriendlyPenaltyMultiplier: 2.0,
  stairsWheelchairCost: Infinity       // Xe lăn tuyệt đối không đi qua cầu thang
};

/**
 * Tính toán chi phí di chuyển qua một cạnh theo hồ sơ người dùng.
 * Trả về Infinity nếu cạnh bị đóng, chưa xác minh thực địa, hoặc vi phạm điều kiện trợ năng.
 */
export function calculateEdgeCost(edge: RouteEdge, profile: RouteProfile = 'shortest_walk'): number {
  // 1. Kiểm tra trạng thái xác minh & mở cửa
  if (edge.verificationStatus !== 'field_verified') {
    return Infinity;
  }
  if (edge.status !== 'open') {
    return Infinity;
  }

  const baseDistance = edge.distanceMeters;
  if (baseDistance <= 0) {
    return Infinity;
  }

  // 2. Chế độ xe lăn (wheelchair_accessible)
  if (profile === 'wheelchair_accessible') {
    if (edge.pathType === 'stairs') {
      return Infinity;
    }
    if (!edge.accessibility.wheelchair) {
      return Infinity;
    }
    return baseDistance;
  }

  // 3. Chế độ người cao tuổi (elderly_friendly)
  if (profile === 'elderly_friendly') {
    if (edge.pathType === 'stairs') {
      return baseDistance * ROUTE_COST_CONFIG.elderlyStairsPenaltyMultiplier;
    }
    if (edge.pathType === 'ramp') {
      return baseDistance * ROUTE_COST_CONFIG.elderlyRampPenaltyMultiplier;
    }
    if (!edge.accessibility.elderlyFriendly) {
      return baseDistance * ROUTE_COST_CONFIG.elderlyUnfriendlyPenaltyMultiplier;
    }
    return baseDistance;
  }

  // 4. Chế độ ngắn nhất (shortest_walk)
  return baseDistance;
}
