import { Hono } from 'hono'

import { Bindings } from './bindings'
import { ROOT_PATH, SIGN_IN_PATH } from './constants'
import { footer, header } from './partials/header'

export const setupSignInPaths = (app: Hono<{ Bindings: Bindings }>) => {
  app.get(SIGN_IN_PATH, (c) => {
    return c.render(
      <div class='flex flex-col grow' data-testid='sign-in-page-banner'>
        {header()}

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

        {footer()}
      </div>
    )
  })
}
