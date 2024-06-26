import { Hono } from 'hono'

import { Bindings } from './bindings'
import { ROOT_PATH, SIGN_IN_PATH } from './constants'

export const setupRootPath = (app: Hono<{ Bindings: Bindings }>) => {
  app.get(ROOT_PATH, (c) => {
    return c.render(
      <div class='flex flex-col grow'>
        <div
          class='flex flex-row items-center justify-between min-h-16 mb-2 rounded-b-lg md:mx-4 shadow-lg bg-primary text-primary-content dark:bg-accent dark:text-accent-content textarea-accent'
          data-testid='startup-page-banner'
        >
          <div class='px-2 mx-2'>
            <span class='text-lg font-bold md:hidden'>SI-EX</span>
            <span class='text-lg font-bold hidden md:inline-block'>
              Sign In Example
            </span>
          </div>

          <div class='px-2 mx-2'>
            <a
              href={SIGN_IN_PATH}
              class='btn btn-secondary'
              data-testid='sign-in-link'
            >
              Sign In
            </a>
          </div>
        </div>

        <div class='flex-grow mx-6'>
          <span class='text-2xl italic'>Nothing to see here (yet)</span>
        </div>

        <div class='mx-6'>
          <span>Content copyright Chris Sterritt, 2024</span>
          <span class='mx-2'>-</span>
          <span>Vx</span>
        </div>
      </div>
    )
  })
}
