import { Hono } from 'hono'
import { LinearRouter } from 'hono/router/linear-router'
import { bodyLimit } from 'hono/body-limit'
import { StatusCodes } from 'http-status-codes'
import Maybe from 'true-myth/maybe'

import { Bindings } from './bindings'
import { ProvideSession } from './middleware/provide-session'
import { SessionInformation } from './db/session-db-access'
import { renderer } from './renderer'
import { setup404Path } from './404'
import { setupProtectedPath } from './protected'
import { setupRootPath } from './root'
import { setupSignInPaths } from './auth-paths'
import { logger, setupLogging } from './middleware/logger'

declare module 'hono' {
  interface ContextVariableMap {
    Session: Maybe<SessionInformation>
  }
}

await setupLogging()

const app: Hono<{ Bindings: Bindings }> = new Hono<{ Bindings: Bindings }>({
  router: new LinearRouter(),
})

app.use(logger())
app.use(renderer)
app.use(
  bodyLimit({
    maxSize: 4 * 1024, // 4kb
    onError: (c: any) => {
      console.log(`body too large, max size is 4kb`)
      return c.text('overflow', StatusCodes.REQUEST_TOO_LONG)
    },
  })
)
app.use(ProvideSession)
setupRootPath(app)
setupProtectedPath(app)
setupSignInPaths(app)

// this path MUST be the last one set up
setup404Path(app)

export default app
