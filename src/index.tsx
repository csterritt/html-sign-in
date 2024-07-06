import { Hono } from 'hono'
import { LinearRouter } from 'hono/router/linear-router'

import { Bindings } from './bindings'
import { renderer } from './renderer'
import { setupRootPath } from './root'
import { setupSignInPaths } from './auth-paths'

const app: Hono<{ Bindings: Bindings }> = new Hono<{ Bindings: Bindings }>({
  router: new LinearRouter(),
})

app.use(renderer)
setupRootPath(app)
setupSignInPaths(app)

export default app
