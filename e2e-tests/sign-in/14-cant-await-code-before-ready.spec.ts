import { test } from '@playwright/test'

import { findItemByTestId } from '../support/finders'

test('you cannot visit the await code page if there is no code', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/api/auth/await-code')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-in-page-banner')
  await findItemByTestId(page, 'footer-banner')
})
