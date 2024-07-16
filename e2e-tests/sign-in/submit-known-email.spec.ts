import { test } from '@playwright/test'

import {
  clickLink,
  fillInput,
  findItemByTestId,
  verifyContentByTestId,
} from '../support/finders'

test('submit a known email', async ({ page }) => {
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
})
