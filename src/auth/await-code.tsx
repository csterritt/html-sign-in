import { getCookie } from 'hono/cookie'
import { bodyLimit } from 'hono/body-limit'
import { StatusCodes } from 'http-status-codes'

import { HonoApp, LocalContext } from '../bindings'
import {
  AWAIT_CODE_PATH,
  BODY_LIMIT_OPTIONS,
  EMAIL_SUBMITTED_COOKIE,
  ERROR_MESSAGE_COOKIE,
  SIGN_IN_PATH,
} from '../constants'
import { buildAwaitCodePage } from '../page-builders/build-await-code-page'
import { withSession } from './with-session'

export const setupAwaitCodePath = (app: HonoApp) => {
  app.get(
    AWAIT_CODE_PATH,
    bodyLimit(BODY_LIMIT_OPTIONS),
    async (c: LocalContext) => {
      const emailSubmitted = getCookie(c, EMAIL_SUBMITTED_COOKIE) ?? ''
      if (emailSubmitted.trim().length === 0) {
        return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
      }

      return await withSession(c, async (sessionIsValid) => {
        if (!sessionIsValid) {
          return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
        }

        const errorMessage = getCookie(c, ERROR_MESSAGE_COOKIE) ?? ''
        return buildAwaitCodePage(emailSubmitted, { error: errorMessage })(c)
      })
    }
  )
}
