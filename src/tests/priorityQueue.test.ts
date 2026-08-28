import { describe, it, expect } from 'vitest';
import { PriorityQueue } from '../services/pathfinding/priorityQueue';

describe('PriorityQueue (Min-Heap)', () => {
  it('should dequeue elements in ascending order of priority', () => {
    const pq = new PriorityQueue<string>();
    pq.enqueue('item3', 30);
    pq.enqueue('item1', 10);
    pq.enqueue('item4', 40);
    pq.enqueue('item2', 20);

    expect(pq.size).toBe(4);
    expect(pq.dequeue()).toBe('item1');
    expect(pq.dequeue()).toBe('item2');
    expect(pq.dequeue()).toBe('item3');
    expect(pq.dequeue()).toBe('item4');
    expect(pq.isEmpty()).toBe(true);
  });

  it('should return undefined when dequeueing from empty queue', () => {
    const pq = new PriorityQueue<number>();
    expect(pq.dequeue()).toBeUndefined();
    expect(pq.peek()).toBeUndefined();
  });

  it('should peek the smallest element without removing it', () => {
    const pq = new PriorityQueue<string>();
    pq.enqueue('b', 5);
    pq.enqueue('a', 1);

    expect(pq.peek()).toBe('a');
    expect(pq.size).toBe(2);
  });
});
