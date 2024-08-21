import { Hono } from 'hono'
import { Fragment } from 'hono/jsx'

import { Bindings } from './bindings'
import { ROOT_PATH } from './constants'
import { footer, header } from './partials/header'

export const setup404Path = (app: Hono<{ Bindings: Bindings }>) => {
  app.all('/*', (c) => {
    return c.render(
      <Fragment>
        {header('404-page-banner')}

        <div class='flex-grow mx-6'>
          <p class='text-2xl italic my-6' data-testid='404-message'>
            That page does not exist
          </p>

          <p>
            <a href={ROOT_PATH} class='btn btn-primary' data-testid='root-link'>
              Return to the home page
            </a>
          </p>
        </div>

        {footer()}
      </Fragment>
    )
  })
}
