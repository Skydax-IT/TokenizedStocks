# Security Documentation

This document outlines the security measures implemented in the Tokenized Stocks Dashboard to protect against common web vulnerabilities and ensure data integrity.

## Security Headers

The application implements comprehensive security headers via `next.config.js`:

### Content Security Policy (CSP)
```
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self' https://api.kraken.com https://api.coingecko.com https://api.beehiiv.com;
frame-ancestors 'none';
```

**Purpose:** Prevents XSS attacks and restricts resource loading to trusted sources.

### Other Security Headers
- **X-Frame-Options: DENY** - Prevents clickjacking attacks
- **X-Content-Type-Options: nosniff** - Prevents MIME type sniffing
- **Referrer-Policy: strict-origin-when-cross-origin** - Controls referrer information
- **Strict-Transport-Security** - Enforces HTTPS connections
- **Permissions-Policy** - Restricts browser features (camera, microphone, geolocation)

## Rate Limiting

### Implementation
- **In-memory storage** with sliding window algorithm
- **IP-based tracking** with fallback to X-Forwarded-For header
- **Automatic cleanup** of expired entries every 5 minutes

### Limits
- **API Tokens:** 100 requests per minute per IP
- **Newsletter:** 3 requests per minute per IP
- **Response headers** include rate limit information

### Example Response (429)
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later.",
  "retryAfter": 45,
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

## Circuit Breaker Pattern

### Implementation
- **Per-service tracking** (Kraken, CoinGecko)
- **Three states:** Closed, Open, Half-Open
- **Automatic recovery** after 2-minute timeout

### Configuration
- **Failure threshold:** 5 consecutive failures
- **Recovery timeout:** 120 seconds
- **Request timeout:** 8 seconds

### Benefits
- Prevents cascade failures
- Reduces load on failing services
- Automatic service recovery

## Input Validation

### Zod Schemas
All API inputs are validated using Zod schemas:

```typescript
const NewsletterSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(254, 'Email too long')
    .refine(email => {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      return emailRegex.test(email);
    }, 'Invalid email format'),
  consent: z.boolean().refine(val => val === true, 'GDPR consent is required'),
  honeypot: z.string().refine(val => val === '', 'Invalid submission'),
  source: z.string().optional(),
});
```

### Data Normalization
- **Price validation:** Positive numbers, max $1M
- **Volume validation:** Non-negative, max 1e15
- **Percentage validation:** Between -100% and 10,000%
- **String sanitization:** Trim whitespace, uppercase symbols

## Anti-Spam Measures

### Newsletter Protection
- **Honeypot field** to detect bots
- **Email validation** with regex pattern
- **GDPR consent** requirement
- **Rate limiting** (3 requests/minute)

### Honeypot Implementation
```html
<input 
  type="text" 
  name="honeypot" 
  style="display: none;"
  tabindex="-1"
  autocomplete="off"
/>
```

## Data Protection

### Logging
- **No PII logging** beyond email (temporarily in flight)
- **Minimal error details** in production
- **Structured logging** for debugging

### Data Handling
- **No sensitive data storage** in client-side storage
- **LocalStorage encryption** for user preferences
- **Secure cookie settings** (if implemented)

## API Security

### External API Calls
- **HTTPS only** for all external requests
- **Timeout protection** (8 seconds)
- **Retry with exponential backoff**
- **Input sanitization** before API calls

### Error Handling
- **Generic error messages** in production
- **Detailed errors** only in development
- **No stack traces** exposed to users

## Client-Side Security

### XSS Prevention
- **React's built-in XSS protection**
- **Content Security Policy**
- **Input sanitization** on form submissions

### CSRF Protection
- **SameSite cookies** (if implemented)
- **Origin validation** for API requests
- **Token-based validation** (if needed)

## Environment Security

### Environment Variables
```bash
# Required for production
BEEHIIV_API_KEY=your_api_key
BEEHIIV_PUBLICATION_ID=your_publication_id

# Optional for development
NODE_ENV=development
DEBUG=tokenizedstocks:*
```

### Secrets Management
- **No hardcoded secrets** in source code
- **Environment variable validation**
- **Secure secret rotation** process

## Monitoring & Alerting

### Security Events
- **Rate limit violations** logged
- **Circuit breaker state changes** tracked
- **Failed authentication attempts** monitored
- **Unusual traffic patterns** detected

### Log Analysis
```typescript
// Example security event logging
console.warn('Rate limit exceeded for IP:', clientIP);
console.warn('Circuit breaker opened for service:', serviceName);
console.error('API validation failed:', validationError);
```

## Deployment Security

### Vercel Security
- **Automatic HTTPS** enforcement
- **DDoS protection** included
- **Edge network** security
- **Automatic security updates**

### Build Security
- **Dependency scanning** in CI/CD
- **Security audit** on npm install
- **Code quality checks** in PRs

## Compliance

### GDPR Compliance
- **Explicit consent** required for newsletter
- **Data minimization** principle followed
- **Right to deletion** supported
- **Transparent data handling**

### Privacy Policy
- **Clear data usage** explanation
- **Third-party service** disclosure
- **User rights** information
- **Contact information** provided

## Incident Response

### Security Breach Response
1. **Immediate containment** of affected systems
2. **Assessment** of breach scope and impact
3. **Notification** of affected users (if required)
4. **Remediation** and security improvements
5. **Post-incident review** and lessons learned

### Contact Information
- **Security issues:** Create GitHub issue with [SECURITY] tag
- **Responsible disclosure:** Email security@yourdomain.com
- **Emergency contact:** Available in private repository

## Security Testing

### Automated Testing
- **Unit tests** for security functions
- **Integration tests** for API endpoints
- **E2E tests** for user flows
- **Security regression** testing

### Manual Testing
- **Penetration testing** checklist
- **Security audit** procedures
- **Code review** guidelines
- **Vulnerability assessment** process

## Future Security Enhancements

### Planned Improvements
- **Web Application Firewall (WAF)** integration
- **Advanced bot detection** and mitigation
- **Real-time threat intelligence** feeds
- **Enhanced monitoring** and alerting
- **Security automation** and orchestration

### Security Roadmap
- **Q1:** Implement WAF rules
- **Q2:** Add advanced rate limiting
- **Q3:** Deploy security monitoring
- **Q4:** Conduct security audit

---

This security documentation should be reviewed and updated regularly to reflect current security measures and best practices.
