import { test } from '@playwright/test'

import { clickLink, findItemByTestId } from '../support/finders'

test('visit registration page, cancel back to root', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await clickLink(page, 'sign-up-link')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-up-page-banner')
  await findItemByTestId(page, 'footer-banner')

  await clickLink(page, 'cancel-sign-up-link')

  // Expect there to be the right banner
  await findItemByTestId(page, 'startup-page-banner')
  await findItemByTestId(page, 'footer-banner')
})
