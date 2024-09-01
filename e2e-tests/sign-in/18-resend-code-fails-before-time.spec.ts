import { test } from '@playwright/test' // UNREVIEWED

import {
  clickLink,
  fillInput,
  findItemByTestId,
  verifyAlert,
} from '../support/finders'

test('click the resend code button, see please wait message', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await fillInput(page, 'email', 'fredfred@team439980.testinator.com')
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'await-code-page-banner')
  await clickLink(page, 'resend-code-button')

  // Expect there to be an error message
  await verifyAlert(
    page,
    `Please wait at least 30 seconds for the email to be delivered. Also, check your spam folder for the code.`
  )

  await clickLink(page, 'cancel-sign-in-link')
})
