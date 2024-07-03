import { html, HTMLResponse } from '@worker-tools/html'
import cookie from 'cookie'

import { layout } from '../../../layout.js'
import { header } from '../../../partials/header.js'

export const onRequest = async (context) => {
  const cookies = cookie.parse(context.request?.headers?.get('cookie')) || {}
  const emailSent = cookies['email'] || 'no email'
  const content = html`
    ${header('testpage-banner')}

    <div class="mx-6">
      <h3>Waiting for the code sent to email ${emailSent}</h3>
    </div>
  `

  return new HTMLResponse(layout(content))
}
