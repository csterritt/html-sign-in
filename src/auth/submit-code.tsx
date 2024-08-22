import { deleteCookie, getCookie } from 'hono/cookie' // UNREVIEWED
import dayjs from 'dayjs/esm'

import {
  AWAIT_CODE_PATH,
  EMAIL_SUBMITTED_COOKIE,
  PROTECTED_PATH,
  SESSION_COOKIE,
  SIGN_IN_PATH,
  SIGN_IN_TIMEOUT,
  STANDARD_COOKIE_OPTIONS,
  SUBMIT_CODE_PATH,
} from '../constants'
import { HonoApp, LocalContext } from '../bindings'
import {
  findCompletePersonByEmail,
  rememberUserCreated,
  rememberUserSignedIn,
  removeOldUserSessionsFromDb,
  removeSessionFromDb,
  SessionInformation,
  updateSessionContent,
} from '../db/session-db-access'
import {
  redirectWithErrorMessage,
  redirectWithNoMessage,
  redirectWithNotificationMessage,
} from '../redirects'
import {
  ValidationResult,
  validCode,
  validEmail,
} from '../validators/validators'

type SubmitCodeBody = {
  code?: string
}

const codeIsValid = async (
  c: LocalContext,
  emailSubmitted: string,
  code: string,
  sessionId: string,
  sessionInfo: SessionInformation
): Promise<ValidationResult> => {
  const content = sessionInfo.Content
  if (content.email !== emailSubmitted) {
    return ValidationResult.InvalidSession
  }

  if (content.signInCode !== code) {
    const count = (content.count ?? 0) + 1

    if (count < 3) {
      const newContent = {
        ...content,
        count,
      }
      const updateResults = await updateSessionContent(
        c,
        null,
        newContent,
        sessionId
      )
      if (!updateResults?.success) {
        // TODO: handle session not found
        return ValidationResult.InvalidSession
      }
    } else {
      await removeSessionFromDb(c, sessionId)
      return ValidationResult.InvalidSession
    }

    return ValidationResult.InvalidCode
  }

  return ValidationResult.Success
}

const sessionHasTimedOut = async (
  c: LocalContext,
  codeSubmitted: string,
  sessionInfo: SessionInformation
) => {
  let delay = SIGN_IN_TIMEOUT
  // PRODUCTION:REMOVE-NEXT-LINE
  if (codeSubmitted === '111111') {
    delay = 1 // PRODUCTION:REMOVE
  } // PRODUCTION:REMOVE

  const now = dayjs()
  let tooOld = now.subtract(delay)
  const removeResults = await removeOldUserSessionsFromDb(
    c,
    sessionInfo,
    tooOld.toDate()
  )

  let found = false
  if (removeResults != null && removeResults?.length > 0) {
    for (let index = 0; index < removeResults.length; index += 1) {
      if (sessionInfo.Session === removeResults[index].Session) {
        found = true
        break
      }
    }
  }

  return found
}

export const setupSubmitCodePath = (app: HonoApp) => {
  app.post(SUBMIT_CODE_PATH, async (c: LocalContext) => {
    const sessionInfo = c.get('Session')
    if (sessionInfo.isNothing || sessionInfo.value.SessionId == null) {
      return redirectWithNoMessage(c, SIGN_IN_PATH)
    }

    const body: SubmitCodeBody = await c.req.parseBody()
    const code = validCode(body.code ?? '')
    if (code.isNothing) {
      return redirectWithErrorMessage(
        c,
        "You must supply the code sent to your email address. Check your spam filter, and after a few minutes, if it hasn't arrived, click the 'Resend' button below to try again.",
        AWAIT_CODE_PATH
      )
    }
    const codeSubmitted = code.value

    const email = validEmail(getCookie(c, EMAIL_SUBMITTED_COOKIE) ?? '')
    if (email.isNothing) {
      // TODO: handle email not found
      return redirectWithNoMessage(c, SIGN_IN_PATH)
    }
    const emailSubmitted = email.value

    const timedOut = await sessionHasTimedOut(
      c,
      codeSubmitted,
      sessionInfo.value
    )
    if (timedOut) {
      deleteCookie(c, SESSION_COOKIE, STANDARD_COOKIE_OPTIONS)
      return redirectWithErrorMessage(
        c,
        'That code has expired, please sign in again',
        SIGN_IN_PATH
      )
    }

    const isValid = await codeIsValid(
      c,
      emailSubmitted,
      codeSubmitted,
      sessionInfo.value.SessionId,
      sessionInfo.value
    )
    if (isValid === ValidationResult.InvalidCode) {
      return redirectWithErrorMessage(
        c,
        'That is the wrong code. Please try again.',
        AWAIT_CODE_PATH
      )
    }

    if (isValid === ValidationResult.InvalidSession) {
      deleteCookie(c, EMAIL_SUBMITTED_COOKIE, STANDARD_COOKIE_OPTIONS)
      deleteCookie(c, SESSION_COOKIE, STANDARD_COOKIE_OPTIONS)
      return redirectWithErrorMessage(
        c,
        'That code has expired, please sign in again',
        SIGN_IN_PATH
      )
    }

    const userResults = await findCompletePersonByEmail(c, emailSubmitted)
    if (userResults.isNothing) {
      return redirectWithErrorMessage(
        c,
        'Internal error, please try again.',
        SIGN_IN_PATH
      )
    }

    let message = `Sign in successful!`
    if (!userResults.value.IsVerified) {
      const content = sessionInfo.value.Content
      const rememberSuccess = await rememberUserCreated(
        c,
        sessionInfo.value.SessionId,
        emailSubmitted,
        content.signUpCode ?? ''
      )

      if (!rememberSuccess) {
        return redirectWithErrorMessage(
          c,
          'Internal error, please try again.',
          SIGN_IN_PATH
        )
      }

      message = `Sign up successful! Welcome.`
    } else {
      const content = {
        email: emailSubmitted,
      }
      await rememberUserSignedIn(c, content, sessionInfo.value.SessionId)
    }

    deleteCookie(c, EMAIL_SUBMITTED_COOKIE, STANDARD_COOKIE_OPTIONS)
    return redirectWithNotificationMessage(c, message, PROTECTED_PATH)
  })
}
