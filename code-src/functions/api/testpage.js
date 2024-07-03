import { html, HTMLResponse } from '@worker-tools/html'
import cookie from 'cookie'

import { layout } from '../../layout.js'
import { header } from '../../partials/header.js'

export const onRequest = async (context) => {
  const content = html`
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

  const headers = { 'Set-Cookie': cookies }
  return new HTMLResponse(output, { headers })
}
