import Maybe, { just, nothing } from 'true-myth/maybe'
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
  let tries = 0
  let sessionCreateSuccess = false
  let sessionId = ''
  let signInCode = ''
  let timeToSleep = 10
  while (tries < 5) {
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
    const createSessionResults = await createNewSession(
      context,
      personId,
      sessionId,
      new Date(),
      sessionContent
    )

    if (createSessionResults.isErr) {
      const isConstrainFail =
        createSessionResults.error
          .toString()
          .indexOf('UNIQUE constraint failed') !== -1
      if (!isConstrainFail) {
        console.log(
          `getSessionId sees session insert failed with NON CONSTRAINT-FAIL error`,
          createSessionResults.error.toString()
        )
      }
    } else {
      sessionCreateSuccess = true
      break
    }

    await sleepWithJitter(timeToSleep)
    timeToSleep *= 2
  }

  if (sessionCreateSuccess) {
    return just({ sessionId, signInCode })
  } else {
    return nothing<SessionIdResults>()
  }
}
