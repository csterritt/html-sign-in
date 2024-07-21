import { getCookie } from 'hono/cookie'
import { StatusCodes } from 'http-status-codes'

import { HonoApp, LocalContext } from '../bindings'
import {
  EMAIL_SUBMITTED_COOKIE,
  ERROR_MESSAGE_COOKIE,
  PROTECTED_PATH,
  SIGN_UP_PATH,
} from '../constants'
import { withSession } from './with-session'
import { buildSignUpPage } from '../page-builders/build-sign-up-page'

export const setupSignUpPath = (app: HonoApp) => {
  app.get(SIGN_UP_PATH, async (c: LocalContext) => {
    const emailSubmitted = getCookie(c, EMAIL_SUBMITTED_COOKIE) ?? ''
    const errorMessage = getCookie(c, ERROR_MESSAGE_COOKIE) ?? ''

    return await withSession(c, async (sessionIsValid) => {
      if (sessionIsValid) {
        return c.redirect(PROTECTED_PATH, StatusCodes.SEE_OTHER)
      }

      return buildSignUpPage(emailSubmitted, { error: errorMessage })(c)
    })
  })
}
