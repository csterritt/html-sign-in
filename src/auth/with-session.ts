import { getCookie } from 'hono/cookie'

import { LocalContext } from '../bindings'
import { SESSION_COOKIE } from '../constants'
import {
  getSessionInfoForSessionId,
  SessionInformation,
} from '../db/session-db-access'

export const withSession = async (
  c: LocalContext,
  next: (
    sessionIsValid: boolean,
    sessionId?: string,
    sessionInfo?: SessionInformation
  ) => Promise<Response>
) => {
  const sessionId = getCookie(c, SESSION_COOKIE) ?? ''
  if (sessionId.trim().length === 0) {
    return next(false)
  }

  const sessionInfo = await getSessionInfoForSessionId(c, sessionId)
  if (
    sessionInfo?.success === false ||
    sessionInfo?.results === undefined ||
    sessionInfo?.results?.Content === undefined ||
    sessionInfo?.results?.Content?.trim()?.length === 0
  ) {
    return next(false)
  }

  return next(true, sessionId, sessionInfo.results)
}
