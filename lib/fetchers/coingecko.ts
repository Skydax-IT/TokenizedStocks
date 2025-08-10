import { CoinGeckoSimplePriceSchema } from '../types';

export interface CoinGeckoTickerData {
  priceUsd: number;
  change24hPct: number;
  volume24hUsd: number;
}

export async function fetchCoinGeckoTicker(coingeckoId: string): Promise<CoinGeckoTickerData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(coingeckoId)}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-store',
      },
      signal: controller.signal,
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('CoinGecko API rate limit exceeded. Please try again later.');
      }
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    
    // Validate response with Zod
    const validated = CoinGeckoSimplePriceSchema.parse(json);
    
    const coinData = validated[coingeckoId];
    if (!coinData) {
      throw new Error(`CoinGecko data not found for ${coingeckoId}`);
    }

    // Extract and validate data
    const { usd: priceUsd, usd_24h_change: change24hPct, usd_24h_vol: volume24hUsd } = coinData;

    if (typeof priceUsd !== 'number' || !isFinite(priceUsd) || priceUsd <= 0) {
      throw new Error('Invalid CoinGecko price data');
    }

    // Handle nullable fields
    const normalizedChange24hPct = change24hPct !== null && isFinite(change24hPct) ? change24hPct : 0;
    const normalizedVolume24hUsd = volume24hUsd !== null && isFinite(volume24hUsd) ? volume24hUsd : 0;

    return {
      priceUsd,
      change24hPct: normalizedChange24hPct,
      volume24hUsd: normalizedVolume24hUsd,
    };

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('CoinGecko API request timeout');
      }
      throw error;
    }
    throw new Error('Unknown CoinGecko API error');
  } finally {
    clearTimeout(timeoutId);
  }
}
