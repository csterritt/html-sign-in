import { Hono } from 'hono'
import { LinearRouter } from 'hono/router/linear-router'

import { Bindings } from './bindings'
import { renderer } from './renderer'
import { setupSignInPaths } from './sign-in'

const app: Hono<{ Bindings: Bindings }> = new Hono<{ Bindings: Bindings }>({
  router: new LinearRouter(),
})

app.use(renderer)
setupSignInPaths(app)

export default app
