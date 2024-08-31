import { drizzle } from 'drizzle-orm/d1' // UNREVIEWED
import { and, eq, lt, SQL } from 'drizzle-orm'
import Maybe, { just, nothing } from 'true-myth/maybe'
import Result, { err, ok } from 'true-myth/result'

import { getSessionId } from './get-session-id'
import {
  ADD_NEW_USER_ADD_USER_FAILED,
  ADD_NEW_USER_GET_SESSION_FAILED,
  ADD_NEW_USER_SUCCESS,
  ADD_NEW_USER_TAKE_CODE_FAILED,
  NO_SUCH_PERSON_ID,
} from '../constants'
import { LocalContext } from '../bindings'
import * as schema from './session-schema'
import { sleepWithJitter } from '../support/sleep'
import { logTapeLogger } from '../middleware/logger'

export type UserInformation = {
  Id: number
  Email: string
  IsVerified: boolean
  AddedTimestamp: string
}

export type ContentInformation = {
  email: string
  signInCode?: string
  signUpCode?: string
  count?: number
}

export type SessionInformation = {
  Id: number
  PersonId: number
  Session: string
  SessionId: string
  Timestamp: string
  SignedIn: boolean
  Content: ContentInformation
}

export type SessionOnly = {
  Session: string
}

export type NewUserCreateResults = {
  personId: number
  sessionId: string
  signInCode: string
  signUpCode: string
}

export type SessionDeleteList = SessionOnly[]

const getDb = (context: LocalContext) => {
  return drizzle(context.env.HTML_SIGN_IN_DB, { schema })
}

export const getSessionInfoForSessionId = async (
  context: LocalContext,
  sessionId: string
): Promise<Maybe<SessionInformation>> => {
  let sessionQueryResults
  let tries = 0
  let timeToSleep = 10
  while (tries < 5) {
    try {
      sessionQueryResults = await getDb(context).query.HSISession.findFirst({
        where: eq(schema.HSISession.Session, sessionId),
      })

      if (sessionQueryResults != null && sessionQueryResults.Id > 0) {
        break
      }
    } catch (error) {
      console.log(`getSessionInfoForSessionId got error ${error}`)
    }

    await sleepWithJitter(timeToSleep)
    timeToSleep *= 2
    tries += 1
  }

  if (
    sessionQueryResults == null ||
    sessionQueryResults.Content == null ||
    typeof sessionQueryResults.Content !== 'string' ||
    sessionQueryResults.Content.trim().length === 0
  ) {
    return nothing<SessionInformation>()
  } else {
    let content: Maybe<ContentInformation> = nothing<ContentInformation>()
    try {
      content = just(JSON.parse(sessionQueryResults.Content))
    } catch {
      console.log(`Unable to parse content: ${sessionQueryResults.Content}`)
    }

    if (content.isNothing) {
      return nothing<SessionInformation>()
    }

    return just({
      Id: sessionQueryResults.Id,
      PersonId: sessionQueryResults.PersonId,
      Session: sessionQueryResults.Session,
      SessionId: sessionId,
      Timestamp: sessionQueryResults.Timestamp,
      SignedIn: sessionQueryResults.SignedIn,
      Content: content.value,
    })
  }
}

export const updateSessionContent = async (
  context: LocalContext,
  date: Date | null,
  content: object,
  sessionId: string
) => {
  const setContent: { Content: string; Timestamp?: string } = {
    Content: JSON.stringify(content),
  }
  if (date != null) {
    setContent.Timestamp = date.toISOString()
  }

  return getDb(context)
    .update(schema.HSISession)
    .set(setContent)
    .where(eq(schema.HSISession.Session, sessionId))
}

export const findPersonByEmail = async (
  context: LocalContext,
  email: string,
  mustBeVerified: boolean
): Promise<Result<number, string>> => {
  let config: { where: SQL<any> | undefined } = {
    where: eq(schema.HSIPeople.Email, email),
  }
  if (mustBeVerified) {
    config.where = and(
      eq(schema.HSIPeople.Email, email),
      eq(schema.HSIPeople.IsVerified, true)
    )
  }

  let result
  try {
    result = await getDb(context).query.HSIPeople.findFirst(config)
  } catch (error: any) {
    const msg = `findPersonByEmail findFirst got error ${error.toString()}`
    logTapeLogger.error(msg)
    return err(msg)
  }

  if (result != null && result.Id > 0) {
    return ok(result.Id)
  } else {
    return ok(NO_SUCH_PERSON_ID)
  }
}

export const findCompletePersonByEmail = async (
  context: LocalContext,
  email: string
): Promise<Maybe<UserInformation>> => {
  let result
  try {
    result = await getDb(context).query.HSIPeople.findFirst({
      where: eq(schema.HSIPeople.Email, email),
    })
  } catch (error: any) {
    const msg = `findCompletePersonByEmail findFirst got error ${error.toString()}`
    logTapeLogger.error(msg)
    return nothing<UserInformation>()
  }

  if (result != null && result.Id > 0) {
    return just(result)
  } else {
    return nothing<UserInformation>()
  }
}

export const createNewSession = async (
  context: LocalContext,
  personId: number,
  sessionId: string,
  date: Date,
  sessionContent: object
): Promise<Result<string, string>> => {
  let result: Result<string, string>
  try {
    const dbResults = await getDb(context)
      .insert(schema.HSISession)
      .values({
        PersonId: personId,
        Session: sessionId,
        SignedIn: false,
        Timestamp: date.toISOString(),
        Content: JSON.stringify(sessionContent),
      })

    if (dbResults.success && dbResults.meta.changed_db) {
      result = ok('success')
    } else {
      console.log('unable to insert new session')
      result = err('unable to insert new session')
    }
  } catch (error: any) {
    console.log(`createNewSession caught db error ${error}`)
    result = err(error.toString())
  }

  return result
}

export const removeSessionFromDb = async (
  context: LocalContext,
  sessionId: string
) => {
  return getDb(context)
    .delete(schema.HSISession)
    .where(eq(schema.HSISession.Session, sessionId))
}

export const removeOldUserSessionsFromDb = async (
  context: LocalContext,
  userInfo: SessionInformation,
  tooOld: Date
): Promise<SessionDeleteList> => {
  return getDb(context)
    .delete(schema.HSISession)
    .where(
      and(
        eq(schema.HSISession.Session, userInfo.Session), // PRODUCTION:REMOVE
        //   eq(schema.HSISession.PersonId, userInfo.PersonId), // PRODUCTION:UNCOMMENT
        eq(schema.HSISession.SignedIn, false),
        lt(schema.HSISession.Timestamp, tooOld.toISOString())
      )
    )
    .returning()
}

export const rememberUserSignedIn = async (
  context: LocalContext,
  sessionContent: object,
  sessionId: string
) => {
  return getDb(context)
    .update(schema.HSISession)
    .set({
      Content: JSON.stringify(sessionContent),
      SignedIn: true,
    })
    .where(eq(schema.HSISession.Session, sessionId))
}

export const rememberUserCreated = async (
  context: LocalContext,
  sessionId: string,
  email: string,
  signUpCode: string
): Promise<boolean> => {
  const userUpdateResults = await getDb(context)
    .update(schema.HSIPeople)
    .set({
      IsVerified: true,
    })
    .where(eq(schema.HSIPeople.Email, email))

  if (
    userUpdateResults == null ||
    !userUpdateResults.success ||
    !userUpdateResults.meta?.changed_db
  ) {
    console.log(`rememberUserCreated failed user update`)
    return false
  }

  const sessionUpdateResults = await getDb(context)
    .update(schema.HSISession)
    .set({
      SignedIn: true,
      Content: JSON.stringify({ email }),
    })
    .where(eq(schema.HSISession.Session, sessionId))

  if (sessionUpdateResults?.success && sessionUpdateResults.meta?.changed_db) {
    const deleteCodeResults = await getDb(context)
      .delete(schema.HSISignUpCodes)
      .where(eq(schema.HSISignUpCodes.Code, signUpCode))

    if (!deleteCodeResults?.success || !deleteCodeResults?.meta?.changed_db) {
      console.log(`rememberUserCreated failed to delete used sign up code`)
    }
  } else {
    console.log(`rememberUserCreated failed session update`)
    return false
  }

  return true
}

export const addNewUserWithEmailAndCode = async (
  context: LocalContext,
  email: string,
  signUpCode: string
): Promise<Result<NewUserCreateResults, number>> => {
  let success = false
  let errorCode: number
  let res: NewUserCreateResults = {
    personId: NO_SUCH_PERSON_ID,
    sessionId: '',
    signInCode: '',
    signUpCode: '',
  }

  let takeCodeResults
  try {
    takeCodeResults = await getDb(context)
      .update(schema.HSISignUpCodes)
      .set({
        Email: email,
      })
      .where(
        and(
          eq(schema.HSISignUpCodes.Code, signUpCode),
          eq(schema.HSISignUpCodes.Email, 'not an email')
        )
      )
  } catch (error: any) {
    const msg = `addNewUserWithEmailAndCode update got error ${error.toString()}`
    logTapeLogger.error(msg)
    return err(ADD_NEW_USER_TAKE_CODE_FAILED)
  }

  if (takeCodeResults?.success && takeCodeResults.meta?.changed_db) {
    let addUserResults
    try {
      addUserResults = await getDb(context)
        .insert(schema.HSIPeople)
        .values({
          Email: email,
          IsVerified: false,
          AddedTimestamp: new Date().toISOString(),
        })
        .returning({ Id: schema.HSIPeople.Id })
    } catch (error: any) {
      const msg = `addNewUserWithEmailAndCode insert of new user got error ${error.toString()}`
      logTapeLogger.error(msg)
      return err(ADD_NEW_USER_ADD_USER_FAILED)
    }

    if (addUserResults != null && addUserResults[0].Id > 0) {
      const personId = addUserResults[0].Id
      const sessionIdResults = await getSessionId(
        context,
        personId,
        email,
        signUpCode
      )

      if (sessionIdResults.isNothing) {
        errorCode = ADD_NEW_USER_GET_SESSION_FAILED
      } else {
        success = true
        errorCode = ADD_NEW_USER_SUCCESS
        res = {
          personId,
          sessionId: sessionIdResults.value.sessionId,
          signInCode: sessionIdResults.value.signInCode,
          signUpCode,
        }
      }
    } else {
      errorCode = ADD_NEW_USER_ADD_USER_FAILED
    }
  } else {
    errorCode = ADD_NEW_USER_TAKE_CODE_FAILED
  }

  if (success) {
    return ok(res)
  } else {
    return err(errorCode)
  }
}
