const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('loads the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/JS Mastery Store/);
  });

  test('displays the navbar with logo', async ({ page }) => {
    await page.goto('/');
    const logo = page.locator('.logo');
    await expect(logo).toBeVisible();
    await expect(logo).toContainText('JSM Headphones');
  });

  test('displays the cart icon in navbar', async ({ page }) => {
    await page.goto('/');
    const cartButton = page.locator('.cart-icon');
    await expect(cartButton).toBeVisible();
  });

  test('displays the Best Seller Products heading', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('.products-heading h2');
    await expect(heading).toContainText('Best Seller Products');
  });

  test('displays the footer', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('.footer-container');
    await expect(footer).toBeVisible();
  });

  test('footer contains copyright text', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('.footer-container');
    await expect(footer).toContainText('2022 JSM Headphones');
  });
});

test.describe('Navigation', () => {
  test('logo links to homepage', async ({ page }) => {
    await page.goto('/');
    const logoLink = page.locator('.logo a');
    await expect(logoLink).toHaveAttribute('href', '/');
  });

  test('clicking cart icon opens cart sidebar', async ({ page }) => {
    await page.goto('/');
    const cartButton = page.locator('.cart-icon');
    await cartButton.click();
    const cartWrapper = page.locator('.cart-wrapper');
    await expect(cartWrapper).toBeVisible();
  });

  test('cart shows empty message initially', async ({ page }) => {
    await page.goto('/');
    const cartButton = page.locator('.cart-icon');
    await cartButton.click();
    await expect(page.locator('.empty-cart')).toBeVisible();
    await expect(page.locator('.empty-cart h3')).toContainText('Your shopping bag is empty');
  });

  test('clicking back button closes cart', async ({ page }) => {
    await page.goto('/');
    await page.locator('.cart-icon').click();
    await expect(page.locator('.cart-wrapper')).toBeVisible();
    await page.locator('.cart-heading').click();
    await expect(page.locator('.cart-wrapper')).not.toBeVisible();
  });
});
