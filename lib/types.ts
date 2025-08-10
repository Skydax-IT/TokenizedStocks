import { z } from 'zod';

// Token configuration type
export type TokenConfig = {
  symbol: string;
  name: string;
  krakenPair?: string;     // e.g. "AAPLUSD" (optional)
  coingeckoId: string;    // e.g. "apple"
};

// Zod schema for token configuration validation
export const TokenConfigSchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(1),
  krakenPair: z.string().optional(),
  coingeckoId: z.string().min(1),
});

export const TokensArraySchema = z.array(TokenConfigSchema);

// Zod schemas for API validation
export const KrakenTickerSchema = z.object({
  error: z.array(z.string()).optional(),
  result: z.record(z.string(), z.object({
    c: z.array(z.string()).length(2), // [last price, last trade volume]
    o: z.string(), // opening price
    v: z.array(z.string()).length(2), // [today's volume, last 24h volume]
  })).optional(),
});

export type KrakenTickerResult = z.infer<typeof KrakenTickerSchema>;

export const CoinGeckoSimplePriceSchema = z.record(z.string(), z.object({
  usd: z.number(),
  usd_24h_change: z.number().nullable(),
  usd_24h_vol: z.number().nullable(),
}));

// Normalized token data type
export type TokenRow = {
  symbol: string;
  name: string;
  priceUsd: number;
  change24hPct: number;
  volume24hUsd: number;
  source: 'kraken' | 'coingecko';
};

// API response type
export type TokensApiResponse = {
  data: TokenRow[];
  updatedAt: string;
  sources: {
    kraken: number;
    coingecko: number;
    unavailable: number;
  };
  warnings?: string[];
  circuitBreakers?: {
    kraken: string;
    coingecko: string;
  };
};

// Affiliate data type
export type AffiliateData = {
  [symbol: string]: string;
};
