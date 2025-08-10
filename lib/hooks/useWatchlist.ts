'use client';

import { useState, useEffect, useCallback } from 'react';

const WATCHLIST_STORAGE_KEY = 'tokenized-stocks-watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWatchlist(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load watchlist from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
      } catch (error) {
        console.error('Failed to save watchlist to localStorage:', error);
      }
    }
  }, [watchlist, isLoaded]);

  const addToWatchlist = useCallback((symbol: string) => {
    setWatchlist(prev => {
      if (prev.includes(symbol)) return prev;
      return [...prev, symbol];
    });
  }, []);

  const removeFromWatchlist = useCallback((symbol: string) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
  }, []);

  const toggleWatchlist = useCallback((symbol: string) => {
    setWatchlist(prev => {
      if (prev.includes(symbol)) {
        return prev.filter(s => s !== symbol);
      } else {
        return [...prev, symbol];
      }
    });
  }, []);

  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
  }, []);

  const isInWatchlist = useCallback((symbol: string) => {
    return watchlist.includes(symbol);
  }, [watchlist]);

  return {
    watchlist,
    isLoaded,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    clearWatchlist,
    isInWatchlist,
  };
}
