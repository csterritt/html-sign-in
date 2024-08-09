import { test } from '@playwright/test'

import {
  clickLink,
  fillInput,
  findItemByTestId,
  verifyAlert,
} from '../support/finders'

test('submit a sign up with the email address for an existing account', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await clickLink(page, 'sign-up-link')
  await fillInput(page, 'email', 'fredfred@team439980.testinator.com')
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-up-page-banner')

  // Expect there to be an error message
  await verifyAlert(
    page,
    `There is already an account for fredfred@team439980.testinator.com, please sign in instead`
  )
})
