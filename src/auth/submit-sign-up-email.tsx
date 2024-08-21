import { setCookie } from 'hono/cookie'

import {
  ADD_NEW_USER_MESSAGES,
  ADD_NEW_USER_TAKE_CODE_FAILED,
  AWAIT_CODE_PATH,
  EMAIL_SUBMITTED_COOKIE,
  SESSION_COOKIE,
  SIGN_UP_PATH,
  STANDARD_COOKIE_OPTIONS,
  SUBMIT_SIGN_UP_EMAIL_PATH,
} from '../constants'
import { HonoApp, LocalContext } from '../bindings'
import {
  addNewUserWithEmailAndCode,
  findPersonByEmail,
} from '../db/session-db-access'
import { redirectWithErrorMessage, redirectWithNoMessage } from '../redirects'
import { validSignUpParameters } from '../validators/validators'

type SubmitSignUpEmailBody = {
  email?: string
  signUpCode?: string
}

export const setupSubmitSignUpEmailPath = (app: HonoApp) => {
  app.post(SUBMIT_SIGN_UP_EMAIL_PATH, async (c: LocalContext) => {
    const body: SubmitSignUpEmailBody = await c.req.parseBody()
    const { email, signUpCode, errorFound, success } = validSignUpParameters(
      body.email ?? '',
      body.signUpCode ?? ''
    )
    if (!success) {
      console.log(`errorFound: ${errorFound}`)
      return redirectWithErrorMessage(c, errorFound, SIGN_UP_PATH)
    }

    const emailFound = email
    const signUpCodeFound = signUpCode

    setCookie(c, EMAIL_SUBMITTED_COOKIE, emailFound, STANDARD_COOKIE_OPTIONS)
    const personId = await findPersonByEmail(c, emailFound, false)
    if (personId.isJust) {
      return redirectWithErrorMessage(
        c,
        `There is already an account for ${emailFound}, please sign in instead`,
        SIGN_UP_PATH
      )
    }

    const signUpResults = await addNewUserWithEmailAndCode(
      c,
      emailFound,
      signUpCodeFound
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
  })
}
