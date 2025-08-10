'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TokenRow } from '@/lib/types';
import { formatUsd, formatPercentage, getChangeColorClass } from '@/lib/normalize';
import { getAffiliateUrl, hasAffiliateLink } from '@/lib/affiliates';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StarIcon, StarIcon as StarIconSolid, MoreHorizontalIcon, ExternalLinkIcon, StoreIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ListingsPanel from './ListingsPanel';

interface EnhancedTokenTableProps {
  rows: TokenRow[];
  onBuyClick: (symbol: string) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  onAddToComparison?: (token: TokenRow) => void;
  selectedForComparison?: TokenRow[];
  onShowChart?: (token: TokenRow) => void;
  onShowAlerts?: () => void;
}

type SortField = 'symbol' | 'name' | 'priceUsd' | 'change24hPct' | 'volume24hUsd' | 'source';
type SortDirection = 'asc' | 'desc';
type Density = 'comfortable' | 'compact';

export default function EnhancedTokenTable({
  rows,
  onBuyClick,
  watchlist,
  onToggleWatchlist,
  onAddToComparison,
  selectedForComparison = [],
  onShowChart,
  onShowAlerts
}: EnhancedTokenTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('symbol');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [density, setDensity] = useState<Density>('comfortable');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [premiumFilter, setPremiumFilter] = useState<string>('all');
  const [listingsPanelOpen, setListingsPanelOpen] = useState(false);
  const [selectedTokenForListings, setSelectedTokenForListings] = useState<TokenRow | null>(null);

  // Filter and sort data
  const filteredAndSortedRows = useMemo(() => {
    let filtered = rows;

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(row =>
        row.symbol.toLowerCase().includes(term) ||
        row.name.toLowerCase().includes(term)
      );
    }

    // Filter by source
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(row => row.source === sourceFilter);
    }

    // Filter by premium range
    if (premiumFilter !== 'all') {
      switch (premiumFilter) {
        case 'positive':
          filtered = filtered.filter(row => row.change24hPct > 0);
          break;
        case 'negative':
          filtered = filtered.filter(row => row.change24hPct < 0);
          break;
        case 'high':
          filtered = filtered.filter(row => Math.abs(row.change24hPct) > 5);
          break;
      }
    }

    // Sort data
    filtered.sort((a, b) => {
      let aVal: string | number = a[sortField];
      let bVal: string | number = b[sortField];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [rows, searchTerm, sortField, sortDirection, sourceFilter, premiumFilter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleShowListings = (token: TokenRow) => {
    setSelectedTokenForListings(token);
    setListingsPanelOpen(true);
  };

  const handleCloseListings = () => {
    setListingsPanelOpen(false);
    setSelectedTokenForListings(null);
  };

  const handleShowChart = (token: TokenRow) => {
    if (onShowChart) {
      onShowChart(token);
    } else {
      // Default behavior: navigate to token detail page
      router.push(`/token/${token.symbol}`);
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  const getRowClass = (index: number) => {
    const baseClass = density === 'compact' ? 'py-2' : 'py-4';
    const zebraClass = index % 2 === 0 ? 'bg-background' : 'bg-muted/30';
    return `${baseClass} ${zebraClass} hover:bg-muted/50 transition-colors`;
  };

  return (
    <>
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <Input
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="kraken">Kraken</SelectItem>
                <SelectItem value="coingecko">CoinGecko</SelectItem>
              </SelectContent>
            </Select>

            <Select value={premiumFilter} onValueChange={setPremiumFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Premium" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
                <SelectItem value="high">High Volatility</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select value={density} onValueChange={(value: Density) => setDensity(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredAndSortedRows.length} of {rows.length} tokens
        </div>

        {/* Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="sticky top-0 bg-background border-b border-border">
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort('symbol')}
                >
                  <div className="flex items-center">
                    Symbol
                    <SortIcon field="symbol" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    <SortIcon field="name" />
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort('priceUsd')}
                >
                  <div className="flex items-center justify-end">
                    Price (USD)
                    <SortIcon field="priceUsd" />
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort('change24hPct')}
                >
                  <div className="flex items-center justify-end">
                    24h %
                    <SortIcon field="change24hPct" />
                  </div>
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort('volume24hUsd')}
                >
                  <div className="flex items-center justify-end">
                    24h Vol (USD)
                    <SortIcon field="volume24hUsd" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort('source')}
                >
                  <div className="flex items-center">
                    Source
                    <SortIcon field="source" />
                  </div>
                </TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedRows.map((row, index) => (
                <TableRow key={row.symbol} className={getRowClass(index)}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{row.symbol}</span>
                      {watchlist.includes(row.symbol) && (
                        <StarIconSolid className="h-4 w-4 text-warning" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={row.name}>
                    {row.name}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatUsd(row.priceUsd)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={row.change24hPct >= 0 ? 'success' : 'destructive'}
                      className="font-mono"
                    >
                      {formatPercentage(row.change24hPct)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatUsd(row.volume24hUsd)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {row.source}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleWatchlist(row.symbol)}
                        className="h-8 w-8 p-0"
                      >
                        {watchlist.includes(row.symbol) ? (
                          <StarIconSolid className="h-4 w-4 text-warning" />
                        ) : (
                          <StarIcon className="h-4 w-4" />
                        )}
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleShowListings(row)}>
                            <StoreIcon className="h-4 w-4 mr-2" />
                            Where to buy
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onBuyClick(row.symbol)}>
                            <ExternalLinkIcon className="h-4 w-4 mr-2" />
                            Buy
                          </DropdownMenuItem>
                          {onShowChart && (
                            <DropdownMenuItem onClick={() => handleShowChart(row)}>
                              <ChartBarIcon className="h-4 w-4 mr-2" />
                              View Chart
                            </DropdownMenuItem>
                          )}
                          {onAddToComparison && (
                            <DropdownMenuItem onClick={() => onAddToComparison(row)}>
                              <CompareIcon className="h-4 w-4 mr-2" />
                              Add to Compare
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Empty state */}
        {filteredAndSortedRows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tokens found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Listings Panel */}
      <ListingsPanel
        isOpen={listingsPanelOpen}
        onClose={handleCloseListings}
        token={selectedTokenForListings}
      />
    </>
  );
}

// Missing icons - need to import or create
const ChartBarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const CompareIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
