'use client';

import { TokenRow } from '@/lib/types';
import { formatUsd, formatPercentage } from '@/lib/normalize';

interface MarketSummaryProps {
  tokens: TokenRow[];
}

export default function MarketSummary({ tokens }: MarketSummaryProps) {
  if (tokens.length === 0) return null;

  const totalMarketCap = tokens.reduce((sum, token) => sum + token.priceUsd, 0);
  const avgChange = tokens.reduce((sum, token) => sum + token.change24hPct, 0) / tokens.length;
  const totalVolume = tokens.reduce((sum, token) => sum + token.volume24hUsd, 0);
  
  const gainers = tokens.filter(token => token.change24hPct > 0).length;
  const losers = tokens.filter(token => token.change24hPct < 0).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="table-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Value</p>
            <p className="text-2xl font-bold text-gray-900">{formatUsd(totalMarketCap)}</p>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>

      <div className="table-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">24h Change</p>
            <p className={`text-2xl font-bold ${avgChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(avgChange)}
            </p>
          </div>
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      <div className="table-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">24h Volume</p>
            <p className="text-2xl font-bold text-gray-900">{formatUsd(totalVolume)}</p>
          </div>
          <div className="p-2 bg-purple-100 rounded-lg">
            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="table-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Market Sentiment</p>
            <p className="text-2xl font-bold text-gray-900">{gainers}/{tokens.length}</p>
            <p className="text-xs text-gray-500">Gainers/Total</p>
          </div>
          <div className="p-2 bg-yellow-100 rounded-lg">
            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
