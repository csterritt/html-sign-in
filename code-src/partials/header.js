import * as constants from '../constants.js'

export const header = (testId, buttonContent = '') => `
  <div
    class="flex flex-row items-center justify-between min-h-16 mb-2 rounded-b-lg md:mx-4 shadow-lg bg-primary text-primary-content dark:bg-accent dark:text-accent-content"
    data-testid="${testId}"
  >
    <div class="px-2 mx-2">
      <a href="${constants.SERVER_URL}/">
        <span class="text-lg font-bold md:hidden">SI-EX</span>
        <span class="text-lg font-bold hidden md:inline-block">
          Sign In Example
        </span>
      </a>
    </div>

    ${buttonContent}
  </div>
`
