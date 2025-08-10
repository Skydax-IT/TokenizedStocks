'use client';

import { useState } from 'react';
import { TokenRow } from '@/lib/types';
import { formatUsd, formatPercentage, getChangeColorClass } from '@/lib/normalize';
import { XMarkIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTokens: TokenRow[];
  onRemoveToken: (symbol: string) => void;
  onClearAll: () => void;
}

export default function CompareDrawer({
  isOpen,
  onClose,
  selectedTokens,
  onRemoveToken,
  onClearAll
}: CompareDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <ChartBarIcon className="h-6 w-6 text-brand-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Compare Tokens ({selectedTokens.length}/4)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {selectedTokens.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded-full p-1 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {selectedTokens.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="p-6">
                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'overview'
                          ? 'border-brand-500 text-brand-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab('performance')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'performance'
                          ? 'border-brand-500 text-brand-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Performance
                    </button>
                  </nav>
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Metric
                        </th>
                        {selectedTokens.map(token => (
                          <th key={token.symbol} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex flex-col items-center gap-2">
                              <span className="font-semibold text-gray-900">{token.symbol}</span>
                              <button
                                onClick={() => onRemoveToken(token.symbol)}
                                className="text-gray-400 hover:text-red-500"
                                title="Remove from comparison"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {activeTab === 'overview' ? (
                        <>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">Company Name</td>
                            {selectedTokens.map(token => (
                              <td key={token.symbol} className="px-4 py-3 text-sm text-center text-gray-900">
                                {token.name}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">Current Price</td>
                            {selectedTokens.map(token => (
                              <td key={token.symbol} className="px-4 py-3 text-sm text-center text-gray-900">
                                {formatUsd(token.priceUsd)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">24h Change</td>
                            {selectedTokens.map(token => {
                              const changeColor = getChangeColorClass(token.change24hPct);
                              return (
                                <td key={token.symbol} className={`px-4 py-3 text-sm text-center ${changeColor}`}>
                                  {formatPercentage(token.change24hPct)}
                                </td>
                              );
                            })}
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">24h Volume</td>
                            {selectedTokens.map(token => (
                              <td key={token.symbol} className="px-4 py-3 text-sm text-center text-gray-900">
                                {formatUsd(token.volume24hUsd)}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">Data Source</td>
                            {selectedTokens.map(token => (
                              <td key={token.symbol} className="px-4 py-3 text-sm text-center text-gray-900">
                                <span className="capitalize">{token.source}</span>
                              </td>
                            ))}
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">Price Performance</td>
                            {selectedTokens.map(token => {
                              const changeColor = getChangeColorClass(token.change24hPct);
                              return (
                                <td key={token.symbol} className={`px-4 py-3 text-sm text-center ${changeColor}`}>
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="font-semibold">{formatPercentage(token.change24hPct)}</span>
                                    <span className="text-xs text-gray-500">
                                      {token.change24hPct > 0 ? '+' : ''}{formatUsd(token.priceUsd)}
                                    </span>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">Volume Activity</td>
                            {selectedTokens.map(token => (
                              <td key={token.symbol} className="px-4 py-3 text-sm text-center text-gray-900">
                                <div className="flex flex-col items-center gap-1">
                                  <span className="font-semibold">{formatUsd(token.volume24hUsd)}</span>
                                  <span className="text-xs text-gray-500">24h volume</span>
                                </div>
                              </td>
                            ))}
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Insights */}
                {selectedTokens.length > 1 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Insights</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      {(() => {
                        const highestGainer = selectedTokens.reduce((max, token) => 
                          token.change24hPct > max.change24hPct ? token : max
                        );
                        const highestVolume = selectedTokens.reduce((max, token) => 
                          token.volume24hUsd > max.volume24hUsd ? token : max
                        );
                        
                        return (
                          <>
                            <p>• <strong>{highestGainer.symbol}</strong> had the best performance today at {formatPercentage(highestGainer.change24hPct)}</p>
                            <p>• <strong>{highestVolume.symbol}</strong> had the highest trading volume at {formatUsd(highestVolume.volume24hUsd)}</p>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No tokens selected</h3>
        <p className="mt-1 text-sm text-gray-500">
          Select up to 4 tokens from the table to compare their performance.
        </p>
      </div>
    </div>
  );
}
