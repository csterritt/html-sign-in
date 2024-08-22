import { deleteCookie, getCookie } from 'hono/cookie' // UNREVIEWED

import { HonoApp, LocalContext } from '../bindings'
import {
  CANCEL_SIGN_IN_PATH,
  EMAIL_SUBMITTED_COOKIE,
  ERROR_MESSAGE_COOKIE,
  NOTIFICATION_MESSAGE_COOKIE,
  ROOT_PATH,
  SESSION_COOKIE,
  STANDARD_COOKIE_OPTIONS,
} from '../constants'
import { removeSessionFromDb } from '../db/session-db-access'
import { redirectWithNoMessage } from '../redirects'

export const setupCancelSignInPath = (app: HonoApp) => {
  app.all(CANCEL_SIGN_IN_PATH, async (c: LocalContext) => {
    const sessionId = getCookie(c, SESSION_COOKIE) ?? ''
    if (sessionId.trim().length > 0) {
      await removeSessionFromDb(c, sessionId)
      deleteCookie(c, SESSION_COOKIE, STANDARD_COOKIE_OPTIONS)
    }

    deleteCookie(c, EMAIL_SUBMITTED_COOKIE, STANDARD_COOKIE_OPTIONS)
    deleteCookie(c, ERROR_MESSAGE_COOKIE)
    deleteCookie(c, NOTIFICATION_MESSAGE_COOKIE)
    return redirectWithNoMessage(c, ROOT_PATH)
  })
}
