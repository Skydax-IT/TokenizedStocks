import { KrakenTickerSchema } from '../types';
import { krakenFetch } from './enhanced';

export interface KrakenTickerData {
  priceUsd: number;
  change24hPct: number;
  volume24hUsd: number;
}

export async function fetchKrakenTicker(pair: string): Promise<KrakenTickerData> {
  const url = `https://api.kraken.com/0/public/Ticker?pair=${encodeURIComponent(pair)}`;
  
  const json = await krakenFetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-store',
    },
    next: { revalidate: 0 },
  });
  
  // Validate response with Zod
  const validated = KrakenTickerSchema.parse(json);
  
  if (validated.error && validated.error.length > 0) {
    throw new Error(`Kraken API error: ${validated.error.join(', ')}`);
  }

  if (!validated.result) {
    throw new Error('No Kraken result data');
  }

  const resultKeys = Object.keys(validated.result);
  if (resultKeys.length === 0) {
    throw new Error('Empty Kraken result');
  }

  const firstKey = resultKeys[0];
  const ticker = validated.result[firstKey];

  // Extract and validate data with proper typing
  const lastPrice = parseFloat(ticker.c[0]);
  const openingPrice = parseFloat(ticker.o);
  const volume24h = parseFloat(ticker.v[1]);

  if (!isFinite(lastPrice) || lastPrice <= 0) {
    throw new Error('Invalid Kraken price data');
  }

  if (!isFinite(openingPrice) || openingPrice <= 0) {
    throw new Error('Invalid Kraken opening price data');
  }

  if (!isFinite(volume24h) || volume24h < 0) {
    throw new Error('Invalid Kraken volume data');
  }

  // Calculate 24h change percentage
  const change24hPct = ((lastPrice - openingPrice) / openingPrice) * 100;
  
  // Calculate USD volume (volume * price)
  const volume24hUsd = volume24h * lastPrice;

  return {
    priceUsd: lastPrice,
    change24hPct,
    volume24hUsd,
  };
}
