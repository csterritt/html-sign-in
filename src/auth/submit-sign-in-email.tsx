import { deleteCookie, setCookie } from 'hono/cookie'
import { StatusCodes } from 'http-status-codes'

import {
  AWAIT_CODE_PATH,
  EMAIL_SUBMITTED_COOKIE,
  ERROR_MESSAGE_COOKIE,
  SESSION_COOKIE,
  SIGN_IN_PATH,
  STANDARD_COOKIE_OPTIONS,
  SUBMIT_SIGN_IN_EMAIL_PATH,
  UNKNOWN_PERSON_ID,
} from '../constants'
import { HonoApp, LocalContext } from '../bindings'
import { findPersonByEmail } from '../db/session-db-access'
import { getSessionId } from '../db/get-session-id'

type SubmitEmailBody = {
  email?: string
}

export const setupSubmitSignInEmailPath = (app: HonoApp) => {
  app.post(SUBMIT_SIGN_IN_EMAIL_PATH, async (c: LocalContext) => {
    const body: SubmitEmailBody = await c.req.parseBody()
    const email = body.email ?? ''

    if (email.trim().length > 0) {
      setCookie(c, EMAIL_SUBMITTED_COOKIE, email, STANDARD_COOKIE_OPTIONS)
      const personId = await findPersonByEmail(c, email, true)
      if (personId === UNKNOWN_PERSON_ID) {
        setCookie(
          c,
          ERROR_MESSAGE_COOKIE,
          `Unknown email address: ${email}`,
          STANDARD_COOKIE_OPTIONS
        )
        return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
      }

      const sessionResults = await getSessionId(c, personId, email)
      if (sessionResults.sessionCreateFailed) {
        setCookie(
          c,
          ERROR_MESSAGE_COOKIE,
          'Failed to create session',
          STANDARD_COOKIE_OPTIONS
        )
        return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
      }

      setCookie(
        c,
        SESSION_COOKIE,
        sessionResults.sessionId,
        STANDARD_COOKIE_OPTIONS
      )
      deleteCookie(c, ERROR_MESSAGE_COOKIE, STANDARD_COOKIE_OPTIONS)
      return c.redirect(AWAIT_CODE_PATH, StatusCodes.SEE_OTHER)
    }

    setCookie(
      c,
      ERROR_MESSAGE_COOKIE,
      'You must supply an email address',
      STANDARD_COOKIE_OPTIONS
    )
    return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
  })
}
