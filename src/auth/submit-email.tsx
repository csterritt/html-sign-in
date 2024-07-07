import { Hono } from 'hono'

import { AWAIT_CODE_PATH, SUBMIT_EMAIL_PATH } from '../constants'
import { Bindings, ForwardOptions } from '../bindings'
import { isExistingEmail } from '../db-access'
import { buildSignInPage } from '../page-builders/buildSignInPage'

type SubmitEmailBody = {
  email?: string
}

export const setupSubmitEmailPath = (app: Hono<{ Bindings: Bindings }>) => {
  app.post(SUBMIT_EMAIL_PATH, async (c) => {
    // const contentType = c.req.header('content-type')
    const body: SubmitEmailBody = await c.req.parseBody()

    if (body.email !== undefined && body.email.trim().length > 0) {
      if (isExistingEmail(body.email)) {
        return new Response()
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
