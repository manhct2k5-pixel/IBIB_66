import { describe, it, expect } from 'vitest';
import { calculateEdgeCost } from '../services/pathfinding/routeCost';
import type { RouteEdge } from '../types';

describe('calculateEdgeCost', () => {
  const baseEdge: RouteEdge = {
    id: 'edge_test',
    from: 'node_1',
    to: 'node_2',
    distanceMeters: 20,
    bidirectional: true,
    pathType: 'indoor_hallway',
    accessibility: {
      wheelchair: true,
      elderlyFriendly: true
    },
    status: 'open',
    instruction: 'Đi thẳng',
    verificationStatus: 'field_verified'
  };

  it('should return base distance for shortest_walk profile on open verified edge', () => {
    const cost = calculateEdgeCost(baseEdge, 'shortest_walk');
    expect(cost).toBe(20);
  });

  it('should return Infinity for closed edge', () => {
    const closedEdge: RouteEdge = { ...baseEdge, status: 'temporarily_closed' };
    expect(calculateEdgeCost(closedEdge, 'shortest_walk')).toBe(Infinity);
  });

  it('should return Infinity for unverified edge', () => {
    const unverifiedEdge: RouteEdge = { ...baseEdge, verificationStatus: 'unverified' };
    expect(calculateEdgeCost(unverifiedEdge, 'shortest_walk')).toBe(Infinity);
  });

  it('should return Infinity for stairs when using wheelchair_accessible profile', () => {
    const stairsEdge: RouteEdge = {
      ...baseEdge,
      pathType: 'stairs',
      accessibility: { wheelchair: false, elderlyFriendly: false }
    };
    expect(calculateEdgeCost(stairsEdge, 'wheelchair_accessible')).toBe(Infinity);
  });

  it('should apply penalty multiplier for stairs when using elderly_friendly profile', () => {
    const stairsEdge: RouteEdge = {
      ...baseEdge,
      pathType: 'stairs',
      accessibility: { wheelchair: false, elderlyFriendly: false }
    };
    const cost = calculateEdgeCost(stairsEdge, 'elderly_friendly');
    expect(cost).toBeGreaterThan(20);
    expect(cost).toBe(20 * 3.5);
  });
});
