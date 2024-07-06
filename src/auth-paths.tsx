import { Hono } from 'hono'

import { Bindings } from './bindings'
import { setupSignInPath } from './auth/sign-in'
import { setupSubmitEmailPath } from './auth/submit-email'

export const setupSignInPaths = (app: Hono<{ Bindings: Bindings }>) => {
  setupSignInPath(app)
  setupSubmitEmailPath(app)
}
