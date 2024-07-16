import { test } from '@playwright/test'

import { clickLink, findItemByTestId, verifyAlert } from '../support/finders'

test('submit no email', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-in-page-banner')

  // Expect there to be an error message
  await verifyAlert(page, `You must supply an email address`)
})
