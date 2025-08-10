'use client';

import { useState } from 'react';
import useSWR from 'swr';
import TokenTable from '@/components/TokenTable';
import CompareDrawer from '@/components/CompareDrawer';
import Newsletter from '@/components/Newsletter';
import ErrorState from '@/components/ErrorState';
import MarketSummary from '@/components/MarketSummary';
import DarkModeToggle from '@/components/DarkModeToggle';
import PriceChart from '@/components/PriceChart';
import PriceAlerts from '@/components/PriceAlerts';
import Portfolio from '@/components/Portfolio';
import { useWatchlist } from '@/lib/hooks/useWatchlist';
import { getAffiliateUrl, hasAffiliateLink } from '@/lib/affiliates';
import { TokenRow, TokensApiResponse } from '@/lib/types';
import { ChartBarIcon, StarIcon, ArrowPathIcon, BellIcon, WalletIcon } from '@heroicons/react/24/outline';

const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<TokensApiResponse>);

export default function Page() {
  const { data, error, isLoading, mutate } = useSWR<TokensApiResponse>('/api/tokens', fetcher, {
    refreshInterval: 300000, // 5 minutes
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  });

  const { watchlist, toggleWatchlist } = useWatchlist();
  const [activeTab, setActiveTab] = useState<'all' | 'watchlist'>('all');
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<TokenRow[]>([]);
  const [chartModalOpen, setChartModalOpen] = useState(false);
  const [selectedTokenForChart, setSelectedTokenForChart] = useState<TokenRow | null>(null);
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);

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

  const handleShowChart = (token: TokenRow) => {
    setSelectedTokenForChart(token);
    setChartModalOpen(true);
  };

  const handleCloseChart = () => {
    setChartModalOpen(false);
    setSelectedTokenForChart(null);
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
            {/* Refresh Button */}
            <button
              onClick={() => mutate()}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Refresh data"
            >
              <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Portfolio Button */}
            <button
              onClick={() => setPortfolioModalOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <WalletIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Portfolio</span>
            </button>

            {/* Alerts Button */}
            <button
              onClick={() => setAlertsModalOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <BellIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
            </button>

            {/* Compare Button */}
            <button
              onClick={() => setCompareDrawerOpen(true)}
              disabled={selectedForComparison.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChartBarIcon className="h-4 w-4" />
              Compare ({selectedForComparison.length}/4)
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'all'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              All Tokens ({rows.length})
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'watchlist'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
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
            <span className="text-lg text-gray-600 dark:text-gray-400">Loading token data...</span>
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
          showWatchlistOnly={activeTab === 'watchlist'}
          onToggleWatchlistFilter={() => setActiveTab(activeTab === 'watchlist' ? 'all' : 'watchlist')}
          onShowChart={handleShowChart}
          onShowAlerts={() => setAlertsModalOpen(true)}
        />
      )}

      {/* Data Source Info */}
      {data && (
        <div className="table-card p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span>Data sources: {data.sources.kraken} Kraken, {data.sources.coingecko} CoinGecko, {data.sources.unavailable} unavailable</span>
              {data.circuitBreakers && (
                <span className="text-xs">
                  Circuits: Kraken ({data.circuitBreakers.kraken}), CoinGecko ({data.circuitBreakers.coingecko})
                </span>
              )}
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

      {/* Price Chart Modal */}
      {selectedTokenForChart && (
        <PriceChart
          token={selectedTokenForChart}
          isOpen={chartModalOpen}
          onClose={handleCloseChart}
        />
      )}

      {/* Price Alerts Modal */}
      <PriceAlerts
        isOpen={alertsModalOpen}
        onClose={() => setAlertsModalOpen(false)}
        tokens={rows}
      />

      {/* Portfolio Modal */}
      <Portfolio
        isOpen={portfolioModalOpen}
        onClose={() => setPortfolioModalOpen(false)}
        tokens={rows}
      />
    </div>
  );
}

