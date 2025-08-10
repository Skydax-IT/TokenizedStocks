'use client';

import { useState } from 'react';
import { TokenRow } from '@/lib/types';
import { getAffiliateUrl, hasAffiliateLink } from '@/lib/affiliates';
import { formatUsd, formatPercentage } from '@/lib/normalize';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLinkIcon, TrendingUpIcon, TrendingDownIcon, BarChart3Icon, GlobeIcon, ShieldIcon } from 'lucide-react';

interface ListingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  token: TokenRow | null;
}

export default function ListingsPanel({ isOpen, onClose, token }: ListingsPanelProps) {
  const [activeTab, setActiveTab] = useState('listings');

  if (!isOpen || !token) return null;

  const affiliateUrl = hasAffiliateLink(token.symbol) ? getAffiliateUrl(token.symbol) : null;
  const isPositive = token.change24hPct >= 0;

  const handleBuyClick = () => {
    if (affiliateUrl) {
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl border-l border-border">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-accent">{token.symbol[0]}</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold">{token.symbol}</h2>
                <p className="text-sm text-muted-foreground">{token.name}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <span className="sr-only">Close</span>
              ×
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
              {/* Price Overview */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Current Price</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-3xl font-bold font-mono">
                    {formatUsd(token.priceUsd)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={isPositive ? 'success' : 'destructive'}
                      className="font-mono"
                    >
                      {isPositive ? '+' : ''}{formatPercentage(token.change24hPct)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">24h change</span>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="listings">Listings</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="risk">Risk</TabsTrigger>
                </TabsList>

                <TabsContent value="listings" className="space-y-4 mt-4">
                  {/* Trading Volume */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3Icon className="h-5 w-5" />
                        Trading Volume
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold font-mono">
                        {formatUsd(token.volume24hUsd)}
                      </div>
                      <p className="text-sm text-muted-foreground">24h volume</p>
                    </CardContent>
                  </Card>

                  {/* Buy Options */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Where to Buy</CardTitle>
                      <CardDescription>
                        Purchase {token.symbol} through our trusted partners
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {affiliateUrl ? (
                        <Button 
                          onClick={handleBuyClick}
                          className="w-full gap-2"
                          size="lg"
                        >
                          <ExternalLinkIcon className="h-4 w-4" />
                          Buy {token.symbol}
                        </Button>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground">No affiliate link available</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Check back later for buying options
                          </p>
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground text-center">
                        Trading through affiliate links may earn us a commission
                      </div>
                    </CardContent>
                  </Card>

                  {/* Data Source */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <GlobeIcon className="h-5 w-5" />
                        Data Source
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline" className="capitalize">
                        {token.source}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-2">
                        Price data provided by {token.source === 'kraken' ? 'Kraken Exchange' : 'CoinGecko'}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="about" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {token.name} is a tokenized representation of the underlying stock. 
                        Tokenized stocks allow investors to trade fractional shares of 
                        traditional equities using blockchain technology.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="risk" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShieldIcon className="h-5 w-5" />
                        Risk Disclosure
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-muted-foreground space-y-2">
                        <p>• Tokenized stocks carry the same risks as traditional stocks</p>
                        <p>• Market volatility can result in significant losses</p>
                        <p>• Past performance doesn't guarantee future results</p>
                        <p>• Consider consulting a financial advisor before investing</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
