import { test } from '@playwright/test'

import { clickLink, fillInput, findItemByTestId } from '../support/finders'

test('start sign in, give email, cancel before giving code', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await fillInput(page, 'email', 'fredfred@team439980.testinator.com')
  await clickLink(page, 'submit')
  await clickLink(page, 'cancel-sign-in-link')

  // Expect there to be the right banner
  await findItemByTestId(page, 'startup-page-banner')
  await findItemByTestId(page, 'footer-banner')
})
