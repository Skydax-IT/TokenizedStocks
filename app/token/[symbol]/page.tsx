'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TokenRow } from '@/lib/types';
import { fetchTokens } from '@/lib/fetchers/enhanced';
import { formatUsd, formatPercentage, getChangeColorClass } from '@/lib/normalize';
import { getAffiliateUrl, hasAffiliateLink } from '@/lib/affiliates';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  TrendingUpIcon, 
  TrendingDownIcon, 
  ExternalLinkIcon,
  StarIcon,
  BarChart3Icon,
  DollarSignIcon,
  ActivityIcon,
  GlobeIcon,
  CalendarIcon
} from 'lucide-react';

export default function TokenDetailPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = params.symbol as string;
  
  const [token, setToken] = useState<TokenRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    loadTokenData();
  }, [symbol]);

  const loadTokenData = async () => {
    try {
      setLoading(true);
      const tokens = await fetchTokens();
      const foundToken = tokens.find(t => t.symbol === symbol);
      
      if (foundToken) {
        setToken(foundToken);
        setError(null);
      } else {
        setError(`Token ${symbol} not found`);
      }
    } catch (err) {
      setError('Failed to load token data');
      console.error('Error loading token:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = () => {
    if (token && hasAffiliateLink(token.symbol)) {
      const affiliateUrl = getAffiliateUrl(token.symbol);
      if (affiliateUrl) {
        window.open(affiliateUrl, '_blank');
      }
    }
  };

  const handleBackClick = () => {
    router.push('/tokens');
  };

  const handleWatchlistToggle = () => {
    setIsInWatchlist(!isInWatchlist);
    // TODO: Implement actual watchlist functionality
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-6 space-y-6"
      >
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </motion.div>
    );
  }

  if (error || !token) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-6"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-4xl font-bold">!</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Token Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400">{error || `Token ${symbol} not found`}</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={handleBackClick} variant="outline">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Tokens
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const ChangeIcon = token.change24hPct >= 0 ? TrendingUpIcon : TrendingDownIcon;
  const changeColorClass = getChangeColorClass(token.change24hPct);

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
        className="flex items-center gap-4"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={handleBackClick} variant="outline" size="sm">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </Button>
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">{token.symbol[0]}</span>
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{token.symbol}</h1>
              <p className="text-gray-600 dark:text-gray-400">{token.name}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleWatchlistToggle}
              className={isInWatchlist ? 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-100' : ''}
            >
              <StarIcon className={`h-4 w-4 mr-2 ${isInWatchlist ? 'fill-current' : ''}`} />
              {isInWatchlist ? 'Watching' : 'Watchlist'}
            </Button>
          </motion.div>
          {hasAffiliateLink(token.symbol) && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleBuyClick} size="sm">
                <ExternalLinkIcon className="h-4 w-4 mr-2" />
                Buy {token.symbol}
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Current Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div 
                key={token.priceUsd}
                initial={{ scale: 1.1, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold text-gray-900 dark:text-gray-100"
              >
                {formatUsd(token.priceUsd)}
              </motion.div>
              <div className={`flex items-center gap-2 mt-2 ${changeColorClass}`}>
                <motion.div
                  animate={{ rotate: token.change24hPct >= 0 ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChangeIcon className="h-4 w-4" />
                </motion.div>
                <span className="font-medium">
                  {formatPercentage(token.change24hPct)}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                24h Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatUsd(token.volume24hUsd)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Trading activity
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Data Source
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant={token.source === 'kraken' ? 'default' : 'secondary'}>
                  {token.source.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {token.source === 'kraken' ? 'Direct API' : 'Aggregated'}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
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
            <TabsTrigger value="chart">Price Chart</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="overview" className="space-y-6">
              <motion.div 
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <motion.div whileHover={{ y: -2, transition: { duration: 0.2 } }}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSignIcon className="h-5 w-5" />
                        Price Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Current Price</span>
                        <span className="font-medium">{formatUsd(token.priceUsd)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">24h Change</span>
                        <span className={`font-medium ${changeColorClass}`}>
                          {formatPercentage(token.change24hPct)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">24h Volume</span>
                        <span className="font-medium">{formatUsd(token.volume24hUsd)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Data Source</span>
                        <Badge variant="outline">{token.source.toUpperCase()}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ y: -2, transition: { duration: 0.2 } }}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ActivityIcon className="h-5 w-5" />
                        Market Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Symbol</span>
                        <span className="font-mono font-medium">{token.symbol}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Company Name</span>
                        <span className="font-medium">{token.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                        <span className="text-sm text-gray-500">Real-time</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Status</span>
                        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          Active
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="chart" className="space-y-6">
              <motion.div 
                key="chart"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3Icon className="h-5 w-5" />
                      Price Chart
                    </CardTitle>
                    <CardDescription>
                      Interactive price chart for {token.symbol}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <BarChart3Icon className="h-16 w-16 text-gray-400 mx-auto" />
                        </motion.div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Chart Coming Soon</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Interactive price charts will be available in the next update
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <motion.div 
                key="analysis"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Analysis</CardTitle>
                    <CardDescription>
                      Market analysis and insights for {token.symbol}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <BarChart3Icon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Analysis Coming Soon</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Technical analysis tools and market insights will be available soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="news" className="space-y-6">
              <motion.div 
                key="news"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Latest News</CardTitle>
                    <CardDescription>
                      Recent news and updates related to {token.symbol}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <GlobeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">News Coming Soon</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Latest news and market updates will be available soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
