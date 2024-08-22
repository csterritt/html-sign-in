import { getCookie } from 'hono/cookie'

import { HonoApp, LocalContext } from '../bindings'
import {
  EMAIL_SUBMITTED_COOKIE,
  ERROR_MESSAGE_COOKIE,
  NOTIFICATION_MESSAGE_COOKIE,
  PROTECTED_PATH,
  SIGN_UP_PATH,
} from '../constants'
import { buildSignUpPage } from '../page-builders/build-sign-up-page'
import { redirectWithNoMessage } from '../redirects'

export const setupSignUpPath = (app: HonoApp) =>
  app.get(SIGN_UP_PATH, async (c: LocalContext) => {
    const sessionInfo = c.get('Session')
    if (sessionInfo.isJust && sessionInfo.value.SignedIn) {
      return redirectWithNoMessage(c, PROTECTED_PATH)
    }

    const emailSubmitted = getCookie(c, EMAIL_SUBMITTED_COOKIE) ?? ''
    return buildSignUpPage(emailSubmitted, {
      error: getCookie(c, ERROR_MESSAGE_COOKIE) ?? '',
      message: getCookie(c, NOTIFICATION_MESSAGE_COOKIE) ?? '',
    })(c)
  })
