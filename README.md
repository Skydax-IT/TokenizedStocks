# Tokenization Data Hub — Tokenized Stocks Dashboard

Next.js 14 + TailwindCSS app with live tokenized stocks data from Kraken (primary) and CoinGecko (fallback). Auto-refresh every 5 minutes, affiliate links, and Beehiiv newsletter.

## Features

- **Live Data**: Fetches from Kraken API first, falls back to CoinGecko
- **Auto-refresh**: Updates every 5 minutes without page reload
- **Responsive Design**: Mobile-friendly table with TailwindCSS styling
- **Affiliate Links**: Configurable buy buttons for each token
- **Newsletter**: Beehiiv integration for email signups
- **SEO Optimized**: Meta tags for search engines

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd TokenizedStocks
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

### Tokens and Affiliate Links
Edit `lib/tokens.ts` to:
- Add/remove tokenized stocks
- Update Kraken pairs and CoinGecko IDs
- Configure affiliate URLs

```typescript
export const TOKENS: TokenConfig[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    krakenPair: 'AAPLUSD',
    coingeckoId: 'apple-tokenized-stock-defichain',
    affiliateUrl: 'https://myaffiliatelink.com/AAPL'
  }
  // Add more tokens...
];
```

### Newsletter (Beehiiv)
1. Create `.env.local` file:
   ```bash
   BEEHIIV_API_KEY=your_api_key_here
   BEEHIIV_PUBLICATION_ID=your_publication_id_here
   ```

2. Or set in Vercel Project Settings → Environment Variables

3. Optional: Replace the embed placeholder in `components/Newsletter.tsx` with your Beehiiv embed snippet

## API Endpoints

### `/api/tokens`
- **GET**: Fetches live tokenized stocks data
- **Source Priority**: Kraken → CoinGecko → Unavailable
- **Cache**: No caching, fresh data on each request

### `/api/newsletter`
- **POST**: Subscribes email to Beehiiv newsletter
- **Body**: `{ "email": "user@example.com" }`
- **Fallback**: Simulates success if API keys are missing

## Data Sources

### Kraken API
- **Endpoint**: `https://api.kraken.com/0/public/Ticker`
- **Rate Limit**: Public endpoint, no authentication required
- **Data**: Price, 24h change, volume

### CoinGecko API
- **Endpoint**: `https://api.coingecko.com/api/v3/coins/{id}`
- **Rate Limit**: Free tier available
- **Data**: Price, 24h change, volume (USD)

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `BEEHIIV_API_KEY`
   - `BEEHIIV_PUBLICATION_ID`
4. Deploy

### Other Platforms
- Build: `npm run build`
- Start: `npm start`
- Static export: Configure in `next.config.ts`

## Customization

### Styling
- **Colors**: Update `tailwind.config.ts` brand colors
- **Components**: Modify `app/globals.css` utility classes
- **Layout**: Edit `app/layout.tsx` for header/footer changes

### Adding New Tokens
1. Add to `TOKENS` array in `lib/tokens.ts`
2. Set appropriate `krakenPair` and `coingeckoId`
3. Configure `affiliateUrl`
4. Restart dev server

### Newsletter Form
- Replace placeholder in `components/Newsletter.tsx`
- Customize form fields and validation
- Add additional Beehiiv integration features

## Project Structure

```
TokenizedStocks/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── tokens/        # Token data endpoint
│   │   └── newsletter/    # Newsletter signup
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/             # React components
│   └── Newsletter.tsx     # Newsletter form
├── lib/                    # Utility functions
│   └── tokens.ts          # Token configuration
├── package.json            # Dependencies
├── tailwind.config.ts      # TailwindCSS config
├── next.config.ts          # Next.js config
└── README.md               # This file
```

## Troubleshooting

### Data Not Loading
- Check browser console for errors
- Verify API endpoints are accessible
- Kraken may not have tokenized stocks; CoinGecko fallback will be used

### Newsletter Issues
- Ensure Beehiiv API keys are set
- Check API rate limits
- Verify publication ID exists

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push branch: `git push origin feature-name`
5. Submit pull request

## License

This project is for informational purposes only. Not financial advice.

## Support

- **Issues**: Create GitHub issue
- **Questions**: Check documentation or create discussion
- **Security**: Report vulnerabilities privately

---

**Note**: This application uses free public APIs. For production use, consider:
- Rate limiting and caching
- Error monitoring and logging
- Backup data sources
- Professional API keys if available

