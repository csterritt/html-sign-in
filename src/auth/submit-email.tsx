import { setCookie } from 'hono/cookie'

import {
  EMAIL_SUBMITTED_COOKIE,
  SUBMIT_EMAIL_PATH,
  UNKNOWN_PERSON_ID,
} from '../constants'
import { HonoApp, LocalContext } from '../bindings'
import { buildSignInPage } from '../page-builders/buildSignInPage'
import { buildAwaitCodePage } from '../page-builders/buildAwaitCodePage'
import { findPersonByEmail } from '../db/session-db-access'

type SubmitEmailBody = {
  email?: string
}

export const setupSubmitEmailPath = (app: HonoApp) => {
  app.post(SUBMIT_EMAIL_PATH, async (c: LocalContext) => {
    // const contentType = c.req.header('content-type')
    const body: SubmitEmailBody = await c.req.parseBody()
    const email = body.email ?? ''

    if (email.trim().length > 0) {
      setCookie(c, EMAIL_SUBMITTED_COOKIE, email, {
        path: '/',
        sameSite: 'Strict',
      })
      const personId = await findPersonByEmail(c, email, true)
      if (personId === UNKNOWN_PERSON_ID) {
        return buildSignInPage(email, {
          error: `Unknown email address: ${email}`,
        })(c)
      }

      return buildAwaitCodePage(email)(c)
    }

    return buildSignInPage('', {
      error: `You must supply an email address`,
    })(c)
  })
}
