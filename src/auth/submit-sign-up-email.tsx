import { setCookie } from 'hono/cookie' // UNREVIEWED

import {
  ADD_NEW_USER_MESSAGES,
  ADD_NEW_USER_TAKE_CODE_FAILED,
  AWAIT_CODE_PATH,
  EMAIL_SUBMITTED_COOKIE,
  NO_SUCH_PERSON_ID,
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
import { logTapeLogger } from '../middleware/logger'

type SubmitSignUpEmailBody = {
  email?: string
  signUpCode?: string
}

export const setupSubmitSignUpEmailPath = (app: HonoApp) => {
  app.post(SUBMIT_SIGN_UP_EMAIL_PATH, async (c: LocalContext) => {
    const body: SubmitSignUpEmailBody = await c.req.parseBody()
    const results = validSignUpParameters(
      body.email ?? '',
      body.signUpCode ?? ''
    )
    if (results.isErr) {
      logTapeLogger.error(results.error)
      return redirectWithErrorMessage(c, results.error, SIGN_UP_PATH)
    }

    const emailFound = results.value.email
    const signUpCodeFound = results.value.signUpCode

    setCookie(c, EMAIL_SUBMITTED_COOKIE, emailFound, STANDARD_COOKIE_OPTIONS)
    const personId = await findPersonByEmail(c, emailFound, false)
    if (personId.isOk && personId.value !== NO_SUCH_PERSON_ID) {
      const msg = `There is already an account for ${emailFound}, please sign in instead`
      logTapeLogger.error(msg)
      return redirectWithErrorMessage(c, msg, SIGN_UP_PATH)
    }
    if (personId.isErr) {
      logTapeLogger.error(personId.error)
      return redirectWithErrorMessage(c, personId.error, SIGN_UP_PATH)
    }

    const signUpResults = await addNewUserWithEmailAndCode(
      c,
      emailFound,
      signUpCodeFound
    )
    if (signUpResults.isErr) {
      if (signUpResults.error === ADD_NEW_USER_TAKE_CODE_FAILED) {
        const msg = `That sign-up code is invalid`
        logTapeLogger.error(msg)
        return redirectWithErrorMessage(c, msg, SIGN_UP_PATH)
      }

      const msg = `Failed to add new user: ${ADD_NEW_USER_MESSAGES.get(signUpResults.error)}`
      logTapeLogger.error(msg)
      return redirectWithErrorMessage(c, msg, SIGN_UP_PATH)
    }

    setCookie(
      c,
      SESSION_COOKIE,
      signUpResults.value.sessionId,
      STANDARD_COOKIE_OPTIONS
    )

    return redirectWithNoMessage(c, AWAIT_CODE_PATH)
  })
}
