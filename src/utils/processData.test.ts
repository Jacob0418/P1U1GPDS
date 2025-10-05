import { calculateAverage } from './processData';
import { describe, it, expect } from 'vitest';

describe('calculateAverage', () => {
  it('calculates the average of an array of numbers', () => {
    const data = [10, 20, 30];
    expect(calculateAverage(data)).toBe(20);
  });

  it('returns 0 for an empty array', () => {
    expect(calculateAverage([])).toBe(0);
  });
});