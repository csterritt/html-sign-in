import { getCookie } from 'hono/cookie'

import { HonoApp, LocalContext } from './bindings'
import { ERROR_MESSAGE_COOKIE, PROTECTED_PATH } from './constants'
import { buildSignInSuccessPage } from './page-builders/build-sign-in-success-page'

export const setupProtectedPath = (app: HonoApp) => {
  app.get(PROTECTED_PATH, async (c: LocalContext) => {
    const errorMessage = getCookie(c, ERROR_MESSAGE_COOKIE) ?? ''

    return buildSignInSuccessPage({ error: errorMessage })(c)
  })
}
