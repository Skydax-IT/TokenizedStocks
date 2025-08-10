import { NextRequest } from 'next/server';

// Rate limiting store (in-memory for now, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number; windowStart: number }>();

// Circuit breaker store
const circuitBreakerStore = new Map<string, { 
  failures: number; 
  lastFailure: number; 
  state: 'closed' | 'open' | 'half-open';
  nextAttempt: number;
}>();

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeoutMs: number;
  timeoutMs: number;
}

const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60000, // 1 minute
};

const DEFAULT_CIRCUIT_BREAKER: CircuitBreakerConfig = {
  failureThreshold: 5,
  recoveryTimeoutMs: 120000, // 2 minutes
  timeoutMs: 8000, // 8 seconds
};

/**
 * Get client IP from request
 */
export function getClientIP(request: NextRequest): string {
  return request.ip || 
         request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

/**
 * Check rate limit with sliding window
 */
export function checkRateLimit(
  key: string, 
  config: RateLimitConfig = DEFAULT_RATE_LIMIT
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  const current = rateLimitStore.get(key);
  
  if (!current || current.windowStart < windowStart) {
    // New window or expired window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
      windowStart: now,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }
  
  if (current.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime,
    };
  }
  
  current.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - current.count,
    resetTime: current.resetTime,
  };
}

/**
 * Circuit breaker implementation
 */
export function checkCircuitBreaker(
  key: string,
  config: CircuitBreakerConfig = DEFAULT_CIRCUIT_BREAKER
): { allowed: boolean; state: string } {
  const now = Date.now();
  const current = circuitBreakerStore.get(key);
  
  if (!current) {
    circuitBreakerStore.set(key, {
      failures: 0,
      lastFailure: 0,
      state: 'closed',
      nextAttempt: 0,
    });
    return { allowed: true, state: 'closed' };
  }
  
  switch (current.state) {
    case 'closed':
      return { allowed: true, state: 'closed' };
      
    case 'open':
      if (now >= current.nextAttempt) {
        current.state = 'half-open';
        return { allowed: true, state: 'half-open' };
      }
      return { allowed: false, state: 'open' };
      
    case 'half-open':
      return { allowed: true, state: 'half-open' };
      
    default:
      return { allowed: true, state: 'closed' };
  }
}

/**
 * Record circuit breaker success
 */
export function recordCircuitBreakerSuccess(key: string): void {
  const current = circuitBreakerStore.get(key);
  if (current) {
    current.failures = 0;
    current.state = 'closed';
  }
}

/**
 * Record circuit breaker failure
 */
export function recordCircuitBreakerFailure(
  key: string,
  config: CircuitBreakerConfig = DEFAULT_CIRCUIT_BREAKER
): void {
  const now = Date.now();
  const current = circuitBreakerStore.get(key);
  
  if (!current) {
    circuitBreakerStore.set(key, {
      failures: 1,
      lastFailure: now,
      state: 'closed',
      nextAttempt: 0,
    });
    return;
  }
  
  current.failures++;
  current.lastFailure = now;
  
  if (current.state === 'half-open') {
    current.state = 'open';
    current.nextAttempt = now + config.recoveryTimeoutMs;
  } else if (current.failures >= config.failureThreshold) {
    current.state = 'open';
    current.nextAttempt = now + config.recoveryTimeoutMs;
  }
}

/**
 * Clean up old entries (call periodically)
 */
export function cleanupStores(): void {
  const now = Date.now();
  
  // Clean rate limit store
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
  
  // Clean circuit breaker store (keep for 1 hour)
  for (const [key, value] of circuitBreakerStore.entries()) {
    if (now - value.lastFailure > 3600000) {
      circuitBreakerStore.delete(key);
    }
  }
}

// Clean up every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupStores, 300000);
}
