import { buildSignInCode } from './build-sign-in-code'
import { createNewSession } from './session-db-access'

export const getSessionId = async (
  context: any,
  personId: number,
  email: string,
  signUpCode?: string
) => {
  let gotSession = false
  let tries = 0
  let sessionCreateFailed = true
  let sessionId = ''
  let signInCode = ''
  while (!gotSession && tries < 10) {
    // TODO: Add exponential backoff with jitter
    gotSession = true
    tries += 1
    sessionId = crypto.randomUUID()
    try {
      signInCode = buildSignInCode()
      // PRODUCTION:REMOVE-NEXT-LINE
      if (personId === 1) {
        signInCode = '123654' // PRODUCTION:REMOVE
      } // PRODUCTION:REMOVE
      // PRODUCTION:REMOVE-NEXT-LINE
      if ((signUpCode as string).length > 0) {
        signInCode = '654321' // PRODUCTION:REMOVE
      } // PRODUCTION:REMOVE

      const sessionContent = {
        email,
        signInCode,
        signUpCode,
      }
      const results = await createNewSession(
        context,
        personId,
        sessionId,
        new Date(),
        sessionContent
      )

      sessionCreateFailed = !results.success
    } catch (err: any) {
      const isConstrainFail =
        err.toString().indexOf('UNIQUE constraint failed') !== -1
      if (isConstrainFail) {
        gotSession = false
      } else {
        console.log(
          `=======> submit-sign-in onRequest sees session insert failed with NON CONSTRAINT-FAIL error`,
          err
        )
        sessionCreateFailed = true
        break
      }
    }
  }

  return { sessionId, signInCode, sessionCreateFailed }
}
