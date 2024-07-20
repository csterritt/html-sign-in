import { Fragment } from 'hono/jsx'
import { addErrorIfAny } from './add-error-if-any'

import { footer, header, HeaderElement } from '../partials/header'
import { ForwardOptions, LocalContext } from '../bindings'
import { CANCEL_SIGN_IN_PATH } from '../constants'

const signOutPart: HeaderElement = (
  <div class='px-2 mx-2'>
    <form action={CANCEL_SIGN_IN_PATH} method='POST'>
      <input
        type='submit'
        class='btn btn-secondary'
        data-testid='sign-out-link'
        value='Sign Out'
      />
    </form>
  </div>
)

const renderProtectedPage = (c: LocalContext, options?: ForwardOptions) =>
  c.render(
    <Fragment>
      {header('protected-page-banner', signOutPart)}

      <div class='flex-grow mx-6'>
        {addErrorIfAny(options)}

        <div class='card bg-gray-100 dark:bg-gray-700 relative'>
          <div class='card-body'>
            <h3 class='card-title'>The protected page.</h3>
          </div>
        </div>
      </div>

      {footer()}
    </Fragment>
  )

export const buildProtectedPage =
  (options?: ForwardOptions) => (c: LocalContext) => {
    return renderProtectedPage(c, options)
  }
