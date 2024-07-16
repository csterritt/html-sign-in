import { deleteCookie } from 'hono/cookie'
import { StatusCodes } from 'http-status-codes'

import { HonoApp, LocalContext } from '../bindings'
import {
  CANCEL_SIGN_IN_PATH,
  EMAIL_SUBMITTED_COOKIE,
  ERROR_MESSAGE_COOKIE,
  ROOT_PATH,
} from '../constants'

export const setupCancelSignInPath = (app: HonoApp) => {
  app.all(CANCEL_SIGN_IN_PATH, async (c: LocalContext) => {
    deleteCookie(c, EMAIL_SUBMITTED_COOKIE)
    deleteCookie(c, ERROR_MESSAGE_COOKIE)
    return c.redirect(ROOT_PATH, StatusCodes.SEE_OTHER)
  })
}
