import { expect, Page } from '@playwright/test'

export const findItemByTestId = async (page: Page, testId: string) => {
  const item = page.getByTestId(testId)
  return expect(item).toBeVisible()
}
