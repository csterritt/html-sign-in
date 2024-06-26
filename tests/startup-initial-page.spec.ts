import { test } from '@playwright/test'

import { findItemByTestId } from './support/finders'

test('has banner', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  // Expect there to be the right banner
  await findItemByTestId(page, 'startup-page-banner')
})

test('has sign in link', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  // Expect there to be a sign-in link
  await findItemByTestId(page, 'sign-in-link')
})
