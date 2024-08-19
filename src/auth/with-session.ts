import { getCookie } from 'hono/cookie'
import Maybe, { nothing } from 'true-myth/maybe'

import { LocalContext } from '../bindings'
import { SESSION_COOKIE } from '../constants'
import {
  getSessionInfoForSessionId,
  SessionInformation,
} from '../db/session-db-access'

export const withSession = async (
  c: LocalContext,
  next: (sessionInfo: Maybe<SessionInformation>) => Promise<Response>
) => {
  const sessionId = getCookie(c, SESSION_COOKIE) ?? ''
  if (sessionId.trim().length === 0) {
    return next(nothing<SessionInformation>())
  }

  const sessionInfo = await getSessionInfoForSessionId(c, sessionId)
  return next(sessionInfo)
}
