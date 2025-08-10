'use client';

import { useState, useMemo } from 'react';
import { TokenRow } from '@/lib/types';
import { formatUsd, formatPercentage, getChangeColorClass } from '@/lib/normalize';
import { getAffiliateUrl, hasAffiliateLink } from '@/lib/affiliates';
import { exportToCSV } from '@/lib/utils/csvExport';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { 
  MagnifyingGlassIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  EyeSlashIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface TokenTableProps {
  rows: TokenRow[];
  onBuyClick: (symbol: string) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  onAddToComparison?: (token: TokenRow) => void;
  selectedForComparison?: TokenRow[];
  showWatchlistOnly?: boolean;
  onToggleWatchlistFilter?: () => void;
  onShowChart?: (token: TokenRow) => void;
  onShowAlerts?: () => void;
}

type SortField = 'symbol' | 'name' | 'priceUsd' | 'change24hPct' | 'volume24hUsd';
type SortDirection = 'asc' | 'desc';

export default function TokenTable({ 
  rows, 
  onBuyClick, 
  watchlist, 
  onToggleWatchlist, 
  onAddToComparison, 
  selectedForComparison = [],
  showWatchlistOnly = false,
  onToggleWatchlistFilter,
  onShowChart,
  onShowAlerts
}: TokenTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('symbol');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter and sort data
  const filteredAndSortedRows = useMemo(() => {
    let filtered = rows;

    // Filter by watchlist if enabled
    if (showWatchlistOnly) {
      filtered = filtered.filter(row => watchlist.includes(row.symbol));
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(row =>
        row.symbol.toLowerCase().includes(term) ||
        row.name.toLowerCase().includes(term)
      );
    }

    // Sort data
    filtered.sort((a, b) => {
      let aVal: string | number = a[sortField];
      let bVal: string | number = b[sortField];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [rows, searchTerm, sortField, sortDirection, showWatchlistOnly, watchlist]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedRows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRows = filteredAndSortedRows.slice(startIndex, startIndex + pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredAndSortedRows);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? (
          <ArrowUpIcon className="h-4 w-4" />
        ) : (
          <ArrowDownIcon className="h-4 w-4" />
        )}
      </span>
    );
  };

  if (rows.length === 0) {
    return <EmptyState />;
  }

  if (showWatchlistOnly && watchlist.length === 0) {
    return <EmptyWatchlistState />;
  }

  return (
    <div className="space-y-4" role="region" aria-label="Token data table">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search symbols or names..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
            aria-label="Search tokens"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="flex items-center gap-2">
          {/* Watchlist Filter Toggle */}
          {onToggleWatchlistFilter && (
            <button
              onClick={onToggleWatchlistFilter}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                showWatchlistOnly
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              aria-label={showWatchlistOnly ? 'Show all tokens' : 'Show watchlist only'}
            >
              {showWatchlistOnly ? (
                <>
                  <EyeSlashIcon className="h-4 w-4" />
                  Watchlist
                </>
              ) : (
                <>
                  <EyeIcon className="h-4 w-4" />
                  All
                </>
              )}
            </button>
          )}

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
            aria-label="Export to CSV"
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
            Export CSV
          </button>

          {/* Page Size Selector */}
          <label className="text-sm text-gray-600 dark:text-gray-400">Show:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 dark:bg-gray-700 dark:text-white"
            aria-label="Select page size"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredAndSortedRows.length)} of {filteredAndSortedRows.length} tokens
        {showWatchlistOnly && ` (${watchlist.length} in watchlist)`}
      </div>

      {/* Table */}
      <div className="table-card overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0" role="table" aria-label="Token prices and data">
            <thead className="bg-brand-800 text-white sticky top-0 z-10">
              <tr>
                <th className="text-left text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  <button
                    onClick={() => handleSort('symbol')}
                    className="flex items-center hover:text-brand-200 transition-colors"
                    aria-label="Sort by symbol"
                  >
                    Symbol
                    <SortIcon field="symbol" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center hover:text-brand-200 transition-colors"
                    aria-label="Sort by name"
                  >
                    Name
                    <SortIcon field="name" />
                  </button>
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  <button
                    onClick={() => handleSort('priceUsd')}
                    className="flex items-center justify-end hover:text-brand-200 transition-colors w-full"
                    aria-label="Sort by price"
                  >
                    Price (USD)
                    <SortIcon field="priceUsd" />
                  </button>
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  <button
                    onClick={() => handleSort('change24hPct')}
                    className="flex items-center justify-end hover:text-brand-200 transition-colors w-full"
                    aria-label="Sort by 24h change"
                  >
                    24h Change
                    <SortIcon field="change24hPct" />
                  </button>
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  <button
                    onClick={() => handleSort('volume24hUsd')}
                    className="flex items-center justify-end hover:text-brand-200 transition-colors w-full"
                    aria-label="Sort by volume"
                  >
                    24h Volume
                    <SortIcon field="volume24hUsd" />
                  </button>
                </th>
                <th className="text-center text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  Watchlist
                </th>
                <th className="text-center text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedRows.map((row, idx) => {
                const isEven = idx % 2 === 0;
                const changeColor = getChangeColorClass(row.change24hPct);
                const hasAffiliate = hasAffiliateLink(row.symbol);
                const affiliateUrl = getAffiliateUrl(row.symbol);
                const isInWatchlist = watchlist.includes(row.symbol);
                const isSelectedForComparison = selectedForComparison?.some(t => t.symbol === row.symbol);

                return (
                  <tr
                    key={row.symbol}
                    className={`${
                      isEven 
                        ? 'bg-white dark:bg-gray-800' 
                        : 'bg-gray-50 dark:bg-gray-900'
                    } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {row.symbol}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {row.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-mono text-gray-900 dark:text-white">
                      {formatUsd(row.priceUsd)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${changeColor}`}>
                        {formatPercentage(row.change24hPct)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-mono text-gray-900 dark:text-white">
                      {formatUsd(row.volume24hUsd)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <button
                        onClick={() => onToggleWatchlist(row.symbol)}
                        className={`p-1 rounded-full transition-colors ${
                          isInWatchlist
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-gray-400 hover:text-yellow-500'
                        }`}
                        aria-label={isInWatchlist ? `Remove ${row.symbol} from watchlist` : `Add ${row.symbol} to watchlist`}
                      >
                        {isInWatchlist ? (
                          <StarIconSolid className="h-5 w-5" />
                        ) : (
                          <StarIcon className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <div className="flex items-center justify-center gap-1">
                        {onShowChart && (
                          <button
                            onClick={() => onShowChart(row)}
                            className="p-1 text-gray-600 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors"
                            aria-label={`View chart for ${row.symbol}`}
                            title="View chart"
                          >
                            <ChartBarIcon className="h-4 w-4" />
                          </button>
                        )}
                        {onAddToComparison && (
                          <button
                            onClick={() => onAddToComparison(row)}
                            disabled={isSelectedForComparison}
                            className={`px-2 py-1 text-xs rounded transition-colors ${
                              isSelectedForComparison
                                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                            aria-label={isSelectedForComparison ? `${row.symbol} already in comparison` : `Add ${row.symbol} to comparison`}
                          >
                            Compare
                          </button>
                        )}
                        <button
                          onClick={() => onBuyClick(row.symbol)}
                          disabled={!hasAffiliate}
                          className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                            hasAffiliate
                              ? 'bg-brand-600 text-white hover:bg-brand-700'
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          }`}
                          aria-label={hasAffiliate ? `Buy ${row.symbol}` : `Buy ${row.symbol} (not available)`}
                          title={hasAffiliate ? undefined : 'Buy option not available for this token'}
                        >
                          Buy
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous page"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 dark:text-gray-500 mb-4">
        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tokens available</h3>
      <p className="text-gray-500 dark:text-gray-400">Token data is currently unavailable. Please try again later.</p>
    </div>
  );
}

function EmptyWatchlistState() {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 dark:text-gray-500 mb-4">
        <StarIcon className="mx-auto h-12 w-12" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Your watchlist is empty</h3>
      <p className="text-gray-500 dark:text-gray-400">Add tokens to your watchlist by clicking the star icon next to any token.</p>
    </div>
  );
}
