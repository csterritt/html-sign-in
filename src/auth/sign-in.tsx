import { getCookie } from 'hono/cookie'

import { HonoApp, LocalContext } from '../bindings'
import {
  EMAIL_SUBMITTED_COOKIE,
  ERROR_MESSAGE_COOKIE,
  NOTIFICATION_MESSAGE_COOKIE,
  PROTECTED_PATH,
  SIGN_IN_PATH,
} from '../constants'
import { buildSignInPage } from '../page-builders/build-sign-in-page'
import { redirectWithNoMessage } from '../redirects'

export const setupSignInPath = (app: HonoApp) => {
  app.get(SIGN_IN_PATH, async (c: LocalContext) => {
    const sessionInfo = c.get('Session')
    if (sessionInfo.isJust && sessionInfo.value.SignedIn) {
      return redirectWithNoMessage(c, PROTECTED_PATH)
    }

    const emailSubmitted = getCookie(c, EMAIL_SUBMITTED_COOKIE) ?? ''
    const errorMessage = getCookie(c, ERROR_MESSAGE_COOKIE) ?? ''
    const notificationMessage = getCookie(c, NOTIFICATION_MESSAGE_COOKIE) ?? ''
    return buildSignInPage(emailSubmitted, {
      error: errorMessage,
      message: notificationMessage,
    })(c)
  })
}
