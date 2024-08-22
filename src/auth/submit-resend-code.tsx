import { HonoApp, LocalContext } from '../bindings' // UNREVIEWED
import {
  AWAIT_CODE_PATH,
  RESEND_CODE_PATH,
  RESEND_CODE_TIMEOUT,
  SIGN_IN_PATH,
} from '../constants'
import {
  redirectWithErrorMessage,
  redirectWithNoMessage,
  redirectWithNotificationMessage,
} from '../redirects'
// import { buildSignInCode } from '../db/build-sign-in-code' // PRODUCTION:UNCOMMENT
import { updateSessionContent } from '../db/session-db-access'

export const setupResendCodePath = (app: HonoApp) => {
  app.post(RESEND_CODE_PATH, async (c: LocalContext) => {
    const sessionInfo = c.get('Session')
    if (sessionInfo.isNothing || sessionInfo.value.SessionId == null) {
      return redirectWithNoMessage(c, SIGN_IN_PATH)
    }

    const lastSend = new Date(sessionInfo.value.Timestamp)
    const now = new Date()
    if (now.getTime() - lastSend.getTime() < RESEND_CODE_TIMEOUT) {
      return redirectWithErrorMessage(
        c,
        'Please wait at least 30 seconds for the email to be delivered. Also, check your spam folder for the code.',
        AWAIT_CODE_PATH
      )
    }

    // const signInCode = buildSignInCode() // PRODUCTION:UNCOMMENT
    const signInCode = '654321' // PRODUCTION:REMOVE
    const content = sessionInfo.value.Content
    // TODO: Check results const results =
    await updateSessionContent(
      c,
      now,
      { ...content, signInCode },
      sessionInfo.value.SessionId
    )

    return redirectWithNotificationMessage(
      c,
      'Code sent, please also check your spam folder for the code.',
      AWAIT_CODE_PATH
    )
  })
}
