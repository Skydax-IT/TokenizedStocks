import { TokenRow } from '../types';

/**
 * Convert token data to CSV format
 */
export function exportToCSV(tokens: TokenRow[], filename?: string): void {
  // Define CSV headers
  const headers = [
    'Symbol',
    'Name',
    'Price (USD)',
    '24h Change (%)',
    '24h Volume (USD)',
    'Data Source',
  ];

  // Convert tokens to CSV rows
  const csvRows = tokens.map(token => [
    token.symbol,
    token.name,
    token.priceUsd.toFixed(2),
    token.change24hPct.toFixed(2),
    token.volume24hUsd.toFixed(2),
    token.source,
  ]);

  // Combine headers and data
  const csvContent = [headers, ...csvRows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename || `tokens-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    // Fallback for older browsers
    window.open(`data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`);
  }
}

/**
 * Format number for CSV export (handles large numbers)
 */
export function formatNumberForCSV(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  } else {
    return value.toFixed(2);
  }
}
