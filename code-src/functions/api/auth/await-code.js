import cookie from 'cookie'

import { layout } from '../../../layout.js'
import { header } from '../../../partials/header.js'
import * as constants from '../../../constants.js'

export const onRequest = async (context) => {
  const cookies = cookie.parse(context.request?.headers?.get('cookie')) || {}
  const emailSent = cookies['email'] || 'no email'
  const content = `
    ${header('testpage-banner')}

    <div class="mx-6">
      <h3>Waiting for the code sent to email ${emailSent}</h3>
    </div>
  `

  return new Response(layout(content), { headers: constants.STANDARD_HEADERS })
}