import { Hono } from 'hono'
import { LinearRouter } from 'hono/router/linear-router'
import { createMiddleware } from 'hono/factory'
import { getCookie } from 'hono/cookie'
import Maybe, { nothing } from 'true-myth/maybe'

import { Bindings } from './bindings'
import { renderer } from './renderer'
import { setup404Path } from './404'
import { setupProtectedPath } from './protected'
import { setupRootPath } from './root'
import { setupSignInPaths } from './auth-paths'
import {
  SessionInformation,
  getSessionInfoForSessionId,
} from './db/session-db-access'
import { SESSION_COOKIE } from './constants'

declare module 'hono' {
  interface ContextVariableMap {
    Session: Maybe<SessionInformation>
  }
}

const GetSession = createMiddleware(async (c, next) => {
  const sessionId = getCookie(c, SESSION_COOKIE) ?? ''
  let sessionInfo: Maybe<SessionInformation> = nothing()
  if (sessionId.trim().length > 0) {
    sessionInfo = await getSessionInfoForSessionId(c, sessionId)
  }

  c.set('Session', sessionInfo)
  await next()
})

const app: Hono<{ Bindings: Bindings }> = new Hono<{ Bindings: Bindings }>({
  router: new LinearRouter(),
})

app.use(renderer)
app.use(GetSession)
setupRootPath(app)
setupProtectedPath(app)
setupSignInPaths(app)

// this path MUST be the last one set up
setup404Path(app)

export default app
