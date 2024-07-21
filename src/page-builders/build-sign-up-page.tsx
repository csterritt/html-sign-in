import { Fragment } from 'hono/jsx'
import { addErrorIfAny } from './add-error-if-any'

import {
  CANCEL_SIGN_IN_PATH,
  SIGN_IN_PATH,
  SUBMIT_SIGN_UP_EMAIL_PATH,
} from '../constants'
import { footer, header } from '../partials/header'
import { ForwardOptions, LocalContext } from '../bindings'

const renderSignUpPage = (
  c: LocalContext,
  emailSubmitted: string,
  options?: ForwardOptions
) =>
  c.render(
    <Fragment>
      {header('sign-up-page-banner')}

      <div class='flex-grow mx-6'>
        {addErrorIfAny(options)}

        <div class='card bg-gray-100 dark:bg-gray-700 relative'>
          <div class='card-body'>
            <h3 class='card-title'>Register a new account</h3>

            <form action={SUBMIT_SIGN_UP_EMAIL_PATH} method='POST'>
              <label class='label'>
                <span class='label-text'>Email address:</span>
              </label>

              <input
                id='email'
                name='email'
                type='email'
                placeholder='email'
                class='input input-bordered input-primary w-full max-w-xs mb-4'
                autoFocus={true}
                value={emailSubmitted}
                data-testid='email-input'
              />

              <label class='label'>
                <span class='label-text'>Registration Code:</span>
              </label>

              <input
                id='signup-code'
                name='signupCode'
                type='signup-code'
                placeholder='Registration Code'
                class='input input-bordered input-primary w-full max-w-xs'
                data-testid='signup-code'
              />

              <div class='card-actions justify-between mt-4'>
                <a
                  href={CANCEL_SIGN_IN_PATH}
                  class='btn btn-ghost'
                  data-testid='cancel-sign-up-link'
                >
                  Cancel registration
                </a>

                <a
                  href={SIGN_IN_PATH}
                  class='btn btn-accent'
                  data-testid='sign-in-link'
                >
                  Sign in to an existing account
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

export const buildSignUpPage =
  (emailSubmitted: string, options?: ForwardOptions) => (c: LocalContext) => {
    return renderSignUpPage(c, emailSubmitted, options)
  }
