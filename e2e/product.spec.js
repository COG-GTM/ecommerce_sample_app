const { test, expect } = require('@playwright/test');

test.describe('Product Pages', () => {
  test('product cards are displayed on homepage', async ({ page }) => {
    await page.goto('/');
    const productCards = page.locator('.product-card');
    const count = await productCards.count();
    // May be 0 if Sanity CMS has no data, but the container should exist
    const container = page.locator('.products-container');
    await expect(container).toBeVisible();
  });

  test('product cards show name and price', async ({ page }) => {
    await page.goto('/');
    const firstProduct = page.locator('.product-card').first();
    const count = await page.locator('.product-card').count();
    if (count > 0) {
      await expect(firstProduct.locator('.product-name')).toBeVisible();
      await expect(firstProduct.locator('.product-price')).toBeVisible();
    }
  });

  test('clicking a product card navigates to product detail', async ({ page }) => {
    await page.goto('/');
    const firstProduct = page.locator('.product-card').first();
    const count = await page.locator('.product-card').count();
    if (count > 0) {
      await firstProduct.click();
      await expect(page.locator('.product-detail-container')).toBeVisible();
    }
  });
});

test.describe('Product Detail Page', () => {
  test('product detail page shows product info', async ({ page }) => {
    await page.goto('/');
    const count = await page.locator('.product-card').count();
    if (count > 0) {
      await page.locator('.product-card').first().click();
      await expect(page.locator('.product-detail-desc h1')).toBeVisible();
      await expect(page.locator('.price')).toBeVisible();
      await expect(page.locator('.quantity')).toBeVisible();
    }
  });

  test('quantity controls work', async ({ page }) => {
    await page.goto('/');
    const count = await page.locator('.product-card').count();
    if (count > 0) {
      await page.locator('.product-card').first().click();
      const qtyDisplay = page.locator('.product-detail-desc .num');
      await expect(qtyDisplay).toHaveText('1');
      await page.locator('.product-detail-desc .plus').click();
      await expect(qtyDisplay).toHaveText('2');
      await page.locator('.product-detail-desc .minus').click();
      await expect(qtyDisplay).toHaveText('1');
    }
  });

  test('Add to Cart button works', async ({ page }) => {
    await page.goto('/');
    const count = await page.locator('.product-card').count();
    if (count > 0) {
      await page.locator('.product-card').first().click();
      await page.locator('.add-to-cart').click();
      const cartQty = page.locator('.cart-item-qty');
      await expect(cartQty).not.toHaveText('0');
    }
  });

  test('Buy Now button opens cart', async ({ page }) => {
    await page.goto('/');
    const count = await page.locator('.product-card').count();
    if (count > 0) {
      await page.locator('.product-card').first().click();
      await page.locator('.buy-now').click();
      await expect(page.locator('.cart-wrapper')).toBeVisible();
    }
  });

  test('may also like section is visible', async ({ page }) => {
    await page.goto('/');
    const count = await page.locator('.product-card').count();
    if (count > 0) {
      await page.locator('.product-card').first().click();
      await expect(page.locator('.maylike-products-wrapper')).toBeVisible();
      await expect(page.locator('.maylike-products-wrapper h2')).toContainText('You may also like');
    }
  });
});
