import { test } from '@playwright/test' // UNREVIEWED

import { clickLink, fillInput, findItemByTestId } from '../support/finders'

test('found a case where sign in with email but not code, then go a page that does not exist then clicking home and sign in puts you on the protected page', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await fillInput(page, 'email', 'fredfred@team439980.testinator.com')
  await clickLink(page, 'submit')
  await page.goto('http://localhost:3000/page-does-not-exist')

  // Expect there to be the right banners
  await findItemByTestId(page, '404-page-banner')
  await clickLink(page, 'root-link')

  // Expect there to be the right banners
  await findItemByTestId(page, 'startup-page-banner')

  await clickLink(page, 'sign-in-link')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-in-page-banner')

  await clickLink(page, 'cancel-sign-in-link')
})
