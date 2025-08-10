import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  checkRateLimit, 
  checkCircuitBreaker, 
  recordCircuitBreakerSuccess, 
  recordCircuitBreakerFailure,
  getClientIP 
} from '@/lib/rateLimit';
import { NextRequest } from 'next/server';

// Mock NextRequest
const createMockRequest = (ip?: string, forwardedFor?: string): NextRequest => {
  const headers = new Map();
  if (forwardedFor) headers.set('x-forwarded-for', forwardedFor);
  
  return {
    ip,
    headers: {
      get: (name: string) => headers.get(name) || null
    }
  } as NextRequest;
};

describe('getClientIP', () => {
  it('should return IP from request.ip', () => {
    const req = createMockRequest('192.168.1.1');
    expect(getClientIP(req)).toBe('192.168.1.1');
  });

  it('should return first IP from x-forwarded-for', () => {
    const req = createMockRequest(undefined, '192.168.1.1, 10.0.0.1');
    expect(getClientIP(req)).toBe('192.168.1.1');
  });

  it('should return unknown for missing IP', () => {
    const req = createMockRequest();
    expect(getClientIP(req)).toBe('unknown');
  });
});

describe('checkRateLimit', () => {
  beforeEach(() => {
    // Clear any existing rate limit data
    vi.clearAllMocks();
  });

  it('should allow first request', () => {
    const result = checkRateLimit('test-ip-1');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(99); // 100 - 1
  });

  it('should allow multiple requests within limit', () => {
    checkRateLimit('test-ip-2'); // First request
    const result = checkRateLimit('test-ip-2'); // Second request
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(98); // 100 - 2
  });

  it('should block requests over limit', () => {
    // Make 100 requests
    for (let i = 0; i < 100; i++) {
      checkRateLimit('test-ip-3');
    }
    
    const result = checkRateLimit('test-ip-3');
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should reset after window expires', () => {
    // Mock Date.now to simulate time passing
    const mockNow = vi.fn();
    vi.spyOn(Date, 'now').mockImplementation(mockNow);
    
    // First request
    mockNow.mockReturnValue(1000);
    checkRateLimit('test-ip-4');
    
    // Second request after window expires (60 seconds + 10 seconds buffer)
    mockNow.mockReturnValue(71000); // 71 seconds later
    const result = checkRateLimit('test-ip-4');
    
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(99);
    
    vi.restoreAllMocks();
  });
});

describe('checkCircuitBreaker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow requests when circuit is closed', () => {
    const result = checkCircuitBreaker('test-service');
    expect(result.allowed).toBe(true);
    expect(result.state).toBe('closed');
  });

  it('should open circuit after failures', () => {
    // Record 5 failures (threshold)
    for (let i = 0; i < 5; i++) {
      recordCircuitBreakerFailure('test-service');
    }
    
    const result = checkCircuitBreaker('test-service');
    expect(result.allowed).toBe(false);
    expect(result.state).toBe('open');
  });

  it('should allow half-open requests after timeout', () => {
    // Mock Date.now
    const mockNow = vi.fn();
    vi.spyOn(Date, 'now').mockImplementation(mockNow);
    
    // Record failures and open circuit
    mockNow.mockReturnValue(1000);
    for (let i = 0; i < 5; i++) {
      recordCircuitBreakerFailure('test-service');
    }
    
    // Try after recovery timeout
    mockNow.mockReturnValue(130000); // 130 seconds later
    const result = checkCircuitBreaker('test-service');
    
    expect(result.allowed).toBe(true);
    expect(result.state).toBe('half-open');
    
    vi.restoreAllMocks();
  });

  it('should close circuit after success', () => {
    // Record some failures
    recordCircuitBreakerFailure('test-service');
    recordCircuitBreakerFailure('test-service');
    
    // Record success
    recordCircuitBreakerSuccess('test-service');
    
    const result = checkCircuitBreaker('test-service');
    expect(result.allowed).toBe(true);
    expect(result.state).toBe('closed');
  });
});
