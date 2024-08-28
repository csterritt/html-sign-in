import { setCookie } from 'hono/cookie' // UNREVIEWED

import {
  AWAIT_CODE_PATH,
  EMAIL_SUBMITTED_COOKIE,
  SESSION_COOKIE,
  SIGN_IN_PATH,
  STANDARD_COOKIE_OPTIONS,
  SUBMIT_SIGN_IN_EMAIL_PATH,
} from '../constants'
import { HonoApp, LocalContext } from '../bindings'
import { findPersonByEmail } from '../db/session-db-access'
import { getSessionId } from '../db/get-session-id'
import { redirectWithErrorMessage, redirectWithNoMessage } from '../redirects'
import { validEmail } from '../validators/validators'
// import { sendCodeEMail } from '../db/send-email' // PRODUCTION:UNCOMMENT

type SubmitEmailBody = {
  email?: string
}

export const setupSubmitSignInEmailPath = (app: HonoApp) => {
  app.post(SUBMIT_SIGN_IN_EMAIL_PATH, async (c: LocalContext) => {
    const body: SubmitEmailBody = await c.req.parseBody()
    const email = validEmail(body.email ?? '')
    if (email.isNothing) {
      return redirectWithErrorMessage(
        c,
        `Invalid email address: ${body.email ?? ''}`,
        SIGN_IN_PATH
      )
    }

    const emailFound = email.value
    setCookie(c, EMAIL_SUBMITTED_COOKIE, emailFound, STANDARD_COOKIE_OPTIONS)
    const personId = await findPersonByEmail(c, emailFound, true)
    if (personId.isErr) {
      return redirectWithErrorMessage(
        c,
        `Invalid email address: ${emailFound}`,
        SIGN_IN_PATH
      )
    }

    const sessionResults = await getSessionId(c, personId.value, emailFound)
    if (sessionResults.isNothing) {
      return redirectWithErrorMessage(
        c,
        'Failed to create session',
        SIGN_IN_PATH
      )
    }

    setCookie(
      c,
      SESSION_COOKIE,
      sessionResults.value.sessionId,
      STANDARD_COOKIE_OPTIONS
    )

    console.log(`signUpCode is ${sessionResults.value.signInCode}`) // PRODUCTION:REMOVE
    // await sendCodeEMail(c.env, email, sessionResults.value.signInCode) // PRODUCTION:UNCOMMENT

    return redirectWithNoMessage(c, AWAIT_CODE_PATH)
  })
}
