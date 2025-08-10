import { describe, it, expect } from 'vitest';
import { normalizeTokenData, formatUsd, formatPercentage, getChangeColorClass } from '@/lib/normalize';

describe('normalizeTokenData', () => {
  it('should normalize valid token data', () => {
    const result = normalizeTokenData('AAPL', 'Apple Inc.', 150.25, 2.5, 1000000, 'kraken');
    
    expect(result).toEqual({
      symbol: 'AAPL',
      name: 'Apple Inc.',
      priceUsd: 150.25,
      change24hPct: 2.5,
      volume24hUsd: 1000000,
      source: 'kraken'
    });
  });

  it('should handle invalid price', () => {
    const result = normalizeTokenData('AAPL', 'Apple Inc.', -10, 2.5, 1000000, 'kraken');
    expect(result).toBeNull();
  });

  it('should handle invalid volume', () => {
    const result = normalizeTokenData('AAPL', 'Apple Inc.', 150.25, 2.5, -1000000, 'kraken');
    expect(result).toBeNull();
  });

  it('should handle extreme percentage changes', () => {
    const result = normalizeTokenData('AAPL', 'Apple Inc.', 150.25, 15000, 1000000, 'kraken');
    expect(result).toBeNull();
  });

  it('should normalize symbol to uppercase', () => {
    const result = normalizeTokenData('aapl', 'Apple Inc.', 150.25, 2.5, 1000000, 'kraken');
    expect(result?.symbol).toBe('AAPL');
  });

  it('should trim name whitespace', () => {
    const result = normalizeTokenData('AAPL', '  Apple Inc.  ', 150.25, 2.5, 1000000, 'kraken');
    expect(result?.name).toBe('Apple Inc.');
  });
});

describe('formatUsd', () => {
  it('should format small numbers', () => {
    expect(formatUsd(123.45)).toBe('$123.45');
  });

  it('should format thousands', () => {
    expect(formatUsd(1234.56)).toBe('$1.23K');
  });

  it('should format millions', () => {
    expect(formatUsd(1234567.89)).toBe('$1.23M');
  });

  it('should format billions', () => {
    expect(formatUsd(1234567890.12)).toBe('$1.23B');
  });

  it('should handle invalid values', () => {
    expect(formatUsd(-100)).toBe('—');
    expect(formatUsd(NaN)).toBe('—');
    expect(formatUsd(Infinity)).toBe('—');
  });
});

describe('formatPercentage', () => {
  it('should format positive percentages', () => {
    expect(formatPercentage(2.5)).toBe('+2.50%');
  });

  it('should format negative percentages', () => {
    expect(formatPercentage(-2.5)).toBe('-2.50%');
  });

  it('should format zero', () => {
    expect(formatPercentage(0)).toBe('+0.00%');
  });

  it('should handle invalid values', () => {
    expect(formatPercentage(NaN)).toBe('—');
    expect(formatPercentage(Infinity)).toBe('—');
  });
});

describe('getChangeColorClass', () => {
  it('should return green for positive changes', () => {
    expect(getChangeColorClass(2.5)).toBe('text-green-600');
  });

  it('should return red for negative changes', () => {
    expect(getChangeColorClass(-2.5)).toBe('text-red-600');
  });

  it('should return gray for zero', () => {
    expect(getChangeColorClass(0)).toBe('text-gray-500');
  });

  it('should handle invalid values', () => {
    expect(getChangeColorClass(NaN)).toBe('text-gray-500');
    expect(getChangeColorClass(Infinity)).toBe('text-gray-500');
  });
});
