import { TokenRow } from './types';
import Big from 'big.js';

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

  // Ensure price is positive and within safe range
  if (priceUsd <= 0 || priceUsd > 1000000) {
    return null;
  }

  // Ensure volume is non-negative and within safe range
  if (volume24hUsd < 0 || volume24hUsd > 1e15) {
    return null;
  }

  // Ensure percentage change is within reasonable bounds
  if (change24hPct < -100 || change24hPct > 10000) {
    return null;
  }

  try {
    // Use big.js for precise decimal arithmetic
    const priceBig = new Big(priceUsd);
    const changeBig = new Big(change24hPct);
    const volumeBig = new Big(volume24hUsd);

    // Normalize to 2 decimal places with proper rounding
    const normalizedPrice = priceBig.round(2).toNumber();
    const normalizedChange = changeBig.round(2).toNumber();
    const normalizedVolume = volumeBig.round(2).toNumber();

    return {
      symbol: symbol.toUpperCase().trim(),
      name: name.trim(),
      priceUsd: normalizedPrice,
      change24hPct: normalizedChange,
      volume24hUsd: normalizedVolume,
      source,
    };
  } catch (error) {
    console.warn('Error normalizing token data:', error);
    return null;
  }
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
