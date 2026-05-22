const { test, expect } = require('@playwright/test');

test.describe('Success Page', () => {
  test('success page loads and shows thank you message', async ({ page }) => {
    await page.goto('/success');
    await expect(page.locator('.success h2')).toContainText('Thank you for your order!');
  });

  test('success page shows email instructions', async ({ page }) => {
    await page.goto('/success');
    await expect(page.locator('.email-msg')).toContainText('Check your email inbox for the receipt');
  });

  test('success page has contact email', async ({ page }) => {
    await page.goto('/success');
    const emailLink = page.locator('a.email');
    await expect(emailLink).toHaveAttribute('href', 'mailto:order@example.com');
    await expect(emailLink).toContainText('order@example.com');
  });

  test('success page has Continue Shopping button linking to home', async ({ page }) => {
    await page.goto('/success');
    const btn = page.locator('.btn:has-text("Continue Shopping")');
    await expect(btn).toBeVisible();
  });

  test('clicking Continue Shopping navigates to homepage', async ({ page }) => {
    await page.goto('/success');
    await page.locator('.btn:has-text("Continue Shopping")').click();
    await expect(page).toHaveURL('/');
  });
});
