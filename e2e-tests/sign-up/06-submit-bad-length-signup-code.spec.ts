import { test } from '@playwright/test'

import {
  clickLink,
  fillInput,
  findItemByTestId,
  verifyAlert,
} from '../support/finders'

test('submit a too-long signup code to registration', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await clickLink(page, 'sign-up-link')
  await fillInput(page, 'email', 'newguy@team439980.testinator.com')
  await fillInput(page, 'code', 'code-code-code-code-code-code-code')
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-up-page-banner')

  // Expect there to be an error message
  await verifyAlert(page, `That sign-up code is invalid`)

  await clickLink(page, 'cancel-sign-up-link')
})

test('submit a too-short signup code to registration', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await clickLink(page, 'sign-up-link')
  await fillInput(page, 'email', 'newguy@team439980.testinator.com')
  await fillInput(page, 'code', 'x')
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-up-page-banner')

  // Expect there to be an error message
  await verifyAlert(page, `That sign-up code is invalid`)

  await clickLink(page, 'cancel-sign-up-link')
})
