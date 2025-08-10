import './globals.css';
import type { Metadata, Viewport } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Tokenized Stocks Dashboard – Live Tokenized Stock Data',
  description:
    'Live tokenized stock prices, 24h changes, volumes, and affiliate links for global investors.',
  keywords: ['tokenized stocks', 'tokenization', 'RWA', 'crypto stocks'],
  applicationName: 'Tokenized Stocks Dashboard',
  openGraph: {
    title: 'Tokenized Stocks Dashboard – Live Tokenized Stock Data',
    description:
      'Live tokenized stock prices, 24h changes, volumes, and affiliate links for global investors.',
    url: 'https://tokenizedstocks.vercel.app',
    siteName: 'Tokenized Stocks Dashboard',
    type: 'website'
  },
  robots: {
    index: true,
    follow: true
  },
  category: 'finance',
  metadataBase: new URL('https://tokenizedstocks.vercel.app')
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  Tokenized Stocks Dashboard
                </h1>
                <p className="text-sm text-gray-300 mt-1">
                  Live Tokenized Stock Data • Real-time Prices • RWA Dashboard
                </p>
              </div>
              <nav className="mt-4 sm:mt-0">
                <ul className="flex space-x-6 text-sm">
                  <li>
                    <a href="/" className="text-gray-300 hover:text-white transition-colors">
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a href="/docs" className="text-gray-300 hover:text-white transition-colors">
                      Documentation
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl p-4 sm:p-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

