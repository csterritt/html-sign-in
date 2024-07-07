import { test } from '@playwright/test'

import {
  clickLink,
  fillInput,
  findItemByTestId,
  verifyAlert,
} from '../support/finders'

test('submit a known email', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await fillInput(page, 'email', 'fredfred@team439980.testinator.com')
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'await-code-page-banner')

  // Expect there to be an error message
  await verifyAlert(
    page,
    `Please enter the code sent to fredfred@team439980.testinator.com`
  )
})
