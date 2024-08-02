import { drizzle } from 'drizzle-orm/d1'

import { getSessionId } from './get-session-id'
import { runDatabaseAction } from './run-db-action'
import { UNKNOWN_PERSON_ID } from '../constants'
import { LocalContext } from '../bindings'
import { and, eq, lt, SQL } from 'drizzle-orm'
import * as schema from './session-schema'

export type SessionInformation = {
  Id: number
  PersonId: number
  Session: string
  Timestamp: string
  SignedIn: boolean
  Content?: string
}

export type SessionQueryResults<ResultsType> = {
  success: boolean
  results: ResultsType | undefined
}

export type SessionOnly = {
  Session: string
}

export type SessionDeleteList = SessionOnly[]

const getDb = (context: LocalContext) => {
  return drizzle(context.env.HTML_SIGN_IN_DB, { schema })
}

export const getSessionInfoForSessionId = async (
  context: LocalContext,
  sessionId: string
): Promise<SessionQueryResults<SessionInformation>> => {
  const results = await getDb(context).query.HSISession.findFirst({
    where: eq(schema.HSISession.Session, sessionId),
  })

  return {
    success: results != null,
    results,
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
): Promise<number> => {
  let config: { where: SQL<any> | undefined } = {
    where: eq(schema.HSIPeople.Email, email),
  }
  if (mustBeVerified) {
    config.where = and(
      eq(schema.HSIPeople.Email, email),
      eq(schema.HSIPeople.IsVerified, true)
    )
  }
  const result = await getDb(context).query.HSIPeople.findFirst(config)

  if (result != null && result.Id > 0) {
    return result.Id
  } else {
    return UNKNOWN_PERSON_ID
  }
}

export const createNewSession = async (
  context: LocalContext,
  personId: number,
  sessionId: string,
  date: Date,
  sessionContent: object
) => {
  return getDb(context)
    .insert(schema.HSISession)
    .values({
      PersonId: personId,
      Session: sessionId,
      SignedIn: false,
      Timestamp: date.toISOString(),
      Content: JSON.stringify(sessionContent),
    })
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
) => {
  const userUpdateResults = await runDatabaseAction(
    context,
    'update HSIPeople set IsVerified = 1 where Email = ?',
    email
  )

  if (!userUpdateResults.success) {
    console.log(`rememberUserCreated failed user update`)
  }

  if (userUpdateResults?.success && userUpdateResults.meta?.changed_db) {
    const sessionUpdateResults = await runDatabaseAction(
      context,
      'update HSISession set SignedIn = 1, Content = ? where Session = ?',
      JSON.stringify({ email }),
      sessionId
    )

    if (
      sessionUpdateResults?.success &&
      sessionUpdateResults.meta?.changed_db
    ) {
      const deleteCodeResults = await runDatabaseAction(
        context,
        'delete from HSISignUpCodes where Code = ?',
        signUpCode
      )

      if (!deleteCodeResults?.success || !deleteCodeResults?.meta?.changed_db) {
        console.log(`rememberUserCreated failed to delete used sign up code`)
      }
    } else {
      console.log(`rememberUserCreated failed session update`)
    }
  }
}

export const addNewUserWithEmailAndCode = async (
  context: LocalContext,
  email: string,
  signUpCode: string
) => {
  let res = {
    success: false,
    personId: -1,
    sessionId: '',
    signInCode: '',
    signUpCode: '',
  }

  let takeCodeResults = await runDatabaseAction(
    context,
    'update HSISignUpCodes set Email = ? where Code = ? and Email = "not an email"',
    email,
    signUpCode
  )

  if (takeCodeResults?.success && takeCodeResults.meta?.changed_db) {
    let addUserResults = await runDatabaseAction(
      context,
      'insert into HSIPeople (Email, IsVerified, AddedTimestamp) values (?, 0, ?) returning Id',
      email,
      new Date().toISOString()
    )

    if (
      addUserResults?.success &&
      addUserResults.meta?.changed_db &&
      addUserResults?.results[0]?.Id > 0
    ) {
      const personId = addUserResults.results[0].Id
      const { sessionId, signInCode, sessionCreateFailed } = await getSessionId(
        context,
        personId,
        email,
        signUpCode
      )

      if (!sessionCreateFailed) {
        res = {
          success: true,
          personId,
          sessionId,
          signInCode,
          signUpCode,
        }
      }
    }
  }

  return res
}
