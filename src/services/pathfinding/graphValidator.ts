import type { RouteNode, RouteEdge, GraphValidationResult } from '../../types';

/**
 * Kiểm tra tính hợp lệ và toàn vẹn của đồ thị điều hướng MedNav 108
 */
export function validateNavigationGraph(
  nodes: RouteNode[],
  edges: RouteEdge[]
): GraphValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Kiểm tra Node IDs duy nhất
  const nodeIds = new Set<string>();
  const qrCodes = new Set<string>();

  for (const node of nodes) {
    if (!node.id || node.id.trim() === '') {
      errors.push(`Phát hiện node thiếu ID.`);
      continue;
    }
    if (nodeIds.has(node.id)) {
      errors.push(`Trùng lặp Node ID: "${node.id}".`);
    }
    nodeIds.add(node.id);

    if (node.qrCode) {
      if (qrCodes.has(node.qrCode)) {
        errors.push(`Trùng lặp mã QR Checkpoint: "${node.qrCode}" tại node "${node.id}".`);
      }
      qrCodes.add(node.qrCode);
    }

    if (!node.name || node.name.trim() === '') {
      errors.push(`Node "${node.id}" thiếu tên hiển thị (name).`);
    }

    if (node.verificationStatus !== 'field_verified' && node.verificationStatus !== 'official_source') {
      warnings.push(`Node "${node.id}" chưa được khảo sát thực địa (status: ${node.verificationStatus}).`);
    }
  }

  // 2. Kiểm tra Edge IDs duy nhất & liên kết hợp lệ
  const edgeIds = new Set<string>();
  let verifiedEdgesCount = 0;

  for (const edge of edges) {
    if (!edge.id || edge.id.trim() === '') {
      errors.push(`Phát hiện edge thiếu ID.`);
      continue;
    }
    if (edgeIds.has(edge.id)) {
      errors.push(`Trùng lặp Edge ID: "${edge.id}".`);
    }
    edgeIds.add(edge.id);

    // Kiểm tra from/to tồn tại trong danh sách node
    if (!nodeIds.has(edge.from)) {
      errors.push(`Edge "${edge.id}" tham chiếu điểm đầu (from: "${edge.from}") không tồn tại.`);
    }
    if (!nodeIds.has(edge.to)) {
      errors.push(`Edge "${edge.id}" tham chiếu điểm đến (to: "${edge.to}") không tồn tại.`);
    }

    // Kiểm tra khoảng cách
    if (typeof edge.distanceMeters !== 'number' || edge.distanceMeters <= 0) {
      errors.push(`Edge "${edge.id}" có khoảng cách không hợp lệ (distanceMeters: ${edge.distanceMeters}m).`);
    }

    // Kiểm tra trạng thái xác minh
    if (!edge.verificationStatus) {
      errors.push(`Edge "${edge.id}" thiếu trường verificationStatus.`);
    } else if (edge.verificationStatus !== 'field_verified') {
      errors.push(`Edge "${edge.id}" có trạng thái "${edge.verificationStatus}", không được phép dùng trong đồ thị điều hướng chính.`);
    } else {
      verifiedEdgesCount++;
    }

    // Kiểm tra câu hướng dẫn
    if (!edge.instruction || edge.instruction.trim() === '') {
      errors.push(`Edge "${edge.id}" thiếu câu hướng dẫn di chuyển (instruction).`);
    }
    if (edge.bidirectional && (!edge.reverseInstruction || edge.reverseInstruction.trim() === '')) {
      warnings.push(`Edge hai chiều "${edge.id}" thiếu reverseInstruction (hướng dẫn chiều ngược lại).`);
    }
  }

  // 3. Kiểm tra destination nodes có được kết nối vào đồ thị không
  const destinationNodes = nodes.filter(n => n.type === 'destination');
  let destinationsConnected = 0;

  for (const dest of destinationNodes) {
    const isConnected = edges.some(
      e => (e.from === dest.id || (e.bidirectional && e.to === dest.id) || e.to === dest.id) &&
           e.verificationStatus === 'field_verified' &&
           e.status === 'open'
    );
    if (isConnected) {
      destinationsConnected++;
    } else {
      errors.push(`Điểm đến (destination) "${dest.name}" (${dest.id}) bị cô lập, không có cạnh nào nối tới.`);
    }
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    stats: {
      totalNodes: nodes.length,
      verifiedNodes: nodes.filter(n => n.verificationStatus === 'field_verified').length,
      totalEdges: edges.length,
      verifiedEdges: verifiedEdgesCount,
      destinationsConnected
    }
  };
}
