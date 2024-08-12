import { test } from '@playwright/test'

import {
  clickLink,
  fillInput,
  findItemByTestId,
  verifyAlert,
} from '../support/finders'

const tooLongEmail =
  'too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long@somesite.com'

test('submit a too-long email to registration', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await clickLink(page, 'sign-up-link')
  await fillInput(page, 'email', tooLongEmail)
  await fillInput(page, 'code', 'code')
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-up-page-banner')

  // Expect there to be an error message
  await verifyAlert(page, `Invalid email address: ${tooLongEmail}`)
})

test('submit a too-short email to registration', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await clickLink(page, 'sign-up-link')
  await fillInput(page, 'email', 'x@y')
  await fillInput(page, 'code', 'code')
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-up-page-banner')

  // Expect there to be an error message
  await verifyAlert(page, `Invalid email address: x@y`)
})
