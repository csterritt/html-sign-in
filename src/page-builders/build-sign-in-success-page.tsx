import { Fragment } from 'hono/jsx'
import { addErrorIfAny } from './add-error-if-any'

import { footer, header } from '../partials/header'
import { ForwardOptions, LocalContext } from '../bindings'

const renderSignInSuccessPage = (c: LocalContext, options?: ForwardOptions) =>
  c.render(
    <Fragment>
      {header('sign-in-success-page-banner')}

      <div class='flex-grow mx-6'>
        {addErrorIfAny(options)}

        <div class='card bg-gray-100 dark:bg-gray-700 relative'>
          <div class='card-body'>
            <h3 class='card-title'>You have signed in successfully!</h3>
          </div>
        </div>
      </div>

      {footer()}
    </Fragment>
  )

export const buildSignInSuccessPage =
  (options?: ForwardOptions) => (c: LocalContext) => {
    return renderSignInSuccessPage(c, options)
  }
