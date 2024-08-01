import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { StatusCodes } from 'http-status-codes'
import dayjs from 'dayjs/esm'

import {
  AWAIT_CODE_PATH,
  EMAIL_SUBMITTED_COOKIE,
  ERROR_MESSAGE_COOKIE,
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

export const setupSubmitCodePath = (app: HonoApp) => {
  app.post(SUBMIT_CODE_PATH, async (c: LocalContext) => {
    return await withSession(
      c,
      async (sessionIsValid, sessionId, sessionInfo) => {
        if (!sessionIsValid || sessionInfo == null) {
          return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
        }

        const body: SubmitCodeBody = await c.req.parseBody()
        const codeSubmitted = body.code ?? ''
        const emailSubmitted = getCookie(c, EMAIL_SUBMITTED_COOKIE) ?? ''

        if (emailSubmitted.trim().length === 0) {
          // TODO: handle email not found
          return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
        }

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

        if (removeResults != null && removeResults?.length > 0) {
          let found = false
          for (let index = 0; index < removeResults.length; index += 1) {
            if (sessionInfo.Session === removeResults[index].Session) {
              found = true
              break
            }
          }

          if (found) {
            setCookie(
              c,
              ERROR_MESSAGE_COOKIE,
              'That code has expired, please sign in again'
            )
            return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
          }
        }

        if (codeSubmitted.trim().length > 0) {
          const isValid = await codeIsValid(
            c,
            emailSubmitted,
            codeSubmitted,
            sessionId as string,
            sessionInfo as SessionInformation
          )
          if (isValid === ValidationResult.InvalidCode) {
            setCookie(
              c,
              ERROR_MESSAGE_COOKIE,
              'That is the wrong code. Please try again.'
            )
            return c.redirect(AWAIT_CODE_PATH, StatusCodes.SEE_OTHER)
          }

          if (isValid === ValidationResult.InvalidSession) {
            setCookie(
              c,
              ERROR_MESSAGE_COOKIE,
              'That code has expired, please sign in again'
            )
            deleteCookie(c, EMAIL_SUBMITTED_COOKIE, STANDARD_COOKIE_OPTIONS)
            deleteCookie(c, SESSION_COOKIE, STANDARD_COOKIE_OPTIONS)

            return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
          }

          const content = {
            email: emailSubmitted,
          }
          await rememberUserSignedIn(c, content, sessionId as string)
          deleteCookie(c, EMAIL_SUBMITTED_COOKIE, STANDARD_COOKIE_OPTIONS)
          deleteCookie(c, ERROR_MESSAGE_COOKIE, STANDARD_COOKIE_OPTIONS)
          return c.redirect(PROTECTED_PATH, StatusCodes.SEE_OTHER)
        }

        setCookie(
          c,
          ERROR_MESSAGE_COOKIE,
          "You must supply the code sent to your email address. Check your spam filter, and after a few minutes, if it hasn't arrived, click the 'Resend' button below to try again."
        )
        return c.redirect(AWAIT_CODE_PATH, StatusCodes.SEE_OTHER)
      }
    )
  })
}
