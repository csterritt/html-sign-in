import { HtmlEscaped, HtmlEscapedString } from 'hono/utils/html'

export type HeaderElement =
  | (string & HtmlEscaped)
  | Promise<HtmlEscapedString>
  | null

export const header = (testId: string, children: HeaderElement = null) => (
  <div
    class='flex flex-row items-center justify-between min-h-16 mb-2 rounded-b-lg md:mx-4 shadow-lg bg-primary text-primary-content dark:bg-accent dark:text-accent-content'
    data-testid={testId}
  >
    <div class='px-2 mx-2'>
      <span class='text-lg font-bold md:hidden'>SI-EX</span>
      <span class='text-lg font-bold hidden md:inline-block'>
        Sign In Example
      </span>
    </div>

    {children}
  </div>
)

export const footer = () => (
  <div class='mx-6' data-testid='footer-banner'>
    <span>Content copyright Chris Sterritt, 2024</span>
    <span class='mx-2'>-</span>
    <span>V-2</span>
  </div>
)
