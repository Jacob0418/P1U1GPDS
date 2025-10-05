import { formatTemperature } from './formatData';

describe('formatTemperature', () => {
  it('formats temperature correctly', () => {
    expect(formatTemperature(25.5)).toBe('25.5°C');
  });
});