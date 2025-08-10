import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/lib/hooks/use-theme';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ 
  subsets: ['latin'], 
  display: 'swap', 
  variable: '--font-inter' 
});

const grotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  display: 'swap', 
  variable: '--font-grotesk' 
});

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
  themeColor: '#12D2A0',
  colorScheme: 'dark'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${grotesk.variable} font-sans bg-bg text-fg`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
          <header className="w-full bg-card border-b border-border">
            <div className="mx-auto max-w-6xl px-4 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="h2 text-fg font-display">
                    Tokenized Stocks Dashboard
                  </h1>
                  <p className="body-sm text-muted mt-1">
                    Live Tokenized Stock Data • Real-time Prices • RWA Dashboard
                  </p>
                </div>
                <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                  <nav>
                    <ul className="flex space-x-6 text-sm">
                      <li>
                        <a href="/" className="text-muted hover:text-fg transition-colors">
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <a href="/docs" className="text-muted hover:text-fg transition-colors">
                          Documentation
                        </a>
                      </li>
                      <li>
                        <a href="/styleguide" className="text-muted hover:text-fg transition-colors">
                          Styleguide
                        </a>
                      </li>
                    </ul>
                  </nav>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </header>
          <main id="main-content" className="mx-auto max-w-6xl p-4 sm:p-6 page-transition">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

