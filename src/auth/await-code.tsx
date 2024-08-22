import { getCookie } from 'hono/cookie'
import { StatusCodes } from 'http-status-codes'

import { HonoApp, LocalContext } from '../bindings'
import {
  AWAIT_CODE_PATH,
  EMAIL_SUBMITTED_COOKIE,
  ERROR_MESSAGE_COOKIE,
  NOTIFICATION_MESSAGE_COOKIE,
  SIGN_IN_PATH,
} from '../constants'
import { buildAwaitCodePage } from '../page-builders/build-await-code-page'

export const setupAwaitCodePath = (app: HonoApp) =>
  app.get(AWAIT_CODE_PATH, async (c: LocalContext) => {
    const sessionInfo = c.get('Session')
    if (sessionInfo.isNothing) {
      return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
    }

    const emailSubmitted = getCookie(c, EMAIL_SUBMITTED_COOKIE) ?? ''
    if (emailSubmitted.trim().length === 0) {
      return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
    }

    return buildAwaitCodePage(emailSubmitted, {
      error: getCookie(c, ERROR_MESSAGE_COOKIE) ?? '',
      message: getCookie(c, NOTIFICATION_MESSAGE_COOKIE) ?? '',
    })(c)
  })
