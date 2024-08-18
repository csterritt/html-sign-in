import { test } from '@playwright/test'

import { clickLink, fillInput, findItemByTestId } from '../support/finders'
import { getOneUseCode, removeTemporaryUser } from '../support/db-support'

test('found a case where sign up with email and sign-up code, then go a page that does not exist then clicking home and sign in puts you on the protected page', async ({
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

  await page.goto('http://localhost:3000/page-does-not-exist')

  // Expect there to be the right banners
  await findItemByTestId(page, '404-page-banner')
  await clickLink(page, 'root-link')

  // Expect there to be the right banners
  await findItemByTestId(page, 'startup-page-banner')

  await clickLink(page, 'sign-in-link')
  await clickLink(page, 'sign-up-link')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-up-page-banner')

  await removeTemporaryUser(code, emailAddress)
})
