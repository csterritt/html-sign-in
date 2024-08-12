import { setCookie } from 'hono/cookie'
import { bodyLimit } from 'hono/body-limit'
import * as v from 'valibot'

import {
  ADD_NEW_USER_MESSAGES,
  ADD_NEW_USER_TAKE_CODE_FAILED,
  AWAIT_CODE_PATH,
  BODY_LIMIT_OPTIONS,
  EMAIL_SUBMITTED_COOKIE,
  SESSION_COOKIE,
  SIGN_UP_PATH,
  STANDARD_COOKIE_OPTIONS,
  SUBMIT_SIGN_UP_EMAIL_PATH,
  UNKNOWN_PERSON_ID,
} from '../constants'
import { HonoApp, LocalContext } from '../bindings'
import {
  addNewUserWithEmailAndCode,
  findPersonByEmail,
} from '../db/session-db-access'
import { redirectWithNoMessage, redirectWithErrorMessage } from '../redirects'

type SubmitSignUpEmailBody = {
  email?: string
  signupCode?: string
}

const SignUpSchema = v.object({
  email: v.pipe(v.string(), v.email(), v.minLength(5), v.maxLength(254)),
  signupCode: v.pipe(v.string(), v.string(), v.minLength(8), v.maxLength(8)),
})

export const setupSubmitSignUpEmailPath = (app: HonoApp) => {
  app.post(
    SUBMIT_SIGN_UP_EMAIL_PATH,
    bodyLimit(BODY_LIMIT_OPTIONS),
    async (c: LocalContext) => {
      const body: SubmitSignUpEmailBody = await c.req.parseBody()
      const results = v.safeParse(SignUpSchema, {
        email: body.email,
        signupCode: body.signupCode,
      })
      if (
        !results?.success ||
        results?.output === undefined ||
        results?.output?.email === undefined ||
        results?.output?.signupCode === undefined
      ) {
        let errorFound = 'Unknown error'
        for (
          let index = 0;
          index < (results?.issues?.length ?? 0);
          index += 1
        ) {
          // @ts-ignore
          const issue: any = results.issues[index]
          if (issue?.path[0]?.key === 'email') {
            errorFound = `Invalid email address: ${body.email}`
            break
          } else if (issue?.path[0]?.key === 'signupCode') {
            errorFound = `That sign-up code is invalid`
          }
        }

        return redirectWithErrorMessage(c, errorFound, SIGN_UP_PATH)
      }

      const emailFound = results.output.email
      const signupCodeFound = results.output.signupCode

      setCookie(c, EMAIL_SUBMITTED_COOKIE, emailFound, STANDARD_COOKIE_OPTIONS)
      const personId = await findPersonByEmail(c, emailFound, false)
      if (personId !== UNKNOWN_PERSON_ID) {
        return redirectWithErrorMessage(
          c,
          `There is already an account for ${emailFound}, please sign in instead`,
          SIGN_UP_PATH
        )
      }

      const signUpResults = await addNewUserWithEmailAndCode(
        c,
        emailFound,
        signupCodeFound
      )
      if (!signUpResults.success) {
        if (signUpResults.errorCode === ADD_NEW_USER_TAKE_CODE_FAILED) {
          return redirectWithErrorMessage(
            c,
            `That sign-up code is invalid`,
            SIGN_UP_PATH
          )
        }

        return redirectWithErrorMessage(
          c,
          `Failed to add new user: ${ADD_NEW_USER_MESSAGES.get(signUpResults.errorCode)}`,
          SIGN_UP_PATH
        )
      }

      setCookie(
        c,
        SESSION_COOKIE,
        signUpResults.sessionId,
        STANDARD_COOKIE_OPTIONS
      )

      return redirectWithNoMessage(c, AWAIT_CODE_PATH)
    }
  )
}
