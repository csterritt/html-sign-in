import { deleteCookie, getCookie } from 'hono/cookie'
import { StatusCodes } from 'http-status-codes'

import { HonoApp, LocalContext } from '../bindings'
import {
  CANCEL_SIGN_IN_PATH,
  EMAIL_SUBMITTED_COOKIE,
  ERROR_MESSAGE_COOKIE,
  ROOT_PATH,
  SESSION_COOKIE,
} from '../constants'
import { removeSessionFromDb } from '../db/session-db-access'

export const setupCancelSignInPath = (app: HonoApp) => {
  app.all(CANCEL_SIGN_IN_PATH, async (c: LocalContext) => {
    const sessionId = getCookie(c, SESSION_COOKIE) ?? ''
    if (sessionId.trim().length > 0) {
      await removeSessionFromDb(c, sessionId)
      deleteCookie(c, SESSION_COOKIE)
    }

    deleteCookie(c, EMAIL_SUBMITTED_COOKIE)
    deleteCookie(c, ERROR_MESSAGE_COOKIE)
    return c.redirect(ROOT_PATH, StatusCodes.SEE_OTHER)
  })
}
