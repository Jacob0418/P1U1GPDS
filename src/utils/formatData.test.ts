import { formatTemperature } from './formatData';
import { describe, it, expect } from 'vitest';

describe('formatTemperature', () => {
  it('formats temperature correctly', () => {
    expect(formatTemperature(25.5)).toBe('25.5°C');
  });
});