import { test } from '@playwright/test'

import { clickLink, findItemByTestId } from '../support/finders'

test('you can toggle between sign in and sign up', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-in-page-banner')

  await clickLink(page, 'sign-up-link')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-up-page-banner')

  await clickLink(page, 'sign-in-link')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-in-page-banner')
})
