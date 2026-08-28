import { PriorityQueue } from './priorityQueue';
import { calculateEdgeCost } from './routeCost';
import type { RouteNode, RouteEdge, RouteProfile } from '../../types';
import type { PathfindingResult } from './aStar';

/**
 * Thuật toán Dijkstra tìm đường ngắn nhất trên đồ thị (không dùng Heuristic)
 */
export function findPathDijkstra(
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

  if (!nodeMap.has(startNodeId) || !nodeMap.has(destinationNodeId)) {
    return {
      found: false,
      pathNodeIds: [],
      totalDistanceMeters: 0,
      totalCost: Infinity,
      edges: []
    };
  }

  // Xây dựng danh sách kề
  const adj = new Map<string, { targetNodeId: string; edge: RouteEdge }[]>();
  for (const edge of edges) {
    const cost = calculateEdgeCost(edge, profile);
    if (!isFinite(cost)) continue;

    if (!adj.has(edge.from)) adj.set(edge.from, []);
    adj.get(edge.from)!.push({ targetNodeId: edge.to, edge });

    if (edge.bidirectional) {
      if (!adj.has(edge.to)) adj.set(edge.to, []);
      adj.get(edge.to)!.push({ targetNodeId: edge.from, edge });
    }
  }

  const distances = new Map<string, number>();
  const cameFrom = new Map<string, { fromNodeId: string; edge: RouteEdge }>();
  const pq = new PriorityQueue<string>();
  const visited = new Set<string>();

  distances.set(startNodeId, 0);
  pq.enqueue(startNodeId, 0);

  while (!pq.isEmpty()) {
    const currentId = pq.dequeue()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

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
        totalCost: distances.get(destinationNodeId) || totalDistance,
        edges: pathEdges
      };
    }

    const neighbors = adj.get(currentId) || [];
    for (const neighbor of neighbors) {
      const neighborId = neighbor.targetNodeId;
      if (visited.has(neighborId)) continue;

      const edgeCost = calculateEdgeCost(neighbor.edge, profile);
      if (!isFinite(edgeCost)) continue;

      const newDist = (distances.get(currentId) ?? Infinity) + edgeCost;
      if (newDist < (distances.get(neighborId) ?? Infinity)) {
        distances.set(neighborId, newDist);
        cameFrom.set(neighborId, { fromNodeId: currentId, edge: neighbor.edge });
        pq.enqueue(neighborId, newDist);
      }
    }
  }

  return {
    found: false,
    pathNodeIds: [],
    totalDistanceMeters: 0,
    totalCost: Infinity,
    edges: []
  };
}
