import { BuildingId, FloorId, MapEdge, MapNode, PDRPositionState, PDRSensorReading, QRCheckpoint } from '../types';
import { MAP_EDGES_DATA, MAP_NODES_DATA } from '../data/hospitalData';

// Map Coordinate conversion factors
// 1000px X * 800px Y space covers approx 100m x 80m indoor floorplan
// => 10 units = 1 meter, 1 meter = 10 units
const PIXELS_PER_METER = 10;
const STEP_LENGTH_METERS = 0.65; // Average human indoor step length (0.65m = ~6.5 units)

/**
 * Step Detection from 3-axis Accelerometer data
 * Analyzes magnitude peak over dynamic threshold and gravity filter
 */
export class StepDetector {
  private lastAccelMag: number = 9.81;
  private peakThreshold: number = 1.35; // G-force variation threshold
  private minStepIntervalMs: number = 280; // Minimum time between human steps
  private lastStepTimestamp: number = 0;

  public processSample(accelX: number, accelY: number, accelZ: number, timestamp: number): boolean {
    const magnitude = Math.sqrt(accelX * accelX + accelY * accelY + accelZ * accelZ);
    const delta = Math.abs(magnitude - 9.81);

    let isStep = false;
    if (delta > this.peakThreshold && (timestamp - this.lastStepTimestamp) > this.minStepIntervalMs) {
      isStep = true;
      this.lastStepTimestamp = timestamp;
    }
    this.lastAccelMag = magnitude;
    return isStep;
  }
}

/**
 * Map Matching Algorithm
 * Projects raw estimated PDR coordinate (x,y) onto the nearest valid corridor edge in the hospital graph
 * Prevents user avatar from "walking through walls"
 */
export function matchPositionToGraph(
  rawX: number,
  rawY: number,
  buildingId: BuildingId,
  floorId: FloorId
): { matchedX: number; matchedY: number; nearestEdge: MapEdge | null; nearestNodeId: string | null; driftMeters: number } {
  // Get all valid edges for this specific building and floor
  const floorEdges = MAP_EDGES_DATA.filter(edge => {
    const fromNode = MAP_NODES_DATA.find(n => n.id === edge.fromNodeId);
    const toNode = MAP_NODES_DATA.find(n => n.id === edge.toNodeId);
    return fromNode && toNode && fromNode.buildingId === buildingId && fromNode.floorId === floorId && toNode.floorId === floorId;
  });

  let closestPoint = { x: rawX, y: rawY };
  let minDistanceSq = Infinity;
  let nearestEdge: MapEdge | null = null;
  let nearestNodeId: string | null = null;

  for (const edge of floorEdges) {
    const p1 = MAP_NODES_DATA.find(n => n.id === edge.fromNodeId);
    const p2 = MAP_NODES_DATA.find(n => n.id === edge.toNodeId);
    if (!p1 || !p2) continue;

    // Project point (rawX, rawY) onto line segment (p1.x, p1.y) -> (p2.x, p2.y)
    const projected = projectPointOnSegment(rawX, rawY, p1.x, p1.y, p2.x, p2.y);
    const distSq = (rawX - projected.x) * (rawX - projected.x) + (rawY - projected.y) * (rawY - projected.y);

    if (distSq < minDistanceSq) {
      minDistanceSq = distSq;
      closestPoint = projected;
      nearestEdge = edge;
      
      // Determine if closer to p1 or p2
      const d1 = (closestPoint.x - p1.x) ** 2 + (closestPoint.y - p1.y) ** 2;
      const d2 = (closestPoint.x - p2.x) ** 2 + (closestPoint.y - p2.y) ** 2;
      nearestNodeId = d1 < d2 ? p1.id : p2.id;
    }
  }

  // If no edges found on this floor, snap to nearest node
  if (!nearestEdge) {
    const floorNodes = MAP_NODES_DATA.filter(n => n.buildingId === buildingId && n.floorId === floorId);
    let minNodeDistSq = Infinity;
    for (const node of floorNodes) {
      const dSq = (rawX - node.x) ** 2 + (rawY - node.y) ** 2;
      if (dSq < minNodeDistSq) {
        minNodeDistSq = dSq;
        closestPoint = { x: node.x, y: node.y };
        nearestNodeId = node.id;
      }
    }
  }

  const driftMeters = Math.sqrt(minDistanceSq) / PIXELS_PER_METER;

  return {
    matchedX: Math.round(closestPoint.x),
    matchedY: Math.round(closestPoint.y),
    nearestEdge,
    nearestNodeId,
    driftMeters: parseFloat(driftMeters.toFixed(2))
  };
}

/**
 * Geometric projection of point (px, py) onto line segment (x1, y1) - (x2, y2)
 */
function projectPointOnSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): { x: number; y: number } {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) return { x: x1, y: y1 };

  // Calculate projection factor t clamped to [0, 1]
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
  return {
    x: x1 + t * dx,
    y: y1 + t * dy
  };
}

/**
 * PDR Core Engine State Manager
 */
export class PDREngine {
  private state: PDRPositionState;
  private stepDetector: StepDetector;

  constructor(initialNode: MapNode) {
    this.stepDetector = new StepDetector();
    this.state = {
      rawPdrX: initialNode.x,
      rawPdrY: initialNode.y,
      matchedX: initialNode.x,
      matchedY: initialNode.y,
      currentFloorId: initialNode.floorId,
      currentBuildingId: initialNode.buildingId,
      nearestEdge: null,
      nearestNodeId: initialNode.id,
      confidence: 1.0,
      driftMeters: 0,
      stepCount: 0,
      lastQrCheckpointId: initialNode.kioskCode || null,
      lastQrTimestamp: Date.now(),
      isMapMatched: true
    };
  }

  public getState(): PDRPositionState {
    return { ...this.state };
  }

  /**
   * Reset position when scanning Checkpoint QR (Zero Drift)
   */
  public resetWithQRCheckpoint(node: MapNode): PDRPositionState {
    this.state = {
      ...this.state,
      rawPdrX: node.x,
      rawPdrY: node.y,
      matchedX: node.x,
      matchedY: node.y,
      currentBuildingId: node.buildingId,
      currentFloorId: node.floorId,
      nearestNodeId: node.id,
      driftMeters: 0, // Reset drift to 0
      confidence: 1.0, // 100% confidence
      lastQrCheckpointId: node.kioskCode || `QR_${node.id}`,
      lastQrTimestamp: Date.now(),
      isMapMatched: true
    };
    return this.getState();
  }

  /**
   * Step integration (PDR Dead Reckoning)
   * headingDeg: 0 = North/Up (-y), 90 = East/Right (+x), 180 = South/Down (+y), 270 = West/Left (-x)
   */
  public step(headingDeg: number, customStepLength: number = STEP_LENGTH_METERS): PDRPositionState {
    const rad = (headingDeg - 90) * (Math.PI / 180);
    const stepPixelDist = customStepLength * PIXELS_PER_METER;

    const deltaX = Math.cos(rad) * stepPixelDist;
    const deltaY = Math.sin(rad) * stepPixelDist;

    const newRawX = Math.max(20, Math.min(980, this.state.rawPdrX + deltaX));
    const newRawY = Math.max(20, Math.min(780, this.state.rawPdrY + deltaY));

    // Map Matching
    const matched = matchPositionToGraph(
      newRawX,
      newRawY,
      this.state.currentBuildingId,
      this.state.currentFloorId
    );

    // Dynamic confidence decays with steps since last QR, restored by low drift
    const stepsSinceQR = this.state.stepCount + 1;
    const baseConfidence = Math.max(0.4, 1.0 - (stepsSinceQR * 0.012));
    const matchBonus = matched.driftMeters < 3 ? 0.2 : 0;
    const confidence = Math.min(1.0, baseConfidence + matchBonus);

    this.state = {
      ...this.state,
      rawPdrX: newRawX,
      rawPdrY: newRawY,
      matchedX: matched.matchedX,
      matchedY: matched.matchedY,
      nearestEdge: matched.nearestEdge,
      nearestNodeId: matched.nearestNodeId,
      driftMeters: matched.driftMeters,
      stepCount: stepsSinceQR,
      confidence: parseFloat(confidence.toFixed(2)),
      isMapMatched: true
    };

    return this.getState();
  }

  /**
   * Manual teleport/change floor
   */
  public setFloor(buildingId: BuildingId, floorId: FloorId, x?: number, y?: number) {
    const targetX = x ?? this.state.matchedX;
    const targetY = y ?? this.state.matchedY;
    const matched = matchPositionToGraph(targetX, targetY, buildingId, floorId);

    this.state = {
      ...this.state,
      rawPdrX: matched.matchedX,
      rawPdrY: matched.matchedY,
      matchedX: matched.matchedX,
      matchedY: matched.matchedY,
      currentBuildingId: buildingId,
      currentFloorId: floorId,
      nearestEdge: matched.nearestEdge,
      nearestNodeId: matched.nearestNodeId,
      driftMeters: 0
    };
  }
}
