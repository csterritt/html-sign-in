import { getCookie } from 'hono/cookie'

import { HonoApp, LocalContext } from './bindings'
import { ERROR_MESSAGE_COOKIE, PROTECTED_PATH, SIGN_IN_PATH } from './constants'
import { buildProtectedPage } from './page-builders/build-protected-page'
import { withSession } from './auth/with-session'
import { redirectWithErrorMessage } from './redirects'

export const setupProtectedPath = (app: HonoApp) => {
  app.get(PROTECTED_PATH, async (c: LocalContext) => {
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
  })
}
