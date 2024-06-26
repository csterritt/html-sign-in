import { test, expect } from '@playwright/test'

import { findItemByTestId } from '../support/finders'

test('click sign in, page has banner', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  // Expect there to be the right banner
  await findItemByTestId(page, 'startup-page-banner')

  await page.getByTestId('sign-in-link').click()

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-in-page-banner')
})

// test('has sign in link', async ({ page }) => {
//   await page.goto('http://localhost:3000/')
//
//   // Expect there to be a sign-in link
//   const link = page.getByTestId('sign-in-link')
//   await expect(link).toBeVisible()
// })
