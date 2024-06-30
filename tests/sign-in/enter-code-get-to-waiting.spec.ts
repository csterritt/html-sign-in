import { test } from '@playwright/test'

import {
  clickButton,
  clickLink,
  fillInput,
  findItemByTestId,
} from '../support/finders'

test('enter email at sign in, taken to waiting for code page', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')

  // Enter email
  await fillInput(page, 'email', 'fredfred@team.testinator.com')
  await clickButton(page, 'submit-button')

  // Expect there to be the right banner
  await findItemByTestId(page, 'await-code-page-banner')
  await findItemByTestId(page, 'footer-banner')
})
