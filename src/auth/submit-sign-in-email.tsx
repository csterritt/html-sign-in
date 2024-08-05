import { setCookie } from 'hono/cookie'

import {
  AWAIT_CODE_PATH,
  EMAIL_SUBMITTED_COOKIE,
  SESSION_COOKIE,
  SIGN_IN_PATH,
  STANDARD_COOKIE_OPTIONS,
  SUBMIT_SIGN_IN_EMAIL_PATH,
  UNKNOWN_PERSON_ID,
} from '../constants'
import { HonoApp, LocalContext } from '../bindings'
import { findPersonByEmail } from '../db/session-db-access'
import { getSessionId } from '../db/get-session-id'
import { redirectWithNoMessage, redirectWithErrorMessage } from '../redirects'
// import { sendCodeEMail } from '../db/send-email' // PRODUCTION:UNCOMMENT

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
        return redirectWithErrorMessage(
          c,
          `Unknown email address: ${email}`,
          SIGN_IN_PATH
        )
      }

      const sessionResults = await getSessionId(c, personId, email)
      if (sessionResults.sessionCreateFailed) {
        return redirectWithErrorMessage(
          c,
          'Failed to create session',
          SIGN_IN_PATH
        )
      }

      setCookie(
        c,
        SESSION_COOKIE,
        sessionResults.sessionId,
        STANDARD_COOKIE_OPTIONS
      )

      console.log(`signUpCode is ${JSON.stringify(sessionResults.signInCode)}`) // PRODUCTION:REMOVE
      // await sendCodeEMail(c.env, email, sessionResults.signInCode) // PRODUCTION:UNCOMMENT

      return redirectWithNoMessage(c, AWAIT_CODE_PATH)
    }

    return redirectWithErrorMessage(
      c,
      'You must supply an email address',
      SIGN_IN_PATH
    )
  })
}
