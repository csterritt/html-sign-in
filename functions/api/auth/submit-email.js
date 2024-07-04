'use strict';

var httpStatusCodes = require('http-status-codes');
var cookie = require('cookie');

const FUNCTION_SERVER_URL = 'http://localhost:8788'; // PRODUCTION:REMOVE
// export const ASSET_SERVER_URL = '' // PRODUCTION:UNCOMMENT

export const onRequest = async (context) => {  const data = await context.request.formData();
  const email = data.get('email') || 'no email';

  const cookies = cookie.serialize('email', email, {
    httpOnly: true,
    maxAge: 60 * 60, // 1 hour
  });
  const resp = new Response(null, {
    headers: {
      status: httpStatusCodes.StatusCodes.SEE_OTHER,
      Location: `${FUNCTION_SERVER_URL}/api/auth/await-code`,
      Refresh: `0; url=${FUNCTION_SERVER_URL}/api/auth/await-code`,
      'Set-Cookie': cookies,
    },
  });

  context.response = resp;

  return resp
};

