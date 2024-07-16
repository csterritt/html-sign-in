import { deleteCookie, getCookie } from 'hono/cookie'
import { StatusCodes } from 'http-status-codes'

import {
  EMAIL_SUBMITTED_COOKIE,
  SESSION_COOKIE,
  SIGN_IN_PATH,
  STANDARD_COOKIE_OPTIONS,
  SUBMIT_CODE_PATH,
} from '../constants'
import { HonoApp, LocalContext } from '../bindings'
import { buildAwaitCodePage } from '../page-builders/build-await-code-page'
import {
  findPersonByEmail,
  getSessionInfoForSessionId,
} from '../db/session-db-access'
import { buildSignInSuccessPage } from '../page-builders/build-sign-in-success-page'

type SubmitCodeBody = {
  code?: string
}

const codeIsValid = (personId: number, code: string) => {
  return personId === 1 && code === '123654' // PRODUCTION:REMOVE
}

export const setupSubmitCodePath = (app: HonoApp) => {
  app.post(SUBMIT_CODE_PATH, async (c: LocalContext) => {
    const sessionId = getCookie(c, SESSION_COOKIE) ?? ''
    if (sessionId.trim().length === 0) {
      return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
    }

    const sessionInfo = await getSessionInfoForSessionId(c, sessionId)
    if (sessionInfo?.success === false) {
      // TODO: handle session not found
      return c.redirect(SIGN_IN_PATH, StatusCodes.SEE_OTHER)
    }

    const body: SubmitCodeBody = await c.req.parseBody()
    const codeSubmitted = body.code ?? ''
    const emailSubmitted = getCookie(c, EMAIL_SUBMITTED_COOKIE) ?? ''

    if (codeSubmitted.trim().length > 0) {
      const personId = await findPersonByEmail(c, emailSubmitted, true)
      if (!codeIsValid(personId, codeSubmitted)) {
        return buildAwaitCodePage(emailSubmitted, {
          error: 'That is the wrong code, or it has expired. Please try again.',
        })(c)
      }

      deleteCookie(c, EMAIL_SUBMITTED_COOKIE, STANDARD_COOKIE_OPTIONS)
      return buildSignInSuccessPage()(c)
    }

    return buildAwaitCodePage(emailSubmitted, {
      error:
        "You must supply the code sent to your email address. Check your spam filter, and after a few minutes, if it hasn't arrived, click the 'Resend' button below to try again.",
    })(c)
  })
}
