import { getCookie } from 'hono/cookie'

import { HonoApp, LocalContext } from '../bindings'
import {
  AWAIT_CODE_PATH,
  EMAIL_SUBMITTED_COOKIE,
  ERROR_MESSAGE_COOKIE,
} from '../constants'
import { buildAwaitCodePage } from '../page-builders/build-await-code-page'

export const setupAwaitCodePath = (app: HonoApp) => {
  app.get(AWAIT_CODE_PATH, async (c: LocalContext) => {
    const emailSubmitted = getCookie(c, EMAIL_SUBMITTED_COOKIE) ?? ''
    const errorMessage = getCookie(c, ERROR_MESSAGE_COOKIE) ?? ''
    return buildAwaitCodePage(emailSubmitted, { error: errorMessage })(c)
  })
}
