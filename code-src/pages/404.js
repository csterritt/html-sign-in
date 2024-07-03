import { html, HTMLResponse } from '@worker-tools/html'

import { layout } from '../layout.js'
import { header } from '../partials/header.js'

const the404Page = () =>
  layout(html`
    ${header('404-page-banner', '')}
    <!-- -->
    <main class="flex-grow ml-8">
      <h3 class="text-2xl italic">Can't find that page... sorry!</h3>
      <a href="/" class="link-secondary">Home</a>
    </main>
  `)

const output = await new HTMLResponse(the404Page()).text()
console.log(output)
