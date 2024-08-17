import { HonoApp, LocalContext } from '../bindings'
import {
  AWAIT_CODE_PATH,
  BODY_LIMIT_OPTIONS,
  RESEND_CODE_PATH,
  SIGN_IN_PATH,
} from '../constants'
import { bodyLimit } from 'hono/body-limit'
import { withSession } from './with-session'
import { redirectWithErrorMessage, redirectWithNoMessage } from '../redirects'

export const setupResendCodePath = (app: HonoApp) => {
  app.post(
    RESEND_CODE_PATH,
    bodyLimit(BODY_LIMIT_OPTIONS),
    async (c: LocalContext) => {
      return await withSession(
        c,
        async (sessionIsValid, sessionId, sessionInfo) => {
          if (!sessionIsValid || sessionInfo == null || sessionId == null) {
            return redirectWithNoMessage(c, SIGN_IN_PATH)
          }

          return redirectWithErrorMessage(
            c,
            'Please wait at least 30 seconds for the email to be delivered. Also, check your spam folder for the code.',
            AWAIT_CODE_PATH
          )
        }
      )
    }
  )
}
