# API Documentation

This document provides comprehensive information about the APIs used in the Tokenized Stocks Dashboard, including endpoints, data formats, and integration details.

## Overview

The Tokenized Stocks Dashboard integrates with two primary data sources:
1. **Kraken API** - Primary source for real-time tokenized stock data
2. **CoinGecko API** - Fallback source with broader coverage

## Data Sources

### Kraken API

**Base URL:** `https://api.kraken.com`

**Endpoint:** `/0/public/Ticker`
**Method:** GET
**Rate Limit:** 15 requests per 15 seconds

**Request Format:**
```
GET /0/public/Ticker?pair=SYMBOLUSD
```

**Example Request:**
```bash
curl "https://api.kraken.com/0/public/Ticker?pair=AAPLUSD"
```

**Response Structure:**
```json
{
  "error": [],
  "result": {
    "AAPLUSD": {
      "a": ["220.75000", "1", "1.00000000"],
      "b": ["220.74000", "1", "1.00000000"],
      "c": ["220.75000", "0.00000000"],
      "v": ["5000.00000000", "10000.00000000"],
      "p": ["220.75000", "220.74000"],
      "t": [100, 200],
      "l": ["220.00000", "220.00000"],
      "h": ["221.00000", "221.00000"],
      "o": "220.50000"
    }
  }
}
```

**Field Mapping:**
- `c[0]` → Current price
- `p[0]` → 24h volume weighted average price
- `v[1]` → 24h volume
- `h[1]` → 24h high
- `l[1]` → 24h low
- `o` → Opening price

### CoinGecko API

**Base URL:** `https://api.coingecko.com`

**Endpoint:** `/api/v3/simple/price`
**Method:** GET
**Rate Limit:** 50 calls per minute

**Request Format:**
```
GET /api/v3/simple/price?ids=coin_id&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true
```

**Example Request:**
```bash
curl "https://api.coingecko.com/api/v3/simple/price?ids=apple&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true"
```

**Response Structure:**
```json
{
  "apple": {
    "usd": 220.75,
    "usd_24h_vol": 5000000,
    "usd_24h_change": 1.25
  }
}
```

**Field Mapping:**
- `usd` → Current price in USD
- `usd_24h_vol` → 24h volume in USD
- `usd_24h_change` → 24h price change percentage

## Data Normalization

All API responses are normalized to a consistent format for frontend consumption.

### Normalized Token Structure

```json
[
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "priceUsd": 220.75,
    "change24hPct": 1.25,
    "volume24hUsd": 5000000,
    "source": "coingecko"
  },
  {
    "symbol": "TSLA",
    "name": "Tesla Inc.",
    "priceUsd": 245.80,
    "change24hPct": -2.15,
    "volume24hUsd": 3200000,
    "source": "kraken"
  },
  {
    "symbol": "MSFT",
    "name": "Microsoft Corporation",
    "priceUsd": 380.45,
    "change24hPct": 0.85,
    "volume24hUsd": 4100000,
    "source": "kraken"
  }
]
```

### Field Descriptions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `symbol` | string | Stock ticker symbol | "AAPL" |
| `name` | string | Company name | "Apple Inc." |
| `priceUsd` | number | Current price in USD | 220.75 |
| `change24hPct` | number | 24h price change percentage | 1.25 |
| `volume24hUsd` | number | 24h trading volume in USD | 5000000 |
| `source` | string | Data source identifier | "kraken" or "coingecko" |

## API Integration

### Primary Data Flow

1. **Request Initiation**: Frontend requests data from `/api/tokens`
2. **Parallel Fetching**: Both Kraken and CoinGecko APIs are called concurrently
3. **Data Processing**: Raw responses are validated and normalized
4. **Fallback Logic**: If Kraken fails, CoinGecko data is used
5. **Response**: Normalized data is returned with source attribution

### Error Handling

**Timeout Protection:**
- All API calls have 8-second timeouts
- Prevents hanging requests and improves user experience

**Fallback Strategy:**
- Kraken API is the primary source
- CoinGecko API serves as backup
- Graceful degradation when both sources fail

**Validation:**
- Zod schemas ensure data integrity
- Invalid responses are filtered out
- Type-safe data processing

### Rate Limiting

**Kraken API:**
- 15 requests per 15 seconds
- Implemented with request queuing

**CoinGecko API:**
- 50 calls per minute
- Automatic retry with exponential backoff

## Configuration

### Token Configuration

Tokens are configured in `lib/tokens.ts`:

```typescript
export const TOKENS: TokenConfig[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    krakenPair: 'AAPLUSD',        // Kraken trading pair
    coingeckoId: 'apple'          // CoinGecko coin ID
  }
];
```

**Important Notes:**
- `krakenPair` must match Kraken's exact trading pair format
- `coingeckoId` should use CoinGecko's lowercase, hyphenated format
- Symbol should be uppercase for consistency

### Environment Variables

```bash
# Optional: Override API endpoints for testing
KRAKEN_API_URL=https://api.kraken.com
COINGECKO_API_URL=https://api.coingecko.com

# Optional: API keys (if required in future)
KRAKEN_API_KEY=your_kraken_key
COINGECKO_API_KEY=your_coingecko_key
```

## Testing & Development

### Local Testing

```bash
# Test Kraken API directly
curl "https://api.kraken.com/0/public/Ticker?pair=AAPLUSD"

# Test CoinGecko API directly
curl "https://api.coingecko.com/api/v3/simple/price?ids=apple&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true"

# Test your normalized endpoint
curl "http://localhost:3000/api/tokens"
```

### Mock Data

For development without external APIs, you can create mock responses:

```typescript
const mockTokens = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    priceUsd: 220.75,
    change24hPct: 1.25,
    volume24hUsd: 5000000,
    source: 'mock'
  }
];
```

## Performance Considerations

### Caching Strategy

- **Static Assets**: 1-year cache for JS/CSS/images
- **API Responses**: No-cache for real-time data
- **Sitemap**: 1-hour cache with 24-hour CDN cache

### Optimization Techniques

- **Concurrent Requests**: Promise.allSettled for parallel API calls
- **Request Deduplication**: Prevents duplicate API calls
- **Lazy Loading**: Data fetched only when needed
- **SWR Integration**: Automatic revalidation every 5 minutes

## Monitoring & Debugging

### Health Checks

```bash
# Check API status
curl -I "https://api.kraken.com/0/public/Time"
curl -I "https://api.coingecko.com/api/v3/ping"

# Check your endpoint
curl -I "https://your-domain.vercel.app/api/tokens"
```

### Error Logging

Enable detailed logging by setting:
```bash
NODE_ENV=development
DEBUG=tokenizedstocks:*
```

### Common Issues

1. **API Timeouts**: Check network connectivity and API status
2. **Rate Limiting**: Implement request queuing and backoff
3. **Data Mismatches**: Verify token configurations
4. **CORS Issues**: Ensure proper header configuration

## Future Enhancements

### Planned Features

- **WebSocket Integration**: Real-time price updates
- **Historical Data**: Price charts and analytics
- **Multiple Exchanges**: Additional data sources
- **Caching Layer**: Redis integration for performance
- **Webhook Support**: Real-time notifications

### API Versioning

Current API version: `v1`
- All endpoints are backward compatible
- New features will be added as optional parameters
- Breaking changes will be communicated in advance

---

For technical support or questions about API integration, please refer to the main README.md or create an issue in the repository.
