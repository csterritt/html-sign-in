import { getCookie } from 'hono/cookie'

import { HonoApp, LocalContext } from '../bindings'
import {
  EMAIL_SUBMITTED_COOKIE,
  ERROR_MESSAGE_COOKIE,
  PROTECTED_PATH,
  SESSION_COOKIE,
  SIGN_IN_PATH,
} from '../constants'
import { buildSignInPage } from '../page-builders/build-sign-in-page'
import { StatusCodes } from 'http-status-codes'
import { getSessionInfoForSessionId } from '../db/session-db-access'

export const setupSignInPath = (app: HonoApp) => {
  app.get(SIGN_IN_PATH, async (c: LocalContext) => {
    const emailSubmitted = getCookie(c, EMAIL_SUBMITTED_COOKIE) ?? ''
    const errorMessage = getCookie(c, ERROR_MESSAGE_COOKIE) ?? ''

    const sessionId = getCookie(c, SESSION_COOKIE) ?? ''
    if (sessionId.trim().length > 0) {
      const sessionInfo = await getSessionInfoForSessionId(c, sessionId)
      if (
        sessionInfo?.success === true &&
        sessionInfo.results?.SignedIn === 1
      ) {
        return c.redirect(PROTECTED_PATH, StatusCodes.SEE_OTHER)
      }
    }

    return buildSignInPage(emailSubmitted, { error: errorMessage })(c)
  })
}
