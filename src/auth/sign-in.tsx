import { HonoApp } from '../bindings'
import { SIGN_IN_PATH } from '../constants'
import { buildSignInPage } from '../page-builders/build-sign-in-page'

export const setupSignInPath = (app: HonoApp) => {
  app.get(SIGN_IN_PATH, buildSignInPage(''))
}
