import { test } from '@playwright/test'

import {
  clickLink,
  findItemByTestId,
  verifyContentByTestId,
} from './support/finders'

test('a bad path redirects to a proper 404 page', async ({ page }) => {
  await page.goto('http://localhost:3000/this/path/does/not/exist')

  // Expect there to be the right banners
  await findItemByTestId(page, '404-page-banner')
  await findItemByTestId(page, 'footer-banner')

  // Expect there to be an error message
  await verifyContentByTestId(page, '404-message', 'That page does not exist')
})

test('return to home from 404 page works', async ({ page }) => {
  await page.goto('http://localhost:3000/this/path/does/not/exist')
  await clickLink(page, 'root-link')

  // Expect there to be the right banners
  await findItemByTestId(page, 'startup-page-banner')
  await findItemByTestId(page, 'footer-banner')
})
