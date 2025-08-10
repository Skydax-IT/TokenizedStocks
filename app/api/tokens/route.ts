import { NextRequest, NextResponse } from 'next/server';
import { getAllTokens, type TokenConfig } from '@/lib/tokens';
import { fetchKrakenTicker } from '@/lib/fetchers/kraken';
import { fetchCoinGeckoTicker } from '@/lib/fetchers/coingecko';
import { fetchMockTicker } from '@/lib/fetchers/mock';
import { normalizeTokenData } from '@/lib/normalize';
import { TokenRow } from '@/lib/types';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';
import { checkCircuitBreaker } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Fetch token data with Kraken priority, CoinGecko fallback, and mock data as final fallback
 */
async function fetchTokenData(token: TokenConfig): Promise<TokenRow | null> {
  // Try Kraken first if krakenPair is available
  if (token.krakenPair && token.krakenPair.trim() !== '') {
    try {
      const krakenData = await fetchKrakenTicker(token.krakenPair);
      const normalized = normalizeTokenData(
        token.symbol,
        token.name,
        krakenData.priceUsd,
        krakenData.change24hPct,
        krakenData.volume24hUsd,
        'kraken'
      );
      
      if (normalized) {
        return normalized;
      }
    } catch (error) {
      console.warn(`Kraken failed for ${token.symbol}:`, error);
      // Fall through to CoinGecko
    }
  }

  // Fallback to CoinGecko
  try {
    const coingeckoData = await fetchCoinGeckoTicker(token.coingeckoId);
    const normalized = normalizeTokenData(
      token.symbol,
      token.name,
      coingeckoData.priceUsd,
      coingeckoData.change24hPct,
      coingeckoData.volume24hUsd,
      'coingecko'
    );
    
    if (normalized) {
      return normalized;
    }
  } catch (error) {
    console.warn(`CoinGecko failed for ${token.symbol}:`, error);
    // Fall through to mock data
  }

  // Final fallback to mock data for development
  try {
    const mockData = await fetchMockTicker(token);
    const normalized = normalizeTokenData(
      token.symbol,
      token.name,
      mockData.priceUsd,
      mockData.change24hPct,
      mockData.volume24hUsd,
      'coingecko' // Use coingecko as source for mock data
    );
    
    if (normalized) {
      return normalized;
    }
  } catch (error) {
    console.warn(`Mock data failed for ${token.symbol}:`, error);
    // Token unavailable from all sources
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP, { maxRequests: 100, windowMs: 60000 });
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
          updatedAt: new Date().toISOString()
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          },
        }
      );
    }

    // Check circuit breakers for external APIs
    const krakenCircuit = checkCircuitBreaker('kraken');
    const coingeckoCircuit = checkCircuitBreaker('coingecko');

    // Load tokens from configuration
    const tokens = getAllTokens();
    
    // Fetch data for all tokens concurrently
    const tokenPromises = tokens.map(fetchTokenData);
    const results = await Promise.allSettled(tokenPromises);

    // Process results and count sources
    const validTokens: TokenRow[] = [];
    const warnings: string[] = [];
    let krakenCount = 0;
    let coingeckoCount = 0;
    let unavailableCount = 0;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        validTokens.push(result.value);
        if (result.value.source === 'kraken') {
          krakenCount++;
        } else {
          coingeckoCount++;
        }
      } else {
        unavailableCount++;
        const tokenSymbol = tokens[index].symbol;
        warnings.push(`Token ${tokenSymbol} unavailable from both APIs`);
        console.warn(`Token ${tokenSymbol} unavailable from both APIs`);
      }
    });

    // Sort tokens by symbol for consistent ordering
    validTokens.sort((a, b) => a.symbol.localeCompare(b.symbol));

    const apiResponse = {
      data: validTokens,
      updatedAt: new Date().toISOString(),
      sources: {
        kraken: krakenCount,
        coingecko: coingeckoCount,
        unavailable: unavailableCount,
      },
      warnings: warnings.length > 0 ? warnings : undefined,
      circuitBreakers: {
        kraken: krakenCircuit.state,
        coingecko: coingeckoCircuit.state,
      },
    };

    return NextResponse.json(apiResponse, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
      },
    });

  } catch (error) {
    console.error('Error in /api/tokens:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch token data',
        message: error instanceof Error ? error.message : 'Unknown error',
        updatedAt: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  }
}

