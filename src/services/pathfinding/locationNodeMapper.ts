import { 
  HOSPITAL_108_ROUTE_NODES, 
  HOSPITAL_108_ROUTE_EDGES 
} from '../../data/hospital108/navigation';
import { findPathAStar } from './aStar';
import { generateNavigationSteps } from './routeInstructions';
import type { 
  Destination, 
  StartLocation, 
  RouteProfile, 
  CalculatedRoute, 
  NavigationSession,
  RouteNode
} from '../../types';

/**
 * Ánh xạ giữa Destination ID và RouteNode ID
 */
export const DESTINATION_NODE_MAP: Record<string, string> = {
  'c1_1_a': 'node_c1_1_a_desk',
  'kham_da_khoa': 'node_c1_1_a_desk',
  'c1_1_lobby': 'node_c1_1_lobby'
};

/**
 * Ánh xạ giữa StartLocation ID và RouteNode ID
 */
export const START_LOCATION_NODE_MAP: Record<string, string> = {
  'cong_1': 'node_gate_01',
  'cong_1_tran_hung_dao': 'node_gate_01',
  'san_trung_tam': 'node_yard_junction',
  'san_c1': 'node_yard_junction',
  'cua_c1_1': 'node_c1_1_entrance',
  'sanh_c1_1': 'node_c1_1_lobby'
};

/**
 * Tìm RouteNode ID cho Destination
 */
export function getRouteNodeIdForDestination(destinationId: string): string {
  return DESTINATION_NODE_MAP[destinationId] || 'node_c1_1_a_desk';
}

/**
 * Tìm RouteNode ID cho StartLocation
 */
export function getRouteNodeIdForStartLocation(startLocationId: string): string {
  return START_LOCATION_NODE_MAP[startLocationId] || 'node_gate_01';
}

/**
 * Tính toán tuyến đường và tạo đối tượng CalculatedRoute đầy đủ
 */
export function buildCalculatedRoute(
  startNodeId: string,
  destinationNodeId: string,
  destinationId: string,
  profile: RouteProfile = 'shortest_walk'
): CalculatedRoute | null {
  const pathResult = findPathAStar(
    startNodeId,
    destinationNodeId,
    HOSPITAL_108_ROUTE_NODES,
    HOSPITAL_108_ROUTE_EDGES,
    profile
  );

  if (!pathResult.found || pathResult.pathNodeIds.length === 0) {
    return null;
  }

  const steps = generateNavigationSteps(
    pathResult.pathNodeIds,
    pathResult.edges,
    HOSPITAL_108_ROUTE_NODES
  );

  // Ước lượng thời gian đi bộ (1 mét/giây ~ 60m/phút)
  const estimatedSeconds = Math.round(pathResult.totalDistanceMeters / 1.0);

  return {
    id: `route_${startNodeId}_to_${destinationNodeId}_${Date.now()}`,
    destinationId,
    startNodeId,
    destinationNodeId,
    profile,
    totalDistanceMeters: pathResult.totalDistanceMeters,
    estimatedDurationSeconds: estimatedSeconds,
    steps,
    pathNodeIds: pathResult.pathNodeIds,
    edges: pathResult.edges,
    verificationStatus: 'field_verified'
  };
}

/**
 * Khởi tạo Session điều hướng
 */
export function createNavigationSession(
  route: CalculatedRoute,
  destination: Destination,
  startLocation: StartLocation
): NavigationSession {
  return {
    id: `session_${Date.now()}`,
    destinationId: destination.id,
    startLocationId: startLocation.id,
    route,
    currentStepIndex: 0,
    status: 'active',
    startedAt: Date.now(),
    updatedAt: Date.now()
  };
}
