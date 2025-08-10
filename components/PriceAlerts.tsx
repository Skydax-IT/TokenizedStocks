'use client';

import { useState, useEffect } from 'react';
import { TokenRow } from '@/lib/types';
import { BellIcon, BellSlashIcon, TrashIcon } from '@heroicons/react/24/outline';

interface PriceAlert {
  id: string;
  symbol: string;
  name: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  createdAt: Date;
}

interface PriceAlertsProps {
  isOpen: boolean;
  onClose: () => void;
  tokens: TokenRow[];
}

export default function PriceAlerts({ isOpen, onClose, tokens }: PriceAlertsProps) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  // Load alerts from localStorage on mount
  useEffect(() => {
    const savedAlerts = localStorage.getItem('priceAlerts');
    if (savedAlerts) {
      try {
        const parsed = JSON.parse(savedAlerts);
        setAlerts(parsed.map((alert: any) => ({
          ...alert,
          createdAt: new Date(alert.createdAt)
        })));
      } catch (error) {
        console.error('Failed to parse saved alerts:', error);
      }
    }
  }, []);

  // Save alerts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('priceAlerts', JSON.stringify(alerts));
  }, [alerts]);

  // Check for triggered alerts
  useEffect(() => {
    const checkAlerts = () => {
      alerts.forEach(alert => {
        if (!alert.isActive) return;

        const token = tokens.find(t => t.symbol === alert.symbol);
        if (!token) return;

        const shouldTrigger = 
          (alert.condition === 'above' && token.priceUsd >= alert.targetPrice) ||
          (alert.condition === 'below' && token.priceUsd <= alert.targetPrice);

        if (shouldTrigger) {
          // Show browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Price Alert', {
              body: `${alert.name} (${alert.symbol}) is now ${alert.condition} $${alert.targetPrice.toLocaleString()}`,
              icon: '/favicon.ico',
            });
          }

          // Deactivate the alert
          setAlerts(prev => prev.map(a => 
            a.id === alert.id ? { ...a, isActive: false } : a
          ));
        }
      });
    };

    const interval = setInterval(checkAlerts, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [alerts, tokens]);

  const handleCreateAlert = () => {
    if (!selectedToken || !targetPrice) return;

    const token = tokens.find(t => t.symbol === selectedToken);
    if (!token) return;

    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) return;

    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      symbol: selectedToken,
      name: token.name,
      targetPrice: price,
      condition,
      isActive: true,
      createdAt: new Date(),
    };

    setAlerts(prev => [...prev, newAlert]);
    setSelectedToken('');
    setTargetPrice('');
  };

  const handleToggleAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Price Alerts
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get notified when tokens reach your target prices
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Create New Alert */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Create New Alert
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

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as 'above' | 'below')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  <option value="above">Above</option>
                  <option value="below">Below</option>
                </select>
              </div>

              {/* Target Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Price ($)
                </label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>

              {/* Create Button */}
              <div className="flex items-end">
                <button
                  onClick={handleCreateAlert}
                  disabled={!selectedToken || !targetPrice}
                  className="w-full px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Alert
                </button>
              </div>
            </div>
          </div>

          {/* Notification Permission */}
          {('Notification' in window && Notification.permission === 'default') && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <BellIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <div className="flex-1">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Enable browser notifications to receive price alerts
                  </p>
                </div>
                <button
                  onClick={requestNotificationPermission}
                  className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Enable
                </button>
              </div>
            </div>
          )}

          {/* Existing Alerts */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Your Alerts ({alerts.length})
            </h3>
            
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <BellIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No price alerts set yet.</p>
                <p className="text-sm">Create your first alert above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map(alert => {
                  const token = tokens.find(t => t.symbol === alert.symbol);
                  const currentPrice = token?.priceUsd || 0;
                  const isTriggered = 
                    (alert.condition === 'above' && currentPrice >= alert.targetPrice) ||
                    (alert.condition === 'below' && currentPrice <= alert.targetPrice);

                  return (
                    <div
                      key={alert.id}
                      className={`p-4 border rounded-lg ${
                        isTriggered
                          ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {alert.name} ({alert.symbol})
                            </h4>
                            {isTriggered && (
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded-full">
                                Triggered
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Alert when price goes {alert.condition} ${alert.targetPrice.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Created {alert.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleAlert(alert.id)}
                            className={`p-2 rounded-md transition-colors ${
                              alert.isActive
                                ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'
                                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                          >
                            {alert.isActive ? (
                              <BellIcon className="h-5 w-5" />
                            ) : (
                              <BellSlashIcon className="h-5 w-5" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteAlert(alert.id)}
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-md transition-colors"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      {token && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Current price: </span>
                          <span className={`font-medium ${
                            isTriggered ? 'text-green-600' : 'text-gray-900 dark:text-white'
                          }`}>
                            ${currentPrice.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
