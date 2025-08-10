'use client';

import { useState } from 'react';
import useSWR from 'swr';
import EnhancedTokenTable from '@/components/EnhancedTokenTable';
import { TokenRow, TokensApiResponse } from '@/lib/types';
import { getAffiliateUrl, hasAffiliateLink } from '@/lib/affiliates';
import { useWatchlist } from '@/lib/hooks/useWatchlist';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ChartBarIcon, BellIcon } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((r) => r.json() as Promise<TokensApiResponse>);

export default function TokensPage() {
  const { data, error, isLoading, mutate } = useSWR<TokensApiResponse>('/api/tokens', fetcher, {
    refreshInterval: 300000, // 5 minutes
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  });

  const { watchlist, toggleWatchlist } = useWatchlist();
  const [selectedForComparison, setSelectedForComparison] = useState<TokenRow[]>([]);

  const rows = data?.data ?? [];

  const handleBuyClick = (symbol: string) => {
    if (hasAffiliateLink(symbol)) {
      const affiliateUrl = getAffiliateUrl(symbol);
      if (affiliateUrl) {
        window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleAddToComparison = (token: TokenRow) => {
    if (selectedForComparison.length >= 4) {
      alert('You can compare up to 4 tokens at a time. Remove some tokens first.');
      return;
    }
    
    if (!selectedForComparison.find(t => t.symbol === token.symbol)) {
      setSelectedForComparison(prev => [...prev, token]);
    }
  };

  const handleShowChart = (token: TokenRow) => {
    // TODO: Implement chart modal
    console.log('Show chart for:', token.symbol);
  };

  const handleShowAlerts = () => {
    // TODO: Implement alerts modal
    console.log('Show alerts');
  };

  if (error && !isLoading) {
    return (
      <div className="space-y-6">
        <Card className="rounded-2xl shadow-soft border-border">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Failed to load token data</h2>
              <p className="text-muted-foreground mb-4">
                Please check your connection and try again.
              </p>
              <Button onClick={() => mutate()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-display">All Tokens</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive view of all available tokenized stocks with real-time data
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleShowAlerts}>
            <BellIcon className="h-4 w-4 mr-2" />
            Price Alerts
          </Button>
          <Button variant="outline" disabled={selectedForComparison.length === 0}>
            <ChartBarIcon className="h-4 w-4 mr-2" />
            Compare ({selectedForComparison.length}/4)
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      {!isLoading && data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="rounded-2xl shadow-soft border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{rows.length}</p>
              <p className="text-sm text-muted-foreground">Total Tokens</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-soft border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{data.sources.kraken}</p>
              <p className="text-sm text-muted-foreground">Kraken</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-soft border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{data.sources.coingecko}</p>
              <p className="text-sm text-muted-foreground">CoinGecko</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-soft border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{watchlist.length}</p>
              <p className="text-sm text-muted-foreground">Watchlist</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Token Table */}
      {isLoading ? (
        <Card className="rounded-2xl shadow-soft border-border">
          <CardContent className="p-12">
            <div className="flex items-center justify-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span className="text-lg text-muted-foreground">Loading token data...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl shadow-soft border-border">
          <CardHeader>
            <CardTitle>Token Listings</CardTitle>
            <CardDescription>
              Real-time prices, volumes, and market data for all available tokenized stocks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EnhancedTokenTable
              rows={rows}
              onBuyClick={handleBuyClick}
              watchlist={watchlist}
              onToggleWatchlist={toggleWatchlist}
              onAddToComparison={handleAddToComparison}
              selectedForComparison={selectedForComparison}
              onShowChart={handleShowChart}
              onShowAlerts={handleShowAlerts}
            />
          </CardContent>
        </Card>
      )}

      {/* Data Source Info */}
      {data && (
        <Card className="rounded-2xl shadow-soft border-border">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>Data sources: {data.sources.kraken} Kraken, {data.sources.coingecko} CoinGecko, {data.sources.unavailable} unavailable</span>
                {data.circuitBreakers && (
                  <span className="text-xs">
                    Circuits: Kraken ({data.circuitBreakers.kraken}), CoinGecko ({data.circuitBreakers.coingecko})
                  </span>
                )}
              </div>
              <span>Last updated: {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : '—'}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
