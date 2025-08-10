/**
 * Chart theme utility that reads CSS variables at runtime
 * to provide theme-aware colors for charts using the Sage Pine palette
 */

export function getChartTheme() {
  // Get computed styles from document root to read CSS variables
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  
  const getCSSVariable = (name: string) => {
    return computedStyle.getPropertyValue(name).trim();
  };

  return {
    // Primary colors - Sage Pine palette
    primary: getCSSVariable('--accent-600'), // Pine 600 for main chart lines
    accent: getCSSVariable('--accent'),
    success: getCSSVariable('--success'),
    danger: getCSSVariable('--danger'),
    warning: getCSSVariable('--warning'),
    
    // Background and surface colors
    background: getCSSVariable('--bg'),
    card: getCSSVariable('--card'),
    
    // Text colors
    text: getCSSVariable('--fg'),
    muted: getCSSVariable('--muted'),
    
    // Border and grid colors
    border: getCSSVariable('--border'),
    grid: getCSSVariable('--border'),
    
    // Neutral colors
    neutral200: getCSSVariable('--neutral-200'),
    neutral400: getCSSVariable('--neutral-400'),
    neutral700: getCSSVariable('--neutral-700'),
    
    // Accent scale for charts
    accent50: getCSSVariable('--accent-50'),
    accent100: getCSSVariable('--accent-100'),
    accent200: getCSSVariable('--accent-200'),
    accent300: getCSSVariable('--accent-300'),
    accent400: getCSSVariable('--accent-400'),
    accent500: getCSSVariable('--accent-500'),
    accent600: getCSSVariable('--accent-600'),
    accent700: getCSSVariable('--accent-700'),
    accent800: getCSSVariable('--accent-800'),
    accent900: getCSSVariable('--accent-900'),
  };
}

export function getRechartsTheme() {
  const theme = getChartTheme();
  
  return {
    // Chart colors - Sage Pine palette
    colors: [
      theme.primary,        // Primary line (accent-600)
      theme.success,        // Success/gain
      theme.danger,         // Danger/loss
      theme.warning,        // Warning
      theme.accent400,      // Accent variation
      theme.neutral400,     // Neutral variation
    ],
    
    // Background
    backgroundColor: theme.background,
    
    // Text colors
    textColor: theme.text,
    
    // Grid and axis
    gridColor: theme.grid,
    axisColor: theme.muted,
    
    // Tooltip
    tooltipBackground: theme.card,
    tooltipBorder: theme.border,
    tooltipText: theme.text,
  };
}

export function getCandlestickTheme() {
  const theme = getChartTheme();
  
  return {
    // Up candle (green) - desaturated success
    up: {
      fill: theme.success,
      stroke: theme.success,
    },
    
    // Down candle (red) - desaturated danger
    down: {
      fill: theme.danger,
      stroke: theme.danger,
    },
    
    // Wick color
    wick: theme.text,
    
    // Grid and background
    grid: theme.grid,
    background: theme.background,
  };
}
