import { getCookie } from 'hono/cookie' // UNREVIEWED

import { HonoApp, LocalContext } from './bindings'
import {
  ERROR_MESSAGE_COOKIE,
  NOTIFICATION_MESSAGE_COOKIE,
  PROTECTED_PATH,
} from './constants'
import { buildProtectedPage } from './page-builders/build-protected-page'
import { RequireSignIn } from './middleware/require-sign-in'

export const setupProtectedPath = (app: HonoApp) => {
  app.get(PROTECTED_PATH, RequireSignIn, async (c: LocalContext) => {
    const errorMessage = getCookie(c, ERROR_MESSAGE_COOKIE) ?? ''
    const notificationMessage = getCookie(c, NOTIFICATION_MESSAGE_COOKIE) ?? ''
    return buildProtectedPage({
      error: errorMessage,
      message: notificationMessage,
    })(c)
  })
}
