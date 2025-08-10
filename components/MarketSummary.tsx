'use client';

import { useMemo } from 'react';
import { TokenRow } from '@/lib/types';
import { formatUsd, formatPercentage } from '@/lib/normalize';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUpIcon, TrendingDownIcon, BarChart3Icon, DollarSignIcon, GlobeIcon } from 'lucide-react';

interface MarketSummaryProps {
  tokens: TokenRow[];
}

export default function MarketSummary({ tokens }: MarketSummaryProps) {
  const stats = useMemo(() => {
    if (!tokens.length) return null;

    const totalMarketCap = tokens.reduce((sum, token) => sum + (token.priceUsd * 1000000), 0); // Assuming 1M shares per token
    const avg24hChange = tokens.reduce((sum, token) => sum + token.change24hPct, 0) / tokens.length;
    
    const sortedByChange = [...tokens].sort((a, b) => Math.abs(b.change24hPct) - Math.abs(a.change24hPct));
    const topGainer = sortedByChange.find(token => token.change24hPct > 0);
    const topLoser = sortedByChange.find(token => token.change24hPct < 0);
    
    const sortedByVolume = [...tokens].sort((a, b) => b.volume24hUsd - a.volume24hUsd);
    const volumeLeader = sortedByVolume[0];
    
    const sortedByPremium = [...tokens].sort((a, b) => Math.abs(b.change24hPct) - Math.abs(a.change24hPct));
    const topPremium = sortedByPremium.find(token => token.change24hPct > 0);
    const topDiscount = sortedByPremium.find(token => token.change24hPct < 0);

    return {
      totalMarketCap,
      avg24hChange,
      topGainer,
      topLoser,
      volumeLeader,
      topPremium,
      topDiscount,
      totalTokens: tokens.length
    };
  }, [tokens]);

  const getMarketStatus = () => {
    if (!stats) return { status: 'Loading', variant: 'secondary' as const };
    
    if (stats.avg24hChange > 2) return { status: 'Bull Market', variant: 'success' as const };
    if (stats.avg24hChange < -2) return { status: 'Bear Market', variant: 'destructive' as const };
    return { status: 'Neutral', variant: 'secondary' as const };
  };

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const marketStatus = getMarketStatus();

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <Card className="shadow-soft border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-3xl font-display">Market Overview</CardTitle>
              <CardDescription className="text-lg mt-2">
                Real-time data from global exchanges • Auto-refreshes every 5 minutes
              </CardDescription>
            </div>
            <Badge variant={marketStatus.variant} className="text-sm px-3 py-1">
              {marketStatus.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {formatUsd(stats.totalMarketCap)}
              </p>
              <p className="text-sm text-muted-foreground">Total Market Cap</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${stats.avg24hChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatPercentage(stats.avg24hChange)}
              </p>
              <p className="text-sm text-muted-foreground">Avg 24h Change</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {stats.totalTokens}
              </p>
              <p className="text-sm text-muted-foreground">Listed Tokens</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">
                {stats.topGainer ? formatPercentage(stats.topGainer.change24hPct) : '—'}
              </p>
              <p className="text-sm text-muted-foreground">Top Gainer</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Highlights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Top Movers 24h */}
        <Card className="shadow-soft border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUpIcon className="h-5 w-5 text-success" />
              Top Movers 24h
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[stats.topGainer, stats.topLoser].filter(Boolean).map((token, index) => (
              <div key={token?.symbol || index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{token?.symbol}</span>
                  <span className="text-sm text-muted-foreground">{token?.name}</span>
                </div>
                <span className={`font-mono ${token?.change24hPct && token.change24hPct > 0 ? 'text-success' : 'text-destructive'}`}>
                  {token ? formatPercentage(token.change24hPct) : '—'}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Volume Leaders */}
        <Card className="shadow-soft border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3Icon className="h-5 w-5 text-accent" />
              Volume Leaders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.volumeLeader && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{stats.volumeLeader.symbol}</span>
                  <span className="text-sm text-muted-foreground">{stats.volumeLeader.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg">{formatUsd(stats.volumeLeader.volume24hUsd)}</p>
                  <p className="text-xs text-muted-foreground">24h Volume</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Premium/Discount Watch */}
        <Card className="shadow-soft border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSignIcon className="h-5 w-5 text-warning" />
              Premium/Discount
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topPremium && (
              <div className="flex items-center justify-between">
                <span className="font-medium">{stats.topPremium.symbol}</span>
                <span className="font-mono text-success">
                  +{formatPercentage(stats.topPremium.change24hPct)}
                </span>
              </div>
            )}
            {stats.topDiscount && (
              <div className="flex items-center justify-between">
                <span className="font-medium">{stats.topDiscount.symbol}</span>
                <span className="font-mono text-destructive">
                  {formatPercentage(stats.topDiscount.change24hPct)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-soft border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a href="/tokens" className="block w-full text-left">
              <div className="p-2 rounded-md hover:bg-muted/50 transition-colors">
                <div className="font-medium">View All Tokens</div>
                <div className="text-sm text-muted-foreground">Browse complete listing</div>
              </div>
            </a>
            <a href="/docs/apis" className="block w-full text-left">
              <div className="p-2 rounded-md hover:bg-muted/50 transition-colors">
                <div className="font-medium">API Access</div>
                <div className="text-sm text-muted-foreground">Developer resources</div>
              </div>
            </a>
            <a href="/styleguide" className="block w-full text-left">
              <div className="p-2 rounded-md hover:bg-muted/50 transition-colors">
                <div className="font-medium">Design System</div>
                <div className="text-sm text-muted-foreground">Component library</div>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
