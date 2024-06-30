import { expect, Page } from '@playwright/test'

export const findItemByTestId = async (page: Page, testId: string) => {
  const item = page.getByTestId(testId)
  return expect(item).toBeVisible()
}

export const clickLink = async (page: Page, testId: string) => {
  return page.getByTestId(testId).click()
}

export const fillInput = async (
  page: Page,
  placeholder: string,
  value: string
) => {
  return page.getByPlaceholder(placeholder).fill(value)
}

export const clickButton = async (page: Page, testId: string) => {
  const item = page.getByTestId(testId)
  return item.click()
}
