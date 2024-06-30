import { test } from '@playwright/test'

import { clickLink, findItemByTestId } from '../support/finders'

test('click sign in, cancel back to main page', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')

  await clickLink(page, 'cancel-sign-in-link')

  // Expect there to be the right banner
  await findItemByTestId(page, 'startup-page-banner')
  await findItemByTestId(page, 'footer-banner')
})
