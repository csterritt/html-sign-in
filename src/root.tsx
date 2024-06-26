import { Hono } from 'hono'
import { Fragment } from 'hono/jsx'

import { Bindings } from './bindings'
import { ROOT_PATH, SIGN_IN_PATH } from './constants'
import { HeaderElement, footer, header } from './partials/header'

const signInPart: HeaderElement = (
  <div class='px-2 mx-2'>
    <a href={SIGN_IN_PATH} class='btn btn-secondary' data-testid='sign-in-link'>
      Sign In
    </a>
  </div>
)

export const setupRootPath = (app: Hono<{ Bindings: Bindings }>) => {
  app.get(ROOT_PATH, (c) => {
    return c.render(
      <Fragment>
        {header('startup-page-banner', signInPart)}

        <div class='flex-grow mx-6'>
          <span class='text-2xl italic'>Nothing to see here (yet)</span>
        </div>

        {footer()}
      </Fragment>
    )
  })
}
