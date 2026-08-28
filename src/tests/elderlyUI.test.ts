import { describe, it, expect } from 'vitest';
import { VoiceSearchController, isSpeechRecognitionSupported } from '../utils/voiceRecognition';
import { MAP_NODES_DATA, BACH_MAI_GATES } from '../data/hospitalData';
import { BACH_MAI_QR_CHECKPOINTS, findQRCheckpointByCode } from '../data/bachMai/checkpoints';
import { findRoute } from '../utils/pathfinding';

describe('Elderly-Friendly UI & UX Validation Tests', () => {
  it('VoiceSearchController initializes gracefully with fallback when SpeechRecognition is not in environment', () => {
    const controller = new VoiceSearchController();
    expect(controller).toBeDefined();
    expect(typeof isSpeechRecognitionSupported()).toBe('boolean');
  });

  it('All 4 gates can route cleanly to popular destinations (K1, K2, A9, A10, K3, Q)', () => {
    const gates = ['node_gate_1', 'node_gate_2', 'node_gate_3', 'node_gate_4'];
    const destinations = [
      'node_k1_reception', 
      'node_k2_entrance', 
      'node_a9_emergency_entrance', 
      'node_a10_stroke_entrance', 
      'node_k3_poison_entrance',
      'node_q_21story_entrance'
    ];

    for (const gateId of gates) {
      for (const destId of destinations) {
        const route = findRoute(gateId, destId, 'fastest');
        expect(route).not.toBeNull();
        expect(route!.steps.length).toBeGreaterThan(0);
        expect(route!.totalDistance).toBeGreaterThan(0);
        // Each step must have human-friendly instruction
        for (const step of route!.steps) {
          expect(step.instruction.length).toBeGreaterThan(3);
        }
      }
    }
  });

  it('No fake simulated locations in QR checkpoints list', () => {
    for (const cp of BACH_MAI_QR_CHECKPOINTS) {
      expect(cp.code).toBeDefined();
      expect(cp.nodeId).toBeDefined();
      const node = MAP_NODES_DATA.find(n => n.id === cp.nodeId);
      expect(node).toBeDefined();
    }
  });

  it('findQRCheckpointByCode resolves uppercase, lowercase and fuzzy aliases', () => {
    const cpK1 = findQRCheckpointByCode('cp-k1');
    expect(cpK1).toBeDefined();
    expect(cpK1?.title).toContain('K1');

    const cpGate4 = findQRCheckpointByCode('cổng 4');
    expect(cpGate4).toBeDefined();
    expect(cpGate4?.nodeId).toBe('node_gate_4');
  });
});
