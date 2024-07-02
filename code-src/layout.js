import { html } from '@worker-tools/html'

import { footer } from './partials/footer.js'

export const layout = (content) => html`
  <html lang="en">
    <head>
      <link href="./style.css" rel="stylesheet" />
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
