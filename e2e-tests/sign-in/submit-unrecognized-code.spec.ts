import { test } from '@playwright/test'

import {
  clickLink,
  fillInput,
  findItemByTestId,
  verifyAlert,
  verifyContentByTestId,
} from '../support/finders'

test('submit an unknown magic code', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await fillInput(page, 'email', 'fredfred@team439980.testinator.com')
  await clickLink(page, 'submit')
  await fillInput(page, 'code', '565656')
  await clickLink(page, 'submit')

  // Expect there to be an error message
  await verifyAlert(
    page,
    'That is the wrong code, or it has expired. Please try again.'
  )

  // Expect there to be the proper message
  await verifyContentByTestId(
    page,
    'please-enter-code-message',
    `Please enter the code sent to fredfred@team439980.testinator.com`
  )
})
