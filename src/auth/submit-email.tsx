import { SUBMIT_EMAIL_PATH, UNKNOWN_PERSON_ID } from '../constants'
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

    if (body.email !== undefined && body.email.trim().length > 0) {
      const personId = await findPersonByEmail(c, body.email, true)
      if (personId === UNKNOWN_PERSON_ID) {
        return buildSignInPage({
          error: `Unknown email address: ${body.email}`,
        })(c)
      }

      return buildAwaitCodePage(body.email)(c)
    }

    return buildSignInPage({
      error: `You must supply an email address`,
    })(c)
  })
}
