import { test } from '@playwright/test'

import {
  clickLink,
  fillInput,
  findItemByTestId,
  verifyAlert,
} from '../support/finders'
import { RESEND_CODE_TIMEOUT } from '../../src/constants'
import { sleep } from '../../src/support/sleep'

test('click the resend code button, sign in with new code', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await fillInput(page, 'email', 'fredfred@team439980.testinator.com')
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'await-code-page-banner')

  await sleep(RESEND_CODE_TIMEOUT)

  await clickLink(page, 'resend-code-button')

  // Expect there to be an error message
  await verifyAlert(
    page,
    `Code sent, please also check your spam folder for the code.`
  )

  await fillInput(page, 'code', '654321')
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'protected-page-banner')

  // There is now a sign-out button
  await findItemByTestId(page, 'sign-out-link')
  await clickLink(page, 'sign-out-link')
})
