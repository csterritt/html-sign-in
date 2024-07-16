import { deleteCookie, getCookie } from 'hono/cookie'

import { EMAIL_SUBMITTED_COOKIE, SUBMIT_CODE_PATH } from '../constants'
import { HonoApp, LocalContext } from '../bindings'
import { buildAwaitCodePage } from '../page-builders/build-await-code-page'
import { findPersonByEmail } from '../db/session-db-access'
import { buildSignInSuccessPage } from '../page-builders/build-sign-in-success-page'

type SubmitCodeBody = {
  code?: string
}

const codeIsValid = (personId: number, code: string) => {
}

export const setupSubmitCodePath = (app: HonoApp) => {
  app.post(SUBMIT_CODE_PATH, async (c: LocalContext) => {
    const body: SubmitCodeBody = await c.req.parseBody()
    const code = body.code ?? ''
    const emailSubmitted = getCookie(c, EMAIL_SUBMITTED_COOKIE) ?? ''

    if (code.trim().length > 0) {
      const personId = await findPersonByEmail(c, emailSubmitted, true)
      if (!codeIsValid(personId, code)) {
        return buildAwaitCodePage(emailSubmitted, {
          error: 'That is the wrong code, or it has expired. Please try again.',
        })(c)
      }

      deleteCookie(c, EMAIL_SUBMITTED_COOKIE)
      return buildSignInSuccessPage()(c)
    }

    return buildAwaitCodePage(emailSubmitted, {
      error:
        "You must supply the code sent to your email address. Check your spam filter, and after a few minutes, if it hasn't arrived, click the 'Resend' button below to try again.",
    })(c)
  })
}
