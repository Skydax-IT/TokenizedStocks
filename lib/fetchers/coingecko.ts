import { CoinGeckoSimplePriceSchema } from '../types';
import { coingeckoFetch } from './enhanced';

export interface CoinGeckoTickerData {
  priceUsd: number;
  change24hPct: number;
  volume24hUsd: number;
}

export async function fetchCoinGeckoTicker(coingeckoId: string): Promise<CoinGeckoTickerData> {
  // Add a small delay to avoid rate limiting
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(coingeckoId)}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;
  
  const json = await coingeckoFetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-store',
    },
    next: { revalidate: 0 },
  });
  
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
}
