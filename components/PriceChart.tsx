'use client';

import { useState, useEffect } from 'react';
import { TokenRow } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PriceChartProps {
  token: TokenRow;
  isOpen: boolean;
  onClose: () => void;
}

interface ChartDataPoint {
  time: string;
  price: number;
  volume: number;
}

export default function PriceChart({ token, isOpen, onClose }: PriceChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d'>('24h');

  // Generate mock chart data for demonstration
  useEffect(() => {
    if (!isOpen || !token) return;

    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      const now = new Date();
      const data: ChartDataPoint[] = [];
      
      // Generate 24 data points for the selected timeframe
      const hours = timeframe === '1h' ? 1 : timeframe === '24h' ? 24 : 168;
      const interval = hours / 24;
      
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - (i * interval * 60 * 60 * 1000));
        const basePrice = token.priceUsd;
        const volatility = 0.02; // 2% volatility
        const randomChange = (Math.random() - 0.5) * volatility;
        const price = basePrice * (1 + randomChange);
        
        data.push({
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          price: parseFloat(price.toFixed(2)),
          volume: token.volume24hUsd * (0.5 + Math.random() * 0.5), // Random volume variation
        });
      }
      
      setChartData(data);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [token, isOpen, timeframe]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {token.name} ({token.symbol}) Price Chart
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current Price: ${token.priceUsd.toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Timeframe Selector */}
            <div className="flex rounded-md shadow-sm">
              {(['1h', '24h', '7d'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-sm font-medium border ${
                    timeframe === tf
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  } ${tf === '1h' ? 'rounded-l-md' : ''} ${tf === '7d' ? 'rounded-r-md' : ''}`}
                >
                  {tf}
                </button>
              ))}
            </div>
            
            {/* Close Button */}
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

        {/* Chart Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Price Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current Price</div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">
                    ${token.priceUsd.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">24h Change</div>
                  <div className={`text-xl font-semibold ${
                    token.change24hPct >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {token.change24hPct >= 0 ? '+' : ''}{token.change24hPct.toFixed(2)}%
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">24h Volume</div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">
                    ${token.volume24hUsd.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      fontSize={12}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      formatter={(value: number, name: string) => [
                        name === 'price' ? `$${value.toLocaleString()}` : `$${value.toLocaleString()}`,
                        name === 'price' ? 'Price' : 'Volume'
                      ]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={false}
                      name="Price"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="volume" 
                      stroke="#10B981" 
                      strokeWidth={1}
                      dot={false}
                      name="Volume"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Additional Info */}
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Data source: {token.source} • Last updated: {new Date().toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
