import { Hono } from 'hono'

import { Bindings } from './bindings'
import { setupSignInPath } from './auth/sign-in'
import { setupAwaitCodePath } from './auth/await-code'
import { setupSubmitEmailPath } from './auth/submit-email'
import { setupSubmitCodePath } from './auth/submit-code'

export const setupSignInPaths = (app: Hono<{ Bindings: Bindings }>) => {
  setupSignInPath(app)
  setupSubmitEmailPath(app)
  setupAwaitCodePath(app)
  setupSubmitCodePath(app)
}
