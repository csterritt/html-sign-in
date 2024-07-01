import { HTML, html, HTMLResponse } from '@worker-tools/html'
import cookie from 'cookie'

const layout = (content: HTML) => html`
  <html lang="en">
    <head>
      <link href="http://localhost:3000/style.css" rel="stylesheet" />
      <title>HTML Sign In</title>
    </head>

    <body
      class="font-slabserif h-full min-h-screen flex flex-col justify-between md:mx-auto max-w-7xl pb-3 bg-gray-200 dark:bg-gray-900"
    >
      ${content}
    </body>
  </html>
`

export const onRequest = async (context: any) => {
  const content = html`
    <h3>Welcome to the test HTML page, produced by a worker!</h3>
  `

  const output = layout(content)
  const cookies = cookie.serialize('name', 'foobar!raboof', {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  const headers = { 'Set-Cookie': cookies }
  return new HTMLResponse(output, { headers })
}
