import type { RouteNode, RouteEdge, NavigationStep } from '../../types';

/**
 * Suy luận loại hành động (actionType) dựa trên thông tin node và câu hướng dẫn
 */
function inferActionType(
  fromNode: RouteNode,
  toNode: RouteNode,
  edge: RouteEdge
): NavigationStep['actionType'] {
  if (toNode.type === 'destination') {
    return 'arrive';
  }
  if (toNode.type === 'building_entrance') {
    return 'enter_building';
  }
  if (edge.pathType === 'elevator' || toNode.type === 'elevator') {
    return 'take_elevator';
  }

  const instructionLower = (edge.instruction || '').toLowerCase();
  if (instructionLower.includes('rẽ trái') || instructionLower.includes('quẹo trái') || instructionLower.includes('bên trái')) {
    return 'turn_left';
  }
  if (instructionLower.includes('rẽ phải') || instructionLower.includes('quẹo phải') || instructionLower.includes('bên phải')) {
    return 'turn_right';
  }

  return 'go_straight';
}

/**
 * Sinh danh sách NavigationStep từ kết quả tìm đường
 */
export function generateNavigationSteps(
  pathNodeIds: string[],
  edges: RouteEdge[],
  nodes: RouteNode[]
): NavigationStep[] {
  if (pathNodeIds.length <= 1) {
    return [];
  }

  const nodeMap = new Map<string, RouteNode>();
  for (const n of nodes) {
    nodeMap.set(n.id, n);
  }

  const steps: NavigationStep[] = [];

  for (let i = 0; i < pathNodeIds.length - 1; i++) {
    const fromId = pathNodeIds[i];
    const toId = pathNodeIds[i + 1];

    const fromNode = nodeMap.get(fromId);
    const toNode = nodeMap.get(toId);
    const edge = edges[i];

    if (!fromNode || !toNode || !edge) continue;

    const stepNumber = i + 1;
    const totalSteps = pathNodeIds.length - 1;

    // Lấy câu hướng dẫn đúng chiều
    let rawInstruction = edge.instruction;
    if (edge.from !== fromId && edge.reverseInstruction) {
      rawInstruction = edge.reverseInstruction;
    }

    const actionType = inferActionType(fromNode, toNode, edge);

    const step: NavigationStep = {
      id: `step_${fromId}_to_${toId}`,
      fromNodeId: fromId,
      toNodeId: toId,
      title: `Bước ${stepNumber}/${totalSteps}: Đến ${toNode.shortName || toNode.name}`,
      instruction: rawInstruction,
      landmark: toNode.landmarkDescription || toNode.visualInstruction || `Điểm mốc: ${toNode.name}`,
      buildingId: toNode.buildingId,
      floorId: toNode.floorId,
      distanceMeters: edge.distanceMeters,
      checkpointCode: toNode.qrCode,
      verificationStatus: 'field_verified',
      actionType
    };

    steps.push(step);
  }

  return steps;
}
