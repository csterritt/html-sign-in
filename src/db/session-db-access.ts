import { getSessionId } from './get-session-id'
import { runDatabaseAction } from './run-db-action'

export type SessionInformation = {
  Id: number
  PersonId: number
  Session: string
  Timestamp: string
  SignedIn: number
  Content?: string
}

export type SessionInformationList = SessionInformation[]

export type SessionQueryResults<ResultsType> = {
  success: boolean
  meta: {
    served_by: string
    duration: number
    changes: number
    last_row_id: number
    changed_db: boolean
    size_after: number
  }
  results: ResultsType
}

export type SessionOnly = {
  Session: string
}

export type SessionDeleteList = SessionOnly[]

export const getSessionInfoForSessionId = async (
  context: any,
  sessionId: string
): Promise<SessionQueryResults<SessionInformationList>> => {
  return runDatabaseAction(
    context,
    'select * from HSISession where Session = ?',
    sessionId
  )
}

export const updateSessionContent = async (
  context: any,
  date: Date | null,
  content: object,
  sessionId: string
) => {
  if (date == null) {
    return runDatabaseAction(
      context,
      'update HSISession set Content = ? where Session = ?',
      JSON.stringify(content),
      sessionId
    )
  }

  return runDatabaseAction(
    context,
    'update HSISession set Timestamp = ?, Content = ? where Session = ?',
    date.toISOString(),
    JSON.stringify(content),
    sessionId
  )
}

export const findPersonByEmail = async (
  context: any,
  email: string,
  mustBeVerified: boolean
) => {
  let statement = 'select Id from HSIPeople where Email = ?'
  if (mustBeVerified) {
    statement += ' and IsVerified = 1'
  }

  const queryResults = await runDatabaseAction(context, statement, email)

  return queryResults?.results
}

export const createNewSession = async (
  context: any,
  personId: number,
  sessionId: string,
  date: Date,
  sessionContent: object
) => {
  return runDatabaseAction(
    context,
    'insert into HSISession (PersonId, Session, SignedIn, Timestamp, Content) values (?, ?, FALSE, ?, ?)',
    personId,
    sessionId,
    date.toISOString(),
    JSON.stringify(sessionContent)
  )
}

export const removeSessionFromDb = async (context: any, sessionId: string) => {
  return runDatabaseAction(
    context,
    'delete from HSISession where Session = ?',
    sessionId
  )
}

export const removeOldUserSessionsFromDb = async (
  context: any,
  userInfo: SessionInformation,
  tooOld: Date
): Promise<SessionQueryResults<SessionDeleteList>> => {
  const sqlStatement = `delete from HSISession where Session = ? and SignedIn = 0 and Timestamp < ? returning Session` // PRODUCTION:REMOVE
  // const sqlStatement = `delete from HSISession where PersonId = ? and SignedIn = 0 and Timestamp < ? returning Session` // PRODUCTION:UNCOMMENT
  const args = [userInfo.Session, tooOld.toISOString()] // PRODUCTION:REMOVE
  // const args = [userInfo.PersonId, tooOld.toISOString()] // PRODUCTION:UNCOMMENT
  return runDatabaseAction(context, sqlStatement, ...args)
}

export const rememberUserSignedIn = async (
  context: any,
  sessionContent: object,
  sessionId: string
) => {
  return runDatabaseAction(
    context,
    'update HSISession set Content = ?, SignedIn = TRUE where Session = ?',
    JSON.stringify(sessionContent),
    sessionId
  )
}

export const rememberUserCreated = async (
  context: any,
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
  context: any,
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
