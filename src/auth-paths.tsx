import { Hono } from 'hono'

import { Bindings } from './bindings'
import { setupAwaitCodePath } from './auth/await-code'
import { setupCancelSignInPath } from './auth/cancel-sign-in'
import { setupSignInPath } from './auth/sign-in'
import { setupSignUpPath } from './auth/sign-up'
import { setupSubmitCodePath } from './auth/submit-code'
import { setupSubmitSignInEmailPath } from './auth/submit-sign-in-email'
import { setupSubmitSignUpEmailPath } from './auth/submit-sign-up-email'

export const setupSignInPaths = (app: Hono<{ Bindings: Bindings }>) => {
  setupAwaitCodePath(app)
  setupCancelSignInPath(app)
  setupSignInPath(app)
  setupSignUpPath(app)
  setupSubmitCodePath(app)
  setupSubmitSignInEmailPath(app)
  setupSubmitSignUpEmailPath(app)
}
