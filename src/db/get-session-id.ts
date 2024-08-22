import Maybe, { just, nothing } from 'true-myth/maybe' // UNREVIEWED
import { buildSignInCode } from './build-sign-in-code'
import { createNewSession } from './session-db-access'
import { sleepWithJitter } from '../support/sleep'

type SessionIdResults = {
  sessionId: string
  signInCode: string
}

export const getSessionId = async (
  context: any,
  personId: number,
  email: string,
  signUpCode?: string
): Promise<Maybe<SessionIdResults>> => {
  let gotSession = false
  let tries = 0
  let sessionCreateFailed = true
  let sessionId = ''
  let signInCode = ''
  let timeToSleep = 10
  while (!gotSession && tries < 5) {
    gotSession = true
    tries += 1
    sessionId = crypto.randomUUID()
    signInCode = buildSignInCode()
    // PRODUCTION:REMOVE-NEXT-LINE
    if (personId === 1) {
      signInCode = '123654' // PRODUCTION:REMOVE
    } // PRODUCTION:REMOVE
    // PRODUCTION:REMOVE-NEXT-LINE
    if ((signUpCode ?? '').length > 0) {
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

    if (results.isErr) {
      sessionCreateFailed = true
      const isConstrainFail =
        results.error.toString().indexOf('UNIQUE constraint failed') !== -1
      if (isConstrainFail) {
        gotSession = false
      } else {
        console.log(
          `=======> submit-sign-in onRequest sees session insert failed with NON CONSTRAINT-FAIL error`,
          results.error.toString()
        )
        sessionCreateFailed = true
        break
      }
    } else {
      gotSession = true
      sessionCreateFailed = false
      break
    }

    await sleepWithJitter(timeToSleep)
    timeToSleep *= 2
  }

  if (sessionCreateFailed) {
    return nothing<SessionIdResults>()
  } else {
    return just({ sessionId, signInCode })
  }
}
