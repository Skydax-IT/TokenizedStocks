'use client';

import { useState } from 'react';
import useSWR from 'swr';
import TokenTable from '@/components/TokenTable';
import CompareDrawer from '@/components/CompareDrawer';
import Newsletter from '@/components/Newsletter';
import ErrorState from '@/components/ErrorState';
import MarketSummary from '@/components/MarketSummary';
import { useWatchlist } from '@/lib/hooks/useWatchlist';
import { getAffiliateUrl, hasAffiliateLink } from '@/lib/affiliates';
import { TokenRow, TokensApiResponse } from '@/lib/types';
import { ChartBarIcon, StarIcon } from '@heroicons/react/24/outline';

const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<TokensApiResponse>);

export default function Page() {
  const { data, error, isLoading, mutate } = useSWR<TokensApiResponse>('/api/tokens', fetcher, {
    refreshInterval: 300000, // 5 minutes
    revalidateOnFocus: false
  });

  const { watchlist, toggleWatchlist } = useWatchlist();
  const [activeTab, setActiveTab] = useState<'all' | 'watchlist'>('all');
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<TokenRow[]>([]);

  const rows = data?.data ?? [];

  // Filter rows based on active tab
  const filteredRows = activeTab === 'watchlist' 
    ? rows.filter(row => watchlist.includes(row.symbol))
    : rows;

  const handleBuyClick = (symbol: string) => {
    if (hasAffiliateLink(symbol)) {
      const affiliateUrl = getAffiliateUrl(symbol);
      if (affiliateUrl) {
        window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleAddToComparison = (token: TokenRow) => {
    if (selectedForComparison.length >= 4) {
      alert('You can compare up to 4 tokens at a time. Remove some tokens first.');
      return;
    }
    
    if (!selectedForComparison.find(t => t.symbol === token.symbol)) {
      setSelectedForComparison(prev => [...prev, token]);
    }
  };

  const handleRemoveFromComparison = (symbol: string) => {
    setSelectedForComparison(prev => prev.filter(t => t.symbol !== symbol));
  };

  const handleClearComparison = () => {
    setSelectedForComparison([]);
  };

  if (error && !isLoading) {
    return (
      <div className="space-y-6">
        <ErrorState 
          message="Failed to load token data. Please check your connection and try again." 
          onRetry={() => mutate()}
        />
        <Newsletter />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Tabs and Compare Button */}
      <div className="table-card p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Tokenized Stocks Dashboard</h1>
            <p className="text-gray-600">
              Real-time data from Kraken and CoinGecko APIs. Auto-refreshes every 5 minutes.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Compare Button */}
            <button
              onClick={() => setCompareDrawerOpen(true)}
              disabled={selectedForComparison.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChartBarIcon className="h-4 w-4" />
              Compare ({selectedForComparison.length}/4)
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Tokens ({rows.length})
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'watchlist'
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <StarIcon className="h-4 w-4" />
                My Watchlist ({watchlist.length})
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Market Summary */}
      {!isLoading && data && data.data.length > 0 && (
        <MarketSummary tokens={data.data} />
      )}

      {/* Token Table */}
      {isLoading ? (
        <div className="table-card p-12 text-center">
          <div className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-6 w-6 text-brand-600" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-lg text-gray-600">Loading token data...</span>
          </div>
        </div>
      ) : (
        <TokenTable
          rows={filteredRows}
          onBuyClick={handleBuyClick}
          watchlist={watchlist}
          onToggleWatchlist={toggleWatchlist}
          onAddToComparison={handleAddToComparison}
          selectedForComparison={selectedForComparison}
        />
      )}

      {/* Data Source Info */}
      {data && (
        <div className="table-card p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>Data sources: {data.sources.kraken} Kraken, {data.sources.coingecko} CoinGecko, {data.sources.unavailable} unavailable</span>
            </div>
            <span>Last updated: {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : '—'}</span>
          </div>
        </div>
      )}

      {/* Newsletter */}
      <Newsletter />

      {/* Compare Drawer */}
      <CompareDrawer
        isOpen={compareDrawerOpen}
        onClose={() => setCompareDrawerOpen(false)}
        selectedTokens={selectedForComparison}
        onRemoveToken={handleRemoveFromComparison}
        onClearAll={handleClearComparison}
      />
    </div>
  );
}

