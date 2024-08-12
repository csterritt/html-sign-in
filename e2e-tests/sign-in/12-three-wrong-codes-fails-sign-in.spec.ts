import { Page, test } from '@playwright/test'

import {
  clickLink,
  fillInput,
  findItemByTestId,
  verifyAlert,
} from '../support/finders'

const doOneBadTry = async (page: Page) => {
  await fillInput(page, 'code', '565656')
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'await-code-page-banner')

  // Expect there to be an error message
  await verifyAlert(page, 'That is the wrong code. Please try again.')
}

test('submitting three wrong magic codes fails and you have to start over', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await fillInput(page, 'email', 'fredfred@team439980.testinator.com')
  await clickLink(page, 'submit')

  await doOneBadTry(page)
  await doOneBadTry(page)

  await fillInput(page, 'code', '565656')
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-in-page-banner')

  // Expect there to be an error message
  await verifyAlert(page, 'That code has expired, please sign in again')
})
