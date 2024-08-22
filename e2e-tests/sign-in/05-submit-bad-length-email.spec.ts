import { test } from '@playwright/test' // UNREVIEWED

import {
  clickLink,
  fillInput,
  findItemByTestId,
  verifyAlert,
} from '../support/finders'

const tooLongEmail =
  'too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long-too-long@somesite.com'

test('submit too long email', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await fillInput(page, 'email', tooLongEmail)
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-in-page-banner')

  // Expect there to be an error message
  await verifyAlert(page, `Invalid email address: ${tooLongEmail}`)
})

test('submit too short email', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await fillInput(page, 'email', 'x@y')
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-in-page-banner')

  // Expect there to be an error message
  await verifyAlert(page, `Invalid email address: x@y`)

  await clickLink(page, 'cancel-sign-in-link')
})
