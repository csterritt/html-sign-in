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
export const PROTECTED_PATH = '/protected'
export const SIGN_IN_PATH = '/api/auth/sign-in'
export const SIGN_UP_PATH = '/api/auth/sign-up'
export const SUBMIT_SIGN_IN_EMAIL_PATH = '/api/auth/submit-sign-in-email'
export const SUBMIT_SIGN_UP_EMAIL_PATH = '/api/auth/submit-sign-up-email'
export const AWAIT_CODE_PATH = '/api/auth/await-code'
export const SUBMIT_CODE_PATH = '/api/auth/submit-code'
export const CANCEL_SIGN_IN_PATH = '/api/auth/cancel-sign-in'

export const UNKNOWN_PERSON_ID = -1
export const SIGN_IN_TIMEOUT = 60 * 1000 // PRODUCTION:REMOVE
// export const SIGN_IN_TIMEOUT = 20 * 60 * 1000 // PRODUCTION:UNCOMMENT

export const STANDARD_COOKIE_OPTIONS: CookieOptions = {
  path: '/',
  sameSite: 'Strict',
  httpOnly: true, // PRODUCTION:UNCOMMENT
  // secure: true, // PRODUCTION:UNCOMMENT
  // domain: 'html-sign-in.pages.dev', // PRODUCTION:UNCOMMENT
}

export const EMAIL_SUBMITTED_COOKIE = 'email-submitted'
export const ERROR_MESSAGE_COOKIE = 'error-message'
export const SESSION_COOKIE = 'session-id'

export const BODY_LIMIT_OPTIONS = {
  maxSize: 4 * 1024, // 4kb
  onError: (c: any) => {
    console.log(`body too large, max size is 4kb`)
    return c.text('overflow :(', 413)
  },
}
