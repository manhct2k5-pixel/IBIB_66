import { PriorityQueue } from './priorityQueue';
import { calculateEdgeCost } from './routeCost';
import type { RouteNode, RouteEdge, RouteProfile } from '../../types';

export interface PathfindingResult {
  found: boolean;
  pathNodeIds: string[];
  totalDistanceMeters: number;
  totalCost: number;
  edges: RouteEdge[];
}

/**
 * Tính heuristic khoảng cách còn lại (h)
 * Chỉ tính Euclidean khi cùng tòa, cùng tầng và đầy đủ tọa độ x, y.
 * Ngược lại trả về 0 (tương đương Dijkstra, đảm bảo admissible).
 */
export function calculateHeuristic(node: RouteNode, targetNode: RouteNode): number {
  if (
    typeof node.x !== 'number' || 
    typeof node.y !== 'number' || 
    typeof targetNode.x !== 'number' || 
    typeof targetNode.y !== 'number'
  ) {
    return 0;
  }

  // Khác tòa hoặc khác tầng -> không dùng tọa độ phẳng
  if (node.buildingId !== targetNode.buildingId || node.floorId !== targetNode.floorId) {
    return 0;
  }

  const dx = node.x - targetNode.x;
  const dy = node.y - targetNode.y;
  const euclideanPixels = Math.sqrt(dx * dx + dy * dy);

  // Heuristic an toàn (scale 0.1 mét/pixel để chắc chắn h <= h*)
  return euclideanPixels * 0.1;
}

/**
 * Thuật toán A* tìm đường đi tối ưu giữa hai điểm trên đồ thị
 */
export function findPathAStar(
  startNodeId: string,
  destinationNodeId: string,
  nodes: RouteNode[],
  edges: RouteEdge[],
  profile: RouteProfile = 'shortest_walk'
): PathfindingResult {
  if (startNodeId === destinationNodeId) {
    return {
      found: true,
      pathNodeIds: [startNodeId],
      totalDistanceMeters: 0,
      totalCost: 0,
      edges: []
    };
  }

  const nodeMap = new Map<string, RouteNode>();
  for (const n of nodes) {
    nodeMap.set(n.id, n);
  }

  const startNode = nodeMap.get(startNodeId);
  const destNode = nodeMap.get(destinationNodeId);

  if (!startNode || !destNode) {
    return {
      found: false,
      pathNodeIds: [],
      totalDistanceMeters: 0,
      totalCost: Infinity,
      edges: []
    };
  }

  // Xây dựng danh sách kề (Adjacency list)
  const adj = new Map<string, { targetNodeId: string; edge: RouteEdge }[]>();
  for (const edge of edges) {
    const cost = calculateEdgeCost(edge, profile);
    if (!isFinite(cost)) continue;

    // Chiều xuôi
    if (!adj.has(edge.from)) adj.set(edge.from, []);
    adj.get(edge.from)!.push({ targetNodeId: edge.to, edge });

    // Chiều ngược nếu bidirectional
    if (edge.bidirectional) {
      if (!adj.has(edge.to)) adj.set(edge.to, []);
      adj.get(edge.to)!.push({ targetNodeId: edge.from, edge });
    }
  }

  const openSet = new PriorityQueue<string>();
  const cameFrom = new Map<string, { fromNodeId: string; edge: RouteEdge }>();

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();

  gScore.set(startNodeId, 0);
  const startH = calculateHeuristic(startNode, destNode);
  fScore.set(startNodeId, startH);

  openSet.enqueue(startNodeId, startH);
  const closedSet = new Set<string>();

  while (!openSet.isEmpty()) {
    const currentId = openSet.dequeue()!;

    if (currentId === destinationNodeId) {
      // Tái tạo đường đi
      const pathNodeIds: string[] = [destinationNodeId];
      const pathEdges: RouteEdge[] = [];
      let curr = destinationNodeId;
      let totalDistance = 0;

      while (cameFrom.has(curr)) {
        const step = cameFrom.get(curr)!;
        pathNodeIds.unshift(step.fromNodeId);
        pathEdges.unshift(step.edge);
        totalDistance += step.edge.distanceMeters;
        curr = step.fromNodeId;
      }

      return {
        found: true,
        pathNodeIds,
        totalDistanceMeters: totalDistance,
        totalCost: gScore.get(destinationNodeId) || totalDistance,
        edges: pathEdges
      };
    }

    closedSet.add(currentId);

    const neighbors = adj.get(currentId) || [];
    for (const neighbor of neighbors) {
      const neighborId = neighbor.targetNodeId;
      if (closedSet.has(neighborId)) continue;

      const neighborNode = nodeMap.get(neighborId);
      if (!neighborNode) continue;

      const edgeCost = calculateEdgeCost(neighbor.edge, profile);
      if (!isFinite(edgeCost)) continue;

      const tentativeGScore = (gScore.get(currentId) ?? Infinity) + edgeCost;

      if (tentativeGScore < (gScore.get(neighborId) ?? Infinity)) {
        cameFrom.set(neighborId, { fromNodeId: currentId, edge: neighbor.edge });
        gScore.set(neighborId, tentativeGScore);

        const h = calculateHeuristic(neighborNode, destNode);
        const f = tentativeGScore + h;
        fScore.set(neighborId, f);

        openSet.enqueue(neighborId, f);
      }
    }
  }

  // Không tìm thấy đường
  return {
    found: false,
    pathNodeIds: [],
    totalDistanceMeters: 0,
    totalCost: Infinity,
    edges: []
  };
}
