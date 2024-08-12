import { deleteCookie, getCookie } from 'hono/cookie'
import { bodyLimit } from 'hono/body-limit'

import { HonoApp, LocalContext } from '../bindings'
import {
  BODY_LIMIT_OPTIONS,
  CANCEL_SIGN_IN_PATH,
  EMAIL_SUBMITTED_COOKIE,
  ROOT_PATH,
  SESSION_COOKIE,
  STANDARD_COOKIE_OPTIONS,
} from '../constants'
import { removeSessionFromDb } from '../db/session-db-access'
import { redirectWithNoMessage } from '../redirects'

export const setupCancelSignInPath = (app: HonoApp) => {
  app.all(
    CANCEL_SIGN_IN_PATH,
    bodyLimit(BODY_LIMIT_OPTIONS),
    async (c: LocalContext) => {
      const sessionId = getCookie(c, SESSION_COOKIE) ?? ''
      if (sessionId.trim().length > 0) {
        await removeSessionFromDb(c, sessionId)
        deleteCookie(c, SESSION_COOKIE, STANDARD_COOKIE_OPTIONS)
      }

      deleteCookie(c, EMAIL_SUBMITTED_COOKIE, STANDARD_COOKIE_OPTIONS)
      return redirectWithNoMessage(c, ROOT_PATH)
    }
  )
}
