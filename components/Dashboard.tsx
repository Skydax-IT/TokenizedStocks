'use client';

import { useState, useEffect } from 'react';
import { TokenRow } from '@/lib/types';
import { fetchTokens } from '@/lib/fetchers/enhanced';
import MarketSummary from './MarketSummary';
import EnhancedTokenTable from './EnhancedTokenTable';
import Portfolio from './Portfolio';
import PriceAlerts from './PriceAlerts';
import CompareDrawer from './CompareDrawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCwIcon, AlertTriangleIcon, BarChart3Icon, GitCompareIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [tokens, setTokens] = useState<TokenRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [compareDrawerOpen, setCompareDrawerOpen] = useState(false);
  const [selectedTokensForComparison, setSelectedTokensForComparison] = useState<TokenRow[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      setLoading(true);
      const data = await fetchTokens();
      setTokens(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to load token data');
      console.error('Error loading tokens:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadTokens();
  };

  const handleBuyClick = (symbol: string) => {
    // This will be handled by the EnhancedTokenTable component
    console.log('Buy clicked for:', symbol);
  };

  const handleShowChart = (token: TokenRow) => {
    // Navigation is now handled automatically by EnhancedTokenTable
    console.log('Show chart for:', token.symbol);
  };

  const handleAddToComparison = (token: TokenRow) => {
    if (selectedTokensForComparison.find(t => t.symbol === token.symbol)) {
      // Remove if already selected
      setSelectedTokensForComparison(prev => 
        prev.filter(t => t.symbol !== token.symbol)
      );
    } else {
      // Add if not already selected (max 4 tokens)
      if (selectedTokensForComparison.length < 4) {
        setSelectedTokensForComparison(prev => [...prev, token]);
      }
    }
  };

  const handleRemoveFromComparison = (symbol: string) => {
    setSelectedTokensForComparison(prev => 
      prev.filter(t => t.symbol !== symbol)
    );
  };

  const handleOpenCompareDrawer = () => {
    if (selectedTokensForComparison.length > 0) {
      setCompareDrawerOpen(true);
    }
  };

  const handleShowAlerts = () => {
    setActiveTab('alerts');
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-6 space-y-6"
      >
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Skeleton className="h-32 w-full" />
            </motion.div>
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-6"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center"
          >
            <AlertTriangleIcon className="h-12 w-12 text-white" />
          </motion.div>
          <h2 className="text-2xl font-semibold text-foreground">Error Loading Data</h2>
          <p className="text-muted-foreground">{error}</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={loadTokens} variant="outline">
              Try Again
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-4 py-6 space-y-6"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tokenized Stocks Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time market data and portfolio tracking
            {lastUpdated && (
              <motion.span 
                key={lastUpdated.getTime()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="ml-2 text-sm"
              >
                • Last updated: {lastUpdated.toLocaleTimeString()}
              </motion.span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleOpenCompareDrawer}
              disabled={selectedTokensForComparison.length === 0}
              variant="outline"
              size="sm"
            >
              <GitCompareIcon className="h-4 w-4 mr-2" />
              Compare ({selectedTokensForComparison.length})
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <motion.div
                animate={{ rotate: loading ? 360 : 0 }}
                transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
              >
                <RefreshCwIcon className="h-4 w-4 mr-2" />
              </motion.div>
              Refresh
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Market Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <MarketSummary tokens={tokens} />
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="space-y-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="overview" className="space-y-6">
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <EnhancedTokenTable
                  rows={tokens}
                  onBuyClick={handleBuyClick}
                  watchlist={[]} // TODO: Implement watchlist functionality
                  onToggleWatchlist={(symbol) => console.log('Toggle watchlist:', symbol)}
                  onAddToComparison={handleAddToComparison}
                  selectedForComparison={selectedTokensForComparison}
                  onShowAlerts={handleShowAlerts}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <motion.div
                key="portfolio"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Portfolio />
              </motion.div>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <motion.div
                key="alerts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PriceAlerts tokens={tokens} />
              </motion.div>
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <motion.div
                key="charts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center py-12">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <BarChart3Icon className="h-16 w-16 text-muted mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Interactive Charts</h3>
                  <p className="text-muted-foreground">
                    Select tokens from the overview to view detailed charts and analysis.
                  </p>
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>

      {/* Compare Drawer */}
      <CompareDrawer
        isOpen={compareDrawerOpen}
        onClose={() => setCompareDrawerOpen(false)}
        selectedTokens={selectedTokensForComparison}
        onRemoveToken={handleRemoveFromComparison}
      />
    </motion.div>
  );
}
