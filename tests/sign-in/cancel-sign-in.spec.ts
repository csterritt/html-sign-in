import { test } from '@playwright/test'

import { clickLink, findItemByTestId } from '../support/finders'

test('click sign in, page has banner', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  // Expect there to be the right banner
  await findItemByTestId(page, 'startup-page-banner')
  await clickLink(page, 'sign-in-link')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-in-page-banner')
  await clickLink(page, 'cancel-sign-in-link')

  // Expect there to be the right banner
  await findItemByTestId(page, 'startup-page-banner')
})
