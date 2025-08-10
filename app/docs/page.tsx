import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation - Tokenized Stocks Dashboard',
  description: 'Comprehensive documentation for the Tokenized Stocks Dashboard API, configuration, and deployment.',
}

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Documentation</h1>
        <p className="text-lg text-gray-600">
          Complete guide to configuring, deploying, and integrating with the Tokenized Stocks Dashboard.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">API Reference</h2>
          <p className="text-gray-600 mb-4">
            Comprehensive documentation of the Kraken and CoinGecko API integrations, data formats, and endpoints.
          </p>
          <Link 
            href="/docs/apis" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View API Docs
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Configuration</h2>
          <p className="text-gray-600 mb-4">
            Learn how to configure tokens, affiliate links, and environment variables for your deployment.
          </p>
          <Link 
            href="https://github.com/Skydax-IT/TokenizedStocks#configuration" 
            target="_blank"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            View Config Guide
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Deployment</h2>
          <p className="text-gray-600 mb-4">
            Step-by-step guide to deploying your Tokenized Stocks Dashboard on Vercel or other platforms.
          </p>
          <Link 
            href="https://github.com/Skydax-IT/TokenizedStocks#deployment" 
            target="_blank"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            View Deployment Guide
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Security</h2>
          <p className="text-gray-600 mb-4">
            Information about security headers, CSP policies, and best practices implemented in the dashboard.
          </p>
          <Link 
            href="https://github.com/Skydax-IT/TokenizedStocks#security-features" 
            target="_blank"
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            View Security Guide
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Start</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-start">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-3">1</span>
            <p className="text-gray-700">Clone the repository and install dependencies</p>
          </div>
          <div className="flex items-start">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-3">2</span>
            <p className="text-gray-700">Configure your tokens in <code className="bg-gray-200 px-1 rounded">lib/tokens.ts</code></p>
          </div>
          <div className="flex items-start">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-3">3</span>
            <p className="text-gray-700">Set up affiliate links in <code className="bg-gray-200 px-1 rounded">data/affiliates.json</code></p>
          </div>
          <div className="flex items-start">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-3">4</span>
            <p className="text-gray-700">Configure environment variables and deploy</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Need help? Check out the{' '}
          <Link href="https://github.com/Skydax-IT/TokenizedStocks" className="text-blue-600 hover:underline">
            GitHub repository
          </Link>{' '}
          or create an issue for support.
        </p>
      </div>
    </div>
  )
}
