import { test } from '@playwright/test' // UNREVIEWED

import {
  clickLink,
  fillInput,
  findItemByTestId,
  verifyAlert,
  verifyContentByTestId,
} from '../support/finders'

test('found a case where if you enter a legal email, but no code, you can visit the protected page', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await fillInput(page, 'email', 'fredfred@team439980.testinator.com')
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'await-code-page-banner')

  // Expect there to be the proper message
  await verifyContentByTestId(
    page,
    'please-enter-code-message',
    `Please enter the code sent to fredfred@team439980.testinator.com`
  )

  await page.goto('http://localhost:3000/protected')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-in-page-banner')

  // Expect there to be an error message
  await verifyAlert(page, 'You must sign in to visit that page')

  await clickLink(page, 'cancel-sign-in-link')
})
