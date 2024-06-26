import { test, expect } from '@playwright/test'

test('has banner', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  // Expect there to be a banner
  const banner = page.getByTestId('page-banner')
  await expect(banner).toBeVisible()
})

test('has sign in link', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  // Expect there to be a sign-in link
  const link = page.getByTestId('sign-in-link')
  await expect(link).toBeVisible()
})
