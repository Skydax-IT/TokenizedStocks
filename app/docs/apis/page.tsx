import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Documentation - Tokenized Stocks Dashboard',
  description: 'Comprehensive API documentation for Kraken and CoinGecko integrations, data formats, and endpoints.',
}

export default function ApisPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <Link 
          href="/docs" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Documentation
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">API Documentation</h1>
        <p className="text-lg text-gray-600">
          Complete API reference for the Tokenized Stocks Dashboard, including Kraken and CoinGecko integrations.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Table of Contents */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
            <nav className="space-y-2">
              <a href="#overview" className="block text-blue-600 hover:text-blue-800">Overview</a>
              <a href="#kraken-api" className="block text-blue-600 hover:text-blue-800">Kraken API</a>
              <a href="#coingecko-api" className="block text-blue-600 hover:text-blue-800">CoinGecko API</a>
              <a href="#data-normalization" className="block text-blue-600 hover:text-blue-800">Data Normalization</a>
              <a href="#integration" className="block text-blue-600 hover:text-blue-800">API Integration</a>
              <a href="#configuration" className="block text-blue-600 hover:text-blue-800">Configuration</a>
              <a href="#testing" className="block text-blue-600 hover:text-blue-800">Testing & Development</a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <section id="overview">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-700 mb-4">
              The Tokenized Stocks Dashboard integrates with two primary data sources to provide comprehensive tokenized stock information:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-3">1</span>
                  <strong>Kraken API</strong> - Primary source for real-time tokenized stock data
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-3">2</span>
                  <strong>CoinGecko API</strong> - Fallback source with broader coverage
                </li>
              </ul>
            </div>
          </section>

          {/* Kraken API */}
          <section id="kraken-api">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Kraken API</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Endpoint Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Base URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded">https://api.kraken.com</code></p>
                    <p><strong>Endpoint:</strong> <code className="bg-gray-100 px-2 py-1 rounded">/0/public/Ticker</code></p>
                    <p><strong>Method:</strong> GET</p>
                    <p><strong>Rate Limit:</strong> 15 requests per 15 seconds</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Request Format</h3>
                  <div className="bg-gray-900 text-green-400 p-3 rounded text-sm">
                    <code>GET /0/public/Ticker?pair=SYMBOLUSD</code>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Example Request</h3>
                <div className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                  <code>curl "https://api.kraken.com/0/public/Ticker?pair=AAPLUSD"</code>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Field Mapping</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><code>c[0]</code> → Current price</p>
                      <p><code>p[0]</code> → 24h volume weighted average price</p>
                      <p><code>v[1]</code> → 24h volume</p>
                    </div>
                    <div>
                      <p><code>h[1]</code> → 24h high</p>
                      <p><code>l[1]</code> → 24h low</p>
                      <p><code>o</code> → Opening price</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CoinGecko API */}
          <section id="coingecko-api">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">CoinGecko API</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Endpoint Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Base URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded">https://api.coingecko.com</code></p>
                    <p><strong>Endpoint:</strong> <code className="bg-gray-100 px-2 py-1 rounded">/api/v3/simple/price</code></p>
                    <p><strong>Method:</strong> GET</p>
                    <p><strong>Rate Limit:</strong> 50 calls per minute</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Request Format</h3>
                  <div className="bg-gray-900 text-green-400 p-3 rounded text-sm">
                    <code>GET /api/v3/simple/price?ids=coin_id&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true</code>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Example Request</h3>
                <div className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                  <code>curl "https://api.coingecko.com/api/v3/simple/price?ids=apple&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true"</code>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Field Mapping</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><code>usd</code> → Current price in USD</p>
                      <p><code>usd_24h_vol</code> → 24h volume in USD</p>
                    </div>
                    <div>
                      <p><code>usd_24h_change</code> → 24h price change percentage</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Normalization */}
          <section id="data-normalization">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Normalization</h2>
            <p className="text-gray-700 mb-4">
              All API responses are normalized to a consistent format for frontend consumption.
            </p>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Normalized Token Structure</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
                <pre>{`[
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "priceUsd": 220.75,
    "change24hPct": 1.25,
    "volume24hUsd": 5000000,
    "source": "coingecko"
  },
  {
    "symbol": "TSLA",
    "name": "Tesla Inc.",
    "priceUsd": 245.80,
    "change24hPct": -2.15,
    "volume24hUsd": 3200000,
    "source": "kraken"
  }
]`}</pre>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Field Descriptions</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Example</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">symbol</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Stock ticker symbol</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"AAPL"</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">name</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Company name</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"Apple Inc."</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">priceUsd</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">number</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Current price in USD</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">220.75</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">change24hPct</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">number</td>
                      <td className="px-6 py-4 text-sm text-gray-500">24h price change percentage</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1.25</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">volume24hUsd</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">number</td>
                      <td className="px-6 py-4 text-sm text-gray-500">24h trading volume in USD</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5000000</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">source</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Data source identifier</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">"kraken" or "coingecko"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Quick Testing */}
          <section id="testing" className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Quick Testing</h2>
            <p className="text-blue-800 mb-4">
              Test the APIs directly to verify they're working correctly:
            </p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">Test Kraken API:</p>
                <code className="text-xs text-blue-700">curl "https://api.kraken.com/0/public/Ticker?pair=AAPLUSD"</code>
              </div>
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">Test CoinGecko API:</p>
                <code className="text-xs text-blue-700">curl "https://api.coingecko.com/api/v3/simple/price?ids=apple&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true"</code>
              </div>
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">Test Your Endpoint:</p>
                <code className="text-xs text-blue-700">curl "http://localhost:3000/api/tokens"</code>
              </div>
            </div>
          </section>

          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              For complete API documentation and advanced configuration options, refer to the full documentation.
            </p>
            <Link 
              href="/docs" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

