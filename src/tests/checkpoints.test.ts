import { describe, it, expect } from 'vitest';
import { lookupCheckpointByQr, QR_PREFIX } from '../data/hospital108/navigation/checkpoints';

describe('QR Checkpoint Lookup', () => {
  it('should lookup checkpoint by full QR payload with prefix', () => {
    const node = lookupCheckpointByQr(`${QR_PREFIX}node_gate_01`);
    expect(node).not.toBeNull();
    expect(node?.id).toBe('node_gate_01');
    expect(node?.name).toBe('Cổng chính số 1 Trần Hưng Đạo');
  });

  it('should lookup checkpoint by raw node id without prefix', () => {
    const node = lookupCheckpointByQr('node_c1_1_a_desk');
    expect(node).not.toBeNull();
    expect(node?.id).toBe('node_c1_1_a_desk');
    expect(node?.name).toContain('C1.1-A');
  });

  it('should return null for non-existent or fake QR codes', () => {
    expect(lookupCheckpointByQr('MEDNAV108:checkpoint:fake_node_123')).toBeNull();
    expect(lookupCheckpointByQr('random_unrelated_qr')).toBeNull();
    expect(lookupCheckpointByQr('')).toBeNull();
  });
});
