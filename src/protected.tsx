import { getCookie } from 'hono/cookie'
import { bodyLimit } from 'hono/body-limit'

import { HonoApp, LocalContext } from './bindings'
import {
  BODY_LIMIT_OPTIONS,
  ERROR_MESSAGE_COOKIE,
  PROTECTED_PATH,
  SIGN_IN_PATH,
} from './constants'
import { buildProtectedPage } from './page-builders/build-protected-page'
import { withSession } from './auth/with-session'
import { redirectWithErrorMessage } from './redirects'

export const setupProtectedPath = (app: HonoApp) => {
  app.get(
    PROTECTED_PATH,
    bodyLimit(BODY_LIMIT_OPTIONS),
    async (c: LocalContext) => {
      const errorMessage = getCookie(c, ERROR_MESSAGE_COOKIE) ?? ''
      return await withSession(c, async (sessionIsValid) => {
        if (!sessionIsValid) {
          return redirectWithErrorMessage(
            c,
            'You must sign in to visit that page',
            SIGN_IN_PATH
          )
        }

        return buildProtectedPage({ error: errorMessage })(c)
      })
    }
  )
}
