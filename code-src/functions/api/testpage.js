import cookie from 'cookie'

import { layout } from '../../layout.js'
import { header } from '../../partials/header.js'
import * as constants from '../../constants.js'

export const onRequest = async (context) => {
  const content = `
    ${header('testpage-banner')}

    <div class="mx-6">
      <h3>Welcome to the test HTML page, produced by a worker, dude!</h3>
    </div>
  `

  const output = layout(content)
  const cookies = cookie.serialize('name', 'foobar!raboof', {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  const headers = {
    ...constants.STANDARD_HEADERS,
    'Set-Cookie': cookies,
  }
  return new Response(output, { headers })
}
