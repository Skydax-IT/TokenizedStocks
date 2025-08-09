'use client';

import useSWR from 'swr';
import Newsletter from '@/components/Newsletter';
import { affiliateBySymbol } from '@/lib/tokens';

type TokenRow = {
  symbol: string;
  name: string;
  priceUsd: number | null;
  change24hPct: number | null;
  volume24hUsd: number | null;
  source: 'kraken' | 'coingecko' | 'unavailable';
  affiliateUrl: string;
};

type ApiResponse = {
  data: TokenRow[];
  updatedAt: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<ApiResponse>);

function formatUsd(n: number | null) {
  if (n === null || !isFinite(n)) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function formatPct(n: number | null) {
  if (n === null || !isFinite(n)) return '—';
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
}

export default function Page() {
  const { data, error, isLoading } = useSWR<ApiResponse>('/api/tokens', fetcher, {
    refreshInterval: 300000, // 5 minutes
    revalidateOnFocus: false
  });

  const rows = data?.data ?? [];

  return (
    <div className="space-y-6">
      <section className="table-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-brand-800 text-white">
              <tr>
                <th className="text-left text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  Symbol
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  Tokenized Asset
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  Price (USD)
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  24h Change
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  24h Volume
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                    Loading data…
                  </td>
                </tr>
              )}
              {error && !isLoading && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-red-600">
                    Failed to load. Retrying…
                  </td>
                </tr>
              )}
              {!isLoading &&
                rows.map((r, idx) => {
                  const isEven = idx % 2 === 0;
                  const changeColor =
                    r.change24hPct === null
                      ? 'text-gray-500'
                      : r.change24hPct >= 0
                      ? 'text-green-600'
                      : 'text-red-600';
                  const affiliateUrl = r.affiliateUrl || affiliateBySymbol[r.symbol];
                  return (
                    <tr
                      key={r.symbol}
                      className={`${isEven ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
                    >
                      <td className="px-4 py-3 text-sm font-medium">{r.symbol}</td>
                      <td className="px-4 py-3 text-sm">{r.name}</td>
                      <td className="px-4 py-3 text-sm text-right">{formatUsd(r.priceUsd)}</td>
                      <td className={`px-4 py-3 text-sm text-right ${changeColor}`}>
                        {formatPct(r.change24hPct)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        {formatUsd(r.volume24hUsd)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <a
                          href={affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-gradient inline-flex items-center justify-center"
                        >
                          Buy
                        </a>
                      </td>
                    </tr>
                  );
                })}
              {!isLoading && rows.length === 0 && !error && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 text-xs text-gray-500 flex items-center justify-between">
          <span>
            Source priority: Kraken → CoinGecko. Auto-refreshes every 5 minutes without reload.
          </span>
          <span>Last updated: {data?.updatedAt ? new Date(data.updatedAt).toLocaleString() : '—'}</span>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}

