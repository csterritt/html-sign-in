import { Fragment } from 'hono/jsx'
import { setCookie } from 'hono/cookie'

import { addErrorIfAny } from './add-error-if-any'

import { SUBMIT_CODE_PATH } from '../constants'
import { footer, header } from '../partials/header'
import { ForwardOptions, LocalContext } from '../bindings'

export const buildAwaitCodePage =
  (email: string, options?: ForwardOptions) => (c: LocalContext) => {
    setCookie(c, 'email-sent', email, {
      path: '/',
      sameSite: 'Strict',
    })

    return c.render(
      <Fragment>
        {header('await-code-page-banner')}

        <div class='flex-grow mx-6'>
          {addErrorIfAny(options)}

          <div class='card bg-gray-100 dark:bg-gray-700 relative'>
            <div class='card-body'>
              <h3 class='card-title'>Enter code</h3>

              <p data-testid='please-enter-code-message'>
                Please enter the code sent to {email}
              </p>

              <form action={SUBMIT_CODE_PATH} method='POST'>
                <label class='label'>
                  <span class='label-text'>Code from email:</span>
                </label>

                <input
                  id='code'
                  name='code'
                  type='code'
                  placeholder='code'
                  class='input input-bordered input-primary w-full max-w-xs'
                  data-testid='code-input'
                />

                <div class='card-actions justify-between mt-4'>
                  <a class='btn btn-ghost' data-testid='cancel-sign-in-link'>
                    Cancel sign in
                  </a>

                  <input
                    type='submit'
                    class='btn btn-primary'
                    data-testid='submit'
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        {footer()}
      </Fragment>
    )
  }
