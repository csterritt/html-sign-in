import { html, HTMLResponse } from '@worker-tools/html'

import { layout } from '../layout.js'
import { header } from '../partials/header.js'
import * as constants from '../constants.js'

const index = () =>
  layout(html`
    ${header(
      'startup-page-banner',
      html`
        <a
          href="${constants.SERVER_URL}/auth/sign-in"
          class="btn btn-ghost mx-2"
          data-testid="sign-in-link"
          >Sign in</a
        >
      `
    )}

    <main class="flex-grow ml-8">
      <h3 class="text-2xl italic">Welcome!</h3>
      <p>
        The
        <a
          href="${constants.FUNCTION_SERVER_URL}/api/testpage"
          class="link-secondary hover:underline"
          >Test Page</a
        >.
      </p>
    </main>
  `)

const output = await new HTMLResponse(index()).text()
console.log(output)
