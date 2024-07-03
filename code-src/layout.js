import { html } from '@worker-tools/html'

import { footer } from './partials/footer.js'
import * as constants from './constants.js'

export const layout = (content) => html`
  <html lang="en">
    <head>
      <link href="${constants.SERVER_URL}/style.css" rel="stylesheet" />
      <title>HTML Sign In</title>
    </head>

    <body
      class="font-slabserif h-full min-h-screen flex flex-col justify-between md:mx-auto max-w-7xl pb-3 bg-gray-200 dark:bg-gray-900"
    >
      ${content}
      <!-- -->
      ${footer()}
    </body>
  </html>
`
