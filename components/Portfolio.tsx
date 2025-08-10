'use client';

import { useState, useEffect } from 'react';
import { TokenRow } from '@/lib/types';
import { PlusIcon, MinusIcon, TrashIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface PortfolioHolding {
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  addedAt: Date;
}

interface PortfolioProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: TokenRow[];
}

export default function Portfolio({ isOpen, onClose, tokens }: PortfolioProps) {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Load portfolio from localStorage on mount
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('portfolio');
    if (savedPortfolio) {
      try {
        const parsed = JSON.parse(savedPortfolio);
        setHoldings(parsed.map((holding: any) => ({
          ...holding,
          addedAt: new Date(holding.addedAt)
        })));
      } catch (error) {
        console.error('Failed to parse saved portfolio:', error);
      }
    }
  }, []);

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(holdings));
  }, [holdings]);

  const handleAddHolding = () => {
    if (!selectedToken || !quantity || !price) return;

    const token = tokens.find(t => t.symbol === selectedToken);
    if (!token) return;

    const qty = parseFloat(quantity);
    const avgPrice = parseFloat(price);
    
    if (isNaN(qty) || isNaN(avgPrice) || qty <= 0 || avgPrice <= 0) return;

    // Check if holding already exists
    const existingIndex = holdings.findIndex(h => h.symbol === selectedToken);
    
    if (existingIndex >= 0) {
      // Update existing holding with weighted average
      const existing = holdings[existingIndex];
      const totalQuantity = existing.quantity + qty;
      const totalValue = (existing.quantity * existing.averagePrice) + (qty * avgPrice);
      const newAveragePrice = totalValue / totalQuantity;

      setHoldings(prev => prev.map((holding, index) => 
        index === existingIndex 
          ? { ...holding, quantity: totalQuantity, averagePrice: newAveragePrice }
          : holding
      ));
    } else {
      // Add new holding
      const newHolding: PortfolioHolding = {
        symbol: selectedToken,
        name: token.name,
        quantity: qty,
        averagePrice: avgPrice,
        addedAt: new Date(),
      };

      setHoldings(prev => [...prev, newHolding]);
    }

    // Reset form
    setSelectedToken('');
    setQuantity('');
    setPrice('');
    setShowAddForm(false);
  };

  const handleRemoveHolding = (symbol: string) => {
    setHoldings(prev => prev.filter(h => h.symbol !== symbol));
  };

  const handleUpdateQuantity = (symbol: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveHolding(symbol);
      return;
    }

    setHoldings(prev => prev.map(holding => 
      holding.symbol === symbol 
        ? { ...holding, quantity: newQuantity }
        : holding
    ));
  };

  // Calculate portfolio metrics
  const portfolioMetrics = holdings.map(holding => {
    const token = tokens.find(t => t.symbol === holding.symbol);
    const currentPrice = token?.priceUsd || 0;
    const currentValue = holding.quantity * currentPrice;
    const costBasis = holding.quantity * holding.averagePrice;
    const gainLoss = currentValue - costBasis;
    const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

    return {
      ...holding,
      currentPrice,
      currentValue,
      costBasis,
      gainLoss,
      gainLossPercent,
    };
  });

  const totalCostBasis = portfolioMetrics.reduce((sum, holding) => sum + holding.costBasis, 0);
  const totalCurrentValue = portfolioMetrics.reduce((sum, holding) => sum + holding.currentValue, 0);
  const totalGainLoss = totalCurrentValue - totalCostBasis;
  const totalGainLossPercent = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Portfolio Tracker
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your token holdings and performance
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Add Holding
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Value</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                ${totalCurrentValue.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Cost Basis</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                ${totalCostBasis.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total P&L</div>
              <div className={`text-xl font-semibold ${
                totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">P&L %</div>
              <div className={`text-xl font-semibold ${
                totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Add Holding Form */}
          {showAddForm && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add New Holding
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Token Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Token
                  </label>
                  <select
                    value={selectedToken}
                    onChange={(e) => setSelectedToken(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  >
                    <option value="">Select a token</option>
                    {tokens.map(token => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.name} ({token.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0.00"
                    step="0.000001"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                {/* Average Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Average Price ($)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>

                {/* Add Button */}
                <div className="flex items-end gap-2">
                  <button
                    onClick={handleAddHolding}
                    disabled={!selectedToken || !quantity || !price}
                    className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Holdings Table */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Your Holdings ({holdings.length})
            </h3>
            
            {holdings.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <ChartBarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No holdings yet.</p>
                <p className="text-sm">Add your first holding to start tracking.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Token
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Avg Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Current Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Current Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        P&L
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {portfolioMetrics.map((holding) => (
                      <tr key={holding.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {holding.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {holding.symbol}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={holding.quantity}
                              onChange={(e) => handleUpdateQuantity(holding.symbol, parseFloat(e.target.value) || 0)}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              step="0.000001"
                              min="0"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${holding.averagePrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${holding.currentPrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${holding.currentValue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className={`font-medium ${
                              holding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {holding.gainLoss >= 0 ? '+' : ''}${holding.gainLoss.toLocaleString()}
                            </div>
                            <div className={`text-xs ${
                              holding.gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleRemoveHolding(holding.symbol)}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
