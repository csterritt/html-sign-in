import { test } from '@playwright/test'

import {
  clickLink,
  fillInput,
  findItemByTestId,
  verifyAlert,
  verifyContentByTestId,
} from '../support/finders'

test('submit an empty magic code', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await fillInput(page, 'email', 'fredfred@team439980.testinator.com')
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'await-code-page-banner')

  await clickLink(page, 'submit')

  // Expect there to be an error message
  await verifyAlert(
    page,
    `You must supply the code sent to your email address. Check your spam filter, and after a few minutes, if it hasn't arrived, click the 'Resend' button below to try again.`
  )

  // Expect there to be the proper message
  await verifyContentByTestId(
    page,
    'please-enter-code-message',
    `Please enter the code sent to fredfred@team439980.testinator.com`
  )
})
