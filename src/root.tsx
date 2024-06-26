import { Hono } from 'hono'

import { Bindings } from './bindings'
import { ROOT_PATH, SIGN_IN_PATH } from './constants'
import { footer, header } from './partials/header'

const signInPart = (
  <div class='px-2 mx-2'>
    <a href={SIGN_IN_PATH} class='btn btn-secondary' data-testid='sign-in-link'>
      Sign In
    </a>
  </div>
)

export const setupRootPath = (app: Hono<{ Bindings: Bindings }>) => {
  app.get(ROOT_PATH, (c) => {
    return c.render(
      <div class='flex flex-col grow' data-testid='startup-page-banner'>
        {header(signInPart)}

        <div class='flex-grow mx-6'>
          <span class='text-2xl italic'>Nothing to see here (yet)</span>
        </div>

        {footer()}
      </div>
    )
  })
}
