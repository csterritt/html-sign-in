import { test } from '@playwright/test'

import {
  clickLink,
  fillInput,
  findItemByTestId,
  verifyContentByTestId,
} from '../support/finders'
import { getOneUseCode, removeTemporaryUser } from '../support/db-support'

test('submit a new email and a good signup code to registration', async ({
  page,
}) => {
  let code = await getOneUseCode()
  code = (code ?? '').trim()
  if (code === '') {
    throw new Error('No code generated?')
  }
  const emailAddress = `newguy_${code}@team439980.testinator.com`

  await page.goto('http://localhost:3000/')
  await clickLink(page, 'sign-in-link')
  await clickLink(page, 'sign-up-link')
  await fillInput(page, 'email', emailAddress)
  await fillInput(page, 'code', code)
  await clickLink(page, 'submit')

  // Expect there to be the right banner
  await findItemByTestId(page, 'await-code-page-banner')

  // Expect there to be the proper message
  await verifyContentByTestId(
    page,
    'please-enter-code-message',
    `Please enter the code sent to ${emailAddress}`
  )

  await fillInput(page, 'code', '654321')
  await clickLink(page, 'submit')

  await findItemByTestId(page, 'protected-page-banner')

  await findItemByTestId(page, 'sign-out-link')
  await clickLink(page, 'sign-out-link')

  await findItemByTestId(page, 'startup-page-banner')
  await findItemByTestId(page, 'footer-banner')

  await removeTemporaryUser(code, emailAddress)
})
