import { Hono } from 'hono'

import { SUBMIT_EMAIL_PATH } from '../constants'
import { Bindings } from '../bindings'
import { buildSignInPage } from '../page-builders/buildSignInPage'
import { buildAwaitCodePage } from '../page-builders/buildAwaitCodePage'
import { findPersonByEmail } from '../db/session-db-access'

type SubmitEmailBody = {
  email?: string
}

export const setupSubmitEmailPath = (app: Hono<{ Bindings: Bindings }>) => {
  app.post(SUBMIT_EMAIL_PATH, async (c) => {
    // const contentType = c.req.header('content-type')
    const body: SubmitEmailBody = await c.req.parseBody()

    if (body.email !== undefined && body.email.trim().length > 0) {
      const person = await findPersonByEmail(c, body.email, true)
      if (person != null && person.length > 0 && person[0]?.Id > 0) {
        return buildAwaitCodePage(body.email)(c)
      }

      return buildSignInPage({
        error: `Unknown email address: ${body.email}`,
      })(c)
    }

    return buildSignInPage({
      error: `You must supply an email address`,
    })(c)
  })
}
