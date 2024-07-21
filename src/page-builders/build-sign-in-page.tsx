import { Fragment } from 'hono/jsx'
import { addErrorIfAny } from './add-error-if-any'

import {
  CANCEL_SIGN_IN_PATH,
  SIGN_UP_PATH,
  SUBMIT_SIGN_IN_EMAIL_PATH,
} from '../constants'
import { footer, header } from '../partials/header'
import { ForwardOptions, LocalContext } from '../bindings'

const renderSignInPage = (
  c: LocalContext,
  emailSubmitted: string,
  options?: ForwardOptions
) =>
  c.render(
    <Fragment>
      {header('sign-in-page-banner')}

      <div class='flex-grow mx-6'>
        {addErrorIfAny(options)}

        <div class='card bg-gray-100 dark:bg-gray-700 relative'>
          <div class='card-body'>
            <h3 class='card-title'>Sign In</h3>

            <form action={SUBMIT_SIGN_IN_EMAIL_PATH} method='POST'>
              <label class='label'>
                <span class='label-text'>Email address:</span>
              </label>

              <input
                id='email'
                name='email'
                type='email'
                placeholder='email'
                class='input input-bordered input-primary w-full max-w-xs'
                autofocus={true}
                value={emailSubmitted}
                data-testid='email-input'
              />

              <div class='card-actions justify-between mt-4'>
                <a
                  href={CANCEL_SIGN_IN_PATH}
                  class='btn btn-ghost'
                  data-testid='cancel-sign-in-link'
                >
                  Cancel sign in
                </a>

                <a
                  href={SIGN_UP_PATH}
                  class='btn btn-accent'
                  data-testid='sign-up-link'
                >
                  Register a new account
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

export const buildSignInPage =
  (emailSubmitted: string, options?: ForwardOptions) => (c: LocalContext) => {
    return renderSignInPage(c, emailSubmitted, options)
  }
