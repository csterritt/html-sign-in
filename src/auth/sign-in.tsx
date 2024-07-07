import { Hono } from 'hono'

import { Bindings } from '../bindings'
import { SIGN_IN_PATH } from '../constants'
import { buildSignInPage } from '../page-builders/buildSignInPage'

export const setupSignInPath = (app: Hono<{ Bindings: Bindings }>) => {
  app.get(SIGN_IN_PATH, buildSignInPage())
}
