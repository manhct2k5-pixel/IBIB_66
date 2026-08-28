import type { Hospital108Checkpoint } from '../../types';

export const QR_CHECKPOINT_FEATURE_ENABLED = false;

export const HOSPITAL_108_CHECKPOINTS: Hospital108Checkpoint[] = [];

export function lookupCheckpointByCode(inputCode: string): Hospital108Checkpoint | null {
  if (!QR_CHECKPOINT_FEATURE_ENABLED) return null;
  const normalized = inputCode.trim().toUpperCase();
  return HOSPITAL_108_CHECKPOINTS.find(c => c.code.toUpperCase() === normalized) || null;
}
