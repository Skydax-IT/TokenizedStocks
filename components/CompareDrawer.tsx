'use client';

import { useState, useEffect } from 'react';
import { TokenRow } from '@/lib/types';
import { formatUsd, formatPercentage } from '@/lib/normalize';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  XIcon, 
  TrendingUpIcon, 
  TrendingDownIcon, 
  BarChart3Icon,
  TrashIcon,
  ExternalLinkIcon
} from 'lucide-react';
import { getAffiliateUrl, hasAffiliateLink } from '@/lib/affiliates';

interface CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTokens: TokenRow[];
  onRemoveToken: (symbol: string) => void;
}

export default function CompareDrawer({ 
  isOpen, 
  onClose, 
  selectedTokens, 
  onRemoveToken 
}: CompareDrawerProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen) return null;

  const handleBuyClick = (token: TokenRow) => {
    if (hasAffiliateLink(token)) {
      window.open(getAffiliateUrl(token), '_blank');
    }
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-success' : 'text-danger';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? TrendingUpIcon : TrendingDownIcon;
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-4xl bg-background border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-2xl font-bold">Compare Tokens</h2>
              <p className="text-muted">
                Compare {selectedTokens.length} selected tokens
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XIcon className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {selectedTokens.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3Icon className="h-16 w-16 mx-auto text-muted mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Tokens Selected</h3>
                <p className="text-muted">
                  Select tokens from the table to compare their performance
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Quick Stats Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Price Comparison</CardTitle>
                    <CardDescription>
                      Current prices and 24h changes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedTokens.map((token) => {
                        const ChangeIcon = getChangeIcon(token.change24h);
                        return (
                          <div key={token.symbol} className="p-4 border border-border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{token.symbol}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveToken(token.symbol)}
                                className="h-6 w-6 p-0"
                              >
                                <TrashIcon className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <div className="text-2xl font-bold font-mono">
                                {formatUsd(token.price)}
                              </div>
                              <div className={`flex items-center gap-1 ${getChangeColor(token.change24h)}`}>
                                <ChangeIcon className="h-4 w-4" />
                                <span className="font-medium">
                                  {formatPercentage(token.change24h)}
                                </span>
                              </div>
                              <div className="text-sm text-muted">
                                {token.name}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Comparison Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Comparison</CardTitle>
                    <CardDescription>
                      Side-by-side comparison of key metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Metric</TableHead>
                            {selectedTokens.map((token) => (
                              <TableHead key={token.symbol} className="text-center">
                                {token.symbol}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Price</TableCell>
                            {selectedTokens.map((token) => (
                              <TableCell key={token.symbol} className="text-center font-mono">
                                {formatUsd(token.price)}
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">24h Change</TableCell>
                            {selectedTokens.map((token) => {
                              const ChangeIcon = getChangeIcon(token.change24h);
                              return (
                                <TableCell key={token.symbol} className="text-center">
                                  <div className={`flex items-center justify-center gap-1 ${getChangeColor(token.change24h)}`}>
                                    <ChangeIcon className="h-4 w-4" />
                                    <span className="font-medium">
                                      {formatPercentage(token.change24h)}
                                    </span>
                                  </div>
                                </TableCell>
                              );
                            })}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Market Cap</TableCell>
                            {selectedTokens.map((token) => (
                              <TableCell key={token.symbol} className="text-center font-mono">
                                {formatUsd(token.marketCap)}
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Volume (24h)</TableCell>
                            {selectedTokens.map((token) => (
                              <TableCell key={token.symbol} className="text-center font-mono">
                                {formatUsd(token.volume24h)}
                              </TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Category</TableCell>
                            {selectedTokens.map((token) => (
                              <TableCell key={token.symbol} className="text-center">
                                <Badge variant="secondary">{token.category}</Badge>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Actions you can take with selected tokens
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTokens.map((token) => (
                        <div key={token.symbol} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div>
                            <span className="font-medium">{token.symbol}</span>
                            <span className="text-sm text-muted ml-2">- {token.name}</span>
                          </div>
                          <div className="flex gap-2">
                            {hasAffiliateLink(token) && (
                              <Button
                                size="sm"
                                onClick={() => handleBuyClick(token)}
                              >
                                <ExternalLinkIcon className="h-4 w-4 mr-2" />
                                Buy
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onRemoveToken(token.symbol)}
                            >
                              <TrashIcon className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted">
                {selectedTokens.length} token{selectedTokens.length !== 1 ? 's' : ''} selected
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                {selectedTokens.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      // TODO: Implement export functionality
                      console.log('Export comparison data');
                    }}
                  >
                    Export Data
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
