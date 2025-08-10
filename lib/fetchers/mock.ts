import { TokenConfig } from '../types';

export interface MockTickerData {
  priceUsd: number;
  change24hPct: number;
  volume24hUsd: number;
}

/**
 * Generate realistic mock data for development
 */
export function generateMockData(symbol: string): MockTickerData {
  // Seed-based random generation for consistent results
  const seed = symbol.charCodeAt(0) + symbol.charCodeAt(1) + symbol.charCodeAt(2);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };

  // Base prices for different stock ranges
  const basePrices: { [key: string]: number } = {
    'AAPL': 150, 'MSFT': 300, 'AMZN': 130, 'GOOG': 140, 'META': 250,
    'TSLA': 200, 'NFLX': 400, 'NVDA': 800, 'BABA': 80, 'ORCL': 120
  };

  const basePrice = basePrices[symbol] || 100;
  const priceVariation = random(-0.1, 0.1); // ±10% variation
  const priceUsd = basePrice * (1 + priceVariation);
  
  const change24hPct = random(-5, 5); // ±5% daily change
  const volume24hUsd = random(1000000, 10000000); // 1M to 10M volume

  return {
    priceUsd: Math.round(priceUsd * 100) / 100,
    change24hPct: Math.round(change24hPct * 100) / 100,
    volume24hUsd: Math.round(volume24hUsd * 100) / 100,
  };
}

/**
 * Fetch mock ticker data for a token
 */
export async function fetchMockTicker(token: TokenConfig): Promise<MockTickerData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50));
  
  return generateMockData(token.symbol);
}
