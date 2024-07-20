import { getCookie } from 'hono/cookie'
import { StatusCodes } from 'http-status-codes'

import { HonoApp, LocalContext } from '../bindings'
import {
  AWAIT_CODE_PATH,
  EMAIL_SUBMITTED_COOKIE,
  ERROR_MESSAGE_COOKIE,
  SESSION_COOKIE,
  SIGN_IN_PATH,
} from '../constants'
import { buildAwaitCodePage } from '../page-builders/build-await-code-page'
import { getSessionInfoForSessionId } from '../db/session-db-access'

export const setupAwaitCodePath = (app: HonoApp) => {
  app.get(AWAIT_CODE_PATH, async (c: LocalContext) => {
    const emailSubmitted = getCookie(c, EMAIL_SUBMITTED_COOKIE) ?? ''
    if (emailSubmitted.trim().length === 0) {
      return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
    }

    const sessionId = getCookie(c, SESSION_COOKIE) ?? ''
    if (sessionId.trim().length === 0) {
      return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
    }

    const sessionInfo = await getSessionInfoForSessionId(c, sessionId)
    if (sessionInfo?.success !== true) {
      // TODO: handle session not found
      return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
    }

    const errorMessage = getCookie(c, ERROR_MESSAGE_COOKIE) ?? ''
    return buildAwaitCodePage(emailSubmitted, { error: errorMessage })(c)
  })
}
