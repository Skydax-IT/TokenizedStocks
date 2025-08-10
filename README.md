# Tokenized Stocks Dashboard

A modern Next.js 14 + TailwindCSS application for displaying real-time tokenized stock data with affiliate link management.

## ✨ Features

- **Real-time Data**: Live tokenized stock prices from Kraken API with CoinGecko fallback
- **Enhanced API System**: Robust error handling, validation, and 8-second timeouts
- **Affiliate Management**: Centralized affiliate link system with UTM tracking
- **Responsive Design**: Mobile-friendly table with alternating row colors
- **Auto-refresh**: Data updates every 5 minutes without page reload
- **Newsletter Integration**: Beehiiv API integration for email collection
- **SEO Optimized**: Meta tags, robots.txt, and sitemap for search engine optimization
- **Security Headers**: Comprehensive security headers and CSP policies

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
# Beehiiv Newsletter API (optional)
BEEHIIV_API_KEY=your_api_key_here
BEEHIIV_PUBLICATION_ID=your_publication_id_here
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

## 🔒 Security Features

- **Input Validation**: Zod schemas for all API responses
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Rate Limiting**: Built-in timeout protection (8s per API call)
- **CORS**: Proper cross-origin request handling
- **Security Headers**: Comprehensive security headers including:
  - Content Security Policy (CSP)
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: restrictive permissions

## 📈 Performance

- **SWR**: Efficient data fetching with automatic revalidation
- **Optimized APIs**: Concurrent API calls with Promise.allSettled
- **Caching**: Strategic cache control headers
- **Bundle Optimization**: Tree-shaking and code splitting
- **Static Assets**: Long-term caching for static files (1 year)
- **API Responses**: No-cache for dynamic data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

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

