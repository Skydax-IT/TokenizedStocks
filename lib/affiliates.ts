import { AffiliateData } from './types';
import affiliatesData from '../data/affiliates.json';

/**
 * Load and validate affiliate data
 */
export function loadAffiliates(): AffiliateData {
  try {
    // Validate the imported data structure
    if (typeof affiliatesData !== 'object' || affiliatesData === null) {
      console.warn('Invalid affiliates data structure');
      return {};
    }

    const validated: AffiliateData = {};
    
    for (const [symbol, url] of Object.entries(affiliatesData)) {
      if (typeof symbol === 'string' && typeof url === 'string' && url.trim() !== '') {
        // Ensure UTM parameters are present
        const urlWithUtm = ensureUtmParams(url, symbol);
        validated[symbol.toUpperCase()] = urlWithUtm;
      }
    }

    return validated;
  } catch (error) {
    console.error('Error loading affiliates:', error);
    return {};
  }
}

/**
 * Ensure UTM parameters are present in affiliate URLs
 */
function ensureUtmParams(url: string, symbol: string): string {
  try {
    const urlObj = new URL(url);
    
    // Add UTM parameters if they don't exist
    if (!urlObj.searchParams.has('utm_source')) {
      urlObj.searchParams.set('utm_source', 'tokenizedstocks');
    }
    
    if (!urlObj.searchParams.has('utm_symbol')) {
      urlObj.searchParams.set('utm_symbol', symbol.toUpperCase());
    }
    
    return urlObj.toString();
  } catch {
    // If URL parsing fails, return original URL
    return url;
  }
}

/**
 * Get affiliate URL for a specific symbol
 */
export function getAffiliateUrl(symbol: string | undefined | null): string | null {
  if (!symbol || typeof symbol !== 'string') return null;
  const affiliates = loadAffiliates();
  return affiliates[symbol.toUpperCase()] || null;
}

/**
 * Check if affiliate link is available for a symbol
 */
export function hasAffiliateLink(symbol: string | undefined | null): boolean {
  if (!symbol || typeof symbol !== 'string') return false;
  return getAffiliateUrl(symbol) !== null;
}

/**
 * Get all available affiliate symbols
 */
export function getAvailableAffiliateSymbols(): string[] {
  return Object.keys(loadAffiliates());
}
