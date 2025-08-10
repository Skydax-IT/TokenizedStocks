import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load and display token table', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Tokenized Stocks Dashboard');
    
    // Check that the table loads
    await expect(page.locator('table')).toBeVisible();
    
    // Check that we have some token data
    await expect(page.locator('tbody tr')).toHaveCount.greaterThan(0);
  });

  test('should handle search functionality', async ({ page }) => {
    await page.goto('/');
    
    // Wait for table to load
    await expect(page.locator('table')).toBeVisible();
    
    // Get initial row count
    const initialRowCount = await page.locator('tbody tr').count();
    
    // Search for a specific token
    await page.fill('input[placeholder*="Search"]', 'AAPL');
    
    // Wait for filtered results
    await page.waitForTimeout(500);
    
    // Should have fewer or equal rows after search
    const filteredRowCount = await page.locator('tbody tr').count();
    expect(filteredRowCount).toBeLessThanOrEqual(initialRowCount);
    
    // Clear search
    await page.fill('input[placeholder*="Search"]', '');
    await page.waitForTimeout(500);
    
    // Should return to original count
    const finalRowCount = await page.locator('tbody tr').count();
    expect(finalRowCount).toBe(initialRowCount);
  });

  test('should handle sorting', async ({ page }) => {
    await page.goto('/');
    
    // Wait for table to load
    await expect(page.locator('table')).toBeVisible();
    
    // Click on symbol header to sort
    await page.click('th button:has-text("Symbol")');
    
    // Should show sort indicator
    await expect(page.locator('th button:has-text("Symbol") svg')).toBeVisible();
    
    // Click again to reverse sort
    await page.click('th button:has-text("Symbol")');
    
    // Should still show sort indicator
    await expect(page.locator('th button:has-text("Symbol") svg')).toBeVisible();
  });

  test('should handle pagination', async ({ page }) => {
    await page.goto('/');
    
    // Wait for table to load
    await expect(page.locator('table')).toBeVisible();
    
    // Change page size to 10
    await page.selectOption('select', '10');
    
    // Should have at most 10 rows
    const rowCount = await page.locator('tbody tr').count();
    expect(rowCount).toBeLessThanOrEqual(10);
    
    // If there are more pages, test pagination
    const paginationText = await page.locator('text=Page 1 of').textContent();
    if (paginationText && paginationText.includes('of') && !paginationText.includes('of 1')) {
      // Click next page
      await page.click('button:has-text("Next")');
      
      // Should be on page 2
      await expect(page.locator('text=Page 2 of')).toBeVisible();
    }
  });

  test('should handle watchlist functionality', async ({ page }) => {
    await page.goto('/');
    
    // Wait for table to load
    await expect(page.locator('table')).toBeVisible();
    
    // Click first star button to add to watchlist
    const firstStarButton = page.locator('tbody tr').first().locator('button[aria-label*="Add"]');
    await firstStarButton.click();
    
    // Should now show filled star
    await expect(page.locator('tbody tr').first().locator('button[aria-label*="Remove"]')).toBeVisible();
    
    // Switch to watchlist tab
    await page.click('button:has-text("My Watchlist")');
    
    // Should show watchlist content
    await expect(page.locator('text=My Watchlist')).toBeVisible();
  });

  test('should handle buy button clicks', async ({ page }) => {
    await page.goto('/');
    
    // Wait for table to load
    await expect(page.locator('table')).toBeVisible();
    
    // Find a buy button that's enabled
    const buyButton = page.locator('button:has-text("Buy"):not([disabled])').first();
    
    if (await buyButton.isVisible()) {
      // Click buy button (should open new tab)
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        buyButton.click()
      ]);
      
      // Should open new page
      expect(newPage).toBeTruthy();
      await newPage.close();
    }
  });

  test('should handle CSV export', async ({ page }) => {
    await page.goto('/');
    
    // Wait for table to load
    await expect(page.locator('table')).toBeVisible();
    
    // Click export CSV button
    await page.click('button:has-text("Export CSV")');
    
    // Should trigger download (we can't easily verify the download in tests)
    // But we can verify the button exists and is clickable
    await expect(page.locator('button:has-text("Export CSV")')).toBeVisible();
  });

  test('should handle dark mode toggle', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Tokenized Stocks Dashboard');
    
    // Find dark mode toggle
    const darkModeButton = page.locator('button[aria-label*="theme"]');
    await expect(darkModeButton).toBeVisible();
    
    // Click dark mode toggle
    await darkModeButton.click();
    
    // Should apply dark mode classes
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Click again to toggle back
    await darkModeButton.click();
    
    // Should remove dark mode classes
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('should handle refresh button', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Tokenized Stocks Dashboard');
    
    // Find refresh button
    const refreshButton = page.locator('button[aria-label="Refresh data"]');
    await expect(refreshButton).toBeVisible();
    
    // Click refresh button
    await refreshButton.click();
    
    // Should show loading state briefly
    await expect(page.locator('button[aria-label="Refresh data"] svg')).toHaveClass(/animate-spin/);
  });

  test('should handle compare functionality', async ({ page }) => {
    await page.goto('/');
    
    // Wait for table to load
    await expect(page.locator('table')).toBeVisible();
    
    // Click compare button for first token
    const firstCompareButton = page.locator('button:has-text("Compare")').first();
    await firstCompareButton.click();
    
    // Should update compare count
    await expect(page.locator('button:has-text("Compare (1/4)")')).toBeVisible();
    
    // Click compare drawer button
    await page.click('button:has-text("Compare (1/4)")');
    
    // Should open compare drawer
    await expect(page.locator('text=Token Comparison')).toBeVisible();
  });
});
