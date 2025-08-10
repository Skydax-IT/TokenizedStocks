# API Documentation

This document describes the external APIs used by the Tokenized Stocks Dashboard and how they are integrated.

## External APIs

### Kraken API

**Base URL:** `https://api.kraken.com/0/public/`

#### Ticker Endpoint
- **URL:** `/Ticker`
- **Method:** GET
- **Parameters:** `pair` (e.g., "AAPLUSD")
- **Rate Limit:** 15 requests per 10 seconds
- **Timeout:** 8 seconds

**Example Request:**
```bash
curl "https://api.kraken.com/0/public/Ticker?pair=AAPLUSD"
```

**Response Format:**
```json
{
  "error": [],
  "result": {
    "AAPLUSD": {
      "c": ["150.25", "100"], // [last price, last trade volume]
      "o": "148.50", // opening price
      "v": ["1000000", "5000000"] // [today's volume, last 24h volume]
    }
  }
}
```

**Data Mapping:**
- Price: `result[pair].c[0]`
- 24h Change: Calculated as `((last_price - opening_price) / opening_price) * 100`
- Volume: `result[pair].v[1] * last_price` (converted to USD)

### CoinGecko API

**Base URL:** `https://api.coingecko.com/api/v3/`

#### Simple Price Endpoint
- **URL:** `/simple/price`
- **Method:** GET
- **Parameters:** 
  - `ids` (comma-separated coin IDs)
  - `vs_currencies=usd`
  - `include_24hr_change=true`
  - `include_24hr_vol=true`
- **Rate Limit:** 50 calls per minute
- **Timeout:** 8 seconds

**Example Request:**
```bash
curl "https://api.coingecko.com/api/v3/simple/price?ids=apple&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true"
```

**Response Format:**
```json
{
  "apple": {
    "usd": 150.25,
    "usd_24h_change": 2.5,
    "usd_24h_vol": 5000000
  }
}
```

**Data Mapping:**
- Price: `data[coinId].usd`
- 24h Change: `data[coinId].usd_24h_change`
- Volume: `data[coinId].usd_24h_vol`

### Beehiiv API (Newsletter)

**Base URL:** `https://api.beehiiv.com/v2/`

#### Subscribe Endpoint
- **URL:** `/publications/{publication_id}/subscriptions`
- **Method:** POST
- **Authentication:** Bearer token
- **Rate Limit:** 100 requests per minute
- **Timeout:** 10 seconds

**Example Request:**
```bash
curl -X POST "https://api.beehiiv.com/v2/publications/{publication_id}/subscriptions" \
  -H "Authorization: Bearer {api_key}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "reactivate_existing": true,
    "send_welcome_email": true,
    "utm_source": "tokenized-stocks-dashboard",
    "utm_medium": "web",
    "utm_campaign": "newsletter-signup"
  }'
```

## Internal API Endpoints

### GET /api/tokens

Returns normalized token data from multiple sources.

**Response Format:**
```json
{
  "data": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "priceUsd": 150.25,
      "change24hPct": 2.5,
      "volume24hUsd": 5000000,
      "source": "kraken"
    }
  ],
  "updatedAt": "2024-01-01T12:00:00.000Z",
  "sources": {
    "kraken": 10,
    "coingecko": 5,
    "unavailable": 2
  },
  "circuitBreakers": {
    "kraken": "closed",
    "coingecko": "closed"
  },
  "warnings": ["Token XYZ unavailable from both APIs"]
}
```

**Rate Limiting:**
- 100 requests per minute per IP
- Returns 429 status with `Retry-After` header when exceeded

### POST /api/newsletter

Handles newsletter subscriptions.

**Request Format:**
```json
{
  "email": "user@example.com",
  "consent": true,
  "honeypot": "",
  "source": "dashboard"
}
```

**Response Format:**
```json
{
  "ok": true,
  "message": "Successfully subscribed to newsletter",
  "email": "user@example.com",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Rate Limiting:**
- 3 requests per minute per IP
- Returns 429 status when exceeded

## Error Handling

### Circuit Breaker States
- **Closed:** Normal operation, requests allowed
- **Open:** Service failing, requests blocked
- **Half-Open:** Testing recovery, limited requests allowed

### Retry Strategy
- Exponential backoff with jitter
- Maximum 3 retries per request
- 8-second timeout per attempt

### Fallback Strategy
1. Try Kraken API first (if pair available)
2. Fallback to CoinGecko API
3. Use mock data as final fallback (development only)

## Data Normalization

All external API responses are normalized to a consistent format:

- **Price:** Rounded to 2 decimal places, validated as positive
- **24h Change:** Rounded to 2 decimal places, clamped to ±100%
- **Volume:** Rounded to 2 decimal places, validated as non-negative
- **Symbol:** Converted to uppercase
- **Name:** Trimmed whitespace

## Security Considerations

- All external API calls use HTTPS
- Rate limiting prevents abuse
- Circuit breakers prevent cascade failures
- Input validation with Zod schemas
- No sensitive data logged
- CSP headers restrict external resources
