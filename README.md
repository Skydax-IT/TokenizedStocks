# Tokenized Stocks Dashboard

A production-ready Next.js 14 + TailwindCSS application for displaying real-time tokenized stock data with comprehensive hardening for real users.

## ✨ Features

### Core Functionality
- **Real-time Data**: Live tokenized stock prices from Kraken API with CoinGecko fallback
- **Enhanced Table**: Sort, search, pagination, CSV export, dark mode, accessibility
- **Watchlist**: Local storage-based watchlist with star functionality
- **Compare Drawer**: Side-by-side comparison of up to 4 tokens
- **Affiliate Management**: Centralized affiliate link system with UTM tracking

### Production Hardening
- **Rate Limiting**: IP-based sliding window rate limiting (100/min for API, 3/min for newsletter)
- **Circuit Breaker**: Automatic failure detection and recovery for external APIs
- **Enhanced Error Handling**: Exponential backoff, jitter, 8-second timeouts
- **Data Validation**: Zod schemas, big.js precision, safe range clamping
- **Security Headers**: CSP, HSTS, X-Frame-Options, and more
- **GDPR Compliance**: Newsletter consent, honeypot protection, data minimization

### Developer Experience
- **Testing**: Vitest unit tests + Playwright E2E tests
- **CI/CD**: GitHub Actions with lint, test, build, deploy
- **Documentation**: Comprehensive API and security docs
- **TypeScript**: Full type safety throughout the application

## 🏗️ Architecture

### Enhanced API System

The application now features a robust, layered API architecture:

```
lib/
├── fetchers/           # API-specific data fetchers
│   ├── kraken.ts      # Kraken API integration
│   └── coingecko.ts   # CoinGecko API integration
├── types.ts           # Zod schemas and TypeScript types
├── normalize.ts       # Data normalization utilities
├── affiliates.ts      # Affiliate link management
└── tokens.ts          # Token configuration
```

### Data Flow

1. **Primary Source**: Kraken API (8s timeout, Zod validation)
2. **Fallback Source**: CoinGecko API (8s timeout, Zod validation)
3. **Data Normalization**: Consistent formatting and validation
4. **Response**: Normalized data with source attribution

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Skydax-IT/TokenizedStocks.git
cd TokenizedStocks

# Install dependencies
npm install

# Run development server
npm run dev
```

### Environment Variables

Create a `.env.local` file:

```bash
# Beehiiv Newsletter API (required for production)
BEEHIIV_API_KEY=your_api_key_here
BEEHIIV_PUBLICATION_ID=your_publication_id_here

# Optional: Override API endpoints for testing
KRAKEN_API_URL=https://api.kraken.com
COINGECKO_API_URL=https://api.coingecko.com
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
npm run test:e2e     # Run E2E tests
npm run test:e2e:ui  # Run E2E tests with UI

# Code Quality
npm run lint         # Run ESLint
```

## 🔧 Configuration

### How to Edit Tokens & Affiliates

#### Adding/Editing Tokens

Edit `lib/tokens.ts`:

```typescript
export const TOKENS: TokenConfig[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    krakenPair: 'AAPLUSD',        // Kraken trading pair
    coingeckoId: 'apple'          // CoinGecko coin ID
  },
  {
    symbol: 'NEW',
    name: 'New Company Inc.',
    krakenPair: 'NEWUSD',         // Kraken trading pair
    coingeckoId: 'new-token-id'   // CoinGecko coin ID
  }
];
```

**Important Notes:**
- `krakenPair`: Must match exactly with Kraken's trading pair format
- `coingeckoId`: Use CoinGecko's coin identifier (usually lowercase, hyphenated)
- Symbol should be uppercase and match your affiliate configuration

### Setting Up Beehiiv Keys

1. **Get API Key**: Visit [Beehiiv Dashboard](https://app.beehiiv.com/settings/api) and generate an API key
2. **Get Publication ID**: Find your publication ID in the URL or settings
3. **Environment Variables**: Add to `.env.local`:
   ```bash
   BEEHIIV_API_KEY=your_api_key_here
   BEEHIIV_PUBLICATION_ID=your_publication_id_here
   ```

### Rate Limiting Configuration

Rate limits can be adjusted in `lib/rateLimit.ts`:

```typescript
const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 100,    // Requests per window
  windowMs: 60000,     // Window in milliseconds
};
```

### Circuit Breaker Configuration

Circuit breaker settings in `lib/rateLimit.ts`:

```typescript
const DEFAULT_CIRCUIT_BREAKER: CircuitBreakerConfig = {
  failureThreshold: 5,        // Failures before opening
  recoveryTimeoutMs: 120000,  // Recovery timeout (2 minutes)
  timeoutMs: 8000,           // Request timeout (8 seconds)
};
```

#### Updating Affiliate Links

Edit `data/affiliates.json`:

```json
{
  "AAPL": "https://your-affiliate-link.com/AAPL?utm_source=tokenizedstocks&utm_symbol=AAPL",
  "TSLA": "https://your-affiliate-link.com/TSLA?utm_source=tokenizedstocks&utm_symbol=TSLA",
  "NEW": "https://your-affiliate-link.com/NEW?utm_source=tokenizedstocks&utm_symbol=NEW"
}
```

**UTM Parameters:**
- `utm_source=tokenizedstocks` - Identifies traffic source
- `utm_symbol=SYMBOL` - Tracks which token was clicked

### How to Set Beehiiv API Key

1. **Get Your API Key:**
   - Log into your Beehiiv account
   - Go to Settings → API Keys
   - Generate a new API key

2. **Configure Environment:**
   ```bash
   # .env.local
   BEEHIIV_API_KEY=your_actual_api_key_here
   BEEHIIV_PUBLICATION_ID=your_publication_id_here
   ```

3. **Find Publication ID:**
   - In Beehiiv dashboard, go to Settings → General
   - Your publication ID is in the URL: `https://app.beehiiv.com/publications/PUBLICATION_ID/...`

4. **Test Integration:**
   - Start your dev server: `npm run dev`
   - Try subscribing to the newsletter
   - Check Beehiiv dashboard for new subscribers

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables:**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add your Beehiiv API credentials:
     ```
     BEEHIIV_API_KEY=your_api_key
     BEEHIIV_PUBLICATION_ID=your_publication_id
     ```

3. **Deploy:**
   - Vercel will automatically deploy on push to main branch
   - Or manually deploy from dashboard

4. **Custom Domain (Optional):**
   - Go to Settings → Domains
   - Add your custom domain
   - Update `metadataBase` in `app/layout.tsx`

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables for Production

Ensure these are set in your production environment:
```bash
NODE_ENV=production
BEEHIIV_API_KEY=your_production_api_key
BEEHIIV_PUBLICATION_ID=your_publication_id
```

## 📊 API Endpoints

### `/api/tokens`

Fetches tokenized stock data with enhanced error handling.

**Response Format:**
```typescript
{
  data: TokenRow[];
  updatedAt: string;
  sources: {
    kraken: number;      // Count of tokens from Kraken
    coingecko: number;   // Count of tokens from CoinGecko
    unavailable: number; // Count of unavailable tokens
  };
}
```

**TokenRow Structure:**
```typescript
{
  symbol: string;        // e.g., "AAPL"
  name: string;          // e.g., "Apple Inc."
  priceUsd: number;      // Current price in USD
  change24hPct: number;  // 24h price change percentage
  volume24hUsd: number;  // 24h volume in USD
  source: "kraken" | "coingecko";
}
```

### `/api/newsletter`

Handles newsletter subscriptions via Beehiiv API.

### `/api/sitemap`

Generates XML sitemap for search engines.

## 🔗 Affiliate System

### Configuration

Affiliate links are stored in `/data/affiliates.json`:

```json
{
  "AAPL": "https://myaffiliatelink.com/AAPL?utm_source=tokenizedstocks&utm_symbol=AAPL",
  "TSLA": "https://myaffiliatelink.com/TSLA?utm_source=tokenizedstocks&utm_symbol=TSLA"
}
```

### UTM Parameters

The system automatically adds UTM tracking parameters:
- `utm_source=tokenizedstocks`
- `utm_symbol=SYMBOL`

### Button States

- **Available**: Clickable "Buy" button linking to affiliate URL
- **Unavailable**: Disabled button with "Link not available" tooltip

## 🎨 Customization

### Adding New Tokens

Edit `lib/tokens.ts`:

```typescript
export const TOKENS: TokenConfig[] = [
  {
    symbol: 'NEW',
    name: 'New Company Inc.',
    krakenPair: 'NEWUSD',        // Kraken trading pair
    coingeckoId: 'new-token-id'  // CoinGecko coin ID
  }
];
```

### Updating Affiliate Links

Edit `data/affiliates.json`:

```json
{
  "NEW": "https://your-affiliate-link.com/NEW?utm_source=tokenizedstocks&utm_symbol=NEW"
}
```

### Styling

Modify `tailwind.config.ts` for brand colors and `app/globals.css` for custom styles.

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Test Coverage

The application includes comprehensive tests for:
- Data normalization and validation
- Rate limiting and circuit breaker logic
- API error handling and retries
- User interactions (search, sort, pagination)
- Newsletter form validation
- Dark mode functionality

## 🔒 Security Features

- **Rate Limiting**: IP-based sliding window rate limiting (100/min for API, 3/min for newsletter)
- **Circuit Breaker**: Automatic failure detection and recovery for external APIs
- **Input Validation**: Zod schemas for all API inputs and responses
- **Security Headers**: Comprehensive security headers including:
  - Content Security Policy (CSP)
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: restrictive permissions
  - Strict-Transport-Security (HSTS)
- **GDPR Compliance**: Newsletter consent, honeypot protection, data minimization
- **Anti-Spam**: Honeypot fields and robust email validation

## 📈 Performance

- **SWR**: Efficient data fetching with automatic revalidation
- **Optimized APIs**: Concurrent API calls with Promise.allSettled
- **Caching**: Strategic cache control headers
- **Bundle Optimization**: Tree-shaking and code splitting
- **Static Assets**: Long-term caching for static files (1 year)
- **API Responses**: No-cache for dynamic data

## 📚 Documentation

- **[API Documentation](docs/apis.md)**: External APIs, endpoints, and integration details
- **[Security Documentation](docs/security.md)**: Security measures, headers, and compliance
- **[Project Status](PROJECT_STATUS.md)**: Current development status and roadmap

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests to ensure everything works (`npm run test && npm run test:e2e`)
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- **TypeScript**: All code must be properly typed
- **Testing**: New features require unit and E2E tests
- **Documentation**: Update docs for API changes
- **Security**: Follow security best practices
- **Accessibility**: Ensure ARIA labels and keyboard navigation

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**API Timeouts**: Check network connectivity and API endpoint availability
**Missing Data**: Verify token symbols and API configurations
**Build Errors**: Ensure Node.js version compatibility
**Newsletter Not Working**: Verify Beehiiv API key and publication ID

### Debug Mode

Enable detailed logging by setting `NODE_ENV=development` in your environment.

### API Status Check

Test your API endpoints:
```bash
# Test tokens endpoint
curl https://your-domain.vercel.app/api/tokens

# Test newsletter endpoint
curl -X POST https://your-domain.vercel.app/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

Built with ❤️ using Next.js 14, TailwindCSS, and modern web technologies.

