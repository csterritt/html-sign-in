import { getCookie } from 'hono/cookie'

import { HonoApp, LocalContext } from '../bindings'
import {
  EMAIL_SUBMITTED_COOKIE,
  ERROR_MESSAGE_COOKIE,
  SIGN_IN_PATH,
} from '../constants'
import { buildSignInPage } from '../page-builders/build-sign-in-page'

export const setupSignInPath = (app: HonoApp) => {
  app.get(SIGN_IN_PATH, async (c: LocalContext) => {
    const emailSubmitted = getCookie(c, EMAIL_SUBMITTED_COOKIE) ?? ''
    const errorMessage = getCookie(c, ERROR_MESSAGE_COOKIE) ?? ''

    return buildSignInPage(emailSubmitted, { error: errorMessage })(c)
  })
}
