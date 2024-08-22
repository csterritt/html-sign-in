import { createMiddleware } from 'hono/factory' // UNREVIEWED
import { getCookie } from 'hono/cookie'
import { SESSION_COOKIE } from '../constants'
import Maybe, { nothing } from 'true-myth/maybe'
import {
  getSessionInfoForSessionId,
  SessionInformation,
} from '../db/session-db-access'
import { LocalContext } from '../bindings'

export const ProvideSession = createMiddleware(
  async (c: LocalContext, next) => {
    const sessionId = getCookie(c, SESSION_COOKIE) ?? ''
    let sessionInfo: Maybe<SessionInformation> = nothing()
    if (sessionId.trim().length > 0) {
      sessionInfo = await getSessionInfoForSessionId(c, sessionId)
    }

    c.set('Session', sessionInfo)
    await next()
  }
)
