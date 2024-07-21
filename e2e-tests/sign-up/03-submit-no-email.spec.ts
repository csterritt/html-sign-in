import { test } from '@playwright/test'

import { clickLink, findItemByTestId, verifyAlert } from '../support/finders'

test('submit no email to registration', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await clickLink(page, 'sign-up-link')
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-up-page-banner')

  // Expect there to be an error message
  await verifyAlert(page, `You must supply an email address`)
})
