import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const historyQuerySchema = z.object({
  timeframe: z.enum(['1h', '24h', '7d', '30d']).default('24h'),
  limit: z.coerce.number().min(1).max(100).default(24),
});

interface HistoryDataPoint {
  timestamp: number;
  price: number;
  volume: number;
}

/**
 * Generate mock historical data for demonstration
 * In a real implementation, this would fetch from CoinGecko, Kraken, or other APIs
 */
function generateMockHistoryData(symbol: string, timeframe: string, limit: number): HistoryDataPoint[] {
  const now = Date.now();
  const data: HistoryDataPoint[] = [];
  
  // Calculate interval based on timeframe
  let intervalMs: number;
  switch (timeframe) {
    case '1h':
      intervalMs = 60 * 60 * 1000; // 1 hour
      break;
    case '24h':
      intervalMs = 60 * 60 * 1000; // 1 hour intervals for 24h
      break;
    case '7d':
      intervalMs = 24 * 60 * 60 * 1000; // 1 day intervals for 7d
      break;
    case '30d':
      intervalMs = 24 * 60 * 60 * 1000; // 1 day intervals for 30d
      break;
    default:
      intervalMs = 60 * 60 * 1000;
  }

  // Generate base price based on symbol (for demo purposes)
  const basePrice = symbol.length * 10 + Math.random() * 100;
  
  for (let i = limit - 1; i >= 0; i--) {
    const timestamp = now - (i * intervalMs);
    const volatility = 0.05; // 5% volatility
    const randomChange = (Math.random() - 0.5) * volatility;
    const price = basePrice * (1 + randomChange);
    const volume = basePrice * 1000 * (0.5 + Math.random() * 0.5); // Random volume
    
    data.push({
      timestamp,
      price: parseFloat(price.toFixed(2)),
      volume: parseFloat(volume.toFixed(2)),
    });
  }
  
  return data;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP, { maxRequests: 50, windowMs: 60000 });
    
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
            'X-RateLimit-Limit': '50',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          },
        }
      );
    }

    // Validate symbol parameter
    const symbol = params.symbol?.toUpperCase();
    if (!symbol) {
      return NextResponse.json(
        { 
          error: 'Invalid symbol',
          message: 'Symbol parameter is required',
          updatedAt: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    
    const validationResult = historyQuerySchema.safeParse(queryParams);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid query parameters',
          message: validationResult.error.issues[0].message,
          updatedAt: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    const { timeframe, limit } = validationResult.data;

    // Generate mock historical data
    const historyData = generateMockHistoryData(symbol, timeframe, limit);

    const response = {
      symbol,
      timeframe,
      data: historyData,
      count: historyData.length,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-RateLimit-Limit': '50',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
      },
    });

  } catch (error) {
    console.error('Error in /api/tokens/[symbol]/history:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch historical data',
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
