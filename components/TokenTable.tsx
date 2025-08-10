'use client';

import { useState, useMemo } from 'react';
import { TokenRow } from '@/lib/types';
import { formatUsd, formatPercentage, getChangeColorClass } from '@/lib/normalize';
import { getAffiliateUrl, hasAffiliateLink } from '@/lib/affiliates';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface TokenTableProps {
  rows: TokenRow[];
  onBuyClick: (symbol: string) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  onAddToComparison?: (token: TokenRow) => void;
  selectedForComparison?: TokenRow[];
}

type SortField = 'symbol' | 'name' | 'priceUsd' | 'change24hPct' | 'volume24hUsd';
type SortDirection = 'asc' | 'desc';

export default function TokenTable({ rows, onBuyClick, watchlist, onToggleWatchlist, onAddToComparison, selectedForComparison = [] }: TokenTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('symbol');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter and sort data
  const filteredAndSortedRows = useMemo(() => {
    let filtered = rows.filter(row =>
      row.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
  }, [rows, searchTerm, sortField, sortDirection]);

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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  if (rows.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Show:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-brand-800 text-white sticky top-0 z-10">
              <tr>
                <th className="text-left text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  <button
                    onClick={() => handleSort('symbol')}
                    className="flex items-center hover:text-brand-200 transition-colors"
                  >
                    Symbol
                    <SortIcon field="symbol" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center hover:text-brand-200 transition-colors"
                  >
                    Name
                    <SortIcon field="name" />
                  </button>
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  <button
                    onClick={() => handleSort('priceUsd')}
                    className="flex items-center justify-end hover:text-brand-200 transition-colors w-full"
                  >
                    Price (USD)
                    <SortIcon field="priceUsd" />
                  </button>
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  <button
                    onClick={() => handleSort('change24hPct')}
                    className="flex items-center justify-end hover:text-brand-200 transition-colors w-full"
                  >
                    24h Change
                    <SortIcon field="change24hPct" />
                  </button>
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-wide px-4 py-3">
                  <button
                    onClick={() => handleSort('volume24hUsd')}
                    className="flex items-center justify-end hover:text-brand-200 transition-colors w-full"
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
            <tbody className="divide-y divide-gray-200">
              {paginatedRows.map((row, idx) => {
                const isEven = idx % 2 === 0;
                const changeColor = getChangeColorClass(row.change24hPct);
                const hasAffiliate = hasAffiliateLink(row.symbol);
                const affiliateUrl = getAffiliateUrl(row.symbol);
                const isInWatchlist = watchlist.includes(row.symbol);

                return (
                  <tr
                    key={row.symbol}
                    className={`${isEven ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-4 py-3 text-sm font-medium">{row.symbol}</td>
                    <td className="px-4 py-3 text-sm">{row.name}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatUsd(row.priceUsd)}</td>
                    <td className={`px-4 py-3 text-sm text-right ${changeColor}`}>
                      {formatPercentage(row.change24hPct)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {formatUsd(row.volume24hUsd)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <button
                        onClick={() => onToggleWatchlist(row.symbol)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                      >
                        {isInWatchlist ? (
                          <StarIconSolid className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <StarIcon className="h-5 w-5 text-gray-400 hover:text-yellow-500" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <div className="flex items-center justify-center gap-2">
                        {onAddToComparison && (
                          <button
                            onClick={() => onAddToComparison(row)}
                            disabled={selectedForComparison.length >= 4 && !selectedForComparison.find(t => t.symbol === row.symbol)}
                            className={`p-2 rounded-md text-xs font-medium transition-colors ${
                              selectedForComparison.find(t => t.symbol === row.symbol)
                                ? 'bg-brand-100 text-brand-700 border border-brand-300'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            title={
                              selectedForComparison.find(t => t.symbol === row.symbol)
                                ? 'Remove from comparison'
                                : selectedForComparison.length >= 4
                                ? 'Maximum 4 tokens for comparison'
                                : 'Add to comparison'
                            }
                          >
                            {selectedForComparison.find(t => t.symbol === row.symbol) ? '✓' : 'Compare'}
                          </button>
                        )}
                        {hasAffiliate ? (
                          <button
                            onClick={() => onBuyClick(row.symbol)}
                            className="btn-gradient inline-flex items-center justify-center px-3 py-2 text-sm"
                          >
                            Buy
                          </button>
                        ) : (
                          <button
                            disabled
                            className="bg-gray-300 text-gray-500 rounded-md px-3 py-2 cursor-not-allowed text-sm"
                            title="Link not available"
                          >
                            Buy
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredAndSortedRows.length)} of{' '}
              {filteredAndSortedRows.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="table-card p-12 text-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No tokens found</h3>
      <p className="mt-1 text-sm text-gray-500">
        Try adjusting your search criteria or check back later.
      </p>
    </div>
  );
}
