import { getCookie, setCookie } from 'hono/cookie'
import { StatusCodes } from 'http-status-codes'

import { HonoApp, LocalContext } from './bindings'
import { ERROR_MESSAGE_COOKIE, PROTECTED_PATH, SIGN_IN_PATH } from './constants'
import { buildProtectedPage } from './page-builders/build-protected-page'
import { withSession } from './auth/with-session'

export const setupProtectedPath = (app: HonoApp) => {
  app.get(PROTECTED_PATH, async (c: LocalContext) => {
    const errorMessage = getCookie(c, ERROR_MESSAGE_COOKIE) ?? ''
    return await withSession(c, async (sessionIsValid) => {
      if (!sessionIsValid) {
        setCookie(
          c,
          ERROR_MESSAGE_COOKIE,
          'You must sign in to visit that page'
        )

        return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
      }

      return buildProtectedPage({ error: errorMessage })(c)
    })
  })
}
