import { Hono } from 'hono'

import { Bindings } from './bindings'
import { ROOT_PATH, SIGN_IN_PATH } from './constants'

export const setupSignInPaths = (app: Hono<{ Bindings: Bindings }>) => {
  app.get(SIGN_IN_PATH, (c) => {
    return c.render(
      <div class='flex flex-col grow'>
        <div
          class='flex flex-row items-center justify-between min-h-16 mb-2 rounded-b-lg md:mx-4 shadow-lg bg-primary text-primary-content dark:bg-accent dark:text-accent-content'
          data-testid='sign-in-page-banner'
        >
          <div class='px-2 mx-2'>
            <span class='text-lg font-bold md:hidden'>SI-EX</span>
            <span class='text-lg font-bold hidden md:inline-block'>
              Sign In Example
            </span>
          </div>
        </div>

        <div class='flex-grow mx-6'>
          <div class='card bg-gray-100 dark:bg-gray-700 relative'>
            <div class='card-body'>
              <h3 class='card-title'>Sign In</h3>

              <section>
                <div>
                  <label class='label'>
                    <span class='label-text'>Email address:</span>
                  </label>

                  <input
                    type='email'
                    placeholder='email'
                    class='input input-bordered input-primary w-full max-w-xs'
                    data-testid='email-input'
                  />
                </div>

                <div class='card-actions justify-between mt-4'>
                  <a
                    href={ROOT_PATH}
                    class='btn btn-ghost'
                    data-testid='cancel-sign-in-link'
                  >
                    Cancel sign in
                  </a>

                  <button class='btn btn-accent'>Register a new account</button>

                  <button class='btn btn-primary'>Submit</button>
                </div>
              </section>
            </div>
          </div>
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
