import { setCookie } from 'hono/cookie'

import {
  AWAIT_CODE_PATH,
  EMAIL_SUBMITTED_COOKIE,
  SESSION_COOKIE,
  SIGN_UP_PATH,
  STANDARD_COOKIE_OPTIONS,
  SUBMIT_SIGN_UP_EMAIL_PATH,
  UNKNOWN_PERSON_ID,
} from '../constants'
import { HonoApp, LocalContext } from '../bindings'
import { findPersonByEmail } from '../db/session-db-access'
import { getSessionId } from '../db/get-session-id'
import { redirectWithNoMessage, redirectWithErrorMessage } from '../redirects'

type SubmitSignUpEmailBody = {
  email?: string
  signupCode?: string
}

export const setupSubmitSignUpEmailPath = (app: HonoApp) => {
  app.post(SUBMIT_SIGN_UP_EMAIL_PATH, async (c: LocalContext) => {
    const body: SubmitSignUpEmailBody = await c.req.parseBody()
    const email = body.email ?? ''
    const signupCode = body.signupCode ?? ''
    let personId: number = UNKNOWN_PERSON_ID
    let emailFound: boolean = false

    if (email.trim().length > 0) {
      emailFound = true
      setCookie(c, EMAIL_SUBMITTED_COOKIE, email, STANDARD_COOKIE_OPTIONS)
      personId = await findPersonByEmail(c, email, false)
      if (personId !== UNKNOWN_PERSON_ID) {
        return redirectWithErrorMessage(
          c,
          `There is already an account for ${email}, please sign in instead`,
          SIGN_UP_PATH
        )
      }
    }

    if (emailFound && signupCode.trim().length > 0) {
      const sessionResults = await getSessionId(c, personId, email, signupCode)
      if (sessionResults.sessionCreateFailed) {
        return redirectWithErrorMessage(
          c,
          'Failed to create session',
          SIGN_UP_PATH
        )
      }

      setCookie(
        c,
        SESSION_COOKIE,
        sessionResults.sessionId,
        STANDARD_COOKIE_OPTIONS
      )

      return redirectWithNoMessage(c, AWAIT_CODE_PATH)
    }

    let errorMessage = ''
    if (!emailFound) {
      errorMessage = 'You must supply an email address'
    } else if (signupCode.trim().length === 0) {
      errorMessage = 'You must supply a sign-up code'
    }

    return redirectWithErrorMessage(c, errorMessage, SIGN_UP_PATH)
  })
}
