import { getCookie } from 'hono/cookie'
import { bodyLimit } from 'hono/body-limit'

import { HonoApp, LocalContext } from '../bindings'
import {
  BODY_LIMIT_OPTIONS,
  EMAIL_SUBMITTED_COOKIE,
  ERROR_MESSAGE_COOKIE,
  PROTECTED_PATH,
  SIGN_UP_PATH,
} from '../constants'
import { withSession } from './with-session'
import { buildSignUpPage } from '../page-builders/build-sign-up-page'
import { redirectWithNoMessage } from '../redirects'

export const setupSignUpPath = (app: HonoApp) => {
  app.get(
    SIGN_UP_PATH,
    bodyLimit(BODY_LIMIT_OPTIONS),
    async (c: LocalContext) => {
      const emailSubmitted = getCookie(c, EMAIL_SUBMITTED_COOKIE) ?? ''
      const errorMessage = getCookie(c, ERROR_MESSAGE_COOKIE) ?? ''

      return await withSession(c, async (sessionIsValid) => {
        if (sessionIsValid) {
          return redirectWithNoMessage(c, PROTECTED_PATH)
        }

        return buildSignUpPage(emailSubmitted, { error: errorMessage })(c)
      })
    }
  )
}
