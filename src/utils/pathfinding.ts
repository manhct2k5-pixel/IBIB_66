import { 
  BuildingId, 
  FloorId, 
  MapEdge, 
  MapNode, 
  NavigationRoute, 
  NavigationStep, 
  RoutingProfile 
} from '../types';
import { MAP_EDGES_DATA, MAP_NODES_DATA } from '../data/hospitalData';

export interface RouteObstacle {
  id: string;
  name: string;
  nameEn: string;
  type: 'maintenance' | 'cleaning' | 'crowded';
  fromNodeId: string;
  toNodeId: string;
  penaltyCost: number; // additional distance cost or Infinity if blocked
  descriptionVi: string;
  descriptionEn: string;
}

// Active dynamic obstacles in hospital (empty by default to avoid blocking verified routes)
export const ACTIVE_HOSPITAL_OBSTACLES: RouteObstacle[] = [];

interface GraphNode {
  node: MapNode;
  neighbors: { neighbor: MapNode; edge: MapEdge }[];
}

function calculateHeuristic(nodeA: MapNode, nodeB: MapNode): number {
  // Horizontal 2D distance (scaled from 1000x800 coordinate space)
  const dx = (nodeA.x - nodeB.x) * 0.1;
  const dy = (nodeA.y - nodeB.y) * 0.1;
  return Math.sqrt(dx * dx + dy * dy);
}

function buildGraph(
  profile: RoutingProfile, 
  avoidObstacles: boolean = true,
  customBlockedEdges: string[] = []
): Map<string, GraphNode> {
  const graph = new Map<string, GraphNode>();

  for (const node of MAP_NODES_DATA) {
    graph.set(node.id, { node, neighbors: [] });
  }

  for (const edge of MAP_EDGES_DATA) {
    const edgeKey1 = `${edge.fromNodeId}_${edge.toNodeId}`;
    const edgeKey2 = `${edge.toNodeId}_${edge.fromNodeId}`;

    if (customBlockedEdges.includes(edgeKey1) || customBlockedEdges.includes(edgeKey2)) {
      continue;
    }

    if (profile === 'accessible') {
      if (!edge.isAccessible || edge.hasSteps) {
        continue;
      }
      if (edge.widthMeters && edge.widthMeters < 1.4) {
        continue;
      }
    }

    let obstaclePenalty = 0;
    if (avoidObstacles) {
      const obstacle = ACTIVE_HOSPITAL_OBSTACLES.find(
        o => (o.fromNodeId === edge.fromNodeId && o.toNodeId === edge.toNodeId) ||
             (o.fromNodeId === edge.toNodeId && o.toNodeId === edge.fromNodeId)
      );
      if (obstacle) {
        if (obstacle.penaltyCost >= 9000) {
          continue;
        }
        obstaclePenalty += obstacle.penaltyCost;
      }
    }

    const from = graph.get(edge.fromNodeId);
    const to = graph.get(edge.toNodeId);

    if (from && to) {
      let weight = edge.distance + obstaclePenalty;

      if (profile === 'visually_impaired') {
        if (edge.audioLandmarkVi) {
          weight *= 0.55;
        }
        if (edge.hasSteps) {
          weight += 35;
        }
      }

      const forwardEdge: MapEdge = { ...edge, distance: weight };
      const reverseEdge: MapEdge = { 
        ...edge, 
        fromNodeId: edge.toNodeId, 
        toNodeId: edge.fromNodeId, 
        distance: weight 
      };

      from.neighbors.push({ neighbor: to.node, edge: forwardEdge });
      to.neighbors.push({ neighbor: from.node, edge: reverseEdge });
    }
  }

  return graph;
}

class MinPriorityQueue<T> {
  private items: { element: T; priority: number }[] = [];

  enqueue(element: T, priority: number) {
    this.items.push({ element, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): T | undefined {
    return this.items.shift()?.element;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

export function findRoute(
  startNodeId: string,
  targetNodeId: string,
  profile: RoutingProfile = 'fastest',
  options?: {
    avoidObstacles?: boolean;
    customBlockedEdges?: string[];
  }
): NavigationRoute | null {
  const startNode = MAP_NODES_DATA.find(n => n.id === startNodeId);
  const targetNode = MAP_NODES_DATA.find(n => n.id === targetNodeId);

  if (!startNode || !targetNode) return null;

  if (startNodeId === targetNodeId) {
    return {
      pathNodes: [startNode],
      totalDistance: 0,
      estimatedDurationSeconds: 0,
      steps: [
        {
          stepIndex: 1,
          instructionVi: `Bạn đang ở ngay tại ${startNode.name}`,
          instructionEn: `You are already at ${startNode.nameEn}`,
          distance: 0,
          maneuver: 'arrive',
          fromNode: startNode,
          toNode: startNode,
          buildingId: startNode.buildingId,
        }
      ],
      profile,
      buildingsInvolved: [startNode.buildingId],
      floorsInvolved: []
    };
  }

  const graph = buildGraph(
    profile, 
    options?.avoidObstacles ?? true, 
    options?.customBlockedEdges ?? []
  );

  const startGraphNode = graph.get(startNodeId);
  const targetGraphNode = graph.get(targetNodeId);

  if (!startGraphNode || !targetGraphNode) {
    return null;
  }

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const previous = new Map<string, { prevNodeId: string; edge: MapEdge }>();
  const openSet = new MinPriorityQueue<string>();
  const closedSet = new Set<string>();

  for (const nodeId of graph.keys()) {
    gScore.set(nodeId, Infinity);
    fScore.set(nodeId, Infinity);
  }

  gScore.set(startNodeId, 0);
  const startH = calculateHeuristic(startNode, targetNode);
  fScore.set(startNodeId, startH);
  openSet.enqueue(startNodeId, startH);

  while (!openSet.isEmpty()) {
    const currentId = openSet.dequeue()!;
    
    if (currentId === targetNodeId) break;
    if (closedSet.has(currentId)) continue;
    closedSet.add(currentId);

    const currentNode = graph.get(currentId);
    if (!currentNode) continue;

    const currentG = gScore.get(currentId)!;

    for (const { neighbor, edge } of currentNode.neighbors) {
      if (closedSet.has(neighbor.id)) continue;

      let turnPenalty = 0;
      const prevInfo = previous.get(currentId);
      if (prevInfo) {
        const prevNode = graph.get(prevInfo.prevNodeId)?.node;
        if (prevNode) {
          const v1x = currentNode.node.x - prevNode.x;
          const v1y = currentNode.node.y - prevNode.y;
          const v2x = neighbor.x - currentNode.node.x;
          const v2y = neighbor.y - currentNode.node.y;
          
          const dot = v1x * v2x + v1y * v2y;
          const mag1 = Math.sqrt(v1x * v1x + v1y * v1y);
          const mag2 = Math.sqrt(v2x * v2x + v2y * v2y);
          if (mag1 > 0 && mag2 > 0) {
            const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
            if (cosAngle < 0.7) turnPenalty = 1.5;
          }
        }
      }

      const tentativeG = currentG + edge.distance + turnPenalty;

      if (tentativeG < (gScore.get(neighbor.id) ?? Infinity)) {
        previous.set(neighbor.id, { prevNodeId: currentId, edge });
        gScore.set(neighbor.id, tentativeG);
        
        const h = calculateHeuristic(neighbor, targetNode);
        const f = tentativeG + h;
        fScore.set(neighbor.id, f);
        openSet.enqueue(neighbor.id, f);
      }
    }
  }

  if (!previous.has(targetNodeId)) return null;

  const pathNodes: MapNode[] = [];
  let curr: string | undefined = targetNodeId;

  while (curr) {
    const node = MAP_NODES_DATA.find(n => n.id === curr);
    if (node) pathNodes.unshift(node);
    const prevInfo = previous.get(curr);
    curr = prevInfo?.prevNodeId;
  }

  let totalDistance = 0;
  for (let i = 0; i < pathNodes.length - 1; i++) {
    const n1 = pathNodes[i];
    const n2 = pathNodes[i + 1];
    totalDistance += calculateSegmentDistance(n1, n2);
  }

  const steps = generateEnhancedTurnByTurnSteps(pathNodes, profile);

  const baseWalkingSpeed = profile === 'accessible' ? 0.9 : profile === 'emergency' ? 1.8 : 1.15;
  const walkingTimeSeconds = Math.round(totalDistance / baseWalkingSpeed);
  const estimatedDurationSeconds = Math.max(15, walkingTimeSeconds);

  const buildingsInvolved = Array.from(new Set(pathNodes.map(n => n.buildingId)));

  const enrichedSteps = steps.map(s => ({
    ...s,
    instruction: s.instructionVi,
    action: s.maneuver.includes('left') ? 'turn-left' : s.maneuver.includes('right') ? 'turn-right' : s.maneuver === 'arrive' ? 'arrive' : 'straight',
    visualCue: s.toNode ? `Mốc đến: ${s.toNode.name}` : undefined
  }));

  return {
    pathNodes,
    totalDistance,
    estimatedDurationSeconds,
    estimatedTimeSeconds: estimatedDurationSeconds,
    steps: enrichedSteps,
    profile,
    buildingsInvolved,
    floorsInvolved: []
  };
}

export function findMultiStopRoute(
  startNodeId: string,
  stopNodeIds: string[],
  endNodeId?: string,
  profile: RoutingProfile = 'fastest'
): {
  orderedStops: MapNode[];
  combinedRoute: NavigationRoute;
  segmentRoutes: NavigationRoute[];
} | null {
  if (stopNodeIds.length === 0) {
    const direct = findRoute(startNodeId, endNodeId || startNodeId, profile);
    if (!direct) return null;
    return {
      orderedStops: [],
      combinedRoute: direct,
      segmentRoutes: [direct]
    };
  }

  const unvisited = [...stopNodeIds];
  const orderedNodeIds: string[] = [];
  let currentId = startNodeId;

  while (unvisited.length > 0) {
    let nearestIndex = -1;
    let shortestDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const candidateId = unvisited[i];
      const route = findRoute(currentId, candidateId, profile);
      if (route && route.totalDistance < shortestDist) {
        shortestDist = route.totalDistance;
        nearestIndex = i;
      }
    }

    if (nearestIndex === -1) nearestIndex = 0;

    const nextId = unvisited.splice(nearestIndex, 1)[0];
    orderedNodeIds.push(nextId);
    currentId = nextId;
  }

  if (endNodeId && endNodeId !== currentId) {
    orderedNodeIds.push(endNodeId);
  }

  const segmentRoutes: NavigationRoute[] = [];
  const fullPathNodes: MapNode[] = [];
  const fullSteps: NavigationStep[] = [];
  let combinedDistance = 0;
  let combinedDuration = 0;

  let prevStopId = startNodeId;
  let globalStepIndex = 1;

  for (let i = 0; i < orderedNodeIds.length; i++) {
    const nextStopId = orderedNodeIds[i];
    const segment = findRoute(prevStopId, nextStopId, profile);
    
    if (segment) {
      segmentRoutes.push(segment);
      combinedDistance += segment.totalDistance;
      combinedDuration += segment.estimatedDurationSeconds;

      segment.pathNodes.forEach((node, nIdx) => {
        if (nIdx === 0 && fullPathNodes.length > 0) return;
        fullPathNodes.push(node);
      });

      segment.steps.forEach(step => {
        fullSteps.push({
          ...step,
          stepIndex: globalStepIndex++
        });
      });
    }
    prevStopId = nextStopId;
  }

  const orderedStops = orderedNodeIds
    .map(id => MAP_NODES_DATA.find(n => n.id === id))
    .filter(Boolean) as MapNode[];

  const buildingsInvolved = Array.from(new Set(fullPathNodes.map(n => n.buildingId)));

  const combinedRoute: NavigationRoute = {
    pathNodes: fullPathNodes,
    totalDistance: combinedDistance,
    estimatedDurationSeconds: combinedDuration,
    steps: fullSteps,
    profile,
    buildingsInvolved,
    floorsInvolved: []
  };

  return {
    orderedStops,
    combinedRoute,
    segmentRoutes
  };
}

function generateEnhancedTurnByTurnSteps(
  path: MapNode[], 
  profile: RoutingProfile
): NavigationStep[] {
  if (path.length === 0) return [];
  if (path.length === 1) {
    const node = path[0];
    return [{
      stepIndex: 1,
      instructionVi: `Bạn đang ở tại ${node.name}`,
      instructionEn: `You are at ${node.nameEn}`,
      distance: 0,
      maneuver: 'arrive',
      fromNode: node,
      toNode: node,
      buildingId: node.buildingId,
    }];
  }

  const steps: NavigationStep[] = [];
  let stepIndex = 1;

  const startNode = path[0];
  const secondNode = path[1];
  const initialDist = calculateSegmentDistance(startNode, secondNode);
  const initialEdge = getEdgeBetween(startNode.id, secondNode.id);

  let startLandmark = '';
  if (profile === 'visually_impaired' && initialEdge?.audioLandmarkVi) {
    startLandmark = ` (${initialEdge.audioLandmarkVi})`;
  }

  steps.push({
    stepIndex: stepIndex++,
    instructionVi: `Bắt đầu từ ${startNode.name}, di chuyển về hướng ${secondNode.name}${startLandmark}`,
    instructionEn: `Start from ${startNode.nameEn}, head towards ${secondNode.nameEn}`,
    distance: initialDist,
    maneuver: 'start',
    fromNode: startNode,
    toNode: secondNode,
    buildingId: startNode.buildingId,
  });

  for (let i = 1; i < path.length - 1; i++) {
    const prev = path[i - 1];
    const curr = path[i];
    const next = path[i + 1];
    const dist = calculateSegmentDistance(curr, next);
    const edge = getEdgeBetween(curr.id, next.id);

    let landmarkExtra = '';
    if (profile === 'visually_impaired' && edge?.audioLandmarkVi) {
      landmarkExtra = ` • Điểm nhận biết: ${edge.audioLandmarkVi}`;
    }

    const v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
    const v2 = { x: next.x - curr.x, y: next.y - curr.y };

    const angle1 = Math.atan2(v1.y, v1.x);
    const angle2 = Math.atan2(v2.y, v2.x);
    let diff = (angle2 - angle1) * (180 / Math.PI);
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;

    let maneuver: NavigationStep['maneuver'] = 'straight';
    let viText = `Đi thẳng tiếp ${dist}m qua ${curr.name}`;
    let enText = `Continue straight for ${dist}m via ${curr.nameEn}`;

    if (diff > 35 && diff <= 70) {
      maneuver = 'turn_slight_right';
      viText = `Tại ${curr.name}, chếch nhẹ sang phải và đi ${dist}m tới ${next.name}`;
      enText = `At ${curr.nameEn}, bear right and walk ${dist}m to ${next.nameEn}`;
    } else if (diff > 70 && diff <= 120) {
      maneuver = 'turn_right';
      viText = `Tại ${curr.name}, rẽ phải và đi ${dist}m tới ${next.name}`;
      enText = `At ${curr.nameEn}, turn right and walk ${dist}m to ${next.nameEn}`;
    } else if (diff < -35 && diff >= -70) {
      maneuver = 'turn_slight_left';
      viText = `Tại ${curr.name}, chếch nhẹ sang trái và đi ${dist}m tới ${next.name}`;
      enText = `At ${curr.nameEn}, bear left and walk ${dist}m to ${next.nameEn}`;
    } else if (diff < -70 && diff >= -120) {
      maneuver = 'turn_left';
      viText = `Tại ${curr.name}, rẽ trái và đi ${dist}m tới ${next.name}`;
      enText = `At ${curr.nameEn}, turn left and walk ${dist}m to ${next.nameEn}`;
    } else if (diff > 120 || diff < -120) {
      maneuver = 'turn_right';
      viText = `Quay đầu / Chuyển hướng tại ${curr.name}, đi ${dist}m tới ${next.name}`;
      enText = `Make a turn at ${curr.nameEn}, walk ${dist}m to ${next.nameEn}`;
    }

    steps.push({
      stepIndex: stepIndex++,
      instructionVi: `${viText}${landmarkExtra}`,
      instructionEn: enText,
      distance: dist,
      maneuver,
      fromNode: curr,
      toNode: next,
      buildingId: curr.buildingId,
    });
  }

  const target = path[path.length - 1];
  const secondLast = path[path.length - 2];

  steps.push({
    stepIndex: stepIndex++,
    instructionVi: `Bạn đã đến nơi: cửa ${target.name} (Tòa ${target.buildingId})`,
    instructionEn: `You have arrived at your destination: ${target.nameEn} entrance (Building ${target.buildingId})`,
    distance: 0,
    maneuver: 'arrive',
    fromNode: secondLast || target,
    toNode: target,
    buildingId: target.buildingId,
  });

  return steps;
}

function getEdgeBetween(nodeId1: string, nodeId2: string): MapEdge | undefined {
  return MAP_EDGES_DATA.find(
    e => (e.fromNodeId === nodeId1 && e.toNodeId === nodeId2) || 
         (e.fromNodeId === nodeId2 && e.toNodeId === nodeId1)
  );
}

function calculateSegmentDistance(n1: MapNode, n2: MapNode): number {
  const edge = getEdgeBetween(n1.id, n2.id);
  if (edge) return edge.distance;
  const dx = (n1.x - n2.x) * 0.1;
  const dy = (n1.y - n2.y) * 0.1;
  return Math.max(3, Math.round(Math.sqrt(dx * dx + dy * dy)));
}
