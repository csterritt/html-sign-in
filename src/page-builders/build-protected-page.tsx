import { Fragment } from 'hono/jsx' // UNREVIEWED
import { addNotificationsIfAny } from './add-notifications-if-any'

import { footer, header } from '../partials/header'
import { ForwardOptions, LocalContext } from '../bindings'

const renderProtectedPage = (c: LocalContext, options?: ForwardOptions) =>
  c.render(
    <Fragment>
      {header(c, 'protected-page-banner')}

      <div class='flex-grow mx-6'>
        {addNotificationsIfAny(options)}

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
