import { Hono } from 'hono'
import { LinearRouter } from 'hono/router/linear-router'
import Maybe from 'true-myth/maybe'

import { Bindings } from './bindings'
import { renderer } from './renderer'
import { setup404Path } from './404'
import { setupProtectedPath } from './protected'
import { setupRootPath } from './root'
import { setupSignInPaths } from './auth-paths'
import { SessionInformation } from './db/session-db-access'
import { GetSession } from './middleware/get-session'

declare module 'hono' {
  interface ContextVariableMap {
    Session: Maybe<SessionInformation>
  }
}

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
