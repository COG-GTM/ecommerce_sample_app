const { test, expect } = require('@playwright/test');

test.describe('Cart Functionality', () => {
  test('cart opens and closes', async ({ page }) => {
    await page.goto('/');
    await page.locator('.cart-icon').click();
    await expect(page.locator('.cart-wrapper')).toBeVisible();
    await page.locator('.cart-heading').click();
    await expect(page.locator('.cart-wrapper')).not.toBeVisible();
  });

  test('empty cart shows correct message and continue shopping button', async ({ page }) => {
    await page.goto('/');
    await page.locator('.cart-icon').click();
    await expect(page.locator('.empty-cart h3')).toContainText('Your shopping bag is empty');
    const continueBtn = page.locator('.empty-cart .btn');
    await expect(continueBtn).toContainText('Continue Shopping');
  });

  test('continue shopping button closes cart', async ({ page }) => {
    await page.goto('/');
    await page.locator('.cart-icon').click();
    await page.locator('.empty-cart .btn').click();
    await expect(page.locator('.cart-wrapper')).not.toBeVisible();
  });

  test('adding product updates cart quantity badge', async ({ page }) => {
    await page.goto('/');
    const count = await page.locator('.product-card').count();
    if (count > 0) {
      await page.locator('.product-card').first().click();
      await page.locator('.add-to-cart').click();
      const badge = page.locator('.cart-item-qty');
      await expect(badge).toContainText('1');
    }
  });

  test('cart shows items after adding', async ({ page }) => {
    await page.goto('/');
    const count = await page.locator('.product-card').count();
    if (count > 0) {
      await page.locator('.product-card').first().click();
      await page.locator('.add-to-cart').click();
      await page.locator('.cart-icon').click();
      await expect(page.locator('.cart-wrapper .product')).toBeVisible();
      await expect(page.locator('.cart-bottom')).toBeVisible();
    }
  });

  test('cart quantity can be incremented and decremented', async ({ page }) => {
    await page.goto('/');
    const count = await page.locator('.product-card').count();
    if (count > 0) {
      await page.locator('.product-card').first().click();
      await page.locator('.add-to-cart').click();
      await page.locator('.cart-icon').click();
      const cartItem = page.locator('.cart-wrapper .product').first();
      const qty = cartItem.locator('.num');
      await expect(qty).toHaveText('1');
      await cartItem.locator('.plus').click();
      await expect(qty).toHaveText('2');
      await cartItem.locator('.minus').click();
      await expect(qty).toHaveText('1');
    }
  });

  test('item can be removed from cart', async ({ page }) => {
    await page.goto('/');
    const count = await page.locator('.product-card').count();
    if (count > 0) {
      await page.locator('.product-card').first().click();
      await page.locator('.add-to-cart').click();
      await page.locator('.cart-icon').click();
      await page.locator('.remove-item').click();
      await expect(page.locator('.empty-cart')).toBeVisible();
    }
  });

  test('Pay with Stripe button is visible with items', async ({ page }) => {
    await page.goto('/');
    const count = await page.locator('.product-card').count();
    if (count > 0) {
      await page.locator('.product-card').first().click();
      await page.locator('.add-to-cart').click();
      await page.locator('.cart-icon').click();
      const payBtn = page.locator('button:has-text("Pay with Stripe")');
      await expect(payBtn).toBeVisible();
    }
  });
});
