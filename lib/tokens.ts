import { TokenConfig, TokensArraySchema } from '@/lib/types';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

// Re-export the TokenConfig type for convenience
export type { TokenConfig } from '@/lib/types';

/**
 * Load tokens from the JSON configuration file
 */
export function loadTokens(): TokenConfig[] {
  try {
    // Read the JSON file directly using fs
    const filePath = path.join(process.cwd(), 'data', 'tokens.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const tokensData = JSON.parse(fileContent);
    
    // Validate with Zod
    const validated = TokensArraySchema.parse(tokensData);
    
    return validated;
  } catch (error) {
    console.error('Failed to load tokens:', error);
    throw new Error('Failed to load token configuration');
  }
}

/**
 * Find a token by its symbol
 */
export function findBySymbol(symbol: string): TokenConfig | undefined {
  const tokens = loadTokens();
  return tokens.find(token => token.symbol.toUpperCase() === symbol.toUpperCase());
}

/**
 * Get all available symbols
 */
export function allSymbols(): string[] {
  const tokens = loadTokens();
  return tokens.map(token => token.symbol);
}

/**
 * Get all tokens
 */
export function getAllTokens(): TokenConfig[] {
  return loadTokens();
}

// Legacy exports for backward compatibility
export const TOKENS = loadTokens();
export const tokenBySymbol: Record<string, TokenConfig> = Object.fromEntries(
  TOKENS.map((t) => [t.symbol, t])
);
export const getAvailableSymbols = allSymbols;

