import { Hono } from 'hono'
import { Fragment } from 'hono/jsx'

import { Bindings } from './bindings'
import { ROOT_PATH, SIGN_IN_PATH, SUBMIT_EMAIL_PATH } from './constants'
import { footer, header } from './partials/header'

export const setupSignInPaths = (app: Hono<{ Bindings: Bindings }>) => {
  app.get(SIGN_IN_PATH, (c) => {
    return c.render(
      <Fragment>
        {header('sign-in-page-banner')}

        <div class='flex-grow mx-6'>
          <div class='card bg-gray-100 dark:bg-gray-700 relative'>
            <div class='card-body'>
              <h3 class='card-title'>Sign In</h3>

              <form action={SUBMIT_EMAIL_PATH} method='POST'>
                <label class='label'>
                  <span class='label-text'>Email address:</span>
                </label>

                <input
                  id='email'
                  type='email'
                  placeholder='email'
                  class='input input-bordered input-primary w-full max-w-xs'
                  data-testid='email-input'
                />

                <div class='card-actions justify-between mt-4'>
                  <a
                    href={ROOT_PATH}
                    class='btn btn-ghost'
                    data-testid='cancel-sign-in-link'
                  >
                    Cancel sign in
                  </a>

                  <button class='btn btn-accent'>Register a new account</button>

                  <input type='submit' class='btn btn-primary' />
                </div>
              </form>
            </div>
          </div>
        </div>

        {footer()}
      </Fragment>
    )
  })

  app.post(SUBMIT_EMAIL_PATH, async (c) => {
    const contentType = c.req.header('content-type')
    console.log(`contentType is`, contentType)
    console.log(`... as string, contentType is ${JSON.stringify(contentType)}`)
    const body = await c.req.parseBody()
    console.log(`body is`, body)
    console.log(`... as string, body is ${JSON.stringify(body)}`)
    return c.json(
      {
        message: 'Created!',
        body,
      },
      201
    )
  })
}
