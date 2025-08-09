import { NextResponse } from 'next/server';
import { TOKENS, type TokenConfig } from '@/lib/tokens';

export const dynamic = 'force-dynamic';

type TokenQuote = {
  symbol: string;
  name: string;
  priceUsd: number | null;
  change24hPct: number | null;
  volume24hUsd: number | null;
  source: 'kraken' | 'coingecko' | 'unavailable';
  affiliateUrl: string;
};

// Kraken public Ticker endpoint: https://api.kraken.com/0/public/Ticker?pair=PAIR
async function fetchFromKraken(pair: string) {
  const url = `https://api.kraken.com/0/public/Ticker?pair=${encodeURIComponent(pair)}`;
  const res = await fetch(url, { cache: 'no-store', next: { revalidate: 0 } });
  if (!res.ok) throw new Error('Kraken network error');
  const json = (await res.json()) as any;
  if (json.error && json.error.length) throw new Error(json.error.join(', '));
  const result = json.result;
  if (!result || typeof result !== 'object') throw new Error('No Kraken result');

  const firstKey = Object.keys(result)[0];
  if (!firstKey) throw new Error('Empty Kraken result');

  const t = result[firstKey];
  const lastTrade = Array.isArray(t?.c) ? parseFloat(t.c[0]) : NaN; // last price
  const opening = t?.o ? parseFloat(t.o) : NaN; // opening price
  const vol24h = Array.isArray(t?.v) ? parseFloat(t.v[1]) : NaN; // volume 24h (base)
  if (!isFinite(lastTrade)) throw new Error('Invalid Kraken price');

  // Kraken volume is base volume; USD volume may not be available. Keep as base unit unless pair uses USD.
  const changePct =
    isFinite(opening) && opening !== 0 ? ((lastTrade - opening) / opening) * 100 : null;

  return {
    priceUsd: lastTrade,
    change24hPct: changePct,
    volume24hUsd: isFinite(vol24h) ? vol24h : null
  } as const;
}

// CoinGecko fallback by coin id:
// https://api.coingecko.com/api/v3/coins/{id}?localization=false&tickers=false&market_data=true...
async function fetchFromCoinGecko(id: string) {
  const url = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
    id
  )}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
  const res = await fetch(url, { cache: 'no-store', next: { revalidate: 0 } });
  if (!res.ok) throw new Error('CoinGecko network error');
  const json = (await res.json()) as any;
  const md = json?.market_data;
  const price = md?.current_price?.usd;
  const change = md?.price_change_percentage_24h;
  const vol = md?.total_volume?.usd;
  if (typeof price !== 'number') throw new Error('Invalid CoinGecko price');
  return {
    priceUsd: price,
    change24hPct: typeof change === 'number' ? change : null,
    volume24hUsd: typeof vol === 'number' ? vol : null
  } as const;
}

function normalizePair(pair?: string) {
  if (!pair) return undefined;
  // Kraken accepts both AAPLUSD and AAPL/USD; we normalize to no slash.
  return pair.replace('/', '').toUpperCase();
}

async function quoteForToken(token: TokenConfig): Promise<TokenQuote> {
  // Try Kraken first
  const krakenPair = normalizePair(token.krakenPair);
  if (krakenPair) {
    try {
      const k = await fetchFromKraken(krakenPair);
      return {
        symbol: token.symbol,
        name: token.name,
        priceUsd: k.priceUsd,
        change24hPct: k.change24hPct,
        volume24hUsd: k.volume24hUsd,
        source: 'kraken',
        affiliateUrl: token.affiliateUrl
      };
    } catch {
      // fall through
    }
  }

  // Fallback to CoinGecko
  if (token.coingeckoId) {
    try {
      const c = await fetchFromCoinGecko(token.coingeckoId);
      return {
        symbol: token.symbol,
        name: token.name,
        priceUsd: c.priceUsd,
        change24hPct: c.change24hPct,
        volume24hUsd: c.volume24hUsd,
        source: 'coingecko',
        affiliateUrl: token.affiliateUrl
      };
    } catch {
      // fall through
    }
  }

  // Unavailable
  return {
    symbol: token.symbol,
    name: token.name,
    priceUsd: null,
    change24hPct: null,
    volume24hUsd: null,
    source: 'unavailable',
    affiliateUrl: token.affiliateUrl
  };
}

export async function GET() {
  const data = await Promise.all(TOKENS.map((t) => quoteForToken(t)));
  return NextResponse.json({ data, updatedAt: new Date().toISOString() });
}

