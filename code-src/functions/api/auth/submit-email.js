import { StatusCodes } from 'http-status-codes'
import cookie from 'cookie'

import * as constants from '../../../constants.js'

export const onRequest = async (context) => {
  const data = await context.request.formData()
  const email = data.get('email') || 'no email'

  const cookies = cookie.serialize('email', email, {
    httpOnly: true,
    maxAge: 60 * 60, // 1 hour
  })
  const resp = new Response(null, {
    headers: {
      status: StatusCodes.SEE_OTHER,
      Location: `${constants.FUNCTION_SERVER_URL}/api/auth/await-code`,
      Refresh: `0; url=${constants.FUNCTION_SERVER_URL}/api/auth/await-code`,
      'Set-Cookie': cookies,
    },
  })

  context.response = resp

  return resp
}
