import { deleteCookie, getCookie } from 'hono/cookie'
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
  rememberUserSignedIn,
  removeOldUserSessionsFromDb,
  SessionInformation,
  updateSessionContent,
} from '../db/session-db-access'
import { withSession } from './with-session'
import { redirectWithNoMessage, redirectWithErrorMessage } from '../redirects'

type SubmitCodeBody = {
  code?: string
}

enum ValidationResult {
  Success,
  InvalidCode,
  InvalidSession,
}

const codeIsValid = async (
  c: LocalContext,
  emailSubmitted: string,
  code: string,
  sessionId: string,
  sessionInfo: SessionInformation
): Promise<ValidationResult> => {
  const content = JSON.parse(sessionInfo.Content as string)
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
      deleteCookie(c, SESSION_COOKIE, STANDARD_COOKIE_OPTIONS)
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
    return await withSession(
      c,
      async (sessionIsValid, sessionId, sessionInfo) => {
        if (!sessionIsValid || sessionInfo == null || sessionId == null) {
          return redirectWithNoMessage(c, SIGN_IN_PATH)
        }

        const body: SubmitCodeBody = await c.req.parseBody()
        const codeSubmitted = body.code ?? ''
        const emailSubmitted = getCookie(c, EMAIL_SUBMITTED_COOKIE) ?? ''

        if (emailSubmitted.trim().length === 0) {
          // TODO: handle email not found
          return redirectWithNoMessage(c, SIGN_IN_PATH)
        }

        const timedOut = await sessionHasTimedOut(c, codeSubmitted, sessionInfo)
        if (timedOut) {
          return redirectWithErrorMessage(
            c,
            'That code has expired, please sign in again',
            SIGN_IN_PATH
          )
        }

        if (codeSubmitted.trim().length > 0) {
          const isValid = await codeIsValid(
            c,
            emailSubmitted,
            codeSubmitted,
            sessionId,
            sessionInfo
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

          const content = {
            email: emailSubmitted,
          }
          await rememberUserSignedIn(c, content, sessionId)
          deleteCookie(c, EMAIL_SUBMITTED_COOKIE, STANDARD_COOKIE_OPTIONS)
          return redirectWithNoMessage(c, PROTECTED_PATH)
        }

        return redirectWithErrorMessage(
          c,
          "You must supply the code sent to your email address. Check your spam filter, and after a few minutes, if it hasn't arrived, click the 'Resend' button below to try again.",
          AWAIT_CODE_PATH
        )
      }
    )
  })
}
