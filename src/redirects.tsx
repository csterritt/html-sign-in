import { LocalContext } from './bindings'
import { deleteCookie, setCookie } from 'hono/cookie'
import { ERROR_MESSAGE_COOKIE } from './constants'
import { StatusCodes } from 'http-status-codes'

export const redirectWithErrorMessage = (
  c: LocalContext,
  message: string,
  path: string
) => {
  setCookie(c, ERROR_MESSAGE_COOKIE, message)
  return c.redirect(path, StatusCodes.SEE_OTHER)
}

export const redirectWithNoMessage = (c: LocalContext, path: string) => {
  deleteCookie(c, ERROR_MESSAGE_COOKIE)
  return c.redirect(path, StatusCodes.SEE_OTHER)
}
