'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusIcon, TrashIcon, TrendingUpIcon, TrendingDownIcon, DollarSignIcon } from 'lucide-react';

interface PortfolioItem {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  totalCost: number;
  gainLoss: number;
  gainLossPct: number;
}

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      shares: 10,
      avgPrice: 250.00,
      currentPrice: 275.50,
      totalValue: 2755.00,
      totalCost: 2500.00,
      gainLoss: 255.00,
      gainLossPct: 10.2
    },
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 15,
      avgPrice: 150.00,
      currentPrice: 145.75,
      totalValue: 2186.25,
      totalCost: 2250.00,
      gainLoss: -63.75,
      gainLossPct: -2.83
    }
  ]);

  const [newSymbol, setNewSymbol] = useState('');
  const [newShares, setNewShares] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const totalPortfolioValue = portfolioItems.reduce((sum, item) => sum + item.totalValue, 0);
  const totalPortfolioCost = portfolioItems.reduce((sum, item) => sum + item.totalCost, 0);
  const totalGainLoss = portfolioItems.reduce((sum, item) => sum + item.gainLoss, 0);
  const totalGainLossPct = totalPortfolioCost > 0 ? (totalGainLoss / totalPortfolioCost) * 100 : 0;

  const addPortfolioItem = () => {
    if (!newSymbol || !newShares || !newPrice) return;

    const shares = parseFloat(newShares);
    const price = parseFloat(newPrice);
    const totalCost = shares * price;

    const newItem: PortfolioItem = {
      symbol: newSymbol.toUpperCase(),
      name: `${newSymbol.toUpperCase()} Stock`, // In a real app, you'd fetch the actual name
      shares,
      avgPrice: price,
      currentPrice: price, // For demo, using same as purchase price
      totalValue: totalCost,
      totalCost,
      gainLoss: 0,
      gainLossPct: 0
    };

    setPortfolioItems([...portfolioItems, newItem]);
    setNewSymbol('');
    setNewShares('');
    setNewPrice('');
  };

  const removePortfolioItem = (symbol: string) => {
    setPortfolioItems(portfolioItems.filter(item => item.symbol !== symbol));
  };

  const getGainLossColor = (value: number) => {
    if (value > 0) return 'text-success';
    if (value < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getGainLossIcon = (value: number) => {
    if (value > 0) return <TrendingUpIcon className="h-4 w-4 text-success" />;
    if (value < 0) return <TrendingDownIcon className="h-4 w-4 text-destructive" />;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {portfolioItems.length} positions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPortfolioCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Average cost basis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              {getGainLossIcon(totalGainLoss)}
              Total P&L
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getGainLossColor(totalGainLoss)}`}>
              ${totalGainLoss.toLocaleString()}
            </div>
            <p className={`text-xs ${getGainLossColor(totalGainLoss)}`}>
              {totalGainLossPct >= 0 ? '+' : ''}{totalGainLossPct.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalGainLossPct >= 0 ? 'text-success' : 'text-destructive'}`}>
              {totalGainLossPct >= 0 ? '+' : ''}{totalGainLossPct.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall return
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Position */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Position</CardTitle>
          <CardDescription>
            Add a new stock position to your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Symbol (e.g., TSLA)"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Shares"
              type="number"
              value={newShares}
              onChange={(e) => setNewShares(e.target.value)}
              className="w-32"
            />
            <Input
              placeholder="Price per share"
              type="number"
              step="0.01"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-40"
            />
            <Button onClick={addPortfolioItem} className="shrink-0">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Table */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Positions</CardTitle>
          <CardDescription>
            Your current stock positions and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {portfolioItems.length === 0 ? (
            <div className="text-center py-12">
              <DollarSignIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No positions yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first stock position to start tracking your portfolio
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Shares</TableHead>
                  <TableHead className="text-right">Avg Price</TableHead>
                  <TableHead className="text-right">Current Price</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioItems.map((item) => (
                  <TableRow key={item.symbol}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.symbol}</div>
                        <div className="text-sm text-muted-foreground">{item.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{item.shares}</TableCell>
                    <TableCell className="text-right font-mono">
                      ${item.avgPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${item.currentPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${item.totalValue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${item.totalCost.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`font-mono ${getGainLossColor(item.gainLoss)}`}>
                        ${item.gainLoss.toLocaleString()}
                      </div>
                      <div className={`text-xs ${getGainLossColor(item.gainLossPct)}`}>
                        {item.gainLossPct >= 0 ? '+' : ''}{item.gainLossPct.toFixed(2)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePortfolioItem(item.symbol)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Insights */}
      {portfolioItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Insights</CardTitle>
            <CardDescription>
              Key metrics and analysis for your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {portfolioItems.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Positions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  ${(totalPortfolioValue / portfolioItems.length).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Average Position Size</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {portfolioItems.filter(item => item.gainLoss > 0).length}/{portfolioItems.length}
                </div>
                <div className="text-sm text-muted-foreground">Profitable Positions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
