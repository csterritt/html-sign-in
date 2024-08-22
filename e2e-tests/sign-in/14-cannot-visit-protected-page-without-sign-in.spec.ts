import { Page, test } from '@playwright/test'

import {
  clickLink,
  fillInput,
  findItemByTestId,
  verifyAlert,
} from '../support/finders'

test('you cannot visit the protected page without signing in', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/protected')

  // Expect there to be the right banner
  await findItemByTestId(page, 'sign-in-page-banner')

  // Expect there to be an error message
  await verifyAlert(page, 'You must sign in to visit that page')
})
