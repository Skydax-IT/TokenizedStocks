// Central place to manage which tokenized stocks to display and affiliate links.
// Add/remove tokens here. Update `krakenPair` (if exists) and `coingeckoId` (fallback).
export type TokenConfig = {
  symbol: string; // e.g., AAPL
  name: string; // e.g., Apple Inc.
  krakenPair?: string; // Kraken pair, e.g., AAPL/USD or AAPLUSD
  coingeckoId?: string; // CoinGecko coin id for tokenized stock (fallback)
  affiliateUrl: string; // Button target
};

export const TOKENS: TokenConfig[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    // Kraken may not have tokenized stocks; we still try.
    krakenPair: 'AAPLUSD',
    // CoinGecko tokenized stocks (DeFiChain) as fallback:
    coingeckoId: 'apple-tokenized-stock-defichain',
    affiliateUrl: 'https://myaffiliatelink.com/AAPL'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    krakenPair: 'TSLAUSD',
    coingeckoId: 'tesla-tokenized-stock-defichain',
    affiliateUrl: 'https://myaffiliatelink.com/TSLA'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    krakenPair: 'NVDAUSD',
    coingeckoId: 'nvidia-tokenized-stock-defichain',
    affiliateUrl: 'https://myaffiliatelink.com/NVDA'
  }
];

// Helper for affiliate lookup inside UI
export const affiliateBySymbol: Record<string, string> = Object.fromEntries(
  TOKENS.map((t) => [t.symbol, t.affiliateUrl])
);

