import { deleteCookie, setCookie } from 'hono/cookie'

import {
  AWAIT_CODE_PATH,
  EMAIL_SUBMITTED_COOKIE,
  ERROR_MESSAGE_COOKIE,
  SIGN_IN_PATH,
  SUBMIT_EMAIL_PATH,
  UNKNOWN_PERSON_ID,
} from '../constants'
import { HonoApp, LocalContext } from '../bindings'
import { findPersonByEmail } from '../db/session-db-access'
import { forwardTo } from '../forward-to'

type SubmitEmailBody = {
  email?: string
}

export const setupSubmitEmailPath = (app: HonoApp) => {
  app.post(SUBMIT_EMAIL_PATH, async (c: LocalContext) => {
    const body: SubmitEmailBody = await c.req.parseBody()
    const email = body.email ?? ''

    if (email.trim().length > 0) {
      setCookie(c, EMAIL_SUBMITTED_COOKIE, email, {
        path: '/',
        sameSite: 'Strict',
      })
      const personId = await findPersonByEmail(c, email, true)
      if (personId === UNKNOWN_PERSON_ID) {
        setCookie(c, ERROR_MESSAGE_COOKIE, `Unknown email address: ${email}`, {
          path: '/',
          sameSite: 'Strict',
        })
        return forwardTo(c, SIGN_IN_PATH)
      }

      deleteCookie(c, ERROR_MESSAGE_COOKIE)
      return forwardTo(c, AWAIT_CODE_PATH)
    }

    setCookie(c, ERROR_MESSAGE_COOKIE, 'You must supply an email address', {
      path: '/',
      sameSite: 'Strict',
    })
    return forwardTo(c, SIGN_IN_PATH)
  })
}
