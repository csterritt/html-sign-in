import { getCookie } from 'hono/cookie'

import { HonoApp, LocalContext } from './bindings'
import {
  ERROR_MESSAGE_COOKIE,
  PROTECTED_PATH,
  SESSION_COOKIE,
  SIGN_IN_PATH,
} from './constants'
import { buildSignInSuccessPage } from './page-builders/build-sign-in-success-page'
import { StatusCodes } from 'http-status-codes'
import { getSessionInfoForSessionId } from './db/session-db-access'
import { setCookie } from 'hono/cookie'

export const setupProtectedPath = (app: HonoApp) => {
  app.get(PROTECTED_PATH, async (c: LocalContext) => {
    const errorMessage = getCookie(c, ERROR_MESSAGE_COOKIE) ?? ''
    const sessionId = getCookie(c, SESSION_COOKIE) ?? ''
    if (sessionId.trim().length === 0) {
      setCookie(c, ERROR_MESSAGE_COOKIE, 'You must sign in to visit that page')

      return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
    }

    const sessionInfo = await getSessionInfoForSessionId(c, sessionId)
    if (sessionInfo?.success !== true) {
      // TODO: handle session not found
      setCookie(c, ERROR_MESSAGE_COOKIE, 'You must sign in to visit that page')

      return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
    }

    return buildSignInSuccessPage({ error: errorMessage })(c)
  })
}
