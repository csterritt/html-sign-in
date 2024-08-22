import { test } from '@playwright/test' // UNREVIEWED

import {
  clickLink,
  fillInput,
  findItemByTestId,
  verifyAlert,
} from '../support/finders'

test('submit a known code', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await fillInput(page, 'email', 'fredfred@team439980.testinator.com')
  await clickLink(page, 'submit')
  await fillInput(page, 'code', '123654')
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'protected-page-banner')

  // There is now a welcome message
  await verifyAlert(page, `Sign in successful!`)

  // There is now a sign-out button
  await findItemByTestId(page, 'sign-out-link')
  await clickLink(page, 'sign-out-link')
})
