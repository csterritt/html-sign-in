export type CookieOptions = {
  domain?: string
  expires?: Date
  httpOnly?: boolean
  maxAge?: number
  path?: string
  secure?: boolean
  signingSecret?: string
  sameSite?: 'Strict' | 'Lax' | 'None' | 'strict' | 'lax' | 'none'
  partitioned?: boolean
}

export const ROOT_PATH = '/'
export const SIGN_IN_PATH = '/api/auth/sign-in'
export const SUBMIT_EMAIL_PATH = '/api/auth/submit-email'
export const AWAIT_CODE_PATH = '/api/auth/await-code'
export const SUBMIT_CODE_PATH = '/api/auth/submit-code'
export const CANCEL_SIGN_IN_PATH = '/api/auth/cancel-sign-in'

export const UNKNOWN_PERSON_ID = -1

export const STANDARD_COOKIE_OPTIONS: CookieOptions = {
  path: '/',
  sameSite: 'Strict',
  httpOnly: true, // PRODUCTION:UNCOMMENT
  // secure: true, // PRODUCTION:UNCOMMENT
  // domain: 'your.domain.here', // PRODUCTION:UNCOMMENT
}

export const EMAIL_SUBMITTED_COOKIE = 'email-submitted'
export const ERROR_MESSAGE_COOKIE = 'error-message'
export const SESSION_COOKIE = 'session-id'
