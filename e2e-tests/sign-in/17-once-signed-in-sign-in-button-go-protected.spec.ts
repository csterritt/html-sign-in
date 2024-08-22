import { test } from '@playwright/test'

import { clickLink, fillInput, findItemByTestId } from '../support/finders'

test('once signed in, the Sign In button takes you to the protected page', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await fillInput(page, 'email', 'fredfred@team439980.testinator.com')
  await clickLink(page, 'submit')
  await fillInput(page, 'code', '123654')
  await clickLink(page, 'submit')

  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')

  // Expect there to be the right banner
  await findItemByTestId(page, 'protected-page-banner')

  // There is now a sign-out button
  await findItemByTestId(page, 'sign-out-link')
  await clickLink(page, 'sign-out-link')
})
