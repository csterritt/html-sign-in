import { deleteCookie, setCookie } from 'hono/cookie'
import { StatusCodes } from 'http-status-codes'

import {
  AWAIT_CODE_PATH,
  EMAIL_SUBMITTED_COOKIE,
  ERROR_MESSAGE_COOKIE,
  SESSION_COOKIE,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
  STANDARD_COOKIE_OPTIONS,
  SUBMIT_SIGN_UP_EMAIL_PATH,
  UNKNOWN_PERSON_ID,
} from '../constants'
import { HonoApp, LocalContext } from '../bindings'
import { findPersonByEmail } from '../db/session-db-access'
import { getSessionId } from '../db/get-session-id'

type SubmitSignUpEmailBody = {
  email?: string
  signupCode?: string
}

export const setupSubmitSignUpEmailPath = (app: HonoApp) => {
  app.post(SUBMIT_SIGN_UP_EMAIL_PATH, async (c: LocalContext) => {
    const body: SubmitSignUpEmailBody = await c.req.parseBody()
    const email = body.email ?? ''
    const signupCode = body.signupCode ?? ''

    if (email.trim().length > 0 && signupCode.trim().length > 0) {
      setCookie(c, EMAIL_SUBMITTED_COOKIE, email, STANDARD_COOKIE_OPTIONS)
      const personId = await findPersonByEmail(c, email, true)
      if (personId !== UNKNOWN_PERSON_ID) {
        setCookie(
          c,
          ERROR_MESSAGE_COOKIE,
          `There is already an account for ${email}, please sign in instead`,
          STANDARD_COOKIE_OPTIONS
        )
        return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
      }

      const sessionResults = await getSessionId(c, personId, email, signupCode)
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

    if (email.trim().length === 0) {
      setCookie(
        c,
        ERROR_MESSAGE_COOKIE,
        'You must supply an email address',
        STANDARD_COOKIE_OPTIONS
      )
    } else if (signupCode.trim().length === 0) {
      setCookie(
        c,
        ERROR_MESSAGE_COOKIE,
        'You must supply a sign-up code',
        STANDARD_COOKIE_OPTIONS
      )
    }

    return c.redirect(SIGN_UP_PATH, StatusCodes.SEE_OTHER)
  })
}
