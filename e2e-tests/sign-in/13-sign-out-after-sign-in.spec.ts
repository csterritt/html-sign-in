import { test } from '@playwright/test'

import { clickLink, fillInput, findItemByTestId } from '../support/finders'

test('sign out after sign in', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await fillInput(page, 'email', 'fredfred@team439980.testinator.com')
  await clickLink(page, 'submit')
  await fillInput(page, 'code', '123654')
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'protected-page-banner')

  await clickLink(page, 'sign-out-link')
  await findItemByTestId(page, 'startup-page-banner')
  await findItemByTestId(page, 'footer-banner')
})
