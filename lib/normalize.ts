import { TokenRow } from './types';

/**
 * Normalize token data to ensure consistent format and validation
 */
export function normalizeTokenData(
  symbol: string,
  name: string,
  priceUsd: number,
  change24hPct: number,
  volume24hUsd: number,
  source: 'kraken' | 'coingecko'
): TokenRow | null {
  // Validate required fields
  if (!symbol || !name || !isFinite(priceUsd) || !isFinite(change24hPct) || !isFinite(volume24hUsd)) {
    return null;
  }

  // Ensure price is positive
  if (priceUsd <= 0) {
    return null;
  }

  // Ensure volume is non-negative
  if (volume24hUsd < 0) {
    return null;
  }

  // Normalize percentage to 2 decimal places
  const normalizedChange24hPct = Math.round(change24hPct * 100) / 100;
  
  // Normalize volume to 2 decimal places
  const normalizedVolume24hUsd = Math.round(volume24hUsd * 100) / 100;

  return {
    symbol: symbol.toUpperCase(),
    name: name.trim(),
    priceUsd: Math.round(priceUsd * 100) / 100, // Round to 2 decimal places
    change24hPct: normalizedChange24hPct,
    volume24hUsd: normalizedVolume24hUsd,
    source,
  };
}

/**
 * Format USD values for display
 */
export function formatUsd(value: number): string {
  if (!isFinite(value) || value < 0) return '—';
  
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  } else {
    return `$${value.toFixed(2)}`;
  }
}

/**
 * Format percentage values for display
 */
export function formatPercentage(value: number): string {
  if (!isFinite(value)) return '—';
  
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Get CSS class for price change styling
 */
export function getChangeColorClass(change24hPct: number): string {
  if (!isFinite(change24hPct)) return 'text-gray-500';
  
  if (change24hPct > 0) return 'text-green-600';
  if (change24hPct < 0) return 'text-red-600';
  return 'text-gray-500';
}
