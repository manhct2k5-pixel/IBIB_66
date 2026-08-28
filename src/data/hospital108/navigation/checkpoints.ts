import { HOSPITAL_108_ROUTE_NODES } from './nodes';
import type { RouteNode } from '../../../types';

/**
 * Feature flag kích hoạt tính năng quét QR Checkpoint
 * Đặt mặc định true để người dùng và nhân viên có thể sử dụng khi có tem mã QR
 */
export const QR_CHECKPOINT_FEATURE_ENABLED = true;

export const QR_PREFIX = 'MEDNAV108:checkpoint:';

/**
 * Danh sách checkpoint có mã QR đã xác minh
 */
export const HOSPITAL_108_CHECKPOINTS = HOSPITAL_108_ROUTE_NODES.filter(
  node => node.qrCode && node.verificationStatus === 'field_verified'
);

/**
 * Tìm checkpoint theo mã quét QR (ví dụ: "MEDNAV108:checkpoint:node_gate_01" hoặc "node_gate_01")
 */
export function lookupCheckpointByQr(qrPayload: string): RouteNode | null {
  if (!QR_CHECKPOINT_FEATURE_ENABLED) return null;
  if (!qrPayload) return null;

  let rawNodeId = qrPayload.trim();
  if (rawNodeId.startsWith(QR_PREFIX)) {
    rawNodeId = rawNodeId.substring(QR_PREFIX.length);
  }

  const foundNode = HOSPITAL_108_ROUTE_NODES.find(
    n => n.id === rawNodeId || n.qrCode === qrPayload.trim()
  );

  if (foundNode && foundNode.verificationStatus === 'field_verified') {
    return foundNode;
  }
  return null;
}

export const lookupCheckpointByCode = lookupCheckpointByQr;

