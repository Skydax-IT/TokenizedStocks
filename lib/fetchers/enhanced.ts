import { recordCircuitBreakerSuccess, recordCircuitBreakerFailure } from '../rateLimit';

export interface FetchOptions {
  timeout?: number;
  retries?: number;
  baseDelay?: number;
  maxDelay?: number;
  circuitBreakerKey?: string;
}

const DEFAULT_OPTIONS: Required<FetchOptions> = {
  timeout: 8000,
  retries: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  circuitBreakerKey: 'default',
};

/**
 * Add jitter to delay to prevent thundering herd
 */
function addJitter(delay: number): number {
  const jitter = Math.random() * 0.1 * delay; // 10% jitter
  return delay + jitter;
}

/**
 * Calculate exponential backoff delay
 */
function calculateBackoffDelay(attempt: number, baseDelay: number, maxDelay: number): number {
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  return addJitter(delay);
}

/**
 * Enhanced fetch with timeout, retries, and circuit breaker
 */
export async function enhancedFetch(
  url: string,
  options: RequestInit = {},
  fetchOptions: FetchOptions = {}
): Promise<Response> {
  const opts = { ...DEFAULT_OPTIONS, ...fetchOptions };
  const { timeout, retries, baseDelay, maxDelay, circuitBreakerKey } = opts;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Record success for circuit breaker
      if (circuitBreakerKey) {
        recordCircuitBreakerSuccess(circuitBreakerKey);
      }

      return response;

    } catch (error) {
      lastError = error as Error;
      
      // Record failure for circuit breaker
      if (circuitBreakerKey) {
        recordCircuitBreakerFailure(circuitBreakerKey);
      }

      // Don't retry on abort (timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }

      // Don't retry on last attempt
      if (attempt === retries) {
        break;
      }

      // Calculate delay for next attempt
      const delay = calculateBackoffDelay(attempt, baseDelay, maxDelay);
      
      console.warn(`Fetch attempt ${attempt + 1} failed for ${url}, retrying in ${delay}ms:`, error);
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Unknown fetch error');
}

/**
 * Fetch JSON with enhanced error handling
 */
export async function enhancedFetchJson<T>(
  url: string,
  options: RequestInit = {},
  fetchOptions: FetchOptions = {}
): Promise<T> {
  const response = await enhancedFetch(url, options, fetchOptions);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  try {
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error}`);
  }
}

/**
 * Create a fetcher for specific API sources
 */
export function createSourceFetcher(source: 'kraken' | 'coingecko') {
  return async function sourceFetch<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    return enhancedFetchJson<T>(url, options, {
      circuitBreakerKey: source,
      timeout: 8000,
      retries: 2,
    });
  };
}

// Pre-configured fetchers
export const krakenFetch = createSourceFetcher('kraken');
export const coingeckoFetch = createSourceFetcher('coingecko');
