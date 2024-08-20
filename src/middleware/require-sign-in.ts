import { createMiddleware } from 'hono/factory'
import { SIGN_IN_PATH } from '../constants'
import { LocalContext } from '../bindings'
import { redirectWithErrorMessage } from '../redirects'

export const RequireSignIn = createMiddleware(async (c: LocalContext, next) => {
  const sessionInfo = c.get('Session')
  if (sessionInfo.isNothing || !sessionInfo.value.SignedIn) {
    return redirectWithErrorMessage(
      c,
      'You must sign in to visit that page',
      SIGN_IN_PATH
    )
  }

  await next()
})
