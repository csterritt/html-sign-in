import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { StatusCodes } from 'http-status-codes'

import {
  AWAIT_CODE_PATH,
  EMAIL_SUBMITTED_COOKIE,
  ERROR_MESSAGE_COOKIE,
  PROTECTED_PATH,
  SESSION_COOKIE,
  SIGN_IN_PATH,
  STANDARD_COOKIE_OPTIONS,
  SUBMIT_CODE_PATH,
} from '../constants'
import { HonoApp, LocalContext } from '../bindings'
import {
  getSessionInfoForSessionId,
  updateSessionContent,
} from '../db/session-db-access'

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
  code: string
): Promise<ValidationResult> => {
  const sessionId = getCookie(c, SESSION_COOKIE) ?? ''
  if (sessionId.trim().length === 0) {
    // TODO: handle session not found
    return ValidationResult.InvalidSession
  }

  const sessionInfo = await getSessionInfoForSessionId(c, sessionId)
  if (
    sessionInfo?.success === false ||
    sessionInfo?.results === undefined ||
    sessionInfo?.results?.length === 0 ||
    sessionInfo?.results[0]?.Content === undefined ||
    sessionInfo.results[0].Content.length === 0
  ) {
    // TODO: handle session not found
    return ValidationResult.InvalidSession
  }

  const content = JSON.parse(sessionInfo.results[0].Content)
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
      if (updateResults?.success === false) {
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
    const sessionId = getCookie(c, SESSION_COOKIE) ?? ''
    if (sessionId.trim().length === 0) {
      return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
    }

    const sessionInfo = await getSessionInfoForSessionId(c, sessionId)
    if (sessionInfo?.success !== true) {
      // TODO: handle session not found
      return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
    }

    const body: SubmitCodeBody = await c.req.parseBody()
    const codeSubmitted = body.code ?? ''
    const emailSubmitted = getCookie(c, EMAIL_SUBMITTED_COOKIE) ?? ''

    if (emailSubmitted.trim().length === 0) {
      // TODO: handle email not found
      return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
    }

    if (codeSubmitted.trim().length > 0) {
      const isValid = await codeIsValid(c, emailSubmitted, codeSubmitted)
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
  })
}
