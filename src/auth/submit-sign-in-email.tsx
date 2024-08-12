import { setCookie } from 'hono/cookie'
import { bodyLimit } from 'hono/body-limit'
import * as v from 'valibot'

import {
  AWAIT_CODE_PATH,
  BODY_LIMIT_OPTIONS,
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
 import { sendCodeEMail } from '../db/send-email' 

type SubmitEmailBody = {
  email?: string
}

const SignInSchema = v.object({
  email: v.pipe(v.string(), v.email(), v.minLength(4), v.maxLength(254)),
})

export const setupSubmitSignInEmailPath = (app: HonoApp) => {
  app.post(
    SUBMIT_SIGN_IN_EMAIL_PATH,
    bodyLimit(BODY_LIMIT_OPTIONS),
    async (c: LocalContext) => {
      const body: SubmitEmailBody = await c.req.parseBody()
      let emailFound = ''
      try {
        const { email } = v.parse(SignInSchema, { email: body.email })
        emailFound = email
      } catch (error) {
        return redirectWithErrorMessage(
          c,
          `Invalid email address: ${body.email}`,
          SIGN_IN_PATH
        )
      }

      setCookie(c, EMAIL_SUBMITTED_COOKIE, emailFound, STANDARD_COOKIE_OPTIONS)
      const personId = await findPersonByEmail(c, emailFound, true)
      if (personId === UNKNOWN_PERSON_ID) {
        return redirectWithErrorMessage(
          c,
          `Invalid email address: ${emailFound}`,
          SIGN_IN_PATH
        )
      }

      const sessionResults = await getSessionId(c, personId, emailFound)
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

       await sendCodeEMail(c.env, email, sessionResults.signInCode) 

      return redirectWithNoMessage(c, AWAIT_CODE_PATH)
    }
  )
}
