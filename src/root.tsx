import { Hono } from 'hono'
import { Fragment } from 'hono/jsx'

import { Bindings, LocalContext } from './bindings'
import { ROOT_PATH } from './constants'
import { footer, header } from './partials/header'

export const setupRootPath = (app: Hono<{ Bindings: Bindings }>) =>
  app.get(ROOT_PATH, (c: LocalContext) =>
    c.render(
      <Fragment>
        {header(c, 'startup-page-banner')}

        <div class='flex-grow mx-6'>
          <span class='text-2xl italic'>Nothing to see here (yet)</span>
        </div>

        {footer()}
      </Fragment>
    )
  )
