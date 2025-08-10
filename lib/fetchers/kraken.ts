import { KrakenTickerSchema } from '../types';

export interface KrakenTickerData {
  priceUsd: number;
  change24hPct: number;
  volume24hUsd: number;
}

export async function fetchKrakenTicker(krakenPair: string): Promise<KrakenTickerData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const url = `https://api.kraken.com/0/public/Ticker?pair=${encodeURIComponent(krakenPair)}`;
    
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
      throw new Error(`Kraken API error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    
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

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Kraken API request timeout');
      }
      throw error;
    }
    throw new Error('Unknown Kraken API error');
  } finally {
    clearTimeout(timeoutId);
  }
}
