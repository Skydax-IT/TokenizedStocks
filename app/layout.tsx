import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Tokenization Data Hub — Tokenized Stocks Dashboard',
  description:
    'Live tokenized stocks data hub. Prices, 24h changes, volumes, and affiliate access. Tokenization Data • Tokenized Stocks • RWA Dashboard.',
  keywords: ['Tokenized Stocks', 'Tokenization Data', 'RWA Dashboard', 'crypto', 'stocks'],
  applicationName: 'Tokenization Data Hub',
  openGraph: {
    title: 'Tokenization Data Hub — Tokenized Stocks Dashboard',
    description:
      'Live tokenized stocks data hub. Prices, 24h changes, volumes, and affiliate access.',
    url: 'https://tokenization-data-hub.vercel.app',
    siteName: 'Tokenization Data Hub',
    type: 'website'
  },
  robots: {
    index: true,
    follow: true
  },
  category: 'finance',
  metadataBase: new URL('https://tokenization-data-hub.vercel.app')
};

export const viewport: Viewport = {
  themeColor: '#1C2541',
  colorScheme: 'light'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="w-full bg-brand-900 text-white">
          <div className="mx-auto max-w-6xl px-4 py-6">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Tokenization Data Hub
            </h1>
            <p className="text-sm text-gray-300 mt-1">
              Tokenized Stocks • Real-time Prices • RWA Dashboard
            </p>
          </div>
        </header>
        <main className="mx-auto max-w-6xl p-4 sm:p-6">{children}</main>
        <footer className="mx-auto max-w-6xl p-6 text-xs text-gray-500">
          Data from public APIs (Kraken, CoinGecko). Not financial advice.
        </footer>
      </body>
    </html>
  );
}

