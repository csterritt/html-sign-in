import { Hono } from 'hono'

import { Bindings } from './bindings'
import { setupAwaitCodePath } from './auth/await-code'
import { setupCancelSignInPath } from './auth/cancel-sign-in'
import { setupSignInPath } from './auth/sign-in'
import { setupSignUpPath } from './auth/sign-up'
import { setupSubmitCodePath } from './auth/submit-code'
import { setupSubmitEmailPath } from './auth/submit-email'

export const setupSignInPaths = (app: Hono<{ Bindings: Bindings }>) => {
  setupAwaitCodePath(app)
  setupCancelSignInPath(app)
  setupSignInPath(app)
  setupSignUpPath(app)
  setupSubmitCodePath(app)
  setupSubmitEmailPath(app)
}
