'use client';

import { useState, useEffect, useCallback } from 'react';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tokenized-stocks-watchlist');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWatchlist(parsed);
        }
      }
    } catch (error) {
      console.warn('Failed to load watchlist from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('tokenized-stocks-watchlist', JSON.stringify(watchlist));
      } catch (error) {
        console.warn('Failed to save watchlist to localStorage:', error);
      }
    }
  }, [watchlist, isLoaded]);

  const addToWatchlist = useCallback((symbol: string) => {
    setWatchlist(prev => {
      const upperSymbol = symbol.toUpperCase();
      if (!prev.includes(upperSymbol)) {
        return [...prev, upperSymbol];
      }
      return prev;
    });
  }, []);

  const removeFromWatchlist = useCallback((symbol: string) => {
    setWatchlist(prev => {
      const upperSymbol = symbol.toUpperCase();
      return prev.filter(s => s !== upperSymbol);
    });
  }, []);

  const toggleWatchlist = useCallback((symbol: string) => {
    const upperSymbol = symbol.toUpperCase();
    if (watchlist.includes(upperSymbol)) {
      removeFromWatchlist(upperSymbol);
    } else {
      addToWatchlist(upperSymbol);
    }
  }, [watchlist, addToWatchlist, removeFromWatchlist]);

  const isInWatchlist = useCallback((symbol: string) => {
    return watchlist.includes(symbol.toUpperCase());
  }, [watchlist]);

  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
  }, []);

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
    clearWatchlist,
    isLoaded,
  };
}
