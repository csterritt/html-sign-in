import { getCookie } from 'hono/cookie'
import { StatusCodes } from 'http-status-codes'

import { HonoApp, LocalContext } from '../bindings'
import {
  EMAIL_SUBMITTED_COOKIE,
  ERROR_MESSAGE_COOKIE,
  PROTECTED_PATH,
  SIGN_IN_PATH,
} from '../constants'
import { buildSignInPage } from '../page-builders/build-sign-in-page'
import { withSession } from './with-session'

export const setupSignInPath = (app: HonoApp) => {
  app.get(SIGN_IN_PATH, async (c: LocalContext) => {
    const emailSubmitted = getCookie(c, EMAIL_SUBMITTED_COOKIE) ?? ''
    const errorMessage = getCookie(c, ERROR_MESSAGE_COOKIE) ?? ''

    return await withSession(c, async (sessionIsValid) => {
      if (sessionIsValid) {
        return c.redirect(PROTECTED_PATH, StatusCodes.SEE_OTHER)
      }

      return buildSignInPage(emailSubmitted, { error: errorMessage })(c)
    })
  })
}
